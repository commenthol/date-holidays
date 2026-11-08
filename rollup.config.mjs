export default {
  input: "./src/index.js",
  output: {
    dir: "lib",
    format: "cjs",
    interop: "auto",
    entryFileNames: "[name].cjs",
    exports: "auto",
    preserveModules: true,
    preserveModulesRoot: "src",
  },
};
