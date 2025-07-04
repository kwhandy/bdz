import { Controller } from "@hotwired/stimulus"
import { useMutation } from "stimulus-use"

// Connects to data-controller="empty"
export default class extends Controller {
  static targets = ["list", "emptyMessage"];
  static classes = ["hide"];

  connect() {
    useMutation(this, {
      element: this.listTarget,
      childList: true,
    });
  }

  mutate(entries) {
    for (const mutation of entries) {
      if (mutation.type === "childList") {
        if (this.listTarget.children.length > 0) {
          // hide empty state
          this.emptyMessageTarget.classList.add(this.hideClass);
        } else {
          // show empty state
          this.emptyMessageTarget.classList.remove(this.hideClass);
        }
      }
    }
  }
}