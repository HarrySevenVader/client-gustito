import DashboardLayout from '../../../../components/DashboardLayout'
import NewsGrid from '../../../../components/NewsGrid'

const sampleNews = [
  { id: 1, title: 'Apertura nueva sucursal', date: '2025-08-30', description: 'Hemos abierto una nueva sucursal en el centro de la ciudad con atención extendida.', image: '/news-sucursal.jpg' },
  { id: 2, title: 'Promoción de verano', date: '2025-07-14', description: 'Descuentos especiales en helados y bebidas hasta fin de mes.', image: '/news-promocion.jpg' },
  { id: 3, title: 'Evento degustación', date: '2025-06-02', description: 'Te invitamos a una degustación gratuita este sábado en nuestra sucursal.', image: '/news-degustacion.jpg' },
  { id: 4, title: 'Nuevo horario', date: '2025-05-10', description: 'Ampliamos horario los fines de semana para mejor servicio.', image: '/news-horario.jpg' },
  { id: 5, title: 'Receta del mes', date: '2025-04-01', description: 'Aprende a preparar nuestra empanada especial con ingredientes locales.', image: '/news-receta.jpg' },
  { id: 6, title: 'Sello de calidad', date: '2025-03-20', description: 'Recibimos un reconocimiento por el uso de ingredientes de calidad.', image: '/news-sello.jpg' },
]

export default function NewsPage() {
  return (
    <DashboardLayout>
      <section>
        <h1>Noticias</h1>
        <p>Administra las noticias destacadas (máx. 6). Elimina y reemplaza noticias antiguas para mostrar solo lo más relevante.</p>

        <div style={{ height: 12 }} />

  <NewsGrid items={sampleNews} />
      </section>
    </DashboardLayout>
  )
}
