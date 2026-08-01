import {
  LineChart, Line, CartesianGrid, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';

export default function MonthlyTrendChart({ data }) {
  if (!data.length) {
    return (
      <div className="chart-card">
        <h3>Monthly Trend</h3>
        <div className="chart-empty">No trend data yet</div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3>Monthly Trend</h3>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f6" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#a855f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" stroke="#8888a4" fontSize={12} />
          <YAxis stroke="#8888a4" fontSize={12} />
            <Tooltip
                contentStyle={{
                    background: 'var(--panel-solid, #1a1a2e)',
                    border: '1px solid var(--panel-border, rgba(168, 85, 246, 0.3))',
                    borderRadius: '10px',
                    color: 'var(--text, #e4e4f0)'
                }}
                labelStyle={{ color: 'var(--text, #e4e4f0)' }}
                itemStyle={{ color: 'var(--text, #e4e4f0)' }}
            />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#a855f6"
            strokeWidth={2.5}
            fill="url(#trendGradient)"
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}