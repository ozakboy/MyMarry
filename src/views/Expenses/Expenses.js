import { ref, computed, onMounted, watch } from 'vue'
import { Modal } from 'bootstrap'
import { Chart, registerables } from 'chart.js'
import NavBar from '@/components/NavBar/NavBar.vue'

Chart.register(...registerables)

export default {
  name: 'Expenses',
  components: { NavBar },
  setup() {
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
        const response = await fetch('api/expenses')
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

    return {
      expenses,
      editingExpense,
      isEditing,
      customCategory,
      chartCanvas,
      categories,
      totalExpense,
      categoryData,
      loadExpenses,
      openAddModal,
      openEditModal,
      saveExpense,
      deleteExpense,
      updateChart
    }
  }
}
