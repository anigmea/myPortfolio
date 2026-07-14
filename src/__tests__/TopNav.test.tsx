import { render, screen, fireEvent } from '@testing-library/react';
import { TopNav } from '@/components/navigation/TopNav';
import { I18nProvider } from '@/lib/i18n/useTranslation';

const noop = () => {};

const renderWithProviders = (ui: React.ReactElement) =>
  render(<I18nProvider>{ui}</I18nProvider>);

test('renders all nav links', () => {
  renderWithProviders(<TopNav activeSection={null} lightMode={false} onSearch={noop} onThemeToggle={noop} />);
  expect(screen.getByText('Projects')).toBeInTheDocument();
  expect(screen.getByText('Experience')).toBeInTheDocument();
  expect(screen.getByText('Education')).toBeInTheDocument();
  expect(screen.getByText('Skills')).toBeInTheDocument();
  expect(screen.getByText('Contact')).toBeInTheDocument();
});

test('dispatches dk-command event when Projects clicked', () => {
  const events: string[] = [];
  window.addEventListener('dk-command', (e) => {
    events.push((e as CustomEvent<{ command: string }>).detail.command);
  });
  renderWithProviders(<TopNav activeSection={null} lightMode={false} onSearch={noop} onThemeToggle={noop} />);
  fireEvent.click(screen.getByText('Projects'));
  expect(events).toContain('projects');
});

test('highlights active nav link', () => {
  renderWithProviders(<TopNav activeSection="projects" lightMode={false} onSearch={noop} onThemeToggle={noop} />);
  const projectsLink = screen.getByText('Projects');
  expect(projectsLink).toHaveClass('text-cyan-300');
});
