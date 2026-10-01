const fs = require("fs");
let content = fs.readFileSync("src/app/(main)/layout.tsx", "utf8");

const start = content.indexOf("const jsonLd = {");
const end = content.indexOf("return (", start);

if (start !== -1 && end !== -1) {
  const newJsonLd = `const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": \`\${SITE_CONFIG.url}/#website\`,
        url: SITE_CONFIG.url,
        name: SITE_CONFIG.name,
        description: SITE_CONFIG.description,
        inLanguage: "en-US"
      },
      {
        "@type": "ProfilePage",
        "@id": \`\${SITE_CONFIG.url}/#profile\`,
        url: SITE_CONFIG.url,
        name: \`\${SITE_CONFIG.name} - Software Engineer\`,
        isPartOf: {
          "@id": \`\${SITE_CONFIG.url}/#website\`
        },
        mainEntity: {
          "@type": "Person",
          name: SITE_CONFIG.name,
          jobTitle: "Software Engineer",
          url: SITE_CONFIG.url,
          image: \`\${SITE_CONFIG.url}/logo.png\`,
          sameAs: [
            socials?.github,
            socials?.linkedin,
            socials?.twitter,
            socials?.medium
          ].filter(Boolean),
          knowsAbout: ["React", "Next.js", "TypeScript", "Frontend Development"]
        }
      }
    ]
  };

  `;
  content = content.substring(0, start) + newJsonLd + content.substring(end);
  fs.writeFileSync("src/app/(main)/layout.tsx", content);
} else {
  console.log("Could not find jsonLd block");
}
