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
    const totalBudget = ref(0)
    const editingBudget = ref(0)
    let expenseModalInstance = null
    let budgetModalInstance = null
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

    const payerOptions = [
      { value: 'mutual', label: '共同' },
      { value: 'groom', label: '新郎' },
      { value: 'bride', label: '新娘' }
    ]

    // 確保 expense 物件含有新欄位（舊資料相容）
    function normalizeExpense(expense) {
      return {
        ...expense,
        main_payer: expense.main_payer || 'mutual',
        sponsorships: expense.sponsorships || []
      }
    }

    // 計算單筆贊助總額
    function getExpenseSponsorTotal(expense) {
      return (expense.sponsorships || []).reduce((sum, s) => sum + (s.amount || 0), 0)
    }

    // 計算單筆實付金額
    function getExpenseActualPaid(expense) {
      return (expense.amount || 0) - getExpenseSponsorTotal(expense)
    }

    const totalExpense = computed(() => {
      return expenses.value.reduce((sum, e) => sum + (e.amount || 0), 0)
    })

    const totalSponsor = computed(() => {
      return expenses.value.reduce((sum, e) => sum + getExpenseSponsorTotal(e), 0)
    })

    const actualPaid = computed(() => {
      return totalExpense.value - totalSponsor.value
    })

    const remainingBudget = computed(() => {
      return totalBudget.value - actualPaid.value
    })

    const budgetPercentage = computed(() => {
      if (totalBudget.value === 0) return 0
      return Math.round((actualPaid.value / totalBudget.value) * 100)
    })

    const categoryData = computed(() => {
      const categoryMap = {}
      expenses.value.forEach(e => {
        const cat = e.category || '其他'
        categoryMap[cat] = (categoryMap[cat] || 0) + e.amount
      })
      return categoryMap
    })

    // 支付方負擔統計
    const payerData = computed(() => {
      const result = { groom: 0, bride: 0, mutual: 0 }
      expenses.value.forEach(e => {
        const payer = e.main_payer || 'mutual'
        const paid = getExpenseActualPaid(e)
        if (result[payer] !== undefined) {
          result[payer] += paid
        } else {
          result.mutual += paid
        }
      })
      return result
    })

    // 贊助貢獻榜
    const sponsorRanking = computed(() => {
      const sponsorMap = {}
      expenses.value.forEach(e => {
        (e.sponsorships || []).forEach(s => {
          const name = s.name || '未知'
          sponsorMap[name] = (sponsorMap[name] || 0) + (s.amount || 0)
        })
      })
      return Object.entries(sponsorMap)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount)
    })

    // 編輯中花費的贊助總額（即時計算）
    const editingSponsorTotal = computed(() => {
      return (editingExpense.value.sponsorships || []).reduce((sum, s) => sum + (s.amount || 0), 0)
    })

    const editingActualPaid = computed(() => {
      return (editingExpense.value.amount || 0) - editingSponsorTotal.value
    })

    async function loadExpenses() {
      try {
        const response = await fetch('/api/expenses')
        if (response.ok) {
          const data = await response.json()
          // 為舊資料補上預設值
          expenses.value = (data.expenses || []).map(normalizeExpense)
          totalBudget.value = data.totalBudget || 0
        }
      } catch (error) {
        console.error('載入花費資料失敗：', error)
      }
    }

    function openBudgetModal() {
      editingBudget.value = totalBudget.value
      budgetModalInstance.show()
    }

    async function saveBudget() {
      try {
        const response = await fetch('/api/expenses/budget', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ totalBudget: editingBudget.value })
        })

        if (response.ok) {
          totalBudget.value = editingBudget.value
          budgetModalInstance.hide()
          alert('預算設定成功')
        }
      } catch (error) {
        console.error('儲存預算失敗：', error)
        alert('儲存預算失敗')
      }
    }

    function openAddModal() {
      isEditing.value = false
      editingExpense.value = {
        category: '場地費用',
        item: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        main_payer: 'mutual',
        sponsorships: [],
        note: ''
      }
      customCategory.value = ''
      expenseModalInstance.show()
    }

    function openEditModal(expense) {
      isEditing.value = true
      editingExpense.value = normalizeExpense({ ...expense })
      // 深拷貝 sponsorships 避免引用問題
      editingExpense.value.sponsorships = (expense.sponsorships || []).map(s => ({ ...s }))
      customCategory.value = ''
      expenseModalInstance.show()
    }

    function addSponsorship() {
      if (!editingExpense.value.sponsorships) {
        editingExpense.value.sponsorships = []
      }
      editingExpense.value.sponsorships.push({
        id: 's' + Date.now(),
        name: '',
        amount: 0
      })
    }

    function removeSponsorship(index) {
      editingExpense.value.sponsorships.splice(index, 1)
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
          ? `/api/expenses/${editingExpense.value.id}`
          : '/api/expenses'

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
        const response = await fetch(`/api/expenses/${id}`, {
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

    function getPayerLabel(payer) {
      const found = payerOptions.find(p => p.value === payer)
      return found ? found.label : '共同'
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

      const expenseModalElement = document.getElementById('expenseModal')
      if (expenseModalElement) {
        expenseModalInstance = new Modal(expenseModalElement)
      }

      const budgetModalElement = document.getElementById('budgetModal')
      if (budgetModalElement) {
        budgetModalInstance = new Modal(budgetModalElement)
      }

      updateChart()
    })

    return {
      expenses,
      editingExpense,
      isEditing,
      customCategory,
      totalBudget,
      editingBudget,
      remainingBudget,
      budgetPercentage,
      chartCanvas,
      categories,
      totalExpense,
      totalSponsor,
      actualPaid,
      categoryData,
      payerOptions,
      payerData,
      sponsorRanking,
      editingSponsorTotal,
      editingActualPaid,
      getExpenseSponsorTotal,
      getExpenseActualPaid,
      getPayerLabel,
      loadExpenses,
      openBudgetModal,
      saveBudget,
      openAddModal,
      openEditModal,
      addSponsorship,
      removeSponsorship,
      saveExpense,
      deleteExpense,
      updateChart
    }
  }
}
