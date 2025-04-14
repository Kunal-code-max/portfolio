
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, Upload, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface DashboardHeaderProps {
  userId: string | undefined;
}

const DashboardHeader = ({ userId }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  useEffect(() => {
    if (userId) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", userId)
          .single();
          
        if (!error && data) {
          setAvatarUrl(data.avatar_url);
          setFullName(data.full_name || "");
        }
      };
      
      fetchProfile();
    }
  }, [userId]);
  
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}.${fileExt}`;
      
      setUploadingAvatar(true);
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      const avatarUrl = data.publicUrl;
      
      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', userId);
        
      if (updateError) {
        throw updateError;
      }
      
      setAvatarUrl(avatarUrl);
      
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };
  
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-12 w-12">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt="Profile" />
            ) : (
              <AvatarFallback>
                {fullName ? fullName.charAt(0).toUpperCase() : <User size={20} />}
              </AvatarFallback>
            )}
          </Avatar>
          <label 
            htmlFor="dashboard-avatar-upload"
            className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
          >
            <Upload size={12} />
          </label>
          <input 
            type="file" 
            id="dashboard-avatar-upload" 
            className="hidden" 
            accept="image/*"
            onChange={handleAvatarUpload}
            disabled={uploadingAvatar}
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-heading">Portfolio Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your projects and skills</p>
        </div>
      </div>
      <div className="flex gap-3 mt-4 lg:mt-0">
        <Button onClick={() => navigate("/profile")} variant="outline">
          Edit Profile
        </Button>
        {userId && (
          <Button asChild>
            <a href={`/portfolio/${userId}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={16} className="mr-2" />
              View Portfolio
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
