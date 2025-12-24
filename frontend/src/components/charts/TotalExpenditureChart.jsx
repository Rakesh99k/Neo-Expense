/**
 * TotalExpenditureChart
 * Bar chart summarizing total spend per time bucket.
 * Props:
 * - data: Array<{ name: string, value: number }>
 */
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'; // Recharts bar chart
import { motion } from 'framer-motion'; // entrance animation

export default function TotalExpenditureChart({ data }) { // bar chart of totals
  if (!data.length) return <div className="chart-empty">No expenditure data</div>; // empty fallback
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="chart-card"> {/* animate up */}
      <h3>Total Expenditure</h3> {/* chart title */}
      <ResponsiveContainer width="100%" height={260}> {/* responsive wrapper */}
        <BarChart data={data}> {/* data source */}
          <CartesianGrid strokeDasharray="3 3" stroke="#233" /> {/* grid */}
            <XAxis dataKey="name" stroke="#7ef" /> {/* x axis */}
            <YAxis stroke="#7ef" /> {/* y axis */}
            <Tooltip /> {/* tooltip */}
            <Bar dataKey="value" fill="#ff6ec7" radius={[4,4,0,0]} /> {/* bars */}
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
