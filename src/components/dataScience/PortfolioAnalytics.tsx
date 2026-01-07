"use client";

import { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { Project, Experience, Education } from '@/types';

interface PortfolioAnalyticsProps {
  projects: Project[];
  experience: Experience[];
  education: Education | null;
  lightMode: boolean;
}

export const PortfolioAnalytics = memo(function PortfolioAnalytics({
  projects,
  experience,
  education,
  lightMode,
}: PortfolioAnalyticsProps) {
  // Calculate statistics
  const stats = useMemo(() => {
    // Technology usage frequency
    const techFrequency: Record<string, number> = {};
    projects.forEach(project => {
      project.tech.forEach(tech => {
        techFrequency[tech] = (techFrequency[tech] || 0) + 1;
      });
    });
    experience.forEach(exp => {
      exp.tech.forEach(tech => {
        techFrequency[tech] = (techFrequency[tech] || 0) + 1;
      });
    });

    const topTech = Object.entries(techFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tech, count]) => ({ tech, count }));

    // Project statistics
    const totalProjects = projects.length;
    const avgTechPerProject = projects.reduce((sum, p) => sum + p.tech.length, 0) / totalProjects || 0;

    // Experience statistics
    const totalYears = experience.length;
    const uniqueCompanies = new Set(experience.map(e => e.company)).size;
    const totalTechUsed = new Set(
      [...projects, ...experience].flatMap(item => item.tech)
    ).size;

    // Timeline analysis
    const experienceYears = experience.map(e => parseInt(e.year) || 0);
    const earliestYear = Math.min(...experienceYears, new Date().getFullYear());
    const latestYear = Math.max(...experienceYears, new Date().getFullYear());
    const careerSpan = latestYear - earliestYear;

    return {
      topTech,
      totalProjects,
      avgTechPerProject: avgTechPerProject.toFixed(1),
      totalYears,
      uniqueCompanies,
      totalTechUsed,
      careerSpan,
      earliestYear,
      latestYear,
    };
  }, [projects, experience]);

  const maxCount = Math.max(...stats.topTech.map(t => t.count), 1);

  return (
    <div className={`w-full max-w-6xl mx-auto p-6 rounded-xl border ${
      lightMode
        ? 'bg-white border-blue-300'
        : 'bg-black/80 border-green-500/50'
    } backdrop-blur-sm`}>
      <h2 className={`text-3xl font-bold mb-6 ${
        lightMode ? 'text-blue-900' : 'text-green-300'
      }`}>
        Portfolio Analytics
      </h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Total Projects"
          value={stats.totalProjects}
          lightMode={lightMode}
        />
        <MetricCard
          label="Technologies"
          value={stats.totalTechUsed}
          lightMode={lightMode}
        />
        <MetricCard
          label="Experience Years"
          value={stats.totalYears}
          lightMode={lightMode}
        />
        <MetricCard
          label="Companies"
          value={stats.uniqueCompanies}
          lightMode={lightMode}
        />
      </div>

      {/* Technology Usage Chart */}
      <div className="mb-8">
        <h3 className={`text-xl font-semibold mb-4 ${
          lightMode ? 'text-blue-800' : 'text-green-400'
        }`}>
          Technology Usage Frequency
        </h3>
        <div className="space-y-3">
          {stats.topTech.map((item, index) => (
            <motion.div
              key={item.tech}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-32 text-sm font-medium ${
                  lightMode ? 'text-blue-900' : 'text-green-300'
                }`}>
                  {item.tech}
                </div>
                <div className="flex-1">
                  <div className={`h-6 rounded-full overflow-hidden ${
                    lightMode ? 'bg-blue-100' : 'bg-green-900/30'
                  }`}>
                    <motion.div
                      className={`h-full ${
                        lightMode
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                          : 'bg-gradient-to-r from-green-500 to-green-600'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / maxCount) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    />
                  </div>
                </div>
                <div className={`w-12 text-right text-sm font-semibold ${
                  lightMode ? 'text-blue-700' : 'text-green-400'
                }`}>
                  {item.count}x
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Average Tech per Project"
          value={stats.avgTechPerProject}
          lightMode={lightMode}
        />
        <StatCard
          title="Career Span"
          value={`${stats.careerSpan} years`}
          lightMode={lightMode}
        />
        <StatCard
          title="Timeline"
          value={`${stats.earliestYear} - ${stats.latestYear}`}
          lightMode={lightMode}
        />
      </div>
    </div>
  );
});

function MetricCard({ label, value, lightMode }: { label: string; value: number; lightMode: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`p-4 rounded-lg border ${
        lightMode
          ? 'bg-blue-50 border-blue-200'
          : 'bg-green-900/20 border-green-500/30'
      }`}
    >
      <div className={`text-3xl font-bold mb-1 ${
        lightMode ? 'text-blue-600' : 'text-green-400'
      }`}>
        {value}
      </div>
      <div className={`text-sm ${
        lightMode ? 'text-blue-700' : 'text-green-300'
      }`}>
        {label}
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, lightMode }: { title: string; value: string; lightMode: boolean }) {
  return (
    <div className={`p-4 rounded-lg border ${
      lightMode
        ? 'bg-gray-50 border-gray-200'
        : 'bg-black/40 border-green-500/20'
    }`}>
      <div className={`text-sm mb-1 ${
        lightMode ? 'text-gray-600' : 'text-green-400'
      }`}>
        {title}
      </div>
      <div className={`text-lg font-semibold ${
        lightMode ? 'text-gray-900' : 'text-green-300'
      }`}>
        {value}
      </div>
    </div>
  );
}




