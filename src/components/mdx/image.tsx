"use client";

import Image from "next/image";
import { useState } from "react";

export function MdxImage({ src, alt, width, height, ...props }: any) {
  const [isLoading, setIsLoading] = useState(true);

  if (!src) return null;

  // Handle external images
  const isExternal = src.startsWith("http");

  if (isExternal) {
    return (
      <span className="relative flex flex-col my-8 overflow-hidden rounded-xl border border-border bg-muted/5 text-center min-h-[300px] w-full items-center justify-center block">
        {isLoading && (
          <span className="absolute inset-0 z-10 block w-full h-full bg-muted/40 animate-pulse rounded-xl" />
        )}
        {/* We use standard img for external markdown images since we might not know the domain for Next config */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={src} 
          alt={alt || "Image"} 
          loading="lazy" 
          className={`mx-auto rounded-xl max-h-[600px] object-contain transition-all duration-700 ease-in-out ${isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} z-20 relative`} 
          onLoad={() => setIsLoading(false)}
          {...props} 
        />
        {alt && !isLoading && <span className="block text-sm text-muted-foreground mt-3 mb-3 z-20 relative">{alt}</span>}
      </span>
    );
  }

  // Handle local public folder images
  return (
    <span className="relative flex flex-col my-8 overflow-hidden rounded-xl border border-border bg-muted/5 text-center min-h-[300px] w-full items-center justify-center block">
      {isLoading && (
        <span className="absolute inset-0 z-10 block w-full h-full bg-muted/40 animate-pulse rounded-xl" />
      )}
      <Image
        src={src}
        alt={alt || "Image"}
        width={width || 800}
        height={height || 500}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`mx-auto rounded-xl object-contain max-h-[600px] w-auto h-auto transition-all duration-700 ease-in-out ${isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} z-20 relative`}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
      {alt && !isLoading && <span className="block text-sm text-muted-foreground mt-3 mb-3 z-20 relative">{alt}</span>}
    </span>
  );
}
