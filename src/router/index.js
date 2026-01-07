import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home/Home.vue'
import Form from '../views/Form/Form.vue'
import Admin from '../views/Admin/Admin.vue'
import Settings from '../views/Settings/Settings.vue'
import QuickView from '../views/QuickView/QuickView.vue'
import Expenses from '../views/Expenses/Expenses.vue'
import WeddingSchedule from '../views/WeddingSchedule/WeddingSchedule.vue'
import StaffAssignment from '../views/StaffAssignment/StaffAssignment.vue'
import SeatingChart from '../views/SeatingChart/SeatingChart.vue'

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
