
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
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const skillSchema = z.object({
  name: z.string().min(2, "Skill name must be at least 2 characters"),
  proficiency: z.preprocess(
    (val) => parseInt(val as string),
    z.number().int().min(1, "Proficiency must be between 1 and 5").max(5)
  ),
});

type SkillFormValues = z.infer<typeof skillSchema>;

interface SkillFormProps {
  userId: string;
  onSuccess?: () => void;
}

const SkillForm = ({ userId, onSuccess }: SkillFormProps) => {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      proficiency: 3,
    },
  });

  const onSubmit = async (values: SkillFormValues) => {
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("skills")
        .insert({
          user_id: userId,
          name: values.name,
          proficiency: values.proficiency, // Now properly converted to number
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Skill added",
        description: "Your skill has been added to your portfolio!",
      });
      
      // Reset form
      form.reset();
      
      // Call onSuccess if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Error adding skill",
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skill Name*</FormLabel>
              <FormControl>
                <Input placeholder="React" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="proficiency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proficiency Level</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select proficiency level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1 - Beginner</SelectItem>
                  <SelectItem value="2">2 - Elementary</SelectItem>
                  <SelectItem value="3">3 - Intermediate</SelectItem>
                  <SelectItem value="4">4 - Advanced</SelectItem>
                  <SelectItem value="5">5 - Expert</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Adding Skill...
            </>
          ) : (
            "Add Skill"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SkillForm;
