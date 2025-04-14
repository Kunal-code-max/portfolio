
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ProjectForm from "@/components/ProjectForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  project_url: string;
  github_url: string;
  tech_stack: string[];
};

interface ProjectsListProps {
  projects: Project[];
  userId: string;
  onRefresh: () => void;
}

const ProjectsList = ({ projects, userId, onRefresh }: ProjectsListProps) => {
  const deleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;
      
      toast({
        title: "Project deleted",
        description: "The project has been removed from your portfolio.",
      });
      
      // Refresh projects list
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error deleting project",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-medium mb-2">No projects yet</h3>
        <p className="text-muted-foreground mb-4">
          Showcase your work by adding projects to your portfolio.
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Your First Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>
                Showcase your work by adding a new project to your portfolio.
              </DialogDescription>
            </DialogHeader>
            <ProjectForm userId={userId} onSuccess={onRefresh} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map(project => (
        <div key={project.id} className="bg-card rounded-xl overflow-hidden shadow-sm border">
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
            {project.description && (
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {project.description}
              </p>
            )}
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
            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-2">
                {project.project_url && (
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={14} className="mr-1" /> View
                    </a>
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <Trash2 size={14} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Project</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this project? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteProject(project.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsList;
