import DashboardLayout from '../../../../components/DashboardLayout'
import ProductList from '../../../../components/ProductList'
import styles from '../../../../components/adminStyles.module.css'

const sampleProducts = [
  {
    id: 1,
    title: 'Empanada de carne',
    date: '2025-10-01',
    description: 'Rellena con carne sazonada, horneada al momento.',
    price: 990,
    image: '/prod-empanada.jpg',
  },
  {
    id: 2,
    title: 'Helado artesanal',
    date: '2025-09-12',
    description: 'Helado hecho con leche de la mejor calidad y sabores naturales.',
    price: 1850,
    image: '/prod-helado.jpg',
  },
  {
    id: 3,
    title: 'Salsa chimichurri',
    date: '2025-08-22',
    description: 'Salsa casera, ideal para acompañar carnes y empanadas.',
    price: 450,
    image: '/prod-salsa.jpg',
  },
]

export default function ProductsPage() {
  return (
    <DashboardLayout>
      <section>
        <h1>Productos</h1>
        <p>Desde aquí podrás gestionar productos: crear, editar y borrar.</p>

        <div style={{ height: 12 }} />

        <div style={{ marginBottom: 12 }}>
          <button className={styles.addBtn}>+ Agregar producto</button>
        </div>

        <ProductList rows={sampleProducts} />
      </section>
    </DashboardLayout>
  )
}
