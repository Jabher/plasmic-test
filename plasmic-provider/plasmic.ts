import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "w63X2LqEPLNaKe4vMByZM4",  // ID of a project you are using
      token: "bixnE8JQnCqEvMRNIktx1VWvNfNCLgtMINGw6pUHZ1CFqarnSuvNeeUKIoET4L6EKUwGDb3XLTwIe0cq7Q"  // API token for that project
    }
  ],
  preview: true
});
