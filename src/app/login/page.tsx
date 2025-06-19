import { LoginForm } from '@/components/auth/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | MobilityLink MVP',
  description: 'Login to your MobilityLink account.',
};

export default function LoginPage() {
  return <LoginForm />;
}
