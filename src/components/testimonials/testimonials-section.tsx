import { testimonials } from "@/data/testimonials";
import { Quote } from "lucide-react";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 w-full relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">What People Say</h2>
          <div className="w-12 h-1 bg-primary rounded-full" />
        </div>
        
        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory hide-scrollbar gap-6">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="snap-center shrink-0 w-[85vw] sm:w-[400px] bg-card border border-border rounded-2xl p-8 relative hover:border-primary/50 transition-colors"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed relative z-10">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
