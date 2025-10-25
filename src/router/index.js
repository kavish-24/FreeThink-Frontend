import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from 'stores/auth.store'
import routes from './routes.js'
import api from '../services/auth.service'
const router = createRouter({
  history: createWebHistory(),
  routes,

  // --- REPLACE the old scrollBehavior with this new one ---
  scrollBehavior(to, from, savedPosition) {
    // If the new route has a hash, scroll to that element
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }

    // If there's a saved position (from browser back/forward), use it
    if (savedPosition) {
      return savedPosition
    }

    // Otherwise, scroll to the top of the page
    return { top: 0 }
  },
})

// Helper function to verify admin token
async function verifyAdminToken(token) {
  try {
    const response = await api.get('admin/verify-token', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    return response.ok && data.success
  } catch (error) {
    console.error('Token verification failed:', error)
    return false
  }
}

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isAdminRoute = to.matched.some(record => record.path.startsWith('/admin'))
  const adminToken = localStorage.getItem('adminToken')

  // Handle admin routes
  if (isAdminRoute) {
    // If trying to access admin login page
    if (to.name === 'AdminLogin') {
      // If already logged in, redirect to dashboard
      if (adminToken) {
        const isValid = await verifyAdminToken(adminToken)
        if (isValid) {
          return next('/admin/dashboard')
        }
      }
      return next()
    }

    // For protected admin routes
    if (!adminToken) {
      // No token, redirect to login
      return next({
        name: 'AdminLogin',
        query: { redirect: to.fullPath }
      })
    }

    // Verify token for protected routes
    const isValid = await verifyAdminToken(adminToken)
    if (!isValid) {
      // Invalid token, clear and redirect to login
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminTokenExpiry')
      return next({
        name: 'AdminLogin',
        query: {
          redirect: to.fullPath,
          sessionExpired: 'true'
        }
      })
    }
    // Continue to the route if it's an admin route
    return next()
  }

  // Handle regular routes
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      return next('/login')
    }

    if (to.meta.role && authStore.role !== to.meta.role) {
      return next('/')
    }
  }

  // If user is authenticated and tries to access guest-only routes
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next('/')
  }

  next()
})

export default router
