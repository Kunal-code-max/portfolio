
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center pt-16 section-padding bg-gradient-to-br from-background to-secondary/30"
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <p className="text-primary font-medium">Hello, I'm</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading leading-tight">
              Kunal Prajapati
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-muted-foreground font-heading">
              <span className="text-foreground">Software Developer</span> & UI/UX Designer
            </h2>
            <p className="text-lg max-w-2xl text-muted-foreground">
              I create beautiful, functional, and responsive websites and applications. 
              My focus is on bringing your ideas to life with clean code and stunning designs.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button className="btn-primary flex items-center gap-2">
                View My Work <ArrowRight size={16} />
              </Button>
              <Button variant="outline" className="btn-outline" asChild>
                <a href="#contact">Contact Me</a>
              </Button>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end animate-fade-in">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-secondary shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJlZXxlbnwwfHwwfHx8MA%3D%3D"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
