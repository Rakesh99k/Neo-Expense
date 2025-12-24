/**
 * CategoryPieChart
 * Displays per-category spending for a given dataset using Recharts.
 * Props:
 * - data: Array<{ name: string, value: number }>
 */
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts'; // Recharts primitives
import { motion } from 'framer-motion'; // entrance animation

const COLORS = ['#11ffee', '#ff6ec7', '#8e2de2', '#4a00e0', '#f9ff21', '#00f0ff']; // palette for pie slices

export default function CategoryPieChart({ data }) { // pie chart for category totals
  if (!data.length) return <div className="chart-empty">No category data</div>; // empty fallback
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="chart-card"> {/* animate in */}
      <h3>Spending by Category</h3> {/* chart title */}
      <ResponsiveContainer width="100%" height={260}> {/* responsive sizing */}
        <PieChart> {/* pie chart container */}
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}> {/* pie settings */}
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)} {/* color each slice */}
          </Pie>
          <Tooltip /> {/* default tooltip */}
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
