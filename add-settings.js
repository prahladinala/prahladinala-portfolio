const fs = require("fs");
let content = fs.readFileSync("keystatic.config.ts", "utf8");

const newSingleton = `
    settings: singleton({
      label: "Site Settings",
      path: "src/content/settings",
      format: { data: "json" },
      schema: {
        showComments: fields.checkbox({ label: "Show Comments", defaultValue: true, description: "Enable or disable Giscus comments on notes." }),
        showViews: fields.checkbox({ label: "Show View Counters", defaultValue: true, description: "Enable or disable view counters on notes." }),
        showTableOfContents: fields.checkbox({ label: "Show Table of Contents", defaultValue: true, description: "Enable or disable the sticky table of contents on notes." }),
        showShareButtons: fields.checkbox({ label: "Show Share Buttons", defaultValue: true, description: "Enable or disable share buttons on notes." }),
        showRelatedNotes: fields.checkbox({ label: "Show Related Notes", defaultValue: true, description: "Enable or disable the related notes section at the bottom of notes." }),
      }
    }),`;

content = content.replace("singletons: {", "singletons: {" + newSingleton);

fs.writeFileSync("keystatic.config.ts", content);
