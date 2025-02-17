import path from "path";

export default function noCodeSplitForInput(targetEntryName) {
  return {
    name: "no-code-split-for-input",
    generateBundle(options, bundle) {
      // Find the target entry chunk by matching its name.
      let targetChunk;
      let targetKey;
      for (const [key, chunk] of Object.entries(bundle)) {
        if (chunk.type === "chunk" && chunk.name === targetEntryName) {
          targetChunk = chunk;
          targetKey = key;
          break;
        }
      }
      if (!targetChunk) {
        this.error(`Target entry chunk "${targetEntryName}" not found.`);
        return;
      }

      // Collect dependent chunks recursively.
      const collectedDeps = new Set();
      function collectDependencies(chunk) {
        for (const imported of chunk.imports || []) {
          if (!collectedDeps.has(imported)) {
            collectedDeps.add(imported);
            const depChunk = bundle[imported];
            if (depChunk && depChunk.type === "chunk") {
              collectDependencies(depChunk);
            }
          }
        }
      }
      collectDependencies(targetChunk);

      // Inline the code from each dependency into the target chunk.
      let inlinedCode = "";
      for (const depName of collectedDeps) {
        const depChunk = bundle[depName];
        if (depChunk && depChunk.type === "chunk") {
          inlinedCode += "\n" + depChunk.code;
          // Remove the dependency chunk from the bundle.
          delete bundle[depName];
        }
      }

      // Prepend the inlined code to the target chunk.
      targetChunk.code = inlinedCode + "\n" + targetChunk.code;
      // Clear the imports list since they’re now inlined.
      targetChunk.imports = [];
    },
  };
}
