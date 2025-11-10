// lib/education.js

// Education data for UC San Diego
export const education = {
    university: "University of California, San Diego",
    degree: "Bachelor of Science",
    majors: ["Data Science", "Business Economics"],
    gpa: "3.8",
    graduationYear: "2025",
    location: "La Jolla, California",
    description: "Pursuing a double major in Data Science and Business Economics, exploring the intersection of quantitative analysis, machine learning, and economic theory. Focused on building intelligent systems that can analyze complex data patterns and inform strategic decision-making.",
    
    // Key course modules organized by category
    modules: {
        "Core Data Science": [
            "Machine Learning Fundamentals",
            "Statistical Methods for Data Science", 
            "Data Structures and Algorithms",
            "Database Systems",
            "Data Visualization",
            "Big Data Analytics"
        ],
        "Business Economics": [
            "Microeconomic Theory",
            "Macroeconomic Analysis", 
            "Econometrics",
            "Financial Markets",
            "Game Theory",
            "Behavioral Economics"
        ],
        "Advanced Computing": [
            "Deep Learning",
            "Natural Language Processing",
            "Computer Vision",
            "Distributed Systems",
            "Cloud Computing",
            "Software Engineering"
        ],
        "Mathematics & Statistics": [
            "Linear Algebra",
            "Probability Theory",
            "Statistical Inference",
            "Calculus",
            "Optimization Theory",
            "Time Series Analysis"
        ]
    },
    
    // Notable achievements and projects
    achievements: [
        "Dean's List - Multiple Quarters",
        "Undergraduate Research Assistant",
        "Machine Learning Competition Winner",
        "Data Science Club President",
        "Published Research Paper on Reinforcement Learning"
    ],
    
    // Research interests
    researchInterests: [
        "Machine Learning Applications in Economics",
        "Behavioral Data Analysis",
        "Algorithmic Trading Systems",
        "Human-AI Interaction Design",
        "Predictive Analytics for Business Intelligence"
    ]
};

// In a real application, this function would fetch from your CMS.
export const getEducation = () => {
    return education;
};

