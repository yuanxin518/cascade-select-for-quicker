import * as rollup from "rollup";
import typescript from "@rollup/plugin-typescript";

/** 移除export相关代码 */
export function removeExportDefault() {
  return {
    name: "remove-export-default",
    renderChunk(code: string) {
      let result = code;
      result = result.replace(/^.*export\s+default.*$/gm, "");
      result = result.replace(/^.*export\s*\{.*$/gm, "");
      result = result.replace(/^export\s+([a-zA-Z])/gm, "$1");
      return result;
    },
  };
}

export default {
  input: "./core/quicker-tree-select.ts",
  output: [
    {
      file: "dist/quicker-tree-select.js",
      format: "cjs",
    },
    {
      file: "dist/quicker-tree-select-for-quicker-script.js",
      format: "es",
      name: "QuickerTreeSelect",
      plugins: [removeExportDefault()],
    },
  ],
  plugins: [typescript()],
};
