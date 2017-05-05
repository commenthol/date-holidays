'use strict'

var path = require('path')

/**
 * include new generated tree of supported countries to README.md file
 */
if (module === require.main) {
  var fs = require('fs')
  var tree = require('./tree')
  var readmeFile = path.resolve(__dirname, '..', 'README.md')
  var buf = (function () {
    var self = {
      str: '',
      write: function (str) {
        self.str += str
      }
    }
    return self
  })()
  var content = fs.readFileSync(readmeFile, 'utf8')

  tree(buf)
  content = content.replace(/(<!-- !tree -->)[^]*(<!-- tree! -->)/m, '$1\n\n```\n' + buf.str + '```\n$2')

  // ~ console.log(content)
  fs.writeFileSync(readmeFile, content, 'utf8')
}
