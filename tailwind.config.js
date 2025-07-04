module.exports = {
  mode: 'jit',
  content: [
    './app/views/**/*.html.erb',
    './app/views/**/*.html+turbo_frame.erb',
    './app/views/**/*.turbo_stream.erb',
    './app/components/**/*.html.erb',
    './app/components/**/*.rb',
    './app/helpers/**/*.rb',
    './app/assets/stylesheets/**/*.css',
    './app/javascript/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Inter var", sans-serif',
          {
            fontFeatureSettings: '"cv11", "ss01"',
            fontVariationSettings: '"opsz" 32'
          },
        ],
      },
      animation: {
        loader: 'loader 0.6s infinite alternate',
      },
      keyframes: {
        loader: {
          to: {
            opacity: 0.1,
            transform: 'translate3d(0, -0.5rem, 0)'
          }
        }
      }
    },
  }
}