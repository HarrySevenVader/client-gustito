"use client"
// Helper para desplegar alertas con SweetAlert2 si está instalado, sino fallback a window.confirm/alert
export async function confirm(title = '¿Estás seguro?', text = '') {
  try {
    // @ts-ignore - import dinámico opcional de sweetalert2 si está instalado
    const Swal = (await import('sweetalert2')).default
    const result = await Swal.fire({ 
      title, 
      text, 
      icon: 'warning', 
      showCancelButton: true, 
      confirmButtonText: 'Sí', 
      cancelButtonText: 'No',
      confirmButtonColor: '#FF6B35',
      cancelButtonColor: '#6b7280',
      width: '400px',
      padding: '2rem',
      showCloseButton: true
    })
    return result.isConfirmed
  } catch (err) {
    return window.confirm((text ? text + '\n\n' : '') + title)
  }
}

export async function toastSuccess(title = 'Hecho') {
  try {
    // @ts-ignore - import dinámico opcional de sweetalert2 si está instalado
    const Swal = (await import('sweetalert2')).default
    await Swal.fire({ 
      title, 
      icon: 'success', 
      confirmButtonText: 'OK',
      confirmButtonColor: '#FF6B35',
      iconColor: '#10b981',
      width: '400px',
      padding: '2rem',
      backdrop: true,
      showCloseButton: true
    })
  } catch (err) {
    try { window.alert(title) } catch (_) {}
  }
}

export async function toastError(title = 'Error') {
  try {
    // @ts-ignore - import dinámico opcional de sweetalert2 si está instalado
    const Swal = (await import('sweetalert2')).default
    await Swal.fire({ 
      title, 
      icon: 'error', 
      confirmButtonText: 'OK',
      confirmButtonColor: '#FF6B35',
      iconColor: '#ef4444',
      width: '400px',
      padding: '2rem',
      backdrop: true,
      showCloseButton: true
    })
  } catch (err) {
    try { window.alert(title) } catch (_) {}
  }
}

// Modal de éxito (no toast), espera confirmación del usuario
export async function alertSuccess(title = 'Hecho', text = '') {
  try {
    // @ts-ignore - import dinámico opcional de sweetalert2 si está instalado
    const Swal = (await import('sweetalert2')).default
    await Swal.fire({ 
      title, 
      text, 
      icon: 'success', 
      confirmButtonText: 'OK',
      confirmButtonColor: '#FF6B35',
      iconColor: '#10b981',,
      customClass: {
        container: 'swal-z-index-top'
      }
      width: '400px',
      padding: '2rem',
      showCloseButton: true
    })
  } catch (err) {
    try { window.alert((text ? title + '\n\n' + text : title)) } catch (_) {}
  }
}
