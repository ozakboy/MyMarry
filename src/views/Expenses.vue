<template>
  <div class="expenses-page">
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container-fluid">
        <router-link to="/MarryList" class="navbar-brand fw-bold" style="color: #d4357f;">
          💒 婚禮管理系統
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/MarryList" class="nav-link">出席名單</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/QuickView" class="nav-link">快速查詢</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/Expenses" class="nav-link active">花費統計</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/WeddingSchedule" class="nav-link">婚禮流程</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/StaffAssignment" class="nav-link">人員配置</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/SeatingChart" class="nav-link">座位表</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/Settings" class="nav-link">系統設定</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <h2 class="mb-4">婚禮準備花費統計表</h2>

      <div class="row mb-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body text-center">
              <h5 class="card-title">總花費</h5>
              <p class="card-text fs-2 fw-bold text-danger">${{ totalExpense.toLocaleString() }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title mb-3">類別分佈</h5>
              <canvas ref="chartCanvas"></canvas>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-body">
          <button class="btn btn-primary" @click="openAddModal">新增花費</button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>類別</th>
                  <th>項目</th>
                  <th>金額</th>
                  <th>日期</th>
                  <th>備註</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="expense in expenses" :key="expense.id">
                  <td>{{ expense.category }}</td>
                  <td>{{ expense.item }}</td>
                  <td class="fw-bold">${{ expense.amount.toLocaleString() }}</td>
                  <td>{{ expense.date }}</td>
                  <td>{{ expense.note }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary me-2" @click="openEditModal(expense)">編輯</button>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteExpense(expense.id)">刪除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="expenses.length === 0" class="text-center text-muted py-4">
            <p>尚無花費記錄</p>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="expenseModal" tabindex="-1" ref="expenseModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? '編輯花費' : '新增花費' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">類別</label>
              <select class="form-select" v-model="editingExpense.category">
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div class="mb-3" v-if="editingExpense.category === '其他'">
              <label class="form-label">自訂類別</label>
              <input type="text" class="form-control" v-model="customCategory">
            </div>
            <div class="mb-3">
              <label class="form-label">項目</label>
              <input type="text" class="form-control" v-model="editingExpense.item" required>
            </div>
            <div class="mb-3">
              <label class="form-label">金額</label>
              <input type="number" class="form-control" v-model.number="editingExpense.amount" min="0" required>
            </div>
            <div class="mb-3">
              <label class="form-label">日期</label>
              <input type="date" class="form-control" v-model="editingExpense.date" required>
            </div>
            <div class="mb-3">
              <label class="form-label">備註</label>
              <textarea class="form-control" v-model="editingExpense.note" rows="2"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="saveExpense">儲存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Modal } from 'bootstrap'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const expenses = ref([])
const editingExpense = ref({})
const isEditing = ref(false)
const customCategory = ref('')
let expenseModalInstance = null
const chartCanvas = ref(null)
let chartInstance = null

const categories = [
  '場地費用',
  '婚紗攝影',
  '喜餅禮品',
  '婚宴餐飲',
  '婚禮佈置',
  '音響燈光',
  '新娘秘書',
  '婚戒',
  '喜帖',
  '其他'
]

const totalExpense = computed(() => {
  return expenses.value.reduce((sum, e) => sum + (e.amount || 0), 0)
})

const categoryData = computed(() => {
  const categoryMap = {}
  expenses.value.forEach(e => {
    const cat = e.category || '其他'
    categoryMap[cat] = (categoryMap[cat] || 0) + e.amount
  })
  return categoryMap
})

async function loadExpenses() {
  try {
    const response = await fetch('http://localhost:4600/api/expenses')
    if (response.ok) {
      expenses.value = await response.json()
    }
  } catch (error) {
    console.error('載入花費資料失敗：', error)
  }
}

function openAddModal() {
  isEditing.value = false
  editingExpense.value = {
    category: '場地費用',
    item: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    note: ''
  }
  customCategory.value = ''
  expenseModalInstance.show()
}

function openEditModal(expense) {
  isEditing.value = true
  editingExpense.value = { ...expense }
  customCategory.value = ''
  expenseModalInstance.show()
}

async function saveExpense() {
  const finalCategory = editingExpense.value.category === '其他' && customCategory.value
    ? customCategory.value
    : editingExpense.value.category

  const expenseData = {
    ...editingExpense.value,
    category: finalCategory
  }

  try {
    const url = isEditing.value
      ? `http://localhost:4600/api/expenses/${editingExpense.value.id}`
      : 'http://localhost:4600/api/expenses'

    const response = await fetch(url, {
      method: isEditing.value ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(expenseData)
    })

    if (response.ok) {
      await loadExpenses()
      expenseModalInstance.hide()
      alert(isEditing.value ? '花費更新成功' : '花費新增成功')
    }
  } catch (error) {
    console.error('儲存花費失敗：', error)
    alert('儲存花費失敗')
  }
}

async function deleteExpense(id) {
  if (!confirm('確定要刪除此筆花費嗎？')) return

  try {
    const response = await fetch(`http://localhost:4600/api/expenses/${id}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      await loadExpenses()
      alert('花費刪除成功')
    }
  } catch (error) {
    console.error('刪除花費失敗：', error)
    alert('刪除花費失敗')
  }
}

function updateChart() {
  if (!chartCanvas.value) return

  const data = categoryData.value
  const labels = Object.keys(data)
  const values = Object.values(data)

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(chartCanvas.value, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#C9CBCF',
          '#4BC0C0',
          '#FF6384'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
}

watch(categoryData, () => {
  updateChart()
}, { deep: true })

onMounted(async () => {
  await loadExpenses()
  const modalElement = document.getElementById('expenseModal')
  if (modalElement) {
    expenseModalInstance = new Modal(modalElement)
  }
  updateChart()
})
</script>

<style scoped>
.expenses-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.card {
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
}
</style>
