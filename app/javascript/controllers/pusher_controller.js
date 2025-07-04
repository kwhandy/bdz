import { Controller } from "@hotwired/stimulus"
import { openDB } from 'idb'
import CryptoJS from 'crypto-js'
import { patch } from "@rails/request.js"

// Connects to data-controller="pusher"
export default class extends Controller {
  static targets = [ "commit", "message", "cleaner", "visibility" ]
  static values = {
    syncUrl: String,
    cleanUrl: String,
    draftKey: String,
  }

  connect() {
    this.timer = null

    this.secretKey = this.draftKeyValue.split('-')[1]
    // console.log(this.secretKey)
    this.initializeDB().then(() => {
      this.messageTarget.textContent = `Last sync: ${this.formatDate(this.messageTarget.dataset.lastUpdate)}`
      this.checkDraftExists()
    })
  }

  async initializeDB() {
    try {
      this.db = await openDB('draftsDB', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('drafts')) {
            db.createObjectStore('drafts')
          }
        }
      })
    } catch (e) {
      console.error('Failed to initialize DB:', e)
    }
  }

  // SERVERPUSH_V1
  async syncToServer(e) {
    e.preventDefault()

    if (!this.db) {
      console.warn('LocalDB are not accessible')
      return false
    }

    clearTimeout(this.timeout)
    
    const encrypted = await this.db.get('drafts', `dL_${this.draftKeyValue}`)
    const decrypted = CryptoJS.AES.decrypt(encrypted, this.secretKey)
    const draftData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))

    if (draftData) {
      try {
        this.setSavingState()

        const response = await patch(this.syncUrlValue, {
          body: JSON.stringify({ 
            article: { 
              content: draftData.content 
            } 
          }),
          responseKind: 'json'
        })

        await new Promise(resolve => setTimeout(resolve, 2000))

        if (response.ok) {
          await this.db.delete('drafts', `dL_${this.draftKeyValue}`)

          const syncedData = await response.json
          // Access response data attributes
          if (syncedData) {
            this.messageTarget.textContent = `Last sync: ${this.formatDate(syncedData.sync_time)}`
            this.visibilityTarget.value = syncedData.visibility
          }
        }
      } catch (error) {
        console.error("Save failed:", error)
      } finally {
        this.resetSaveState()
        this.visibilityTarget.disabled = false
        this.visibilityTarget.classList.remove("opacity-50")
      }
    } else {
      this.messageTarget.textContent = "No draft to sync"
      console.info("No draft found, can't sync to server")
    }
  }

  async deleteDraft(e) {
    e.preventDefault()
    
    try {
      await this.db.delete('drafts', `dL_${this.draftKeyValue}`)
      Turbo.visit(window.location.href, { action: "replace" })
    } catch (error) {
      console.error('Cleanup failed:', error)
    }
  }

  async checkDraftExists() {
    if (!this.db) {
      console.warn('LocalDB are not accessible')
      return false
    }

    try {
      const hasDraft = await this.db.get('drafts', `dL_${this.draftKeyValue}`)
      // console.log(`encryptedDraft: ${encryptedDraft}`)

      if (hasDraft) {
        const decryptedDraft = CryptoJS.AES.decrypt(hasDraft, this.secretKey)
        // console.log(`decryptedDraft: ${decryptedDraft}`)
        const savedDraft = JSON.parse(decryptedDraft.toString(CryptoJS.enc.Utf8))
        // console.log(`savedDraft: ${JSON.stringify(savedDraft)}`)
        const draftDate = new Date(savedDraft.timestamp)
        const serverDate = new Date(this.messageTarget.dataset.lastUpdate)

        if (draftDate < serverDate) {
          this.commitTarget.disabled = true
          this.commitTarget.classList.toggle('opacity-50', true)
          this.commitTarget.textContent = "Nothing to sync"

          this.messageTarget.textContent = `Last edit: ${this.formatDate(savedDraft.timestamp)}`
        } else {
          this.updateButtonState(!!hasDraft, savedDraft.timestamp)
        }
      } else {
        this.updateButtonState(!!hasDraft, "No draft to sync")
      }
    } catch (e) {
      console.error('Failed to check draft:', e)
    }
  }
  
  updateButtonState(hasDraft, timestamp) {
    this.commitTarget.disabled = !hasDraft
    this.commitTarget.classList.toggle('opacity-50', !hasDraft)
    this.commitTarget.textContent = hasDraft ? 'Sync now' : 'Nothing to sync'

    this.cleanerTarget.disabled = !hasDraft
    this.cleanerTarget.classList.toggle('opacity-50', !hasDraft)
    
    if (hasDraft) this.messageTarget.textContent = `Last edit: ${this.formatDate(timestamp)}`
  }
  
  setSavingState() {
    this.visibilityTarget.disabled = true
    this.visibilityTarget.classList.add("opacity-50")

    this.commitTarget.textContent = "Syncing.."
    this.commitTarget.disabled = true
    this.commitTarget.classList.add("opacity-50")

    this.cleanerTarget.disabled = true
    this.cleanerTarget.classList.toggle('opacity-50', true)
  }
  
  resetSaveState() {
    this.checkDraftExists() // Check draft status after reset
  }

  formatDate(timestamp) {
    const date = new Date(timestamp)
    const now = new Date()
    const diffYear = now.getFullYear() - date.getFullYear()
    
    const options = {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }
    
    if (diffYear > 0) {
      options.year = 'numeric'
    }
    
    return date.toLocaleString("en-US", options)
  }

  disconnect() {
    clearTimeout(this.timeout)
  }
}