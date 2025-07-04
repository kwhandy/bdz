import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="selector"
export default class extends Controller {
  static targets = ["skeleton", "content"]

  connect() {
    setTimeout(() => {
      this.skeletonTarget.classList.add("hidden")
      this.contentTarget.classList.remove("hidden")
    }, 500)
  }
}