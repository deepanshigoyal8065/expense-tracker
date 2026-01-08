import { useState } from 'react'
import PropTypes from 'prop-types'
import { TextField, Button, Alert, IconButton, InputAdornment, Box, Typography, Link } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'

const SignupForm = ({ onSwitchToLogin }) => {
  const { signup, loading, error } = useAuth()
  const { addToast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      addToast({ message: 'Please fill all fields', type: 'error' })
      return
    }

    if (formData.password.length < 6) {
      addToast({ message: 'Password must be at least 6 characters', type: 'error' })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      addToast({ message: 'Passwords do not match', type: 'error' })
      return
    }

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      addToast({ message: 'Account created successfully!', type: 'success' })
    } catch (err) {
      // Error is already set in context
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
        type="text"
        name="name"
        label="Name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Your name"
        autoComplete="name"
        variant="outlined"
      />

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
        autoComplete="new-password"
        variant="outlined"
        helperText="At least 6 characters"
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

      <TextField
        fullWidth
        type={showConfirmPassword ? 'text' : 'password'}
        name="confirmPassword"
        label="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="••••••••"
        autoComplete="new-password"
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
        {loading ? 'Creating account...' : 'Sign Up'}
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link
            component="button"
            type="button"
            onClick={onSwitchToLogin}
            sx={{ fontWeight: 500, cursor: 'pointer' }}
          >
            Login
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

SignupForm.propTypes = {
  onSwitchToLogin: PropTypes.func.isRequired
}

export default SignupForm
