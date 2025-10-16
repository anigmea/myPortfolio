// lib/projects.js

// This data can now be easily replaced by a fetch call to a Headless CMS like Sanity or Contentful.
export const projects = [
    { 
        title: "Project Alpha", 
        description: "A machine learning model for stock prediction.", 
        tech: ["Python", "TensorFlow", "scikit-learn"], 
        link: "#", 
        keywords: ["alpha", "stock", "prediction", "machine learning"] 
    },
    { 
        title: "Project Beta", 
        description: "Decentralized application on the Ethereum blockchain.", 
        tech: ["Solidity", "React", "Ethers.js"], 
        link: "#", 
        keywords: ["beta", "blockchain", "decentralized", "ethereum"] 
    },
    { 
        title: "Project Gamma", 
        description: "An IoT solution for smart home automation.", 
        tech: ["Raspberry Pi", "Python", "MQTT"], 
        link: "#", 
        keywords: ["gamma", "iot", "home automation", "raspberry pi"] 
    }
];

// In a real application, this function would fetch from your CMS.
export const getProjects = () => {
    return projects;
};