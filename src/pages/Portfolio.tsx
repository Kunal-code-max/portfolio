import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader, Mail, MapPin, Phone, Globe, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type Profile = {
  id: string;
  full_name: string;
  headline: string;
  bio: string;
  avatar_url: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  github: string;
  linkedin: string;
};

type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  project_url: string;
  github_url: string;
  tech_stack: string[];
};

type Skill = {
  id: string;
  name: string;
  proficiency: number;
};

const Portfolio = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Portfolio-specific navigation links
  const portfolioLinks = [
    { href: "#hero", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" }
  ];

  // Check for user's preferred color scheme
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else if (storedTheme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      if (newTheme) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newTheme;
    });
  };

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", id)
          .order("created_at", { ascending: false });

        if (projectsError) throw projectsError;
        setProjects(projectsData || []);

        // Fetch skills
        const { data: skillsData, error: skillsError } = await supabase
          .from("skills")
          .select("*")
          .eq("user_id", id)
          .order("proficiency", { ascending: false });

        if (skillsError) throw skillsError;
        setSkills(skillsData || []);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPortfolioData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Portfolio Not Found</h1>
        <p className="text-muted-foreground">The requested portfolio does not exist or is not available.</p>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Navbar */}
      <Navbar 
        toggleTheme={toggleTheme} 
        isDarkMode={isDarkMode} 
        customLinks={portfolioLinks}
        onPortfolioPage={true}
      />
      
      {/* Hero Section */}
      <section id="hero" className="pt-24 pb-12 bg-gradient-to-b from-primary/10 to-background">
        <div className="container-custom text-center space-y-6">
          {profile.avatar_url && (
            <div className="flex justify-center mb-6">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                <AvatarFallback>{profile.full_name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold font-heading">{profile.full_name}</h1>
          {profile.headline && (
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{profile.headline}</p>
          )}

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {profile.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail size={16} />
                <a href={`mailto:${profile.email}`} className="hover:text-primary transition-colors">
                  {profile.email}
                </a>
              </div>
            )}
            {profile.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={16} />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone size={16} />
                <a href={`tel:${profile.phone}`} className="hover:text-primary transition-colors">
                  {profile.phone}
                </a>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-3 pt-2">
            {profile.website && (
              <Button size="icon" variant="ghost" asChild>
                <a href={profile.website} target="_blank" rel="noopener noreferrer" aria-label="Website">
                  <Globe size={20} />
                </a>
              </Button>
            )}
            {profile.github && (
              <Button size="icon" variant="ghost" asChild>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github size={20} />
                </a>
              </Button>
            )}
            {profile.linkedin && (
              <Button size="icon" variant="ghost" asChild>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      {profile.bio && (
        <section id="about" className="py-12 bg-background">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-6 font-heading">About Me</h2>
            <div className="prose prose-lg max-w-none">
              <p>{profile.bio}</p>
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-12 bg-secondary/10">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-8 font-heading">Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {skills.map((skill) => (
                <div key={skill.id} className="bg-card p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{skill.name}</h3>
                    <span className="text-sm text-muted-foreground">{skill.proficiency}/5</span>
                  </div>
                  <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section id="projects" className="py-12 bg-background">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-8 font-heading">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-card rounded-xl overflow-hidden shadow-md">
                  {project.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech_stack.map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-secondary/20 text-xs rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3">
                      {project.project_url && (
                        <Button size="sm" asChild>
                          <a
                            href={project.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Project
                          </a>
                        </Button>
                      )}
                      {project.github_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github size={14} className="mr-1" /> Code
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
      )}
    </div>
  );
};

export default Portfolio;
