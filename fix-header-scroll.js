const fs = require("fs");
let content = fs.readFileSync("src/components/header-v2.tsx", "utf8");

content = content.replace(
  'href="/#home"',
  'href="/"'
);

// Fix the scrolling logic
// If href === "/", we want to scroll to top!
const handleLinkClickStr = `const handleLinkClick = (
      e: React.MouseEvent<HTMLAnchorElement>,
      href: string,
    ) => {
      const isHashLink = href.startsWith("/#") || href.startsWith("#");
  
      if (pathname === "/") {
        if (href === "/") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (isHashLink) {
          e.preventDefault();
          const targetId = href.split("#")[1];
          const elem = document.getElementById(targetId);
          if (elem) {
            window.scrollTo({
              top: elem.offsetTop - 80,
              behavior: "smooth",
            });
          }
        }
      }
      setIsOpen(false);
    };`;

content = content.replace(/const handleLinkClick = \([\s\S]*?setIsOpen\(false\);\s*\};/m, handleLinkClickStr);

fs.writeFileSync("src/components/header-v2.tsx", content);
