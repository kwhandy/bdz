import { Controller } from "@hotwired/stimulus"
import { marked } from "marked"
import { topHeadingRenderer, youtubeRenderer } from "../helpers/marked_helper"
import DOMPurify from "dompurify"
import { get } from "@rails/request.js"

// Connects to data-controller="viewer"
export default class extends Controller {
  static targets = ["skeleton", "content", "empty", "error"]
  static values = {
    postId: String,
    rawKey: String
  }

  async connect() {
    try {
      
      this.showSkeleton()
      const response = await get(
        `/a/${this.postIdValue}.json?raw_key=${this.rawKeyValue}`
      )
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
      
      if (response.ok) {
        const { content } = await response.json

        if (!content || content.trim() === "") {
          this.emptyTarget.classList.remove('hidden')
        } else {
          const markedContent = marked.parse(content)
          const cleanHtml = DOMPurify.sanitize(markedContent)
          this.contentTarget.innerHTML = cleanHtml
          this.contentTarget.classList.remove('hidden')
        }
      }
    } catch (error) {
      this.contentTarget.textContent = "Failed to load content data"
    } finally {
      this.hideSkeleton()
    }
  }

  showSkeleton() {
    this.skeletonTarget.classList.remove('hidden')
  }

  hideSkeleton() {
    this.skeletonTarget.classList.add('hidden')
    // this.contentTarget.classList.remove('hidden')
  }
}