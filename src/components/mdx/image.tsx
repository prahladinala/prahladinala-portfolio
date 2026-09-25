import Image from "next/image";

export function MdxImage({ src, alt, width, height, ...props }: any) {
  if (!src) return null;

  // Handle external images
  const isExternal = src.startsWith("http");

  if (isExternal) {
    return (
      <span className="block relative my-8 overflow-hidden rounded-xl border border-border bg-muted/20 text-center">
        {/* We use standard img for external markdown images since we might not know the domain for Next config */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt || "Image"} loading="lazy" className="mx-auto rounded-xl max-h-[600px] object-contain" {...props} />
        {alt && <span className="block text-sm text-muted-foreground mt-2 mb-4">{alt}</span>}
      </span>
    );
  }

  // Handle local public folder images
  return (
    <span className="block relative my-8 overflow-hidden rounded-xl border border-border bg-muted/20 text-center">
      <Image
        src={src}
        alt={alt || "Image"}
        width={width || 800}
        height={height || 500}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="mx-auto rounded-xl object-contain max-h-[600px] w-auto h-auto"
        {...props}
      />
      {alt && <span className="block text-sm text-muted-foreground mt-2 mb-4">{alt}</span>}
    </span>
  );
}
