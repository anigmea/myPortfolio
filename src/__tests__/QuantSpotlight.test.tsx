const QUANT_PROJECT_TITLES = [
  'Monte Carlo Optimization',
  'Fleet Attack',
  'Tic Tac Toe Bot',
  'Frozen Lake Solver',
];

const QUANT_EXPERIENCE_COMPANIES = ['KPMG', 'Tan Labs', 'Undergraduate Economics Lab'];

test('quant project titles include Monte Carlo Optimization', () => {
  expect(QUANT_PROJECT_TITLES).toContain('Monte Carlo Optimization');
});

test('quant experience includes KPMG', () => {
  expect(QUANT_EXPERIENCE_COMPANIES).toContain('KPMG');
});

test('filtering projects by quant titles works', () => {
  const allProjects = [
    { title: 'Monte Carlo Optimization', description: 'test', tech: [], link: '', keywords: [], subject: 'Finance' },
    { title: 'Casino', description: 'test', tech: [], link: '', keywords: [], subject: 'Data Science' },
  ];
  const quantProjects = allProjects.filter(p => QUANT_PROJECT_TITLES.includes(p.title));
  expect(quantProjects).toHaveLength(1);
  expect(quantProjects[0].title).toBe('Monte Carlo Optimization');
});

test('resume href points to /resume.pdf', () => {
  const href = '/resume.pdf';
  expect(href).toBe('/resume.pdf');
});
