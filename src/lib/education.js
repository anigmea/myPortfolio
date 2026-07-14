// lib/education.js

// Education data for UC San Diego
export const education = {
    university: "University of California, San Diego",
    degree: "Bachelor of Science",
    majors: ["Data Science", "Business Economics"],
    gpa: "3.9 (Provost Honors)",
    graduationYear: "2027",
    location: "La Jolla, California",
    description: "Data Science and Business Economics student combining machine learning, econometrics, and optimization to analyze complex systems and strategic decision-making.",


    // Key course modules organized by category
    modules: {
        "Core Data Science": [
            "Machine Learning",
            "Introduction to Data Science",
            "Data Structures & Algorithms",
            "Programming and Computational Problem-Solving",
            "Database Systems",
            "Data Visualization"
        ],
        "Business Economics": [
            "Microeconomics",
            "Macroeconomics", 
            "Econometrics",
            "Game Theory",
            "Optimization",
            "Financial Markets"
        ],
        "Advanced Computing": [
            "Reinforcement Learning",
            "Simulation Design",
            "Cloud Computing",
            "Software Engineering",
            "Asynchronous Programming"
        ],
        "Mathematics & Statistics": [
            "Linear Algebra",
            "Probability Theory",
            "Statistical Inference",
            "Calculus",
            "Optimization Theory"
        ]
    },
    
    // Notable achievements and projects
    achievements: [
        "Provost Honors",
        "Undergraduate Research Assistant, Tan Labs (LLMs + robotics)",
        "Undergraduate Research Assistant, Economics Lab (labor markets)",
        "IPPF Debate Top 32 globally (research-driven competition)"
    ],
    
    // Research interests
    researchInterests: [
        "Reinforcement learning for decision-making",
        "Game theory and strategic behavior",
        "Labor market analytics",
        "LLM-enabled robotics",
        "Economic modeling and optimization"
    ]
};

// In a real application, this function would fetch from your CMS.
export const getEducation = () => {
    return education;
};
