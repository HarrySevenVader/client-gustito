export const metadata = { title: 'Dashboard - Gustito' }

import DashboardLayout from '../../../components/DashboardLayout'
import StatCard from '../../../components/StatCard'
import EntityTable from '../../../components/EntityTable'
import styles from '../../../components/adminStyles.module.css'

export default function DashboardPage() {
  const sampleProducts = [
    { id: 1, title: 'Empanada de carne', date: '2025-10-01' },
    { id: 2, title: 'Helado artesanal', date: '2025-09-12' },
  ]

  const sampleNews = [
    { id: 'n1', title: 'Apertura nueva sucursal', date: '2025-08-30' },
  ]

  const sampleQueries = [
    { id: 'q1', title: 'Consulta: pedido personalizado', date: '2025-11-01' },
  ]

  return (
    <DashboardLayout>
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>Panel de administrador</h1>
        </div>

        <div style={{ height: 18 }} />

        <div className={styles.cards}>
          <StatCard title="Productos" value={34} />
          <StatCard title="Noticias" value={8} />
          <StatCard title="Consultas" value={12} />
        </div>

        <div style={{ height: 18 }} />

        <EntityTable title="Productos recientes" rows={sampleProducts} />

        <div style={{ height: 14 }} />

        <EntityTable title="Noticias recientes" rows={sampleNews} />

        <div style={{ height: 14 }} />

        <EntityTable title="Consultas" rows={sampleQueries} />
      </section>
    </DashboardLayout>
  )
}
