import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { AppBar, Toolbar, Typography, Avatar, IconButton, Menu, MenuItem, Box, Divider } from '@mui/material'
import { Person, Logout } from '@mui/icons-material'
import ProfileSettings from './ProfileSettings'
import ConfirmDialog from './ConfirmDialog'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'

const Header = ({ title, subtitle, user, children }) => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { addToast } = useToast()
  const [anchorEl, setAnchorEl] = useState(null)
  const [showProfileSettings, setShowProfileSettings] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    const names = name.trim().split(' ')
    if (names.length === 1) return names[0].charAt(0).toUpperCase()
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
  }

  return (
    <>
      <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
        <Toolbar sx={{ flexDirection: { xs: 'column', sm: 'row' }, py: { xs: 2, sm: 1.5 }, gap: { xs: 2, sm: 0 } }}>
          <Box sx={{ flex: 1, width: '100%' }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'stretch', sm: 'flex-end' }, gap: 1.5, width: { xs: '100%', sm: 'auto' } }}>
            <Box sx={{ alignSelf: { xs: 'flex-end', sm: 'auto' } }}>
              <IconButton
                onMouseEnter={handleMenuOpen}
                sx={{ p: 0 }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
                    fontWeight: 'bold',
                    '&:hover': {
                      boxShadow: 3
                    }
                  }}
                >
                  {getInitials(user?.name)}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                MenuListProps={{
                  onMouseLeave: handleMenuClose
                }}
                PaperProps={{
                  elevation: 3,
                  sx: { minWidth: 200, mt: 1.5 }
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {user?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {user?.email}
                  </Typography>
                  <Typography variant="caption" color="primary" sx={{ fontWeight: 500, mt: 0.5, display: 'block' }}>
                    {user?.role === 'manager' ? '👔 Manager' : '👤 User'}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem
                  onClick={() => {
                    setShowProfileSettings(true)
                    handleMenuClose()
                  }}
                >
                  <Person fontSize="small" sx={{ mr: 1 }} />
                  Profile Settings
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setShowLogoutConfirm(true)
                    handleMenuClose()
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Logout fontSize="small" sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
            {children}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Settings Modal */}
      <ProfileSettings
        isOpen={showProfileSettings}
        onClose={() => setShowProfileSettings(false)}
      />

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          logout()
          addToast({ message: 'Logged out successfully', type: 'success' })
          setShowLogoutConfirm(false)
        }}
        title="Logout Confirmation"
        message="Are you sure you want to logout? You'll need to login again to access your account."
        confirmText="Yes, Logout"
        cancelText="Cancel"
        confirmColor="red"
      />
    </>
  )
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string
  }),
  children: PropTypes.node
}

export default Header
