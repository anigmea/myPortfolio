'use client';

import { Github, Linkedin, Mail, Download } from 'lucide-react';
import { Project, Experience, Education } from '@/types';

interface MobileLayoutProps {
  projects: Project[];
  experience: Experience[];
  education: Education | null;
}

export function MobileLayout({ projects, experience, education }: MobileLayoutProps) {
  const topTech = Array.from(new Set(projects.flatMap(p => p.tech))).slice(0, 10);

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center space-y-3">
        <h1 className="text-2xl font-bold text-cyan-200">Divyansh Kanodia</h1>
        <p className="text-sm text-cyan-500">
          Reinforcement Learning · Quantitative Finance · Labor Economics
        </p>
        <p className="text-xs text-cyan-600">
          {education?.university} · Data Science &amp; Business Economics
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <a href="https://github.com/anigmea" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github size={20} className="text-cyan-500 hover:text-cyan-300" />
          </a>
          <a href="https://www.linkedin.com/in/divyansh-kanodia/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin size={20} className="text-cyan-500 hover:text-cyan-300" />
          </a>
          <a href="mailto:dkanodia@ucsd.edu" aria-label="Email">
            <Mail size={20} className="text-cyan-500 hover:text-cyan-300" />
          </a>
          <a href="/resume.pdf" download aria-label="Download Resume">
            <Download size={20} className="text-cyan-500 hover:text-cyan-300" />
          </a>
        </div>
      </section>

      {/* Skills */}
      {topTech.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-cyan-300 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {topTech.map(tech => (
              <span key={tech} className="px-2 py-1 text-xs border border-cyan-500/40 rounded text-cyan-400">
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-cyan-300 mb-3">Experience</h2>
          <div className="space-y-3">
            {experience.map(exp => (
              <div key={exp.company} className="border border-cyan-500/30 rounded-lg p-4">
                <div className="text-xs mb-1" style={{ color: exp.color }}>{exp.year}</div>
                <div className="font-bold text-cyan-200">{exp.title}</div>
                <div className="text-sm text-cyan-400 mb-2">{exp.company}</div>
                <p className="text-xs text-cyan-600">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-cyan-300 mb-3">Projects</h2>
          <div className="grid grid-cols-1 gap-3">
            {projects.map(p => (
              <div key={p.title} className="border border-cyan-500/30 rounded-lg p-4">
                <h3 className="font-bold text-cyan-200 mb-1">{p.title}</h3>
                <p className="text-xs text-cyan-500 mb-3">{p.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {p.tech.slice(0, 4).map(t => (
                    <span key={t} className="text-xs border border-cyan-500/30 rounded px-1.5 py-0.5 text-cyan-600">{t}</span>
                  ))}
                </div>
                {p.link && (
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 underline">
                    {p.link.startsWith('/research/') ? 'View paper' : 'View project'}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="text-center space-y-2">
        <h2 className="text-lg font-bold text-cyan-300">Contact</h2>
        <p className="text-sm text-cyan-500">dkanodia@ucsd.edu</p>
        <a
          href="https://www.linkedin.com/in/divyansh-kanodia/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-cyan-400 underline block"
        >
          linkedin.com/in/divyansh-kanodia
        </a>
      </section>

      {/* Desktop hint */}
      <footer className="text-center text-xs text-cyan-800 pb-4">
        Full terminal experience on desktop ↗
      </footer>
    </div>
  );
}
