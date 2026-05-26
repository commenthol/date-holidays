export default {
  input: './src/index.js',
  external: ['date-holidays-parser'],
  output: {
    dir: 'lib',
    format: 'cjs',
    entryFileNames: '[name].cjs',
    preserveModules: true,
    exports: 'auto'
  }
}
