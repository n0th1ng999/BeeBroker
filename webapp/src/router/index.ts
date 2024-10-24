import MainPage from '@/views/MainPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import PatientPage from '@/views/PatientPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainPage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/patients/:id',
      name: 'patientPage',
      component: PatientPage
    },
  ]
})

export default router
