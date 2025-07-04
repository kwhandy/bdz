export const youtubeRenderer = {
    name: 'youtube',
    level: 'inline',
    start(src) { return src.indexOf('[') },
    tokenizer(src) {
      // you have to remove "?si=<alphanumeric>" from the YouTube URL(VIA SHARE BUTTON)
      // if writing for some content in order to embed the video in an iframe
      // because it is not a valid YouTube URL for embedding
      // and it will cause the iframe to not load the video
      // this is a workaround for the issue with YouTube URLs that have "?si=<alphanumeric>"
      // at the end of the URL, which is used for tracking purposes
      // and is not necessary for embedding the video
      // example: https://youtu.be/<alphanumeric>&si=<alphanumeric>
      const rule = /^\[(yt)(?:\|(\d+)(?:,(\d+))?)?\]\((https?:\/\/(?:(?:www\.)?youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+))\)/
      const match = rule.exec(src)
      if (match) {
        return {
          type: 'youtube',
          raw: match[0],
          title: match[1],
          width: match[2] || '560',
          height: match[3] || '315',
          videoId: match[5]
        }
      }
      return false
    },
    renderer(token) {
      return `<p class="">
            <span class="flex justify-center">
                <iframe 
                    width="${token.width}" 
                    height="${token.height}" 
                    src="https://www.youtube.com/embed/${token.videoId}?autoplay=1&mute=1" 
                    frameborder="0"
                    allow="autoplay"
                    allowfullscreen>
                </iframe>
            </span>
        </p>`
    }
}

export const topHeadingRenderer = {
    name: 'top-heading',
    level: 'block',
    start(src) { 
      return src.match(/^=+\s/)?.index
    },
    tokenizer(src) {
      const rule = /^(={1,6})\s+([^\n]+?)(?:\n|$)/
      const match = rule.exec(src)
      if (match) {
        return {
          type: 'top-heading',
          raw: match[0],
          level: match[1].length,
          text: match[2].trim()
        }
      }
    },
    renderer(token) {
        return `<h${token.level} class="flex justify-center">${token.text}</h${token.level}>\n`
    }
}