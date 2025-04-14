
import { useState } from "react";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Project types
type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  category: string;
};

// Sample projects data
const projectsData: Project[] = [
  {
    id: 1,
    title: "E-Commerce Website",
    description: "A fully responsive e-commerce platform built with React and Node.js. Features include user authentication, product filtering, cart functionality, and payment integration.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    liveUrl: "https://example.com/ecommerce",
    githubUrl: "https://github.com/johndoe/ecommerce",
    category: "web",
  },
  {
    id: 2,
    title: "Task Management App",
    description: "A task management application with drag-and-drop functionality, user authentication, and real-time updates. Built with React, TypeScript, and Firebase.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    tags: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
    liveUrl: "https://example.com/taskapp",
    githubUrl: "https://github.com/johndoe/taskapp",
    category: "app",
  },
  {
    id: 3,
    title: "Company Dashboard",
    description: "An admin dashboard for company analytics with interactive charts, data tables, and user management. Built with React, Material UI, and Chart.js.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    tags: ["React", "Material UI", "Chart.js", "Redux"],
    liveUrl: "https://example.com/dashboard",
    githubUrl: "https://github.com/johndoe/dashboard",
    category: "web",
  },
  {
    id: 4,
    title: "Weather App",
    description: "A weather application that provides current weather data and forecasts based on user location or search. Uses OpenWeather API and Geolocation.",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    tags: ["JavaScript", "API", "CSS", "HTML"],
    liveUrl: "https://example.com/weather",
    githubUrl: "https://github.com/johndoe/weather",
    category: "app",
  },
  {
    id: 5,
    title: "Portfolio Design",
    description: "A minimalist portfolio design for a photographer showcasing their work with a clean, modern aesthetic and smooth animations.",
    image: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    tags: ["Figma", "UI/UX", "Design", "Prototyping"],
    liveUrl: "https://figma.com/file/example",
    category: "design",
  },
  {
    id: 6,
    title: "Mobile App UI Kit",
    description: "A comprehensive UI kit for mobile applications with over 200 components, 10 templates, and a design system guide.",
    image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80",
    tags: ["Figma", "UI Design", "Mobile", "Design System"],
    liveUrl: "https://figma.com/file/example-uikit",
    category: "design",
  },
];

const ProjectsSection = () => {
  const [filter, setFilter] = useState("all");
  
  const categories = [
    { id: "all", name: "All" },
    { id: "web", name: "Web Development" },
    { id: "app", name: "App Development" },
    { id: "design", name: "UI/UX Design" },
  ];

  const filteredProjects = projectsData.filter(
    (project) => filter === "all" || project.category === filter
  );

  return (
    <section id="projects" className="section-padding bg-secondary/30">
      <div className="container-custom">
        <h2 className="section-title text-center">My Projects</h2>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={filter === category.id ? "default" : "outline"}
              onClick={() => setFilter(category.id)}
              className="rounded-full"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-card rounded-xl overflow-hidden shadow-md card-hover">
              <div className="h-48 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 font-heading">{project.title}</h3>
                
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  {project.liveUrl && (
                    <Button size="sm" className="flex items-center gap-1" asChild>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={14} /> View Live
                      </a>
                    </Button>
                  )}
                  
                  {project.githubUrl && (
                    <Button size="sm" variant="outline" className="flex items-center gap-1" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github size={14} /> Code
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
