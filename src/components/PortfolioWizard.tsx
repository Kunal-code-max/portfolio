
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, ChevronRight, ChevronLeft, User, Briefcase, Award, FileText, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Step components
import Profile from "@/pages/Profile";
import ProjectForm from "@/components/ProjectForm";
import SkillForm from "@/components/SkillForm";
import ResumeBuilder from "@/components/ResumeBuilder";

type WizardStep = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const PortfolioWizard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [wizardComplete, setWizardComplete] = useState(false);

  const steps: WizardStep[] = [
    {
      id: "profile",
      title: "Personal Information",
      description: "Enter your basic information to get started",
      icon: <User className="h-5 w-5" />,
    },
    {
      id: "projects",
      title: "Add Projects",
      description: "Showcase your best work",
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      id: "skills",
      title: "Add Skills",
      description: "Highlight your expertise",
      icon: <Award className="h-5 w-5" />,
    },
    {
      id: "resume",
      title: "Build Resume",
      description: "Create your professional resume",
      icon: <FileText className="h-5 w-5" />,
    },
  ];

  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      completeWizard();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleSkip = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      completeWizard();
    }
  };

  const completeWizard = async () => {
    setLoading(true);
    try {
      setWizardComplete(true);
      toast({
        title: "Portfolio complete!",
        description: "Your portfolio has been successfully created.",
      });
      
      // Redirect to the portfolio view page
      if (user) {
        navigate(`/portfolio/${user.id}`);
      }
    } catch (error: any) {
      toast({
        title: "Error completing portfolio",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStepSuccess = () => {
    handleNext();
  };

  // Render the appropriate step content
  const renderStepContent = () => {
    if (wizardComplete) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CheckCircle className="h-16 w-16 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">All Done!</h2>
          <p className="text-muted-foreground mb-6">Your portfolio has been created successfully.</p>
          {user && (
            <Button onClick={() => navigate(`/portfolio/${user.id}`)}>
              View My Portfolio
            </Button>
          )}
        </div>
      );
    }

    switch (currentStep.id) {
      case "profile":
        return <div className="wizard-step-container"><Profile wizardMode={true} onComplete={handleStepSuccess} /></div>;
      case "projects":
        return (
          <div className="wizard-step-container">
            <h2 className="text-2xl font-bold mb-4">Add Your Projects</h2>
            <p className="text-muted-foreground mb-6">Showcase your work by adding projects to your portfolio.</p>
            {user && <ProjectForm userId={user.id} onSuccess={handleStepSuccess} />}
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={handleSkip}>
                Skip for now
              </Button>
            </div>
          </div>
        );
      case "skills":
        return (
          <div className="wizard-step-container">
            <h2 className="text-2xl font-bold mb-4">Add Your Skills</h2>
            <p className="text-muted-foreground mb-6">Add skills to showcase your expertise.</p>
            {user && <SkillForm userId={user.id} onSuccess={handleStepSuccess} />}
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={handleSkip}>
                Skip for now
              </Button>
            </div>
          </div>
        );
      case "resume":
        return (
          <div className="wizard-step-container">
            <h2 className="text-2xl font-bold mb-4">Build Your Resume</h2>
            <p className="text-muted-foreground mb-6">Create a professional resume based on your portfolio information.</p>
            {user && <ResumeBuilder userId={user.id} onComplete={handleStepSuccess} />}
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={handleSkip}>
                Skip for now
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container-custom py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Build Your Portfolio</CardTitle>
          <div className="flex justify-between items-center mt-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  index === currentStepIndex
                    ? "text-primary"
                    : index < currentStepIndex
                    ? "text-muted-foreground"
                    : "text-muted-foreground/50"
                }`}
              >
                <div
                  className={`flex items-center justify-center h-10 w-10 rounded-full border-2 mb-2 ${
                    index === currentStepIndex
                      ? "border-primary bg-primary/10"
                      : index < currentStepIndex
                      ? "border-muted-foreground bg-muted"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {step.icon}
                </div>
                <span className="text-xs hidden md:block">{step.title}</span>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
        {!wizardComplete && (
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStepIndex === 0}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
            {currentStep.id !== "resume" && (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
            {currentStep.id === "resume" && (
              <Button onClick={completeWizard} disabled={loading}>
                {loading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Finalizing...
                  </>
                ) : (
                  "Complete"
                )}
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default PortfolioWizard;
