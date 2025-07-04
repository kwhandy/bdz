import { Controller } from "@hotwired/stimulus"
import { patch } from "@rails/request.js"

// Connects to data-controller="noform"
export default class extends Controller {
  static targets = [ "input", "save" ]
  static values = {
    updateUrl: String,
    formScope: String
  }
  
  async updateForm(event) {
    event.preventDefault()
    this.setLoadingState()
    
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

      const response = await patch(this.updateUrlValue, {
        body: JSON.stringify(formData),
        responseKind: "json"
      })

      await new Promise(resolve => setTimeout(resolve, 2000))  // Add 2s delay

      if (response.ok) {
        this.saveTarget.textContent = "Saved!"
        setTimeout(() => {
          this.resetButtonState()
        }, 1000);
      }
    } catch (error) {
      this.resetButtonState()
      console.error("Object update failed:", error)
    }
  }

  setLoadingState() {
    this.saveTarget.disabled = true
    this.saveTarget.classList.add("opacity-50")
    this.saveTarget.textContent = "Saving.."
  }

  resetButtonState() {
    this.saveTarget.disabled = false
    this.saveTarget.classList.remove("opacity-50")
    this.saveTarget.textContent = "Save"
  }
}