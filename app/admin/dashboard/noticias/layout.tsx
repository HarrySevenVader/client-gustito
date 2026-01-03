import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Noticias - Administración - Gustito',
  description: 'Gestión de noticias',
};

export default function NoticiasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
