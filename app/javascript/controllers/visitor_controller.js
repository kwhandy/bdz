import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="visitor"
export default class extends Controller {
  static values = { url: String }

  pageVisit(e) {
    e.preventDefault();
    Turbo.visit(this.urlValue)
  }
}