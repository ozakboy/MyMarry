import { ref, computed, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import NavBar from '@/components/NavBar/NavBar.vue'

export default {
  name: 'QuickView',
  components: { NavBar },
  setup() {
    const responses = ref([])
    const searchQuery = ref('')
    const sideFilter = ref('all')
    const editingResponse = ref({})
    let editGiftModalInstance = null

    const filteredResponses = computed(() => {
      let filtered = responses.value

      // 依賓客方篩選
      if (sideFilter.value !== 'all') {
        filtered = filtered.filter(r => r.side === sideFilter.value)
      }

      // 依姓名搜尋
      if (searchQuery.value) {
        filtered = filtered.filter(r =>
          r.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      }

      return filtered
    })

    const totalGiftMoney = computed(() => {
      return responses.value.reduce((sum, r) => sum + (r.giftMoney || 0), 0)
    })

    const groomGiftMoney = computed(() => {
      return responses.value
        .filter(r => r.side === 'groom')
        .reduce((sum, r) => sum + (r.giftMoney || 0), 0)
    })

    const brideGiftMoney = computed(() => {
      return responses.value
        .filter(r => r.side === 'bride')
        .reduce((sum, r) => sum + (r.giftMoney || 0), 0)
    })

    const groomCount = computed(() => {
      return responses.value.filter(r => r.side === 'groom').length
    })

    const brideCount = computed(() => {
      return responses.value.filter(r => r.side === 'bride').length
    })

    async function loadResponses() {
      try {
        const response = await fetch('/api/responses')
        if (response.ok) {
          responses.value = await response.json()
        }
      } catch (error) {
        console.error('載入資料失敗：', error)
        alert('載入資料失敗')
      }
    }

    function openEditGiftModal(response) {
      editingResponse.value = { ...response }
      editGiftModalInstance.show()
    }

    async function saveGiftMoney() {
      try {
        const response = await fetch(`/api/responses/${editingResponse.value.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editingResponse.value)
        })

        if (response.ok) {
          await loadResponses()
          editGiftModalInstance.hide()
          alert('禮金更新成功')
        }
      } catch (error) {
        console.error('更新禮金失敗：', error)
        alert('更新禮金失敗')
      }
    }

    onMounted(async () => {
      await loadResponses()
      const modalElement = document.getElementById('editGiftModal')
      if (modalElement) {
        editGiftModalInstance = new Modal(modalElement)
      }
    })

    return {
      responses,
      searchQuery,
      sideFilter,
      editingResponse,
      filteredResponses,
      totalGiftMoney,
      groomGiftMoney,
      brideGiftMoney,
      groomCount,
      brideCount,
      openEditGiftModal,
      saveGiftMoney
    }
  }
}
