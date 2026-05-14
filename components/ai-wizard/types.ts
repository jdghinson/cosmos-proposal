import type { Collaborator, ProjectType } from "@/lib/mock-data";

export type WizardState = {
  name: string;
  brief: string;
  projectTypes: ProjectType[];
  keywords: string[];
  color: string | null;
  isPrivate: boolean;
  collaborators: Collaborator[];
  imageUrls: string[];
  selected: Set<string>;
};
