import DashboardLayout from '../../../../components/DashboardLayout'
import QueryList from '../../../../components/QueryList'

const sampleQueries = [
  { id: 101, consulta: 'Quisiera pedir un envío especial para un cumpleaños', email: 'cliente1@example.com', created_at: '2025-11-01 10:22:00' },
  { id: 102, consulta: '¿Los productos contienen gluten?', email: 'cliente2@example.com', created_at: '2025-10-22 15:12:41' },
  { id: 103, consulta: '¿Tienen sucursal abierta el domingo?', email: 'usuario@correo.cl', created_at: '2025-10-10 09:05:12' },
]

export default function QueriesPage() {
  return (
    <DashboardLayout>
      <section>
        <h1>Consultas</h1>
        <p>Visualiza y responde las consultas realizadas por usuarios.</p>

        <div style={{ height: 12 }} />

        <QueryList rows={sampleQueries} />
      </section>
    </DashboardLayout>
  )
}
