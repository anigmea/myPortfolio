// lib/experience.js

// Experience data for timeline
export const experience = [
    {
        year: "2024 - Present",
        title: "Data Science Student",
        company: "UC San Diego",
        description: "Pursuing studies in Data Science and Business Economics. Exploring the intersection of machine learning, econometrics, and design. Building intelligent systems through research projects and coursework.",
        tech: ["Python", "Machine Learning", "Data Analysis", "Statistical Modeling"],
        color: "#00FFAA"
    },
    {
        year: "2023 - 2024",
        title: "AI Research Assistant",
        company: "UC San Diego Research Lab",
        description: "Assisted in developing reinforcement learning algorithms for adaptive systems. Worked on neural network optimization and published research on computational learning theory. Contributed to open-source ML frameworks.",
        tech: ["PyTorch", "TensorFlow", "Python", "Research Methods"],
        color: "#64B4FF"
    },
    {
        year: "2022 - 2023",
        title: "Software Development Intern",
        company: "Tech Startup",
        description: "Built scalable full-stack applications using modern frameworks. Improved system performance by 40% through database optimization and caching strategies. Collaborated with cross-functional teams on agile projects.",
        tech: ["Node.js", "React", "PostgreSQL", "Docker", "AWS"],
        color: "#B469FF"
    },
    {
        year: "2021 - 2022",
        title: "Independent Developer",
        company: "Freelance & Personal Projects",
        description: "Developed custom web solutions for clients and personal projects. Specialized in full-stack development and responsive design. Created multiple deployed applications showcasing machine learning integrations.",
        tech: ["JavaScript", "React", "Node.js", "MongoDB", "Python"],
        color: "#FFDC64"
    }
];

// In a real application, this function would fetch from your CMS.
export const getExperience = () => {
    return experience;
};

