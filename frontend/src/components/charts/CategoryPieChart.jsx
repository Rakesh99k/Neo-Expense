import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#a855f6', '#3b82f6', '#ec4899', '#f97316', '#22c55e', '#06b6d4'];

export default function CategoryPieChart({ data }) {
  if (!data.length) {
    return (
      <div className="chart-card">
        <h3>Spending by Category</h3>
        <div className="chart-empty">No category data yet</div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3>Spending by Category</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={4}
            animationDuration={800}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
            ))}
          </Pie>
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
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}