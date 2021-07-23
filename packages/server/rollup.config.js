import typescript from "rollup-plugin-typescript2";
export default {
  input: "./src/index.js",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
    },
  ],
  plugins: [typescript()],
};
