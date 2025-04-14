
import PortfolioWizard from "@/components/PortfolioWizard";
import RequireAuth from "@/components/RequireAuth";

const PortfolioWizardPage = () => {
  return (
    <RequireAuth>
      <PortfolioWizard />
    </RequireAuth>
  );
};

export default PortfolioWizardPage;
