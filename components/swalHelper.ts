"use client"
// Helper para desplegar alertas con SweetAlert2 si está instalado, sino fallback a window.confirm/alert
export async function confirm(title = '¿Estás seguro?', text = '') {
  try {
    // @ts-ignore - import dinámico opcional de sweetalert2 si está instalado
    const Swal = (await import('sweetalert2')).default
    const result = await Swal.fire({ title, text, icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí', cancelButtonText: 'No' })
    return result.isConfirmed
  } catch (err) {
    return window.confirm((text ? text + '\n\n' : '') + title)
  }
}

export async function toastSuccess(title = 'Hecho') {
  try {
    // @ts-ignore - import dinámico opcional de sweetalert2 si está instalado
    const Swal = (await import('sweetalert2')).default
    Swal.fire({ title, icon: 'success', timer: 1600, showConfirmButton: false, toast: true, position: 'top-end' })
  } catch (err) {
    try { window.alert(title) } catch (_) {}
  }
}

export async function toastError(title = 'Error') {
  try {
    // @ts-ignore - import dinámico opcional de sweetalert2 si está instalado
    const Swal = (await import('sweetalert2')).default
    Swal.fire({ title, icon: 'error', timer: 2000, showConfirmButton: false, toast: true, position: 'top-end' })
  } catch (err) {
    try { window.alert(title) } catch (_) {}
  }
}
