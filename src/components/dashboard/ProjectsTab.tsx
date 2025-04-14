
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProjectForm from "@/components/ProjectForm";
import ProjectsList from "@/components/dashboard/ProjectsList";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  project_url: string;
  github_url: string;
  tech_stack: string[];
};

interface ProjectsTabProps {
  projects: Project[];
  userId: string;
  onRefresh: () => void;
}

const ProjectsTab = ({ projects, userId, onRefresh }: ProjectsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Projects</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>
                Showcase your work by adding a new project to your portfolio.
              </DialogDescription>
            </DialogHeader>
            {userId && <ProjectForm userId={userId} onSuccess={onRefresh} />}
          </DialogContent>
        </Dialog>
      </div>
      <ProjectsList projects={projects} userId={userId} onRefresh={onRefresh} />
    </div>
  );
};

export default ProjectsTab;
