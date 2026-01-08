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
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Category Reports</h2>
      
      <div className="mb-4 sm:mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-xs sm:text-sm text-gray-600">Total Spending{propSummary ? '' : ` for ${currentMonth}`}</p>
        <p className="text-2xl sm:text-3xl font-bold text-blue-600">₹{summary.totalSpent?.toFixed(2) || '0.00'}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Pie Chart */}
        <div className="min-h-[300px] sm:min-h-[400px]">
          <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-700">Spending Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart margin={{ top: 0, right: 20, bottom: 20, left: 20 }}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => window.innerWidth > 640 ? `${name}: ${(percent * 100).toFixed(0)}%` : `${(percent * 100).toFixed(0)}%`}
                outerRadius={window.innerWidth > 640 ? 90 : 70}
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
        <div className="min-h-[300px] sm:min-h-[400px]">
          <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-700">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 20, right: 10, bottom: 60, left: 10 }}>
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
      <div className="mt-4 sm:mt-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-700">Detailed Breakdown</h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-700 border-b whitespace-nowrap">Category</th>
                    <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-700 border-b whitespace-nowrap">Amount</th>
                    <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-700 border-b whitespace-nowrap">Trans.</th>
                    <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-700 border-b whitespace-nowrap">% Total</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-2 sm:p-3 border-b text-xs sm:text-sm whitespace-nowrap">
                        <span className={`inline-block w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                        {cat.category}
                      </td>
                      <td className="p-2 sm:p-3 border-b font-medium text-xs sm:text-sm whitespace-nowrap">₹{cat.total.toFixed(2)}</td>
                      <td className="p-2 sm:p-3 border-b text-xs sm:text-sm">{cat.count}</td>
                      <td className="p-2 sm:p-3 border-b text-xs sm:text-sm">{((cat.total / summary.totalSpent) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
