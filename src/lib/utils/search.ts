// Search functionality across projects, experience, education

import { Project, Experience, Education, SearchResult } from '@/types';
export type { SearchResult };

export function searchProjects(query: string, projects: Project[]): SearchResult[] {
  const lowerQuery = query.toLowerCase();
  return projects
    .filter(project => 
      project.title.toLowerCase().includes(lowerQuery) ||
      project.description.toLowerCase().includes(lowerQuery) ||
      project.tech.some(tech => tech.toLowerCase().includes(lowerQuery)) ||
      project.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
    )
    .map(project => ({
      type: 'project' as const,
      title: project.title,
      description: project.description,
      data: project,
    }));
}

export function searchExperience(query: string, experience: Experience[]): SearchResult[] {
  const lowerQuery = query.toLowerCase();
  return experience
    .filter(exp =>
      exp.title.toLowerCase().includes(lowerQuery) ||
      exp.company.toLowerCase().includes(lowerQuery) ||
      exp.description.toLowerCase().includes(lowerQuery) ||
      exp.tech.some(tech => tech.toLowerCase().includes(lowerQuery))
    )
    .map(exp => ({
      type: 'experience' as const,
      title: `${exp.title} at ${exp.company}`,
      description: exp.description,
      data: exp,
    }));
}

export function searchEducation(query: string, education: Education | null): SearchResult[] {
  if (!education) return [];
  
  const lowerQuery = query.toLowerCase();
  const matches: SearchResult[] = [];

  if (
    education.university.toLowerCase().includes(lowerQuery) ||
    education.degree.toLowerCase().includes(lowerQuery) ||
    education.majors.some(major => major.toLowerCase().includes(lowerQuery)) ||
    education.description.toLowerCase().includes(lowerQuery)
  ) {
    matches.push({
      type: 'education',
      title: `${education.degree} at ${education.university}`,
      description: education.description,
      data: education,
    });
  }

  return matches;
}

export function searchAll(
  query: string,
  projects: Project[],
  experience: Experience[],
  education: Education | null
): SearchResult[] {
  return [
    ...searchProjects(query, projects),
    ...searchExperience(query, experience),
    ...searchEducation(query, education),
  ];
}




