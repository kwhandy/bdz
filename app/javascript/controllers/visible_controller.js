import { Controller } from "@hotwired/stimulus"
import { patch } from "@rails/request.js"

// Connects to data-controller="visible"
export default class extends Controller {
  static targets = ["input"]
  static values = {
    url: String,
    current: String,
    formScope: String
  }

  connect() {
    this.statuses = ["drafted", "unlisted", "published"]
  }

  async changeStatus(event) {
    event.preventDefault()
    this.setLoadingState()

    const value = event.target.value
    
    try {
      const formData = {}
      const mainScope = this.formScopeValue

      const scopedData = {}
      this.inputTargets.forEach(input => {
        const fieldScope = input.dataset.scope || mainScope
        const fieldName = input.dataset.field
        if (fieldName) {
          if (!scopedData[fieldScope]) {
            scopedData[fieldScope] = {}
          }

          scopedData[fieldScope][fieldName] = input.value
        }
      })

      formData[mainScope] = scopedData[mainScope]

      const response = await patch(this.urlValue, {
        body: JSON.stringify(formData),
        responseKind: 'json'
      })
      
      await new Promise(resolve => setTimeout(resolve, 2000))

      if (response.ok) {
        this.currentValue = value
        this.resetSelectionState()
      } else {
        console.error('Trouble to update object status')
      }
    } catch (error) {
      this.resetSelectionState()
      console.error('Object update failed:', error)
    }
  }

  setLoadingState() {
    this.inputTarget.disabled = true
    this.inputTarget.classList.add("opacity-50")
  }

  resetSelectionState() {
    this.inputTarget.disabled = false
    this.inputTarget.classList.remove("opacity-50")
  }
}