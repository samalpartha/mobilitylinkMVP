
import { RegistrationForm } from '@/components/auth/RegistrationForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register | MobilityLink MVP',
  description: 'Create your MobilityLink account.',
};

export default function RegisterPage() {
  return <RegistrationForm />;
}
