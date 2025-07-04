# lib/tasks/assets.rake

namespace :assets do
  desc "Upload precompiled assets to Cloudflare R2"
  task upload: :environment do
    require "aws-sdk-s3"
    require "find"
    require "mime/types"

    puts "Uploading assets to Cloudflare R2..."

    # Configuration from environment variables
    account_id = Rails.application.credentials.dig(:static, :account_id)
    access_key_id = Rails.application.credentials.dig(:static, :access_key_id)
    secret_access_key = Rails.application.credentials.dig(:static, :secret_access_key)
    bucket_name = Rails.application.credentials.dig(:static, :bucket)
    endpoint = "https://#{account_id}.r2.cloudflarestorage.com"
    region = "auto" # R2 specific

    # Path to your precompiled assets
    assets_dir = Rails.root.join("public", "assets")


    # Exit if the assets directory doesn't exist
    unless File.directory?(assets_dir)
      puts "Assets directory not found. Skipping upload. Did you run 'assets:precompile'?"
      next
    end

    s3 = Aws::S3::Resource.new(
      endpoint: endpoint,
      access_key_id: access_key_id,
      secret_access_key: secret_access_key,
      region: region
    )

    bucket = s3.bucket(bucket_name)

    # FIX: Ensure we start the find operation with a string path.
    Find.find(assets_dir.to_s) do |path|
      next if File.directory?(path)

      # In this context, `path` is now a string. Let's create the S3 key.
      # The key should not have the full local path, just 'assets/filename.ext'
      relative_path = Pathname.new(path).relative_path_from(assets_dir).to_s
      key = "assets/legal/#{relative_path}"

      # Determine the content type from the file path string
      content_type = MIME::Types.type_for(path).first&.content_type || "application/octet-stream"

      puts "Uploading #{relative_path} to s3://#{bucket_name}/#{key}"

      obj = bucket.object(key)

      # FIX: The `upload_file` method expects a string for the path.
      obj.upload_file(path, {
        acl: "public-read",
        content_type: content_type,
        cache_control: "public, max-age=31536000, immutable" # Added 'immutable' for best practice
      })
    end

    puts "Asset upload complete."
  end
end