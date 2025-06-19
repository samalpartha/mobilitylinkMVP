import Link from 'next/link';
import { Bike } from 'lucide-react'; // Using Bike as a placeholder for mobility

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const textSizeClass = size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-2xl' : 'text-xl';
  const iconSize = size === 'lg' ? 30 : size === 'md' ? 24 : 20;

  return (
    <Link href="/dashboard" className="flex items-center gap-2 group" aria-label="Go to dashboard">
      <Bike className="text-primary group-hover:animate-pulse" size={iconSize} />
      <span className={`font-headline font-bold ${textSizeClass} text-foreground group-hover:text-primary transition-colors`}>
        MobilityLink
      </span>
    </Link>
  );
}
