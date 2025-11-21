import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export default function TotalExpenditureChart({ data }) {
  if (!data.length) return <div className="chart-empty">No expenditure data</div>;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="chart-card">
      <h3>Total Expenditure</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#233" />
            <XAxis dataKey="name" stroke="#7ef" />
            <YAxis stroke="#7ef" />
            <Tooltip />
            <Bar dataKey="value" fill="#ff6ec7" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
