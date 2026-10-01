const fs = require("fs");
let content = fs.readFileSync("src/app/(main)/layout.tsx", "utf8");

const oldJsonLd = `const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: SITE_CONFIG.name,
      jobTitle: "Software Engineer",
      url: SITE_CONFIG.url,
      sameAs: [
        socials?.github,
        socials?.linkedin,
        socials?.twitter,
        socials?.medium
      ].filter(Boolean),
      
      knowsAbout: ["React", "Next.js", "TypeScript", "Guidewire Jutro", "Frontend Development"]
    };`;

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
            jobTitle: "Software Engineer & Frontend Developer",
            url: SITE_CONFIG.url,
            image: \`\${SITE_CONFIG.url}/logo.png\`,
            sameAs: [
              socials?.github,
              socials?.linkedin,
              socials?.twitter,
              socials?.medium
            ].filter(Boolean),
            knowsAbout: ["React", "Next.js", "TypeScript", "JavaScript", "Frontend Development", "Web Performance"]
          }
        }
      ]
    };`;

content = content.replace(oldJsonLd, newJsonLd);
fs.writeFileSync("src/app/(main)/layout.tsx", content);
