import { redirect } from 'next/navigation'

export default function AdminRoot() {
  // Redirigir a /admin/login donde ahora está la página de login
  redirect('/admin/login')
}
