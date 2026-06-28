export const techRadarData = [
  { category: "Adopt", items: ["Next.js 14+", "TypeScript", "Tailwind CSS v4", "shadcn/ui", "Guidewire Jutro"] },
  { category: "Trial", items: ["React Server Components", "GraphQL", "Framer Motion", "tRPC"] },
  { category: "Assess", items: ["Rust", "SvelteKit", "Bun", "Biome"] },
  { category: "Hold", items: ["jQuery", "Create React App", "Redux (legacy)"] },
];

export function TechRadarSection() {
  return (
    <section id="tech-radar" className="py-24 bg-muted/30 w-full relative">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Tech Radar</h2>
          <div className="w-12 h-1 bg-primary rounded-full" />
          <p className="mt-4 text-muted-foreground max-w-2xl">
            My current assessment of technologies and where they stand in my stack.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techRadarData.map((ring) => (
            <div key={ring.category} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${
                  ring.category === 'Adopt' ? 'bg-green-500' :
                  ring.category === 'Trial' ? 'bg-blue-500' :
                  ring.category === 'Assess' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <h3 className="font-bold text-lg">{ring.category}</h3>
              </div>
              <ul className="space-y-2">
                {ring.items.map((item) => (
                  <li key={item} className="text-muted-foreground flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-muted-foreground/50 before:rounded-full before:mr-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
