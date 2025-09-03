export interface JobData {
  title: string;
  company: string;
  location: string;
  url: string;
  date: string;
  description: string;
  salary: string;
  jobType: string;
  experienceLevel: string;
  companySize: string;
  industry: string;
  status: string;
  notes: string;
  [key: string]: string; // Allow other string properties
}
