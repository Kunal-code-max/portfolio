
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

const projectSchema = z.object({
  title: z.string().min(2, "Project title must be at least 2 characters"),
  description: z.string().optional(),
  imageUrl: z.string().url("Please enter a valid URL").optional().or(z.string().length(0)),
  projectUrl: z.string().url("Please enter a valid URL").optional().or(z.string().length(0)),
  githubUrl: z.string().url("Please enter a valid URL").optional().or(z.string().length(0)),
  techStack: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  userId: string;
  onSuccess?: () => void;
}

const ProjectForm = ({ userId, onSuccess }: ProjectFormProps) => {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      projectUrl: "",
      githubUrl: "",
      techStack: "",
    },
  });

  const onSubmit = async (values: ProjectFormValues) => {
    setSubmitting(true);
    
    try {
      // Convert comma-separated tech stack to array
      const techStackArray = values.techStack
        ? values.techStack.split(',').map(item => item.trim()).filter(Boolean)
        : [];
      
      const { error } = await supabase
        .from("projects")
        .insert({
          user_id: userId,
          title: values.title,
          description: values.description,
          image_url: values.imageUrl,
          project_url: values.projectUrl,
          github_url: values.githubUrl,
          tech_stack: techStackArray,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Project added",
        description: "Your project has been added to your portfolio!",
      });
      
      // Reset form
      form.reset();
      
      // Call onSuccess if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Error adding project",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title*</FormLabel>
              <FormControl>
                <Input placeholder="My Awesome Project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your project..." 
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="techStack"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technologies Used</FormLabel>
                <FormControl>
                  <Input placeholder="React, Node.js, Tailwind CSS" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="projectUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Live Demo URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://myproject.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="githubUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub Repository URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/username/repo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Adding Project...
            </>
          ) : (
            "Add Project"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProjectForm;
