import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Productos - Administración - Gustito',
  description: 'Gestión de productos',
};

export default function ProductosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
