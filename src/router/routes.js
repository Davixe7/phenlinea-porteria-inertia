
const routes = [
  { name: 'Login', path: '/login', component: () => import('pages/Login.vue') },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: '', path: '', component: () => import('pages/Home.vue') },
      { name: 'home', path: 'home', component: () => import('pages/Home.vue') },
      { name: 'visitas', path: 'visitas', component: () => import('pages/Visits/Visits.vue') },
      { name: 'apartamentos', path: 'apartamentos', component: () => import('pages/Apartments/Apartments.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
