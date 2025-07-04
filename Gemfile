source "https://rubygems.org"

gem "rails", "~> 8.0.2"  # Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem "propshaft"  # The modern asset pipeline for Rails [https://github.com/rails/propshaft]
gem "pg", "~> 1.1"  # Use postgresql as the database for Active Record
gem "sqlite3", ">= 2.1"  # Use sqlite3 as the database for Active Record
gem "puma", ">= 5.0"  # Use the Puma web server [https://github.com/puma/puma]
gem "jsbundling-rails"  # Bundle and transpile JavaScript [https://github.com/rails/jsbundling-rails]
gem "turbo-rails"  # Hotwire's SPA-like page accelerator [https://turbo.hotwired.dev]
gem "stimulus-rails"  # Hotwire's modest JavaScript framework [https://stimulus.hotwired.dev]
gem "cssbundling-rails"  # Bundle and process CSS [https://github.com/rails/cssbundling-rails]
gem "jbuilder"  # Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem "tzinfo-data", platforms: %i[ windows jruby ]  # Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "solid_cache"  # Use the database-backed adapters for Rails.cache, Active Job, and Action Cable
gem "solid_queue"  # Use the database-backed adapters for Rails.cache, Active Job, and Action Cable
gem "solid_cable"  # Use the database-backed adapters for Rails.cache, Active Job, and Action Cable
gem "bootsnap", require: false  # Reduces boot times through caching; required in config/boot.rb
gem "kamal", require: false  # [RAW DOCKER: NOT USED] Deploy this application anywhere as a Docker container [https://kamal-deploy.org]
gem "thruster", require: false  # [RAW DOCKER: NOT USED] Add HTTP asset caching/compression and X-Sendfile acceleration to Puma [https://github.com/basecamp/thruster/]

gem 'friendly_id'  # https://github.com/norman/friendly_id
gem "pagy"
gem "view_component"
gem "lucide-rails"  # https://github.com/heyvito/lucide-rails
gem "inline_svg"
gem "local_time"
gem "meta-tags"
gem "sitemap_generator"

gem 'mission_control-jobs'
gem 'stackprof'
gem 'sentry-ruby'
gem 'sentry-rails'

gem 'aws-sdk-s3'

group :development, :test do
  gem "debug", platforms: %i[ mri windows ], require: "debug/prelude"  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "brakeman", require: false  # Static analysis for security vulnerabilities [https://brakemanscanner.org/]
  gem "rubocop-rails-omakase", require: false  # Omakase Ruby styling [https://github.com/rails/rubocop-rails-omakase/]
  gem 'break'
  gem 'benchmark-ips', require: false
end

group :development do
  gem 'faker', require: false
  gem 'listen', '>= 3.0.5', '< 3.10'
  gem "web-console"  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem 'rack-mini-profiler', require: false  # Add speed badges [https://github.com/MiniProfiler/rack-mini-profiler]
  gem 'annotate'
end

group :test do
  gem 'mocha'
  gem "capybara"
  gem "selenium-webdriver"
end

group :production do
  gem 'cloudflare-rails'
end
