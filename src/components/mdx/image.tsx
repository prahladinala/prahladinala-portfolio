"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function MdxImage({ src, alt, width, height, ...props }: any) {
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

  // Close lightbox on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isZoomed) setIsZoomed(false);
    };
    if (isZoomed) {
      document.body.style.overflow = 'hidden';
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isZoomed]);

  if (!src) return null;
  const isExternal = src.startsWith("http");

  return (
    <>
      <span 
        className="relative flex flex-col my-8 overflow-hidden rounded-xl border border-border bg-muted/5 text-center min-h-[300px] w-full items-center justify-center block cursor-zoom-in group"
        onClick={() => setIsZoomed(true)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsZoomed(true); } }}
        role="button"
        tabIndex={0}
        aria-label={`Zoom image: ${alt || "Image"}`}
      >
        {isLoading && (
          <span className="absolute inset-0 z-10 block w-full h-full bg-muted/40 animate-pulse rounded-xl" />
        )}
        
        {isExternal ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img 
            src={src} 
            alt={alt || "Image"} 
            loading="lazy" 
            className={`mx-auto rounded-xl max-h-[600px] object-contain transition-all duration-700 ease-in-out group-hover:scale-[1.02] ${isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} z-20 relative`} 
            onLoad={() => setIsLoading(false)}
            {...props} 
          />
        ) : (
          <Image
            src={src}
            alt={alt || "Image"}
            width={width || 800}
            height={height || 500}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`mx-auto rounded-xl object-contain max-h-[600px] w-auto h-auto transition-all duration-700 ease-in-out group-hover:scale-[1.02] ${isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} z-20 relative`}
            onLoad={() => setIsLoading(false)}
            {...props}
          />
        )}
        
        {alt && !isLoading && <span className="block text-sm text-muted-foreground mt-3 mb-3 z-20 relative">{alt}</span>}
      </span>

      {/* Lightbox */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm cursor-zoom-out p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsZoomed(false)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsZoomed(false); } }}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <button 
            className="absolute top-6 right-6 p-2 rounded-full bg-muted/50 hover:bg-muted text-foreground transition-colors z-[101]"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(false);
            }}
            aria-label="Close zoomed image"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center">
            {isExternal ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img 
                src={src} 
                alt={alt || "Image"} 
                className="max-w-full max-h-full object-contain rounded-md shadow-2xl animate-in zoom-in-95 duration-200" 
              />
            ) : (
              <Image
                src={src}
                alt={alt || "Image"}
                fill
                sizes="100vw"
                className="object-contain rounded-md shadow-2xl animate-in zoom-in-95 duration-200"
                quality={100}
              />
            )}
          </div>
          {alt && <div className="absolute bottom-6 left-0 right-0 text-center text-foreground font-medium bg-background/80 py-2 mx-auto w-fit px-4 rounded-full backdrop-blur-md border border-border shadow-lg">{alt}</div>}
        </div>
      )}
    </>
  );
}
