
import { FileText, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-background">
      <div className="container-custom">
        <h2 className="section-title text-center">About Me</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              I'm a passionate frontend developer and UI/UX designer with over 5 years of experience building modern, 
              responsive web applications. I specialize in React, TypeScript, and modern CSS frameworks like Tailwind.
            </p>

            <p className="text-lg text-muted-foreground">
              My approach to web development focuses on creating intuitive user experiences that are both aesthetically 
              pleasing and highly functional. I believe in clean code, accessibility, and performance optimization.
            </p>

            <p className="text-lg text-muted-foreground">
              When I'm not coding, you can find me exploring new design trends, contributing to open-source projects, 
              or enjoying outdoor activities. I'm always eager to learn new technologies and improve my skills.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="btn-primary flex items-center gap-2" asChild>
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                  <FileText size={16} /> Download Resume
                </a>
              </Button>
            </div>
          </div>

          <div className="bg-card p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold mb-6 font-heading">Personal Information</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                  <p className="text-foreground">John Doe</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Age</h4>
                  <p className="text-foreground">28 Years</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Experience</h4>
                  <p className="text-foreground">5+ Years</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Availability</h4>
                  <p className="text-foreground">Open to Opportunities</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Location</h4>
                <div className="flex items-center text-foreground">
                  <MapPin size={16} className="mr-2 text-primary" />
                  <p>San Francisco, CA</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Email</h4>
                <div className="flex items-center text-foreground">
                  <Mail size={16} className="mr-2 text-primary" />
                  <a href="mailto:john.doe@example.com" className="hover:underline">
                    john.doe@example.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
