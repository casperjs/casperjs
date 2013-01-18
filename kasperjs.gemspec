# by hannyu

kasperJS_VERSION = File.read("package.json")[/version.*:.*"(.*?)"/,1].gsub(/[\-_\+]/,".")

Gem::Specification.new do |s|
  s.name                = "kasperjs"
  s.version             = kasperJS_VERSION
  s.homepage            = "http://kasperjs.org/"
  s.authors             = ["Nicolas Perriault", ]
  s.email               = ["nperriault@gmail.com",]
  s.description         = "kasperJS is a navigation scripting & testing utility for [PhantomJS](http://www.phantomjs.org/).
It eases the process of defining a full navigation scenario and provides useful
high-level functions, methods & syntaxic sugar for doing common tasks."
  s.summary             = "Navigation scripting & testing utility for PhantomJS"
  s.extra_rdoc_files    = ["LICENSE.md", "README.md"]
  s.files               = Dir["LICENSE.md", "README.md", "CHANGELOG.md", "package.json", "kasperjs.gemspec",
                            "bin/bootstrap.js", "bin/usage.txt", "bin/kasperjs_python",
                            "docs/**/*", "modules/**/*", "samples/**/*", "tests/**/*"]
  s.bindir              = "rubybin"
  s.executables         = [ "kasperjs" ]
  s.license             = "MIT"
  s.requirements        = [ "PhantomJS v1.7" ]
end
