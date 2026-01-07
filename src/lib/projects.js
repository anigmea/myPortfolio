// lib/projects.js

// This data can now be easily replaced by a fetch call to a Headless CMS like Sanity or Contentful.
export const projects = [
    { 
        title: "Tic Tac Toe Bot", 
        description: "Reinforcement learning agent combining Min-Max search with Q-learning to play optimally, logging training runs and reward distributions.", 
        tech: ["Python", "Reinforcement Learning", "Q-learning", "SQL"], 
        link: "https://github.com/anigmea/TicTacToe", 
        keywords: ["tic tac toe", "rl", "q-learning", "min-max"] 
    },
    { 
        title: "Frozen Lake Solver", 
        description: "Q-learning solution for OpenAI Gym’s Frozen Lake with >79% accuracy after 10k+ episodes, applying RL to stochastic navigation.", 
        tech: ["Python", "Gym", "Reinforcement Learning"], 
        link: "https://github.com/anigmea/frozen_lake", 
        keywords: ["frozen lake", "gym", "q-learning", "reinforcement learning"] 
    }
];

// In a real application, this function would fetch from your CMS.
export const getProjects = () => {
    return projects;
};