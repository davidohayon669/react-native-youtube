require 'json'
package_json = JSON.parse(File.read('package.json'))

Pod::Spec.new do |s|

  s.name           = "RCTYouTube"
  s.version        = package_json["version"]
  s.summary        = package_json["description"]
  s.homepage       = package_json["homepage"]
  s.license        = package_json["license"]
  s.author         = { package_json["author"] => package_json["author"] }
  s.platform       = :ios, "9.0"
  s.source         = { :git => package_json["repository"]["url"].gsub(/(http.*)/).first, :tag => "v#{s.version}" }
  s.source_files   = "RCTYouTube*.{h,m}"
  s.preserve_paths = "*.js"
  s.dependency "React-Core"
  s.dependency "YoutubePlayer-in-WKWebView", "~> 0.3.1"

end
