import { ref, computed, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import draggable from 'vuedraggable'
import NavBar from '@/components/NavBar/NavBar.vue'

export default {
  name: 'SeatingChart',
  components: { NavBar, draggable },
  setup() {
    const tables = ref([])
    const responses = ref([])
    const selectedGuest = ref(null)
    const selectedTableIndex = ref(0)
    let assignModalInstance = null
    let seatsPerTable = 10
    let mainTableMaxSeats = 12

    const unassignedSeats = computed(() => {
      const assignedSeatIds = new Set()
      tables.value.forEach(table => {
        table.guests.forEach(seat => {
          if (seat.seatId) {
            assignedSeatIds.add(seat.seatId)
          }
        })
      })

      const seats = []
      const attendingGuests = responses.value.filter(r => r.willAttend === 'yes')

      attendingGuests.forEach(guest => {
        const attendeeCount = guest.attendees || 1
        for (let i = 1; i <= attendeeCount; i++) {
          const seatId = `${guest.id}-seat-${i}`
          if (!assignedSeatIds.has(seatId)) {
            seats.push({
              seatId: seatId,
              guestId: guest.id,
              guestName: guest.name,
              seatNumber: i,
              totalSeats: attendeeCount,
              side: guest.side,
              originalGuest: guest
            })
          }
        }
      })
      return seats
    })

    const unassignedGuests = computed(() => {
      const guestIds = new Set()
      unassignedSeats.value.forEach(seat => {
        guestIds.add(seat.guestId)
      })
      return responses.value.filter(r => guestIds.has(r.id))
    })

    const unassignedGuestsList = computed({
      get: () => unassignedSeats.value,
      set: () => {} // Read-only for draggable clone mode
    })

    function getCurrentSeats(table) {
      return table.guests.length
    }

    function getSideName(side) {
      return side === 'groom' ? '新郎' : '新娘'
    }

    function getSeatColorClass(table) {
      const current = getCurrentSeats(table)
      const max = table.maxSeats
      const ratio = current / max
      if (ratio >= 1) return 'text-danger'
      if (ratio >= 0.8) return 'text-warning'
      return 'text-success'
    }

    function cloneGuest(seat) {
      return { ...seat }
    }

    function getUnassignedSeatCount() {
      return unassignedSeats.value.length
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

    function showAssignModal(seat) {
      selectedGuest.value = seat
      selectedTableIndex.value = 0
      assignModalInstance.show()
    }

    function assignGuest() {
      if (selectedTableIndex.value === null) return

      const table = tables.value[selectedTableIndex.value]
      const currentSeats = getCurrentSeats(table)

      if (currentSeats + 1 > table.maxSeats) {
        alert(`座位不足！目前 ${currentSeats}/${table.maxSeats}`)
        return
      }

      table.guests.push(selectedGuest.value)
      assignModalInstance.hide()
    }

    function removeGuestFromTable(tableIndex, seatIndex) {
      tables.value[tableIndex].guests.splice(seatIndex, 1)
    }

    function autoArrange() {
      if (!confirm('自動安排將清空現有座位表，確定要繼續嗎？')) return

      tables.value = []

      const allSeats = unassignedSeats.value
      const groomSeats = allSeats.filter(s => s.side === 'groom')
      const brideSeats = allSeats.filter(s => s.side === 'bride')

      let tableNum = 1
      const createTable = (isMainTable = false) => ({
        name: isMainTable ? '主桌' : `第${tableNum++}桌`,
        maxSeats: isMainTable ? mainTableMaxSeats : seatsPerTable,
        guests: []
      })

      const arrangeSeats = (seats) => {
        let currentTable = createTable(tables.value.length === 0)
        tables.value.push(currentTable)

        seats.forEach(seat => {
          const current = getCurrentSeats(currentTable)

          if (current + 1 > currentTable.maxSeats) {
            currentTable = createTable()
            tables.value.push(currentTable)
          }

          currentTable.guests.push(seat)
        })
      }

      arrangeSeats(groomSeats)
      arrangeSeats(brideSeats)

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
      unassignedSeats,
      unassignedGuestsList,
      getCurrentSeats,
      getSideName,
      getSeatColorClass,
      cloneGuest,
      getUnassignedSeatCount,
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
