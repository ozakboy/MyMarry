import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Form from '../views/Form.vue'
import Admin from '../views/Admin.vue'
import Settings from '../views/Settings.vue'
import QuickView from '../views/QuickView.vue'
import Expenses from '../views/Expenses.vue'
import WeddingSchedule from '../views/WeddingSchedule.vue'
import StaffAssignment from '../views/StaffAssignment.vue'
import SeatingChart from '../views/SeatingChart.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/form',
    name: 'Form',
    component: Form
  },
  {
    path: '/MarryList',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/Settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/QuickView',
    name: 'QuickView',
    component: QuickView
  },
  {
    path: '/Expenses',
    name: 'Expenses',
    component: Expenses
  },
  {
    path: '/WeddingSchedule',
    name: 'WeddingSchedule',
    component: WeddingSchedule
  },
  {
    path: '/StaffAssignment',
    name: 'StaffAssignment',
    component: StaffAssignment
  },
  {
    path: '/SeatingChart',
    name: 'SeatingChart',
    component: SeatingChart
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
