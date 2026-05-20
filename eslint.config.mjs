import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import globals from 'globals'
import { flatConfigs as importX } from 'eslint-plugin-import-x'
import n from 'eslint-plugin-n'
import promise from 'eslint-plugin-promise'
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
            js.configs.recommended,
            n.configs['flat/recommended'],
            promise.configs['flat/recommended'],
            importX.recommended
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
            js.configs.recommended,
            n.configs['flat/recommended'],
            promise.configs['flat/recommended'],
            importX.recommended
        ],
        rules: {
            'n/no-unsupported-features/es-syntax': 'off'
        }
    },
    {
        // Tooling and example files follow different constraints than runtime code.
        // Relax strict n/* checks here to avoid non-actionable lint noise.
        files: ['eslint.config.mjs', 'examples/**', 'scripts/**'],
        rules: {
            'n/no-unpublished-import': 'off',
            'n/no-missing-require': 'off',
            'n/no-unsupported-features/es-syntax': 'off',
            'n/no-process-exit': 'off',
            'n/hashbang': 'off'
        }
    },
    {
        files: ['**/*.yaml', '**/*.yml'],
        extends: [ymlConfigs['flat/standard']],
        rules: {
            'yml/plain-scalar': 'off'
        }
    }
])