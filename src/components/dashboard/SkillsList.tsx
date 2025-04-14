
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import SkillForm from "@/components/SkillForm";
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

type Skill = {
  id: string;
  name: string;
  proficiency: number;
};

interface SkillsListProps {
  skills: Skill[];
  userId: string;
  onRefresh: () => void;
}

const SkillsList = ({ skills, userId, onRefresh }: SkillsListProps) => {
  const deleteSkill = async (skillId: string) => {
    try {
      const { error } = await supabase
        .from("skills")
        .delete()
        .eq("id", skillId);

      if (error) throw error;
      
      toast({
        title: "Skill deleted",
        description: "The skill has been removed from your portfolio.",
      });
      
      // Refresh skills list
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error deleting skill",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (skills.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-medium mb-2">No skills added yet</h3>
        <p className="text-muted-foreground mb-4">
          Showcase your expertise by adding skills to your portfolio.
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Your First Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Skill</DialogTitle>
              <DialogDescription>
                Add a skill to showcase your expertise.
              </DialogDescription>
            </DialogHeader>
            <SkillForm userId={userId} onSuccess={onRefresh} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {skills.map(skill => (
        <div key={skill.id} className="bg-card p-4 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{skill.name}</h3>
            <div className="flex gap-2">
              <span className="text-sm text-muted-foreground">{skill.proficiency}/5</span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Trash2 size={14} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Skill</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this skill? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteSkill(skill.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
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
  );
};

export default SkillsList;
