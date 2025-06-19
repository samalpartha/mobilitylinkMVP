import { redirect } from 'next/navigation';

export default function RootPage() {
  // The middleware will handle redirection to /login if the user is not authenticated.
  // If authenticated, it might allow access here or redirect to a default authenticated page.
  // For simplicity, we redirect to /dashboard, assuming middleware correctly gates access.
  redirect('/dashboard');
  return null; // Or a loading spinner
}
