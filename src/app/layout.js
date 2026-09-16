import '@/styles/globals.css';
import AppShell from '@/components/AppShell';

export const metadata = {
  title: 'StudyAI â€” Your Personal AI Study Assistant',
  description: 'An AI-powered study assistant that helps students learn, practice, and excel. Features Furqan NovaAIing, quiz generation, flashcards, study planning, and progress tracking.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>ðŸŽ“</text></svg>" />
      </head>
      <body>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}

