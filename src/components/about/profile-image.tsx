import Image from "next/image";

export function ProfileImage() {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto lg:mx-0 shrink-0">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-purple-500/40 rounded-full blur-3xl opacity-50 dark:opacity-30" />
      <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border bg-muted/50 p-2 transform rotate-3 hover:rotate-0 transition-transform duration-500">
        <div className="w-full h-full bg-muted rounded-xl flex items-center justify-center overflow-hidden">
          {/* Using a placeholder for now, replace with actual image */}
          {/* <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex flex-col items-center justify-center text-muted-foreground">
            <span className="text-4xl">👨‍💻</span>
            <span className="mt-2 text-sm">Prahlad</span>
          </div> */}
          {/* Image instead of placeholder */}
          <Image
            src="/avatar.PNG"
            alt="Prahlad Inala"
            width={320}
            height={320}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Decorative floating badge */}
      <div className="absolute -bottom-4 -right-4 bg-background border border-border rounded-lg shadow-lg p-3 transform -rotate-6 hover:rotate-0 transition-transform">
        <p className="text-xs font-bold whitespace-nowrap">
          ✨ Building the web
        </p>
      </div>
    </div>
  );
}
