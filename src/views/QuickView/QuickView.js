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
    const newGuest = ref({})
    const defaultCookieCount = ref(1)
    let editGiftModalInstance = null
    let addGuestModalInstance = null

    const relationshipOptions = [
      '家人',
      '親戚',
      '同事',
      '同學',
      '朋友',
      '其他'
    ]

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

    async function loadConfig() {
      try {
        const response = await fetch('/api/config')
        if (response.ok) {
          const config = await response.json()
          defaultCookieCount.value = config.defaultCookieCount ?? 1
        }
      } catch (error) {
        console.error('載入設定失敗：', error)
      }
    }

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

    async function toggleCookieGiven(response) {
      const updated = { ...response, cookieGiven: !response.cookieGiven }
      try {
        const res = await fetch(`/api/responses/${response.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updated)
        })

        if (res.ok) {
          await loadResponses()
        } else {
          alert('更新失敗')
        }
      } catch (error) {
        console.error('更新喜餅給予狀態失敗：', error)
        alert('更新失敗')
      }
    }

    function resetNewGuest() {
      newGuest.value = {
        name: '',
        phone: '',
        relationship: '朋友',
        customRelationship: '',
        side: 'groom',
        willAttend: 'yes',
        attendees: 1,
        mealType: '葷食',
        needChildSeat: 'no',
        childSeatCount: 0,
        giftMoney: 0,
        note: ''
      }
    }

    function openAddGuestModal() {
      resetNewGuest()
      addGuestModalInstance.show()
    }

    async function saveNewGuest() {
      if (!newGuest.value.name.trim()) {
        alert('請輸入姓名')
        return
      }

      const finalRelationship = newGuest.value.relationship === '其他' && newGuest.value.customRelationship
        ? newGuest.value.customRelationship
        : newGuest.value.relationship

      const dataToSubmit = {
        name: newGuest.value.name,
        phone: newGuest.value.phone,
        relationship: finalRelationship,
        side: newGuest.value.side,
        willAttend: newGuest.value.willAttend,
        attendees: newGuest.value.willAttend === 'yes' ? newGuest.value.attendees : 0,
        mealType: newGuest.value.willAttend === 'yes' ? newGuest.value.mealType : '',
        needChildSeat: newGuest.value.willAttend === 'yes' ? newGuest.value.needChildSeat : 'no',
        childSeatCount: newGuest.value.willAttend === 'yes' && newGuest.value.needChildSeat === 'yes' ? newGuest.value.childSeatCount : 0,
        needInvitation: 'no',
        invitationRecipient: '',
        invitationAddress: '',
        invitationPhone: '',
        blessing: '',
        giftMoney: newGuest.value.giftMoney || 0,
        note: newGuest.value.note
      }

      try {
        const response = await fetch('/api/responses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify(dataToSubmit)
        })

        if (response.ok) {
          await loadResponses()
          addGuestModalInstance.hide()
          alert('來賓新增成功')
        } else {
          throw new Error('新增失敗')
        }
      } catch (error) {
        console.error('新增來賓失敗：', error)
        alert('新增來賓失敗')
      }
    }

    onMounted(async () => {
      await loadConfig()
      await loadResponses()
      const modalElement = document.getElementById('editGiftModal')
      if (modalElement) {
        editGiftModalInstance = new Modal(modalElement)
      }
      const addGuestModalElement = document.getElementById('addGuestModal')
      if (addGuestModalElement) {
        addGuestModalInstance = new Modal(addGuestModalElement)
      }
    })

    return {
      responses,
      searchQuery,
      sideFilter,
      editingResponse,
      newGuest,
      defaultCookieCount,
      filteredResponses,
      totalGiftMoney,
      groomGiftMoney,
      brideGiftMoney,
      groomCount,
      brideCount,
      relationshipOptions,
      openEditGiftModal,
      saveGiftMoney,
      toggleCookieGiven,
      openAddGuestModal,
      saveNewGuest
    }
  }
}
