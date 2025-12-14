"use client"
import React from 'react'
import styles from './adminStyles.module.css'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import { ThemeProvider } from '../contexts/ThemeContext'

function DashboardContent({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.root}>
      <div className={styles.layout}>
        <AdminSidebar />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <AdminTopbar />
          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DashboardContent>{children}</DashboardContent>
    </ThemeProvider>
  )
}
