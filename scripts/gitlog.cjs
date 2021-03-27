#!/usr/bin/env node

/* eslint no-unused-vars: ["error", { varsIgnorePattern: "_" }] */

const { promisify } = require('util')
const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const { version } = require('../package.json')

const BASE = 'https://github.com/commenthol/date-holidays'
const CHANGELOG = path.resolve(__dirname, '../CHANGELOG.md')

const MAJOR = 0
const MINOR = 1
const PATCH = 2

const semverInc = (version, semrel) => {
  const semver = version.split(/[.-]/)
  semver[semrel] = +semver[semrel] + 1
  if (semrel === MINOR) semver[2] = 0
  if (semrel === MAJOR) semver[2] = semver[1] = 0
  return semver.splice(0, 3).join('.')
}

const date = () => new Date().toISOString().substr(0, 10)

const templateHeader = (from, to) =>
  `## [${to}](${BASE}/compare/${from}...${to}) (${date()})`

const templateCommit = (line) =>
  `- ${line.subject} [${line.short}](${BASE}/commit/${line.hash})`

const gitTagVersions = async () => {
  const gittags = await promisify(exec)('git tag --list v*')
  const tags = gittags.stdout.split(/\n/)
    .map(v => {
      // filter pre-release versions
      const [_, vv] = /^v?(\d+\.\d+\.\d+).*/.exec(v) || []
      if (vv) {
        const vvv = vv.split(/[.-]/).filter(s => !s[3]).filter(Boolean)
        return vvv && vvv.length ? vvv : undefined
      } else {
        return undefined
      }
    })
    .filter(Boolean)
    .sort((a, b) => {
      for (let i = 0; i < 3; i++) {
        if (a[i] !== b[i]) {
          return b[i] - a[i]
        }
      }
      return 0
    })
  return tags
}

const gitLog = async (from, to = 'HEAD') => {
  const gitLogMapper = ['short', 'hash', 'tags', 'date', 'subject']

  const opts = version ? `${from}..${to}` : ''
  const cmd = `git log ${opts} --pretty=format:"%h|%H|%d|%ci|%s"`
  const log = await promisify(exec)(cmd)

  const lines = log.stdout.split('\n')
    .map(line => line.split(/[|]/)
      .reduce((o, item, i) => {
        const prop = gitLogMapper[i]
        let val = item
        switch (prop) {
          case 'date':
            val = item.substring(0, 10)
            break
          case 'tags': {
            const [_, tags] = /^.*\(tag: ([^)]+)\).*$/.exec(item) || []
            if (tags) {
              val = tags.split(/\s*,\s*/)
            } else {
              val = []
            }
            break
          }
        }
        o[prop] = val
        return o
      }, {})
    )
  return lines
}

;(async () => {
  let semrel = PATCH

  const tagVersions = await gitTagVersions()
  const lastVersion = tagVersions[0] && tagVersions[0].join('.')

  const gitlog = await gitLog('v' + lastVersion)
  const lines = gitlog
    .filter(line => !/Merge pull request|chore.*(bump|contributors)/.test(line.subject))
    .map(line => {
      if (/break[(:)]/.test(line.subject)) {
        semrel = MAJOR
      } else if (/feat[(:)]/.test(line.subject)) {
        semrel = MINOR
      }
      return line
    })

  const nextVersion = semverInc(version, semrel)

  const changes = [
    '',
    templateHeader(lastVersion, nextVersion),
    '',
    lines.map(line => templateCommit(line)).join('\n'),
    ''
  ].join('\n')

  const changelog = await promisify(fs.readFile)(CHANGELOG, 'utf8')

  const containsRE = new RegExp(`\n## \\[${nextVersion}\\]\\([^]*?\n## `, 'm')

  const out = containsRE.test(changelog)
    ? changelog.replace(containsRE, changes + '\n## ')
    : changelog.replace(/(# Changelog\n)/, '$1' + changes)

  await promisify(fs.writeFile)(CHANGELOG, out, 'utf8')
})()
