// lib/projects.js

// This data can now be easily replaced by a fetch call to a Headless CMS like Sanity or Contentful.
export const projects = [
    { 
        title: "Tic Tac Toe Bot", 
        description: "Reinforcement learning agent combining Min-Max search with Q-learning to play optimally, logging training runs and reward distributions.", 
        tech: ["Python", "Reinforcement Learning", "Q-learning", "SQL"], 
        link: "https://github.com/anigmea/TicTacToe", 
        keywords: ["tic tac toe", "rl", "q-learning", "min-max"],
        subject: "Data Science and Coding" 
    },
    { 
        title: "Frozen Lake Solver", 
        description: "Q-learning solution for OpenAI Gym’s Frozen Lake with >79% accuracy after 10k+ episodes, applying RL to stochastic navigation.", 
        tech: ["Python", "Gym", "Reinforcement Learning"], 
        link: "https://github.com/anigmea/frozen_lake", 
        keywords: ["frozen lake", "gym", "q-learning", "reinforcement learning"],
        subject: "Data Science and Coding" 
    },
    {
        title: "Monte Carlo Optimization",
        description: "Implemented a dashboard for the Value at Risk and Conditional Value at Risk Optimization for a Portfolio using a Monte Carlo Simulation.",
        tech: ["Python", "pandas", "streamlit", "matplotlib", "yfinance", "scipy"],
        link: "https://github.com/anigmea/monte_carlo",
        keywords: ["monte carlo", "optimization", "value at risk", "conditional value at risk", "portfolio"],
        subject: "Finance and Quant" 
    },
    {
        title: "Ecommerce Platform - Clothing Brand",
        description: "Designed and implemented a full-stack e-commerce platform for a clothing brand, including user authentication, product catalog, cart, checkout, and order management and hosted it with Droplets on DigitalOcean.",
        tech: ["Droplets", "DigitalOcean", "Node.js", "Express.js", "SQL", "HTML", "CSS", "JavaScript", "React.js"],
        link: "https://github.com/anigmea/crossover",
        keywords: ["e-commerce", "clothing brand", "user authentication", "product catalog", "cart", "checkout", "order management"],
        subject: "Data Science and Coding" 
    },
    {
        title: "Cyclopath",
        description: "This interactive web-based visualization maps bike traffic patterns across Boston's bike-sharing stations. Using D3.js, it dynamically displays the balance between departures and arrivals at each station with color-coded circles and an intuitive legend. Hover tooltips provide detailed trip data, offering a clear, engaging view of station activity over time. The project combines thoughtful UI design with real-world transportation data to highlight urban mobility trends in a user-friendly way.",
        tech: ["D3.js", "HTML", "CSS", "JavaScript"],
        link: "https://github.com/dkanodia/cyclopath",
        keywords: ["bike traffic", "bike-sharing", "Boston", "D3.js", "HTML", "CSS", "JavaScript"],
        subject: "Data Science and Coding" 
    },
    {
        title: "Rate My Recipe",
        description: "Rate My Recipe is a data science project that explores how recipe characteristics—such as nutrition, preparation time, and complexity—relate to user ratings on Food.com, using a dataset of 83K recipes and 731K reviews. The project combines exploratory analysis with a predictive model to estimate recipe ratings using only recipe features, showing that certain attributes influence user preference and that ratings can be reasonably predicted from intrinsic recipe information alone.",
        tech: ["Python", "pandas", "numpy", "scikit-learn", "matplotlib", "seaborn"],
        link: "https://github.com/dkanodia/rate_my_recipe",
        keywords: ["recipe ratings", "food.com", "data science", "predictive modeling", "exploratory analysis", "pandas", "numpy", "scikit-learn", "matplotlib", "seaborn"],
        subject: "Data Science and Coding" 
    },
    {
        title: "Fleet Attack",
        description: "Designed a multi-agent reinforcement learning system where agents learn secure communication protocols in a grid-world environment with an adaptive adversary. Combined actor–critic methods, supervised learning, REINFORCE, and tabular control to enable reliable coordination under adversarial interception and attack, extending ideas from neural cryptography to embodied, interactive settings.",
        tech: ["Python", "PyTorch", "Reinforcement Learning"],
        // Hosted research paper PDF (served from public/research)
        link: "/research/DSC190_Reinforcement_Learning.pdf",
        keywords: ["reinforcement learning", "grid-world", "adversarial interception", "actor-critic", "supervised learning", "REINFORCE", "tabular control", "PyTorch"],
        subject: "Research" 
    },
    {
        title: "Quantifying Offensive Gravity: A Machine Learning Approach to Measuring Spacing Impact in Basketball",
        description: "The study creates a composite metric to measure offensive gravity, showing that rim pressure and three point shooting most influence spacing, with random forest models outperforming linear methods in predicting offensive impact.",
        tech: ["Python"],
        // Hosted research paper PDF
        link: "/research/Eclipse%20Basketball.pdf",
        keywords: ["basketball", "machine learning", "random forest", "linear regression", "offensive gravity", "three point shooting", "rim pressure"],
        subject: "Research" 

    },
    {
        title: "Casino",
        description: "Implemented a Casino game with python, consisting of varied games and connecting them with SQL to maintain the amount of money of the player.",
        tech: ["Python", "SQL"],
        link: "https://github.com/anigmea/casino",
        keywords: ["Casino", "python", "SQL"],
        subject: "Data Science and Coding" 
    },
    {
        title: "Focus in the Mix: The Role of Music in UCSD Students' Study Habits and GPA",
        description: "Created a Study finding the effects of music on students' study habits and GPA, by collecting data using created survey and analyzing it using python.",
        tech: ["Python"],
        // Hosted research paper PDF (URL-encoded spaces to match filename)
        link: "/research/Final%20Project%20Group%20077%20SP25.pdf",
        keywords: ["music", "study habits", "GPA", "python"],
        subject: "Research" 
    },
    {
        title: "Reddit Post Engagement Prediction Recommender System",
        description: "Implemented a recommender system to predict the engagement rates of the reddit post based on its features.",
        tech: ["Python"],
        // Hosted research presentation
        link: "/research/Reddit_Engagement_Prediction_Presentation.pptx",
        keywords: ["reddit", "engagement rates", "recommender system", "python"],
        subject: "Research"
    }
];

// In a real application, this function would fetch from your CMS.
export const getProjects = () => {
    return projects;
};