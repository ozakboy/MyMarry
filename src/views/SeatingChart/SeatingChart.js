import { ref, computed, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import NavBar from '@/components/NavBar/NavBar.vue'

export default {
  name: 'SeatingChart',
  components: { NavBar },
  setup() {
    const tables = ref([])
    const responses = ref([])
    const selectedGuest = ref(null)
    const selectedTableIndex = ref(0)
    let assignModalInstance = null
    let seatsPerTable = 10
    let mainTableMaxSeats = 12

    const unassignedGuests = computed(() => {
      const assignedIds = new Set()
      tables.value.forEach(table => {
        table.guests.forEach(guest => assignedIds.add(guest.id))
      })
      return responses.value.filter(r => !assignedIds.has(r.id))
    })

    function getCurrentSeats(table) {
      return table.guests.reduce((sum, g) => sum + (g.attendeeCount || 0), 0)
    }

    async function loadConfig() {
      try {
        const response = await fetch('/api/config')
        if (response.ok) {
          const config = await response.json()
          seatsPerTable = config.seatsPerTable || 10
          mainTableMaxSeats = 12
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
        console.error('載入賓客資料失敗：', error)
      }
    }

    async function loadSeating() {
      try {
        const response = await fetch('/api/seating')
        if (response.ok) {
          const data = await response.json()
          if (data.tables && data.tables.length > 0) {
            tables.value = data.tables
          }
        }
      } catch (error) {
        console.error('載入座位表失敗：', error)
      }
    }

    function addTable() {
      const tableNumber = tables.value.length + 1
      const isMainTable = tableNumber === 1
      tables.value.push({
        name: isMainTable ? '主桌' : `第${tableNumber}桌`,
        maxSeats: isMainTable ? mainTableMaxSeats : seatsPerTable,
        guests: []
      })
    }

    function removeTable(index) {
      if (!confirm('確定要刪除此桌次嗎？該桌的賓客將移回未安排列表。')) return
      tables.value.splice(index, 1)
    }

    function showAssignModal(guest) {
      selectedGuest.value = guest
      selectedTableIndex.value = 0
      assignModalInstance.show()
    }

    function assignGuest() {
      if (selectedTableIndex.value === null) return

      const table = tables.value[selectedTableIndex.value]
      const currentSeats = getCurrentSeats(table)
      const neededSeats = selectedGuest.value.attendeeCount || 0

      if (currentSeats + neededSeats > table.maxSeats) {
        alert(`座位不足！目前 ${currentSeats}/${table.maxSeats}，需要 ${neededSeats} 個座位`)
        return
      }

      table.guests.push(selectedGuest.value)
      assignModalInstance.hide()
    }

    function removeGuestFromTable(tableIndex, guestIndex) {
      tables.value[tableIndex].guests.splice(guestIndex, 1)
    }

    function autoArrange() {
      if (!confirm('自動安排將清空現有座位表，確定要繼續嗎？')) return

      tables.value = []

      const groomGuests = responses.value.filter(r => r.guestSide === '新郎')
      const brideGuests = responses.value.filter(r => r.guestSide === '新娘')

      let tableNum = 1
      const createTable = (isMainTable = false) => ({
        name: isMainTable ? '主桌' : `第${tableNum++}桌`,
        maxSeats: isMainTable ? mainTableMaxSeats : seatsPerTable,
        guests: []
      })

      const arrangeGuests = (guests) => {
        let currentTable = createTable(tables.value.length === 0)
        tables.value.push(currentTable)

        guests.forEach(guest => {
          const needed = guest.attendeeCount || 0
          const current = getCurrentSeats(currentTable)

          if (current + needed > currentTable.maxSeats) {
            currentTable = createTable()
            tables.value.push(currentTable)
          }

          currentTable.guests.push(guest)
        })
      }

      arrangeGuests(groomGuests)
      arrangeGuests(brideGuests)

      alert('自動安排完成！')
    }

    async function saveSeating() {
      try {
        const data = {
          tables: tables.value,
          unassigned: unassignedGuests.value.map(g => g.id)
        }

        const response = await fetch('/api/seating', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })

        if (response.ok) {
          alert('座位表儲存成功')
        }
      } catch (error) {
        console.error('儲存座位表失敗：', error)
        alert('儲存座位表失敗')
      }
    }

    onMounted(async () => {
      await loadConfig()
      await loadResponses()
      await loadSeating()

      const modalElement = document.getElementById('assignModal')
      if (modalElement) {
        assignModalInstance = new Modal(modalElement)
      }
    })

    return {
      tables,
      responses,
      selectedGuest,
      selectedTableIndex,
      unassignedGuests,
      getCurrentSeats,
      loadConfig,
      loadResponses,
      loadSeating,
      addTable,
      removeTable,
      showAssignModal,
      assignGuest,
      removeGuestFromTable,
      autoArrange,
      saveSeating
    }
  }
}
