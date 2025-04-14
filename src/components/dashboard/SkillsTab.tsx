
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SkillForm from "@/components/SkillForm";
import SkillsList from "@/components/dashboard/SkillsList";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Skill = {
  id: string;
  name: string;
  proficiency: number;
};

interface SkillsTabProps {
  skills: Skill[];
  userId: string;
  onRefresh: () => void;
}

const SkillsTab = ({ skills, userId, onRefresh }: SkillsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Skills</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Skill</DialogTitle>
              <DialogDescription>
                Add a skill to showcase your expertise.
              </DialogDescription>
            </DialogHeader>
            {userId && <SkillForm userId={userId} onSuccess={onRefresh} />}
          </DialogContent>
        </Dialog>
      </div>
      <SkillsList skills={skills} userId={userId} onRefresh={onRefresh} />
    </div>
  );
};

export default SkillsTab;
