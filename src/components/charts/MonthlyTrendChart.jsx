import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export default function MonthlyTrendChart({ data }) {
  if (!data.length) return <div className="chart-empty">No monthly trend data</div>;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="chart-card">
      <h3>Monthly Trend</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#233" />
          <XAxis dataKey="name" stroke="#7ef" />
          <YAxis stroke="#7ef" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#11ffee" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
