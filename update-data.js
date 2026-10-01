const fs = require("fs");
let content = fs.readFileSync("src/lib/keystatic-data.ts", "utf8");

const newCode = `
export type Settings = {
  showComments: boolean;
  showViews: boolean;
  showTableOfContents: boolean;
  showShareButtons: boolean;
  showRelatedNotes: boolean;
};

export const getSettings = cache((): Settings => {
  const filePath = path.join(process.cwd(), "src/content/settings.json");
  
  const defaultSettings: Settings = {
    showComments: true,
    showViews: true,
    showTableOfContents: true,
    showShareButtons: true,
    showRelatedNotes: true,
  };

  if (!fs.existsSync(filePath)) return defaultSettings;
  
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return { ...defaultSettings, ...JSON.parse(content) };
  } catch (e) {
    return defaultSettings;
  }
});
`;

content = content + "\n" + newCode;
fs.writeFileSync("src/lib/keystatic-data.ts", content);
