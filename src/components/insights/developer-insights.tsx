export function DeveloperInsights() {
  // Currently hidden as requested by the user
  return (
    <section id="insights" className="py-24 w-full relative hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Developer Insights</h2>
          <div className="w-12 h-1 bg-primary rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card border border-border rounded-2xl p-6 flex justify-center items-center">
            {/* We use next/image or img for the github stats card */}
            <img 
              src="https://github-readme-stats.vercel.app/api?username=PRAHLADINALA&show_icons=true&theme=transparent&hide_border=true&title_color=a855f7&text_color=8b949e&icon_color=a855f7" 
              alt="Prahlad's GitHub Stats" 
              className="w-full max-w-md h-auto filter dark:invert"
            />
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 flex justify-center items-center">
             <img 
              src="https://github-readme-stats.vercel.app/api/top-langs/?username=PRAHLADINALA&layout=compact&theme=transparent&hide_border=true&title_color=a855f7&text_color=8b949e" 
              alt="Prahlad's Top Languages" 
              className="w-full max-w-md h-auto filter dark:invert"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
