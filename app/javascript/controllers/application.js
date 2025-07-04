import { Application } from "@hotwired/stimulus"
import Confirmation from '@stimulus-components/confirmation'
import TextareaAutogrow from 'stimulus-textarea-autogrow'

const application = Application.start()
application.register('confirmation', Confirmation)
application.register('textarea-autogrow', TextareaAutogrow)

// Configure Stimulus development experience
application.debug = false
window.Stimulus   = application

export { application }
