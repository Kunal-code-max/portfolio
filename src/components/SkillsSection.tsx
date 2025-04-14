
import { Progress } from "@/components/ui/progress";

type Skill = {
  name: string;
  level: number;
  category: "frontend" | "backend" | "design" | "other";
};

const skills: Skill[] = [
  { name: "HTML & CSS", level: 95, category: "frontend" },
  { name: "JavaScript", level: 90, category: "frontend" },
  { name: "TypeScript", level: 85, category: "frontend" },
  { name: "React", level: 90, category: "frontend" },
  { name: "Vue.js", level: 75, category: "frontend" },
  { name: "Tailwind CSS", level: 90, category: "frontend" },
  { name: "Node.js", level: 80, category: "backend" },
  { name: "Express", level: 80, category: "backend" },
  { name: "MongoDB", level: 75, category: "backend" },
  { name: "SQL", level: 70, category: "backend" },
  { name: "Figma", level: 85, category: "design" },
  { name: "UI/UX Design", level: 80, category: "design" },
  { name: "Git & GitHub", level: 90, category: "other" },
  { name: "Responsive Design", level: 95, category: "frontend" },
  { name: "RESTful APIs", level: 85, category: "backend" },
];

const SkillsSection = () => {
  const frontendSkills = skills.filter((skill) => skill.category === "frontend");
  const backendSkills = skills.filter((skill) => skill.category === "backend");
  const designSkills = skills.filter((skill) => skill.category === "design");
  const otherSkills = skills.filter((skill) => skill.category === "other");

  const SkillCategory = ({ title, skills }: { title: string; skills: Skill[] }) => (
    <div>
      <h3 className="text-xl font-bold mb-4 font-heading">{title}</h3>
      <div className="space-y-4">
        {skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{skill.name}</span>
              <span className="text-sm text-muted-foreground">{skill.level}%</span>
            </div>
            <Progress value={skill.level} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section id="skills" className="section-padding bg-background">
      <div className="container-custom">
        <h2 className="section-title text-center">My Skills</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <SkillCategory title="Frontend Development" skills={frontendSkills} />
          <SkillCategory title="Backend Development" skills={backendSkills} />
          <SkillCategory title="Design" skills={designSkills} />
          <SkillCategory title="Other Skills" skills={otherSkills} />
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
