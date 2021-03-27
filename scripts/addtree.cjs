#!/usr/bin/env node

const path = require('path')

/**
 * include new generated tree of supported countries to README.md file
 */
if (module === require.main) {
  const fs = require('fs')
  const tree = require('./tree.cjs')
  const readmeFile = path.resolve(__dirname, '..', 'README.md')
  const buf = (function () {
    const self = {
      str: '',
      write: function (str) {
        self.str += str
      }
    }
    return self
  })()
  let content = fs.readFileSync(readmeFile, 'utf8')

  tree(buf)
  content = content.replace(/(<!-- !tree -->)[^]*(<!-- tree! -->)/m, '$1\n\n```\n' + buf.str + '```\n$2')

  fs.writeFileSync(readmeFile, content, 'utf8')
}
