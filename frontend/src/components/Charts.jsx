import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { fetchSummaryRequest } from '../redux/expense/expenseSlice'

const Charts = ({ summary: propSummary }) => {
  const dispatch = useDispatch()
  const { summary: reduxSummary, currentMonth } = useSelector((state) => state.expense)
  
  // Use prop summary if provided (for team data), otherwise use Redux summary (for personal data)
  const summary = propSummary || reduxSummary

  useEffect(() => {
    // Only fetch personal summary if no prop summary provided
    if (!propSummary) {
      dispatch(fetchSummaryRequest(currentMonth))
    }
  }, [currentMonth, dispatch, propSummary])

  // Transform team summary format (byCategory object) to categories array if needed
  let categories = summary?.categories || []
  
  // If summary has byCategory (team format), convert to categories array
  if (summary?.byCategory && !summary?.categories) {
    categories = Object.entries(summary.byCategory).map(([category, total]) => ({
      category,
      total,
      count: 1 // We don't have count in byCategory, default to 1
    }))
  }

  if (!summary || !categories || categories.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Category Reports</h2>
        <p className="text-center text-gray-500 py-8">No expense data available for charts</p>
      </div>
    )
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658']

  const pieData = categories.map((cat) => ({
    name: cat.category,
    value: cat.total
  }))

  const barData = categories.map((cat) => ({
    category: cat.category,
    amount: cat.total,
    count: cat.count
  }))

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Category Reports</h2>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600">Total Spending{propSummary ? '' : ` for ${currentMonth}`}</p>
        <p className="text-3xl font-bold text-blue-600">₹{summary.totalSpent?.toFixed(2) || '0.00'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Spending Distribution</h3>
          <ResponsiveContainer width="100%" height={450}>
            <PieChart margin={{ top: 0, right: 120, bottom: 30, left: 120 }}>
              <Pie
                data={pieData}
                cx="40%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barData} margin={{ top: 20, right: 30, bottom: 80, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'amount') return [`₹${value.toFixed(2)}`, 'Amount']
                  return [value, 'Count']
                }}
              />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Details Table */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Detailed Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 font-semibold text-gray-700 border-b">Category</th>
                <th className="p-3 font-semibold text-gray-700 border-b">Amount</th>
                <th className="p-3 font-semibold text-gray-700 border-b">Transactions</th>
                <th className="p-3 font-semibold text-gray-700 border-b">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border-b">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    {cat.category}
                  </td>
                  <td className="p-3 border-b font-medium">₹{cat.total.toFixed(2)}</td>
                  <td className="p-3 border-b">{cat.count}</td>
                  <td className="p-3 border-b">{((cat.total / summary.totalSpent) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

Charts.propTypes = {
  summary: PropTypes.shape({
    totalSpent: PropTypes.number,
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        category: PropTypes.string,
        total: PropTypes.number,
        count: PropTypes.number
      })
    )
  })
}

export default Charts
