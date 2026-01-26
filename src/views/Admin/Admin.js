import { ref, computed, onMounted } from 'vue'
import NavBar from '@/components/NavBar/NavBar.vue'

export default {
  name: 'Admin',
  components: { NavBar },
  setup() {
    const responses = ref([])
    const editingResponse = ref(null)
    const addingGuest = ref(null)
    const filter = ref('all')
    const defaultCookieCount = ref(1)

    const relationshipOptions = [
      '家人',
      '親戚',
      '同事',
      '同學',
      '朋友',
      '其他'
    ]

    // 篩選後的資料
    const filteredResponses = computed(() => {
      if (filter.value === 'all') return responses.value
      return responses.value.filter(r => r.side === filter.value)
    })

    // 出席統計
    const attendanceStats = computed(() => {
      const stats = { willAttend: 0, wontAttend: 0 }
      responses.value.forEach(r => {
        if (r.willAttend === 'yes') {
          stats.willAttend++
        } else {
          stats.wontAttend++
        }
      })
      return stats
    })

    // 總出席人數
    const totalAttendees = computed(() => {
      return responses.value.reduce((sum, r) => {
        return sum + (r.willAttend === 'yes' ? r.attendees : 0)
      }, 0)
    })

    // 預計桌數 (每桌10人)
    const estimatedTables = computed(() => {
      return Math.ceil(totalAttendees.value / 10)
    })

    // 禮金總額
    const totalGiftMoney = computed(() => {
      return responses.value.reduce((sum, r) => {
        return sum + (r.willAttend === 'yes' && r.giftMoney ? r.giftMoney : 0)
      }, 0)
    })

    // 男女方禮金統計
    const giftMoneyByGender = computed(() => {
      const stats = { groom: 0, bride: 0 }
      responses.value.forEach(r => {
        if (r.willAttend === 'yes' && r.giftMoney) {
          if (r.side === 'groom') {
            stats.groom += r.giftMoney
          } else {
            stats.bride += r.giftMoney
          }
        }
      })
      return stats
    })

    // 喜餅總數
    const totalCookies = computed(() => {
      return responses.value.reduce((sum, r) => {
        if (r.willAttend === 'yes') {
          const count = (r.cookieCount != null) ? r.cookieCount : defaultCookieCount.value
          return sum + count
        }
        return sum
      }, 0)
    })

    // 餐點統計
    const mealStats = computed(() => {
      const stats = { meat: 0, vegetarian: 0 }
      responses.value.forEach(r => {
        if (r.willAttend === 'yes') {
          if (r.mealType === '葷食') {
            stats.meat += r.attendees
          } else if (r.mealType === '素食') {
            stats.vegetarian += r.attendees
          }
        }
      })
      return stats
    })

    // 兒童座椅總數
    const childSeatCount = computed(() => {
      return responses.value.reduce((sum, r) => {
        return sum + (r.needChildSeat === 'yes' ? r.childSeatCount : 0)
      }, 0)
    })

    // 需要喜帖的數量
    const invitationCount = computed(() => {
      return responses.value.filter(r => r.needInvitation === 'yes').length
    })

    // 男女方統計
    const sideStats = computed(() => {
      const stats = {
        groom: { count: 0, attending: 0, totalAttendees: 0 },
        bride: { count: 0, attending: 0, totalAttendees: 0 }
      }

      responses.value.forEach(r => {
        const side = r.side === 'groom' ? 'groom' : 'bride'
        stats[side].count++
        if (r.willAttend === 'yes') {
          stats[side].attending++
          stats[side].totalAttendees += r.attendees || 0
        }
      })

      return stats
    })

    // 關係類型統計
    const relationshipStats = computed(() => {
      const stats = {}

      responses.value.forEach(r => {
        const rel = r.relationship || '未知'
        if (!stats[rel]) {
          stats[rel] = { count: 0, attendees: 0 }
        }
        stats[rel].count++
        if (r.willAttend === 'yes') {
          stats[rel].attendees += r.attendees || 0
        }
      })

      return stats
    })

    // 載入設定
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/config')
        if (response.ok) {
          const config = await response.json()
          defaultCookieCount.value = config.defaultCookieCount ?? 1
        }
      } catch (error) {
        console.error('載入設定錯誤：', error)
      }
    }

    // 載入資料
    const loadResponses = async () => {
      try {
        const response = await fetch('/api/responses')
        responses.value = await response.json()
      } catch (error) {
        console.error('載入資料錯誤：', error)
        alert('載入資料失敗')
      }
    }

    // 編輯資料
    const editResponse = (response) => {
      editingResponse.value = { ...response }
    }

    // 取消編輯
    const cancelEdit = () => {
      editingResponse.value = null
    }

    // 儲存編輯
    const saveEdit = async () => {
      if (!editingResponse.value) return

      try {
        const response = await fetch(`/api/responses/${editingResponse.value.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify(editingResponse.value)
        })

        if (response.ok) {
          await loadResponses()
          editingResponse.value = null
          alert('更新成功')
        } else {
          throw new Error('更新失敗')
        }
      } catch (error) {
        console.error('更新錯誤：', error)
        alert('更新失敗')
      }
    }

    // 刪除資料
    const deleteResponse = async (id) => {
      if (!confirm('確定要刪除這筆資料嗎？')) return

      try {
        const response = await fetch(`/api/responses/${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          await loadResponses()
          alert('刪除成功')
        } else {
          throw new Error('刪除失敗')
        }
      } catch (error) {
        console.error('刪除錯誤：', error)
        alert('刪除失敗')
      }
    }

    // 快速新增來賓
    const openAddGuest = () => {
      addingGuest.value = {
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
        cookieCount: defaultCookieCount.value,
        giftMoney: 0,
        note: ''
      }
    }

    const cancelAddGuest = () => {
      addingGuest.value = null
    }

    const saveAddGuest = async () => {
      if (!addingGuest.value.name.trim()) {
        alert('請輸入姓名')
        return
      }

      const finalRelationship = addingGuest.value.relationship === '其他' && addingGuest.value.customRelationship
        ? addingGuest.value.customRelationship
        : addingGuest.value.relationship

      const dataToSubmit = {
        name: addingGuest.value.name,
        phone: addingGuest.value.phone,
        relationship: finalRelationship,
        side: addingGuest.value.side,
        willAttend: addingGuest.value.willAttend,
        attendees: addingGuest.value.willAttend === 'yes' ? addingGuest.value.attendees : 0,
        mealType: addingGuest.value.willAttend === 'yes' ? addingGuest.value.mealType : '',
        needChildSeat: addingGuest.value.willAttend === 'yes' ? addingGuest.value.needChildSeat : 'no',
        childSeatCount: addingGuest.value.willAttend === 'yes' && addingGuest.value.needChildSeat === 'yes' ? addingGuest.value.childSeatCount : 0,
        cookieCount: addingGuest.value.willAttend === 'yes' ? (addingGuest.value.cookieCount ?? defaultCookieCount.value) : 0,
        needInvitation: 'no',
        invitationRecipient: '',
        invitationAddress: '',
        invitationPhone: '',
        blessing: '',
        giftMoney: addingGuest.value.giftMoney || 0,
        note: addingGuest.value.note
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
          addingGuest.value = null
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
    })

    return {
      responses,
      editingResponse,
      addingGuest,
      filter,
      defaultCookieCount,
      relationshipOptions,
      filteredResponses,
      attendanceStats,
      totalAttendees,
      estimatedTables,
      totalGiftMoney,
      giftMoneyByGender,
      totalCookies,
      mealStats,
      childSeatCount,
      invitationCount,
      sideStats,
      relationshipStats,
      loadResponses,
      editResponse,
      cancelEdit,
      saveEdit,
      deleteResponse,
      openAddGuest,
      cancelAddGuest,
      saveAddGuest
    }
  }
}
