export default {
  input: './src/index.js',
  output: {
    dir: 'lib',
    format: 'cjs',
    entryFileNames: '[name].cjs',
    preserveModules: true,
    exports: 'auto'
  }
}
