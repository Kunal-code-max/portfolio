
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader, Download, FileText, Briefcase, GraduationCap, Award } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const resumeSchema = z.object({
  objective: z.string().optional(),
  education: z.array(
    z.object({
      school: z.string().min(2, "School name must be at least 2 characters"),
      degree: z.string().min(2, "Degree must be at least 2 characters"),
      fieldOfStudy: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      description: z.string().optional(),
    })
  ).optional(),
  workExperience: z.array(
    z.object({
      company: z.string().min(2, "Company name must be at least 2 characters"),
      position: z.string().min(2, "Position must be at least 2 characters"),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      description: z.string().optional(),
    })
  ).optional(),
});

type ResumeFormValues = z.infer<typeof resumeSchema>;

interface ResumeBuilderProps {
  userId: string;
  onComplete?: () => void;
}

const ResumeBuilder = ({ userId, onComplete }: ResumeBuilderProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resumePreview, setResumePreview] = useState<string | null>(null);

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      objective: "",
      education: [{ school: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", description: "" }],
      workExperience: [{ company: "", position: "", startDate: "", endDate: "", description: "" }],
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch skills
        const { data: skillsData, error: skillsError } = await supabase
          .from("skills")
          .select("*")
          .eq("user_id", userId)
          .order("proficiency", { ascending: false });

        if (skillsError) throw skillsError;
        setSkills(skillsData || []);

        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (projectsError) throw projectsError;
        setProjects(projectsData || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const addEducation = () => {
    const education = form.getValues().education || [];
    form.setValue("education", [
      ...education,
      { school: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", description: "" },
    ]);
  };

  const removeEducation = (index: number) => {
    const education = form.getValues().education || [];
    if (education.length > 1) {
      education.splice(index, 1);
      form.setValue("education", [...education]);
    }
  };

  const addWorkExperience = () => {
    const workExperience = form.getValues().workExperience || [];
    form.setValue("workExperience", [
      ...workExperience,
      { company: "", position: "", startDate: "", endDate: "", description: "" },
    ]);
  };

  const removeWorkExperience = (index: number) => {
    const workExperience = form.getValues().workExperience || [];
    if (workExperience.length > 1) {
      workExperience.splice(index, 1);
      form.setValue("workExperience", [...workExperience]);
    }
  };

  const generateResumePreview = (values: ResumeFormValues) => {
    if (!profile) return null;

    // Create HTML content for the resume
    const resumeHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resume - ${profile.full_name || 'Resume'}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
          }
          h1, h2, h3 { margin-top: 1.5em; color: #333; }
          h1 { border-bottom: 2px solid #555; padding-bottom: 5px; }
          .header { text-align: center; margin-bottom: 20px; }
          .contact-info { text-align: center; margin-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .section-title { border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          .item { margin-bottom: 15px; }
          .item-header { display: flex; justify-content: space-between; }
          .item-title { font-weight: bold; }
          .item-date { color: #777; }
          .skills-list { display: flex; flex-wrap: wrap; gap: 10px; }
          .skill-item { 
            background: #f0f0f0; 
            padding: 5px 10px; 
            border-radius: 3px; 
            font-size: 0.9em;
          }
          .projects-list { margin-top: 10px; }
          .project-item { margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${profile.full_name || ''}</h1>
          <p>${profile.headline || ''}</p>
        </div>
        
        <div class="contact-info">
          ${profile.email ? `<span>${profile.email}</span> | ` : ''}
          ${profile.phone ? `<span>${profile.phone}</span> | ` : ''}
          ${profile.location ? `<span>${profile.location}</span>` : ''}
          <br>
          ${profile.website ? `<span>Website: ${profile.website}</span> | ` : ''}
          ${profile.github ? `<span>GitHub: ${profile.github}</span> | ` : ''}
          ${profile.linkedin ? `<span>LinkedIn: ${profile.linkedin}</span>` : ''}
        </div>
        
        ${values.objective ? `
        <div class="section">
          <h2 class="section-title">Professional Summary</h2>
          <p>${values.objective}</p>
        </div>
        ` : ''}
        
        ${skills && skills.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skills-list">
            ${skills.map(skill => `
              <div class="skill-item">${skill.name} ${skill.proficiency ? `(${skill.proficiency}/5)` : ''}</div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        ${values.workExperience && values.workExperience.length > 0 && values.workExperience[0].company ? `
        <div class="section">
          <h2 class="section-title">Work Experience</h2>
          ${values.workExperience.map(job => `
            <div class="item">
              <div class="item-header">
                <span class="item-title">${job.position} at ${job.company}</span>
                <span class="item-date">${job.startDate || ''} ${job.endDate ? `- ${job.endDate}` : job.startDate ? '- Present' : ''}</span>
              </div>
              <p>${job.description || ''}</p>
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${values.education && values.education.length > 0 && values.education[0].school ? `
        <div class="section">
          <h2 class="section-title">Education</h2>
          ${values.education.map(edu => `
            <div class="item">
              <div class="item-header">
                <span class="item-title">${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''} - ${edu.school}</span>
                <span class="item-date">${edu.startDate || ''} ${edu.endDate ? `- ${edu.endDate}` : edu.startDate ? '- Present' : ''}</span>
              </div>
              <p>${edu.description || ''}</p>
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${projects && projects.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Projects</h2>
          <div class="projects-list">
            ${projects.map(project => `
              <div class="project-item">
                <div class="item-header">
                  <span class="item-title">${project.title}</span>
                </div>
                <p>${project.description || ''}</p>
                ${project.tech_stack && project.tech_stack.length > 0 ? `
                <div><small><strong>Technologies:</strong> ${project.tech_stack.join(', ')}</small></div>
                ` : ''}
                ${project.project_url || project.github_url ? `
                <div>
                  <small>
                    ${project.project_url ? `<a href="${project.project_url}">View Project</a>` : ''}
                    ${project.project_url && project.github_url ? ' | ' : ''}
                    ${project.github_url ? `<a href="${project.github_url}">GitHub</a>` : ''}
                  </small>
                </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
      </body>
      </html>
    `;

    return resumeHtml;
  };

  const onSubmit = (values: ResumeFormValues) => {
    setSubmitting(true);
    
    try {
      // Generate resume preview HTML
      const resumeHtml = generateResumePreview(values);
      setResumePreview(resumeHtml);
      
      toast({
        title: "Resume generated",
        description: "Your resume has been created successfully!",
      });
      
      // Save resume data to database could be implemented here
      
      // Call onComplete if provided
      if (onComplete) {
        onComplete();
      }
    } catch (error: any) {
      toast({
        title: "Error generating resume",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const downloadResume = () => {
    if (!resumePreview) return;
    
    // Create a blob from the HTML content
    const blob = new Blob([resumePreview], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile?.full_name || 'resume'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (resumePreview) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Resume</h2>
          <Button onClick={downloadResume}>
            <Download className="mr-2 h-4 w-4" />
            Download HTML
          </Button>
        </div>
        
        <div className="border rounded-md p-4 bg-card">
          <iframe 
            srcDoc={resumePreview}
            title="Resume Preview"
            className="w-full h-[600px] border-0"
          />
        </div>
        
        <div className="flex justify-end">
          <Button onClick={() => setResumePreview(null)} variant="outline" className="mr-2">
            Edit Resume
          </Button>
          {onComplete && (
            <Button onClick={onComplete}>
              Continue
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="basic">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">
              <FileText className="h-4 w-4 mr-2" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="experience">
              <Briefcase className="h-4 w-4 mr-2" />
              Work Experience
            </TabsTrigger>
            <TabsTrigger value="education">
              <GraduationCap className="h-4 w-4 mr-2" />
              Education
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="objective"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Summary</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="A brief summary of your professional background and goals"
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-muted/30 p-4 rounded-md">
                    <h3 className="font-medium flex items-center mb-3">
                      <Award className="h-4 w-4 mr-2" />
                      Skills
                    </h3>
                    {skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <span 
                            key={skill.id} 
                            className="px-2 py-1 bg-secondary/20 text-sm rounded-full"
                          >
                            {skill.name} ({skill.proficiency}/5)
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No skills added yet. You can add skills from the Skills tab in your dashboard.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="experience">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {form.watch("workExperience")?.map((_, index) => (
                    <div key={index} className="space-y-4 p-4 border border-border rounded-md">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Work Experience #{index + 1}</h3>
                        {index > 0 && (
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeWorkExperience(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`workExperience.${index}.company`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company</FormLabel>
                              <FormControl>
                                <Input placeholder="Company name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`workExperience.${index}.position`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Position</FormLabel>
                              <FormControl>
                                <Input placeholder="Job title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`workExperience.${index}.startDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YYYY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`workExperience.${index}.endDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date (or Present)</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YYYY or Present" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name={`workExperience.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your responsibilities and achievements"
                                className="min-h-[100px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addWorkExperience}
                    className="w-full"
                  >
                    Add Another Work Experience
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="education">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {form.watch("education")?.map((_, index) => (
                    <div key={index} className="space-y-4 p-4 border border-border rounded-md">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Education #{index + 1}</h3>
                        {index > 0 && (
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeEducation(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`education.${index}.school`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>School / University</FormLabel>
                              <FormControl>
                                <Input placeholder="School name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`education.${index}.degree`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Degree</FormLabel>
                              <FormControl>
                                <Input placeholder="Bachelor's, Master's, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name={`education.${index}.fieldOfStudy`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Field of Study</FormLabel>
                            <FormControl>
                              <Input placeholder="Computer Science, Business, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`education.${index}.startDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YYYY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`education.${index}.endDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date (or Expected)</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YYYY or Expected" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name={`education.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Relevant coursework, achievements, etc."
                                className="min-h-[100px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addEducation}
                    className="w-full"
                  >
                    Add Another Education
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Generating Resume...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Resume
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ResumeBuilder;
