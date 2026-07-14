import { render, screen } from '@testing-library/react';
import { MobileLayout } from '@/components/layout/MobileLayout';

const mockProjects = [
  { title: 'Monte Carlo Optimization', description: 'A finance project', tech: ['Python'], link: '', keywords: [], subject: 'Finance' },
];

const mockExperience = [
  { year: '2024', title: 'Valuation Intern', company: 'KPMG', description: 'Built models', tech: ['Excel'], color: '#B469FF' },
];

const mockEducation = {
  university: 'UC San Diego',
  degree: 'B.S.',
  majors: ['Data Science', 'Business Economics'],
  gpa: '3.8',
  graduationYear: '2026',
  location: 'San Diego, CA',
  description: 'Double major',
  modules: {},
  achievements: [],
  researchInterests: [],
};

test('renders name in hero', () => {
  render(<MobileLayout projects={mockProjects} experience={mockExperience} education={mockEducation} />);
  expect(screen.getByText('Divyansh Kanodia')).toBeInTheDocument();
});

test('renders project titles', () => {
  render(<MobileLayout projects={mockProjects} experience={mockExperience} education={mockEducation} />);
  expect(screen.getByText('Monte Carlo Optimization')).toBeInTheDocument();
});

test('renders experience company', () => {
  render(<MobileLayout projects={mockProjects} experience={mockExperience} education={mockEducation} />);
  expect(screen.getByText('KPMG')).toBeInTheDocument();
});

test('renders desktop hint footer', () => {
  render(<MobileLayout projects={mockProjects} experience={mockExperience} education={mockEducation} />);
  expect(screen.getByText(/Full terminal experience on desktop/i)).toBeInTheDocument();
});
