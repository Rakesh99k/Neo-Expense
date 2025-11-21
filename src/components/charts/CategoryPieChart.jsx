import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#11ffee', '#ff6ec7', '#8e2de2', '#4a00e0', '#f9ff21', '#00f0ff'];

export default function CategoryPieChart({ data }) {
  if (!data.length) return <div className="chart-empty">No category data</div>;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="chart-card">
      <h3>Spending by Category</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
