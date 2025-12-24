/**
 * MonthlyTrendChart
 * Line chart showing totals per month for the selected period.
 * Props:
 * - data: Array<{ name: string, value: number }>
 */
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'; // Recharts line chart
import { motion } from 'framer-motion'; // entrance animation

export default function MonthlyTrendChart({ data }) { // line chart over months
  if (!data.length) return <div className="chart-empty">No monthly trend data</div>; // empty fallback
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="chart-card"> {/* animate up */}
      <h3>Monthly Trend</h3> {/* chart title */}
      <ResponsiveContainer width="100%" height={260}> {/* responsive wrapper */}
        <LineChart data={data}> {/* data source */}
          <CartesianGrid strokeDasharray="3 3" stroke="#233" /> {/* grid styling */}
          <XAxis dataKey="name" stroke="#7ef" /> {/* x axis labels */}
          <YAxis stroke="#7ef" /> {/* y axis */}
          <Tooltip /> {/* hover tooltip */}
          <Line type="monotone" dataKey="value" stroke="#11ffee" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} /> {/* line series */}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
