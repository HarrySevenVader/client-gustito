"use client"
import React, { useState } from 'react'
import styles from './adminStyles.module.css'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import { ThemeProvider } from '../contexts/ThemeContext'
import { ActivityProvider } from '../contexts/ActivityContext'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from './LoadingSpinner'

function DashboardContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(180deg, rgba(12,60,30,0.05) 0%, rgba(10,70,30,0.03) 100%)'
      }}>
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return null // El hook redirigirá al login
  }

  return (
    <div className={styles.root}>
      <div className={styles.layout}>
        <AdminSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />
          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ActivityProvider>
        <DashboardContent>{children}</DashboardContent>
      </ActivityProvider>
    </ThemeProvider>
  )
}
