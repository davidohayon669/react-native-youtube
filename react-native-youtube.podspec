require 'json'
package_json = JSON.parse(File.read('package.json'))

Pod::Spec.new do |s|

  s.name           = package_json["name"]
  s.version        = package_json["version"]
  s.summary        = package_json["description"]
  s.homepage       = package_json["homepage"]
  s.license        = package_json["license"]
  s.author         = { package_json["author"] => package_json["author"] }
  s.platform       = :ios, "7.0"
  s.source         = { :git => package_json["repository"]["url"].gsub(/(http.*)/).first, :tag => "v#{s.version}" }
  s.source_files   = 'RCTYouTube*.{h,m}', 'YTPlayerView/YTPlayerView.{h,m}'
  s.preserve_paths = '*.js'
  s.resources      = ['assets/YTPlayerView-iframe-player.html']
  s.dependency 'React'

end
