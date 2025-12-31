"use client"
import React, { useState } from 'react'
import styles from './adminStyles.module.css'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import { ThemeProvider } from '../contexts/ThemeContext'
import { ActivityProvider } from '../contexts/ActivityContext'

function DashboardContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
