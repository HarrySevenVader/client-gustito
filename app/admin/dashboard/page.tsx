export const metadata = { title: 'Dashboard - Gustito' }

export default function DashboardPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ padding: 24, borderRadius: 12, background: '#fff', color: '#111', boxShadow: '0 6px 18px rgba(0,0,0,0.08)' }}>
        <h1 style={{ margin: 0 }}>Dashboard (placeholder)</h1>
        <p style={{ marginTop: 8 }}>Aquí irá la interfaz de administración.</p>
      </div>
    </main>
  )
}
