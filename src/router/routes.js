import HomePage from 'pages/HomePage.vue'
const AboutUs = () => import('pages/AboutUs.vue')

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: HomePage
      },
      {
        path: 'employers',
        name: 'Employers',
        component: () => import('pages/EmployerHomePage.vue')
      },
      {
        path: 'about',
        name: 'About',
        component: AboutUs
  },
        {
        path: 'contact',
        name: 'Contact',
        component: () => import('pages/ContactPage.vue')
      },
            {
        path: 'privacy-policy', 
        name: 'PrivacyPolicy',
        component: () => import('pages/PrivacyPolicy.vue')
      },
      {
        path: '/terms-and-conditions',
        name: 'TermsConditions',
        component: () => import('pages/TermsConditions.vue')
      },
      {
        path: 'job/:id',
        name: 'JobDescription',
        component: () => import('pages/JobDescriptionPage.vue'),
        props: true
      },
      {
        path: 'post-job',
        name: 'PostNewJob',
        component: () => import('components/PostNewJob.vue')
      },
      {
        path: 'jobs/:category',
        name: 'JobListing',
        component: () => import('pages/JobListing.vue'),
        props: true
      },
      {
        path: 'job/:id',
        name: 'JobDescription',
        component: () => import('pages/JobDescriptionPage.vue'),
        props: true
      },
      {
        path: 'apply/:jobId',
        name: 'ApplicationForm',
        component: () => import('pages/ApplicationForm.vue'),
        props: true
      },
       {
        path: '/application-success',
        name: 'ApplicationSuccess',
        component: () => import('pages/ApplicationSuccess.vue')
      },
      {
        path: '/test-instructions',
        name: 'TestInstructions',
        component: () => import('../pages/TestInstructions.vue')
      },
      {
        path: '/test',           
        name: 'TestPage',        
        component: () => import('../pages/TestPage.vue')      
      },
      {
        path: '/test-under-review',
        name: 'TestUnderReview',
        component: () => import('../components/TestUnderReview.vue')
      },
      {
        path: "/application-status",
        name: "ApplicationStatus",
        component: () => import('../pages/ApplicationStatus.vue')
      },
      {
        path: '/application-details/:id',
        name: 'ApplicationDetails',
        component: () => import('../components/ApplicationDetailsPage.vue'),
        props: true
      },
       {path: '/resume-builder',
        component: () => import('../components/resume-builder.vue') }
    ]
  },
{
  path: '/posted-jobs',
  name: 'PostedJobs',
  component: () => import('components/PostedJobs.vue')
},
{
  path: '/candidates',
  name: 'EmployerCandidates',
  component: () => import('components/EmployerCandidates.vue')
},
{
  path: '/employer-messages',
  name: 'EmployerMessages',
  component: () => import('components/EmployerMessages.vue')
},
{
  path: '/company-profile',
  name: 'CompanyProfile',
  component: () => import('components/CompanyProfile.vue')
},
  {
    path: '/employer-settings',
    name: 'EmployerSettings',
    component: () => import('components/EmployerSettings.vue')
  },

  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('pages/LoginPage.vue')
      },
    ]
  },
  
  {
    path: '/registration-pending',
    name: 'RegistrationPending',
    component: () => import('pages/RegistrationPending.vue')
  },

  {
    path: '/create-account',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'CreateAccount',
        component: () => import('pages/CreateAccount.vue')
      }
    ]
  },
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'JobSeekerDashboard',
        component: () => import('pages/JobSeekerDashboard.vue'),
        meta: {
          requiresAuth: true,
          role: 'job_seeker'
        }
      },
    ]
  },
{
  path: '/employer-login',
  component: () => import('src/pages/EmployerSignUp.vue')
},
{
  path: '/employer-signup',
  component: () => import('src/pages/EmployerSignUp.vue')
},
{
  path: '/employer-portal',
  component: () => import('pages/EmployerPortal.vue'),
  meta: {
    requiresAuth: true,
    role: 'company'
  }
},
  {
    path: '/posted-jobs',
    name: 'EmployerPostedJobs',
    component: () => import('pages/EmployerPostedJobs.vue'),
    meta: {
      requiresAuth: true,
      role: 'company'
    }
  },

  {
    path: '/forgot-password',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'ForgotPassword',
        component: () => import('pages/ChangePassword.vue')
      }
    ]
  },

  // Admin Routes
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'AdminLogin',
        component: () => import('pages/admin/AdminLogin.vue'),
        meta: { requiresGuest: true }
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('pages/admin/AdminDashboard.vue'),
        meta: { requiresAuth: true, role: 'admin' }
      },
      {
        path: 'companies',
        name: 'CompaniesManagement',
        component: () => import('pages/admin/CompaniesManagement.vue'),
        meta: { requiresAuth: true, role: 'admin' }
      }
    ]
  },

  // 404 - Keep this last
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes;
