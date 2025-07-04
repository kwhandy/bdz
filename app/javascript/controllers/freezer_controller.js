import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="freezer"
export default class extends Controller {
  static targets = [ "trigger" ]

  connect() {
    this.element.addEventListener("turbo:submit-end", () => {
      this.triggerTarget.disabled = true
      this.triggerTarget.classList.add("opacity-50", "cursor-not-allowed")
    })
  }
}