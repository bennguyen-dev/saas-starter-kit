import { ReactNode } from 'react';
import { PublicLayout } from '@/shared/components/layouts';

export default function Layout({ children }: { children: ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}
