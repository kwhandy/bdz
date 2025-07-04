import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="timestamp"
export default class extends Controller {
  static targets = [ "date" ]

  connect() {
    this.dateTarget.textContent = this.formatDate(this.dateTarget.textContent)
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
}