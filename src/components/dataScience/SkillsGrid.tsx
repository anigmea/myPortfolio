"use client";

import React from "react";

interface Skill {
  name: string;
  level: number; // 1–100
}

interface SkillCategory {
  name: string;
  skills: Skill[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: "AI / ML / RL",
    skills: [
      { name: "Reinforcement Learning", level: 90 },
      { name: "Supervised / Classical ML", level: 85 },
      { name: "PyTorch", level: 80 },
      { name: "Experiment Design / Evaluation", level: 80 },
    ],
  },
  {
    name: "Data & Analytics",
    skills: [
      { name: "Python (pandas / numpy)", level: 90 },
      { name: "Statistical Modeling", level: 80 },
      { name: "SQL", level: 80 },
      { name: "Visualization (matplotlib / seaborn / D3)", level: 75 },
    ],
  },
  {
    name: "Systems / Product",
    skills: [
      { name: "Full‑stack Web (React / Node)", level: 75 },
      { name: "System Design", level: 70 },
      { name: "Experimentation & A/B Testing", level: 70 },
    ],
  },
];

export function SkillsGrid({ lightMode }: { lightMode: boolean }) {
  return (
    <div className="mt-8 space-y-6">
      <h3 className={`text-2xl font-bold ${lightMode ? "text-blue-700" : "text-green-300"}`}>
        Skills Overview
      </h3>
      <p className={lightMode ? "text-gray-700 text-sm" : "text-green-200/80 text-sm"}>
        Snapshot of core technical focus areas. Bars represent relative depth, not years of experience.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SKILL_CATEGORIES.map((cat) => (
          <div
            key={cat.name}
            className={`rounded-lg border p-4 ${
              lightMode ? "border-blue-200 bg-blue-50" : "border-green-500/40 bg-black/40"
            }`}
          >
            <h4 className={`text-lg font-semibold mb-3 ${lightMode ? "text-blue-800" : "text-green-200"}`}>
              {cat.name}
            </h4>
            <div className="space-y-2">
              {cat.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className={lightMode ? "h-2 bg-blue-100 rounded-full" : "h-2 bg-green-900 rounded-full"}>
                    <div
                      className={`h-2 rounded-full ${
                        lightMode ? "bg-blue-500" : "bg-green-400"
                      }`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


