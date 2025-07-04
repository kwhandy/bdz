import { Controller } from "@hotwired/stimulus"
import { openDB } from 'idb'
import debounce from "lodash/debounce"
import { marked } from "marked"
import CryptoJS from 'crypto-js'
import { topHeadingRenderer, youtubeRenderer } from "../helpers/marked_helper"
import DOMPurify from "dompurify"

// Connects to data-controller="editor"
export default class extends Controller {
  static targets = ["content", "indicator", "preview", "caution"]
  static values = { 
    draftKey: String,
    saveInterval: { type: Number, default: 2000 },
    content: String
  }

  connect() {
    this.timer = null
    
    this.resetPreviewState()

    this.secretKey = this.draftKeyValue.split('-')[1]
    this.initializeDB().then(() => {
      this.initializeEditor()
      this.autoSave = debounce(this.saveDraft.bind(this), this.saveIntervalValue)
      this.loadDraft()

      const renderer = {
        paragraph({ tokens }) {
          const text = this.parser.parseInline(tokens)
          return `<p class="text-justify">${text}</p>`
        }
      }
      
      marked.use({ 
        renderer,
        extensions: [ 
          topHeadingRenderer, 
          youtubeRenderer
        ]
      })

      marked.setOptions({
        breaks: true,
        gfm: true,
        sanitize: false
      })

      DOMPurify.setConfig({
        ADD_TAGS: ['iframe'],
        ADD_ATTR: [
          'allow',
          'allowfullscreen',
          'frameborder',
          'scrolling',
          'src',
          'width',
          'height'
        ]
      })
  
      DOMPurify.addHook('uponSanitizeElement', (node, data) => {
        if (data.tagName === 'iframe') {
          const src = node.getAttribute('src') || ''
          if (!src.startsWith('https://www.youtube.com/embed/')) {
            return node.parentNode?.removeChild(node)
          }
        }
      })
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

  initializeEditor() {
    clearTimeout(this.timer)

    this.contentTarget.setAttribute("contenteditable", "true")
    
    this.contentTarget.focus()

    this.contentTarget.addEventListener("paste", this.handlePaste.bind(this))

    this.contentTarget.addEventListener("beforeinput", (e) => {
      const currentLength = this.contentTarget.innerText.length
      const willExceedLimit = currentLength >= 10000
      
      if (willExceedLimit && e.inputType.includes('insert')) {
        e.preventDefault()
        alert(`Character limit(10,000) reached`)
      }
    })

    this.contentTarget.addEventListener("input", () => {

      this.timer = setTimeout(() => {
        this.autoSave()
        this.updateSaveStatus("Saving..")
      }, 500)
    })
  }

  async saveDraft() {
    // console.log("User stopped typing. Save data or perform action.")
    if (!this.db) {
      console.warn('LocalDB are not ready yet')
      return false
    }

    
    try {
      const draftData = {
        content: this.contentTarget.innerText,
        timestamp: new Date().toISOString()
      }

      const serialized = JSON.stringify(draftData)
      const sizeInMB = new Blob([serialized]).size / (1024 * 1024)
      
      if (sizeInMB > 1) { // Setting safe limit at 1MB
        alert("Data too large, press 'Save' button to continue.")
        return false
      }
      
      const encrypted = CryptoJS.AES.encrypt(serialized, this.secretKey).toString()
      await this.db.put('drafts', encrypted, `dL_${this.draftKeyValue}`)
      this.updateSaveStatus("Saved")
      
      return true
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        alert("Local storage is full, press 'Save' button to continue.");
        return false
      }
      throw e
    }
  }

  async loadDraft() {
    if (!this.db) {
      console.warn('LocalDB are not ready yet')
      return false
    }

    try {
      const encrypted = await this.db.get('drafts', `dL_${this.draftKeyValue}`)
      // console.log(`encrypted: ${encrypted}`)

      if (encrypted) {
        const decrypted = CryptoJS.AES.decrypt(encrypted, this.secretKey)
        // console.log(`decrypted: ${decrypted}`)
        const savedDraft = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
        // console.log(`savedDraft: ${JSON.stringify(savedDraft)}`)

        const draftDate = new Date(savedDraft.timestamp)
        const serverDate = new Date(this.contentTarget.dataset.lastUpdate)
        
        if (draftDate > serverDate) {
          this.updateSaveStatus("Local draft")
          setTimeout(() => {
            this.updateSaveStatus("Saved")
          }, 3000)

          if (savedDraft.content !== '\n' && savedDraft.content !== '') {
            this.contentTarget.innerText = DOMPurify.sanitize(savedDraft.content)
          }
        } else if (draftDate < serverDate) {
          this.updateSaveStatus("Draft issue")
          this.contentTarget.innerText = DOMPurify.sanitize(savedDraft.content)
        }
      } else {
        this.updateSaveStatus("Synced")
        setTimeout(() => {
          this.updateSaveStatus("Saved")
        }, 3000)
        this.contentTarget.innerText = DOMPurify.sanitize(this.contentTarget.innerText)
      }
    } catch (e) {
      console.error("Error loading draft:", e)
    }
  }

  updateSaveStatus(message) {
    this.indicatorTarget.textContent = message
  }

  toggle() {
    this.isPreviewMode = !this.isPreviewMode
    
    if (this.isPreviewMode) {
      const markdown = this.contentTarget.innerText
      const markedContent = marked.parse(markdown)
      const cleanHtml = DOMPurify.sanitize(markedContent)
      this.previewTarget.innerHTML = cleanHtml
      this.previewTarget.classList.remove('hidden')
      this.cautionTarget.classList.add('hidden')
      this.contentTarget.classList.add('hidden')
    } else {
      this.previewTarget.classList.add('hidden')
      this.cautionTarget.classList.remove('hidden')
      this.contentTarget.classList.remove('hidden')
    }
  }

  disconnect() {
    this.autoSave.cancel()
  }

  handlePaste(event) {
    event.preventDefault()

    const plainText = event.clipboardData.getData('text/plain')
    const truncated = plainText.slice(0, 10000)
    const currentLength = this.contentTarget.innerText.length
    
    if (currentLength <= 10000) {
      const remainingSpace = 10000 - currentLength
      const insertText = truncated.slice(0, remainingSpace)
      document.execCommand('insertText', false, insertText)
    } else if (currentLength > 10000) {
      alert("Character limit (10,000) reached pasye.")
    }
  }

  resetPreviewState() {
    this.isPreviewMode = false
    this.previewTarget.classList.add('hidden')
    this.contentTarget.classList.remove('hidden')
    
    // // Reset Tailwind toggle
    const previewToggle = document.querySelector('[data-action*="editor#toggle"]')
    if (previewToggle) {
      previewToggle.checked = false
    }
  }
}
