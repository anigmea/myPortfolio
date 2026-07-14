// Reading list / resources

export const resources = [
  {
    title: "Reinforcement Learning: An Introduction (Sutton & Barto)",
    category: "RL / Control",
    link: "http://incompleteideas.net/book/the-book-2nd.html",
    note: "Core text that shaped much of my thinking in RL, especially around value functions and exploration.",
  },
  {
    title: "The Bitter Lesson (Rich Sutton)",
    category: "AI / Philosophy",
    link: "http://www.incompleteideas.net/IncIdeas/BitterLesson.html",
    note: "Short essay on why compute and search often beat hand-designed structure.",
  },
  {
    title: "Distill.pub",
    category: "ML / Interpretability",
    link: "https://distill.pub",
    note: "Interactive essays on deep learning and interpretability; a benchmark for clear technical communication.",
  },
  {
    title: "Money Stuff (Matt Levine)",
    category: "Finance / Markets",
    link: "https://www.bloomberg.com/account/newsletters/money-stuff",
    note: "Sharp commentary on how incentives and institutions shape markets — useful for economic modeling intuition.",
  },
];

export const getResources = () => resources;
