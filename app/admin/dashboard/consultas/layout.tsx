import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Consultas - Administración - Gustito',
  description: 'Gestión de consultas',
};

export default function ConsultasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
