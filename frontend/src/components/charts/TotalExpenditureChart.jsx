import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export default function TotalExpenditureChart({ data }) {
  if (!data.length) {
    return (
      <div className="chart-card">
        <h3>Total Expenditure</h3>
        <div className="chart-empty">No expenditure data yet</div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3>Total Expenditure</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#a855f6" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" stroke="#8888a4" fontSize={12} />
          <YAxis stroke="#8888a4" fontSize={12} />
          <Tooltip
            contentStyle={{
              background: 'rgba(20, 20, 30, 0.95)',
              border: '1px solid rgba(168, 85, 246, 0.3)',
              borderRadius: '10px',
              color: '#e4e4f0'
            }}
          />
          <Bar
            dataKey="value"
            fill="url(#barGradient)"
            radius={[8, 8, 0, 0]}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}