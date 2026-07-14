// lib/experience.js

// Experience data for timeline
export const experience = [
    {
        year: "September 2025 - Present",
        title: "Project Mentor",
        company: "Eclipse Analytics",
        description: "Guided a team of 4 students to analyze the concept of gravity in basketball, developing a machine learning model to predict offensive impact.",
        tech: ["Python", "Data Analysis"],
        color: "#FFDA64"
    },
    {
        year: "Apr 2025 – Present",
        title: "Research Assistant",
        company: "Undergraduate Economics Lab",
        description: "Analyzing large-scale Indian labor market datasets; applying econometrics and statistical modeling to study employment outcomes and incentive-driven behavior.",
        tech: ["Python", "Stata", "Econometrics", "Data Analysis"],
        color: "#00FFAA"
    },
    {
        year: "Apr 2025 – August 2025",
        title: "Software Engineer Intern",
        company: "QueryHat",
        description: "Developed the backend architecture for the QueryHat platform, enabling efficient data ingestion and analysis.",
        tech: ["Python", "FastAPI", "SQL"],
        color: "#FF00AA"
    },
    {
        year: "Apr 2025 – Jun 2025",
        title: "Research Assistant",
        company: "Tan Labs",
        description: "Integrating large language models into robotic systems for autonomous decision-making; MATLAB simulations to study adaptation under uncertainty and strategic feedback.",
        tech: ["LLMs", "MATLAB", "Robotics", "Autonomous Systems"],
        color: "#64B4FF"
    },
    {
        year: "Jul 2024 – Sep 2024",
        title: "Valuation Intern",
        company: "KPMG",
        description: "Built transaction and valuation models across multiple sectors; applied optimization-based metrics (EV/EBITDA, EV/Revenue) and authored analysis on macro rate impacts.",
        tech: ["Financial Modeling", "Optimization", "Research", "Excel"],
        color: "#B469FF"
    },
    {
        year: "Jun 2021 – Mar 2023",
        title: "Senior Executive of Technology",
        company: "The Indian Conclave",
        description: "Led tech infrastructure with PHP/SQL/Python; implemented B2C framework boosting revenue 40%, scaled org from 20 to 50 staff, and mentored a 4-person web team.",
        tech: ["PHP", "SQL", "Python", "Leadership"],
        color: "#FFDC64"
    }
];

// In a real application, this function would fetch from your CMS.
export const getExperience = () => {
    return experience;
};

