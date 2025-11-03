"use client"
import React from 'react'
import styles from './adminStyles.module.css'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
