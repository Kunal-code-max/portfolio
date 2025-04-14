
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "lucide-react";
import { Project, Skill } from "@/components/dashboard/types";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProjectsTab from "@/components/dashboard/ProjectsTab";
import SkillsTab from "@/components/dashboard/SkillsTab";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }
      
      setUser(session.user);
      await fetchUserData(session.user.id);
    };
    
    const fetchUserData = async (userId: string) => {
      try {
        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (projectsError) throw projectsError;
        setProjects(projectsData || []);

        // Fetch skills
        const { data: skillsData, error: skillsError } = await supabase
          .from("skills")
          .select("*")
          .eq("user_id", userId)
          .order("name", { ascending: true });

        if (skillsError) throw skillsError;
        setSkills(skillsData || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <DashboardHeader userId={user?.id} />

      <Tabs defaultValue="projects" className="space-y-8">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <ProjectsTab 
            projects={projects} 
            userId={user?.id} 
            onRefresh={handleRefresh} 
          />
        </TabsContent>

        <TabsContent value="skills">
          <SkillsTab 
            skills={skills} 
            userId={user?.id} 
            onRefresh={handleRefresh} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
