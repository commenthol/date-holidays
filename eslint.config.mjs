import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import globals from 'globals'
import { configs as ymlConfigs } from 'eslint-plugin-yml'

export default defineConfig([
    globalIgnores([
        'coverage/**',
        'dist/**',
        'lib/**',
        'src/data.js',
        'pnpm-lock.yaml'
    ]),
    {
        files: ['**/*.js', '**/*.mjs'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.mocha
            },
            ecmaVersion: 'latest',
            sourceType: 'module'
        },
        extends: [
            js.configs.recommended
        ]
    },
    {
        files: ['**/*.cjs'],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.mocha
            },
            ecmaVersion: 'latest',
            sourceType: 'commonjs'
        },
        extends: [
            js.configs.recommended
        ]
    },
    {
        files: ['**/*.yaml', '**/*.yml'],
        extends: [ymlConfigs['flat/standard']],
        rules: {
            'yml/plain-scalar': 'off'
        }
    }
])