import { useState } from 'react'
import PropTypes from 'prop-types'
import { TextField, Button, Alert, IconButton, InputAdornment, Box, Typography, Link } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'

const LoginForm = ({ onSwitchToSignup }) => {
  const { login, loading, error } = useAuth()
  const { addToast } = useToast()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      addToast({ message: 'Please fill all fields', type: 'error' })
      return
    }
    try {
      await login(formData)
      addToast({ message: 'Logged in successfully!', type: 'success' })
    } catch (err) {
      addToast({ message: err.message, type: 'error' })
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {error && (
        <Alert severity="error">{error}</Alert>
      )}

      <TextField
        fullWidth
        type="email"
        name="email"
        label="Email"
        value={formData.email}
        onChange={handleChange}
        placeholder="your@email.com"
        autoComplete="email"
        variant="outlined"
      />

      <TextField
        fullWidth
        type={showPassword ? 'text' : 'password'}
        name="password"
        label="Password"
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
        autoComplete="current-password"
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{ py: 1.5, textTransform: 'none', fontWeight: 500 }}
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Don&apos;t have an account?{' '}
          <Link
            component="button"
            type="button"
            onClick={onSwitchToSignup}
            sx={{ fontWeight: 500, cursor: 'pointer' }}
          >
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

LoginForm.propTypes = {
  onSwitchToSignup: PropTypes.func.isRequired
}

export default LoginForm
