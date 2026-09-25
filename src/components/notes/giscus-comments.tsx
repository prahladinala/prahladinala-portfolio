"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export function GiscusComments() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="mt-16 pt-8 border-t border-border print:hidden">
      <h3 className="text-xl font-bold mb-8">Comments</h3>
      <Giscus
        id="comments"
        repo="prahladinala/prahladinala-portfolio"
        repoId="R_kgDOTHxtTg" // Note: The user will need to update this with their actual repoId from Giscus.app if it hasn't been configured yet!
        category="Announcements"
        categoryId="DIC_kwDOTHxtTs4DGWSl" // Same for categoryId
        mapping="pathname"
        term="Welcome to @giscus/react component!"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={resolvedTheme === "dark" ? "transparent_dark" : "light"}
        lang="en"
        loading="lazy"
      />
    </div>
  );
}

