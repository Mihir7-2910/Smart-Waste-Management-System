import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { BarChart3, TrendingUp, ShieldCheck, Truck, Clock, Sparkles } from 'lucide-react';
import { MetricCard } from '../common/MetricCard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

export function AnalyticsDashboard({ complaints = [] }) {
  // Ward Waste Data
  const wardWasteData = {
    labels: ['Ward 3 (Ellisbridge)', 'Ward 4 (Navrangpura)', 'Ward 7 (Vastrapur)', 'Ward 8 (Bodakdev)', 'Ward 11 (Sabarmati)'],
    datasets: [
      {
        label: 'Collected Solid Waste (Tons)',
        data: [28.4, 42.1, 35.8, 19.5, 31.2],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: '#10b981',
        borderRadius: 8
      },
      {
        label: 'Predicted Next 24h Surge (Tons)',
        data: [34.0, 58.2, 44.5, 22.0, 36.0],
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        borderColor: '#a855f7',
        borderRadius: 8
      }
    ]
  };

  // Category Breakdown Doughnut Data
  const categoryData = {
    labels: ['Overflowing Smart Bins', 'Single-Use Plastics', 'Construction Debris', 'Hazardous/Medical', 'Organic Waste'],
    datasets: [
      {
        data: [38, 28, 16, 8, 10],
        backgroundColor: [
          '#10b981',
          '#3b82f6',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6'
        ],
        borderWidth: 2,
        borderColor: '#0f172a'
      }
    ]
  };

  // SLA Resolution Trend Data
  const slaTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Average Resolution Time (Hours)',
        data: [3.8, 3.2, 2.9, 2.7, 2.4, 2.8, 2.3],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#10b981',
        pointRadius: 5
      },
      {
        label: 'Target Municipal SLA (4.0 Hours)',
        data: [4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0],
        borderColor: 'rgba(239, 68, 68, 0.6)',
        borderDash: [6, 6],
        fill: false,
        pointRadius: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 11 }
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1'
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#64748b', font: { size: 11 } }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#64748b', font: { size: 11 } }
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
            <BarChart3 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-xl text-white">Actionable Municipal BI & Analytics</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                REAL-TIME DATA
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Ward-wise solid waste generation, SLA turnaround speed, and vehicle fleet efficiency metrics
            </p>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Daily Solid Waste Cleared</span>
          <p className="text-2xl font-extrabold text-white font-heading">157.0 Tons</p>
          <span className="text-[10px] text-emerald-400 font-bold">↑ 8.4% vs last week</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Average SLA Resolution Time</span>
          <p className="text-2xl font-extrabold text-emerald-400 font-heading">2.3 Hours</p>
          <span className="text-[10px] text-emerald-400 font-bold">42% Faster than 4-hr SLA</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">AI Verification Accuracy</span>
          <p className="text-2xl font-extrabold text-purple-400 font-heading">94.8%</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Fleet Fuel Saved (Haversine)</span>
          <p className="text-2xl font-extrabold text-amber-400 font-heading">320 Litres</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ward-Wise Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-heading font-bold text-sm text-white">
              Ward-Wise Waste Generated vs. Predicted Surge
            </h3>
            <span className="text-xs text-slate-400 font-mono">Tonnage / Day</span>
          </div>
          <div className="h-64">
            <Bar data={wardWasteData} options={chartOptions} />
          </div>
        </div>

        {/* Category Breakdown Donut (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-heading font-bold text-sm text-white">Grievance Category Breakdown</h3>
            <span className="text-xs text-slate-400 font-mono">% Share</span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={categoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: { color: '#94a3b8', font: { family: 'Inter', size: 10 } }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* SLA Resolution Speed Trend Line Chart (12 cols) */}
        <div className="lg:col-span-12 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-heading font-bold text-sm text-white">
                7-Day Municipal SLA Turnaround Time Trend
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
              Target: &lt; 4.0 Hours
            </span>
          </div>
          <div className="h-64">
            <Line data={slaTrendData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
