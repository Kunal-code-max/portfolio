
export type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  project_url: string;
  github_url: string;
  tech_stack: string[];
};

export type Skill = {
  id: string;
  name: string;
  proficiency: number;
};
