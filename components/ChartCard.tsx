'use client';

import { useEffect, useRef } from 'react';
import styles from './ChartCard.module.css';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ChartCardProps {
  title: string;
  data: DataPoint[];
  type?: 'bar' | 'line';
  height?: number;
}

export default function ChartCard({ title, data, type = 'bar', height = 200 }: ChartCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 40;
    const width = canvas.width;
    const height = canvas.height;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Find max value for scaling
    const maxValue = Math.max(...data.map(d => d.value));
    const scale = chartHeight / (maxValue || 1);

    // Draw axes
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    const barWidth = chartWidth / data.length;
    const barSpacing = barWidth * 0.2;
    const actualBarWidth = barWidth - barSpacing;

    data.forEach((point, index) => {
      const x = padding + index * barWidth + barSpacing / 2;
      const barHeight = point.value * scale;
      const y = height - padding - barHeight;

      if (type === 'bar') {
        // Draw bar with gradient
        const gradient = ctx.createLinearGradient(x, y, x, height - padding);
        gradient.addColorStop(0, point.color || '#10b981');
        gradient.addColorStop(1, point.color ? `${point.color}80` : '#10b98180');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, actualBarWidth, barHeight);

        // Draw value on top
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 12px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(point.value.toString(), x + actualBarWidth / 2, y - 5);
      }

      // Draw label
      ctx.fillStyle = '#6b7280';
      ctx.font = '11px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.save();
      ctx.translate(x + actualBarWidth / 2, height - padding + 15);
      ctx.rotate(-0.3);
      ctx.fillText(point.label.length > 8 ? point.label.substring(0, 8) + '...' : point.label, 0, 0);
      ctx.restore();
    });

    // Draw line chart if type is line
    if (type === 'line' && data.length > 1) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      data.forEach((point, index) => {
        const x = padding + index * barWidth + barWidth / 2;
        const barHeight = point.value * scale;
        const y = height - padding - barHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        // Draw point
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
      
      ctx.stroke();
    }

  }, [data, type]);

  return (
    <div className={styles.chartCard}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={height}
        className={styles.canvas}
      />
    </div>
  );
}
