/* eslint-disable react/no-unescaped-entities */
import { getTestimonials } from "@/lib/keystatic-data";
import { Quote } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = getTestimonials();
  if (testimonials.length === 0) return null;

  // Duplicate testimonials to create a seamless infinite loop
  const displayItems = [...testimonials, ...testimonials];

  return (
    <section
      id="testimonials"
      className="py-24 w-full relative overflow-hidden"
    >
      <div className="container px-4 md:px-6 mx-auto mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          What People Say
        </h2>
        <div className="w-12 h-1 bg-primary rounded-full" />
      </div>

      <div className="flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max gap-6 animate-marquee hover:[animation-play-state:paused] py-4 pl-6">
          {displayItems.map((testimonial, idx) => (
            <div
              key={testimonial.slug + "-" + idx}
              className="shrink-0 w-[85vw] sm:w-[400px] bg-card border border-border rounded-2xl p-8 relative hover:border-primary/50 transition-colors"
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
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
