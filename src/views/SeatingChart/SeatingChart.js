import { ref, computed, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import draggable from 'vuedraggable'
import NavBar from '@/components/NavBar/NavBar.vue'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
  name: 'SeatingChart',
  components: { NavBar, draggable },
  setup() {
    const tables = ref([])
    const responses = ref([])
    const selectedGuest = ref(null)
    const selectedTableIndex = ref(0)
    const editingTableIndex = ref(null)
    const editingTableName = ref('')
    const editingTableType = ref('')
    let assignModalInstance = null
    let editTableModalInstance = null
    let seatsPerTable = 10
    let mainTableMaxSeats = 12
    let nextTableId = 1

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
              mealType: guest.mealType,
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
      if (ratio > 1) return 'text-danger'
      if (ratio >= 1) return 'text-warning'
      if (ratio >= 0.8) return 'text-info'
      return 'text-success'
    }

    function getMealTypeBadgeClass(mealType) {
      if (mealType === '葷食') return 'bg-danger'
      if (mealType === '素食') return 'bg-success'
      return 'bg-secondary'
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
            // 為每個桌次添加 id 並修補缺少的 mealType
            tables.value = data.tables.map((table, index) => {
              // 為舊資料補充葷素資訊
              const updatedGuests = table.guests.map(seat => {
                if (!seat.mealType && seat.guestId) {
                  const originalGuest = responses.value.find(r => r.id === seat.guestId)
                  if (originalGuest && originalGuest.mealType) {
                    return { ...seat, mealType: originalGuest.mealType }
                  }
                }
                return seat
              })

              return {
                ...table,
                id: table.id || nextTableId++,
                guests: updatedGuests
              }
            })

            // 確保新郎新娘在主桌
            ensureBrideGroomInMainTable()
          }
        }
      } catch (error) {
        console.error('載入座位表失敗：', error)
      }
    }

    function ensureBrideGroomInMainTable() {
      // 找到主桌（第一桌或名稱包含「主桌」的桌次）
      let mainTable = tables.value.find(t => t.name.includes('主桌'))
      if (!mainTable && tables.value.length === 0) {
        // 如果沒有桌次，創建主桌
        mainTable = {
          id: nextTableId++,
          name: '主桌',
          maxSeats: mainTableMaxSeats,
          guests: [],
          tableType: ''
        }
        tables.value.push(mainTable)
      } else if (!mainTable && tables.value.length > 0) {
        mainTable = tables.value[0]
      }

      // 檢查主桌是否已有新郎新娘
      const hasGroom = mainTable.guests.some(g => g.seatId === 'groom-default')
      const hasBride = mainTable.guests.some(g => g.seatId === 'bride-default')

      if (!hasGroom) {
        mainTable.guests.unshift({
          seatId: 'groom-default',
          guestId: 'groom-default',
          guestName: '新郎',
          seatNumber: 1,
          totalSeats: 1,
          side: 'groom',
          mealType: '葷食'
        })
      }

      if (!hasBride) {
        mainTable.guests.unshift({
          seatId: 'bride-default',
          guestId: 'bride-default',
          guestName: '新娘',
          seatNumber: 1,
          totalSeats: 1,
          side: 'bride',
          mealType: '葷食'
        })
      }
    }

    function addTable() {
      const tableNumber = tables.value.length + 1
      const isMainTable = tableNumber === 1
      const newTable = {
        id: nextTableId++,
        name: isMainTable ? '主桌' : `第${tableNumber}桌`,
        maxSeats: isMainTable ? mainTableMaxSeats : seatsPerTable,
        guests: [],
        tableType: ''
      }

      // 如果是第一桌，添加新郎新娘
      if (isMainTable) {
        newTable.guests = [
          {
            seatId: 'bride-default',
            guestId: 'bride-default',
            guestName: '新娘',
            seatNumber: 1,
            totalSeats: 1,
            side: 'bride',
            mealType: '葷食'
          },
          {
            seatId: 'groom-default',
            guestId: 'groom-default',
            guestName: '新郎',
            seatNumber: 1,
            totalSeats: 1,
            side: 'groom',
            mealType: '葷食'
          }
        ]
      }

      tables.value.push(newTable)
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
        if (!confirm(`此桌將超過預設人數 (${currentSeats + 1}/${table.maxSeats})，確定要安排嗎？`)) {
          return
        }
      }

      table.guests.push(selectedGuest.value)
      assignModalInstance.hide()
    }

    function editTableName(tableIndex) {
      editingTableIndex.value = tableIndex
      const table = tables.value[tableIndex]
      editingTableName.value = table.name
      editingTableType.value = table.tableType || ''
      editTableModalInstance.show()
    }

    function saveTableEdit() {
      if (editingTableIndex.value !== null && editingTableName.value.trim()) {
        const table = tables.value[editingTableIndex.value]
        table.name = editingTableName.value.trim()
        table.tableType = editingTableType.value
        editTableModalInstance.hide()
        editingTableIndex.value = null
        editingTableName.value = ''
        editingTableType.value = ''
      }
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
      const createTable = (isMainTable = false) => {
        const table = {
          id: nextTableId++,
          name: isMainTable ? '主桌' : `第${tableNum++}桌`,
          maxSeats: isMainTable ? mainTableMaxSeats : seatsPerTable,
          guests: [],
          tableType: ''
        }

        // 如果是主桌，添加新郎新娘
        if (isMainTable) {
          table.guests = [
            {
              seatId: 'bride-default',
              guestId: 'bride-default',
              guestName: '新娘',
              seatNumber: 1,
              totalSeats: 1,
              side: 'bride',
              mealType: '葷食'
            },
            {
              seatId: 'groom-default',
              guestId: 'groom-default',
              guestName: '新郎',
              seatNumber: 1,
              totalSeats: 1,
              side: 'groom',
              mealType: '葷食'
            }
          ]
        }

        return table
      }

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

    function onTableReorder() {
      // 當桌次順序改變時，可以在這裡處理
      console.log('桌次順序已更新')
    }

    function exportToPDF() {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // 使用內建字體繪製中文（使用 Unicode 方式）
      doc.setFont('helvetica')

      // 設定標題
      doc.setFontSize(20)
      // 使用 text API 的 unicode 支援
      const title = '婚禮座位表'
      doc.text(title, 105, 15, { align: 'center' })

      doc.setFontSize(12)
      const dateText = `產生日期：${new Date().toLocaleDateString('zh-TW')}`
      doc.text(dateText, 105, 25, { align: 'center' })

      let yPosition = 35

      // 統計資訊
      const totalGuests = tables.value.reduce((sum, table) => sum + table.guests.length, 0)
      const totalVegetarian = tables.value.reduce((sum, table) =>
        sum + table.guests.filter(g => g.mealType === '素食').length, 0
      )
      const totalMeat = tables.value.reduce((sum, table) =>
        sum + table.guests.filter(g => g.mealType === '葷食').length, 0
      )

      doc.setFontSize(10)
      doc.text(`總座位數：${totalGuests} | 葷食：${totalMeat} | 素食：${totalVegetarian}`, 15, yPosition)
      yPosition += 10

      // 為每個桌次生成表格
      tables.value.forEach((table, tableIndex) => {
        // 檢查是否需要換頁
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 20
        }

        // 桌次標題
        doc.setFontSize(14)
        const tableTypeText = table.tableType === 'vegetarian' ? '(素桌)' : table.tableType === 'meat' ? '(葷桌)' : ''
        doc.text(`${table.name} ${tableTypeText}`, 15, yPosition)
        yPosition += 3

        doc.setFontSize(10)
        const vegetarianCount = table.guests.filter(g => g.mealType === '素食').length
        const meatCount = table.guests.filter(g => g.mealType === '葷食').length
        doc.text(`座位：${table.guests.length}/${table.maxSeats} | 葷：${meatCount} | 素：${vegetarianCount}`, 15, yPosition)
        yPosition += 7

        // 賓客列表
        if (table.guests.length > 0) {
          const tableData = table.guests.map((guest, index) => [
            (index + 1).toString(),
            guest.guestName,
            getSideName(guest.side),
            guest.mealType || '未設定',
            guest.seatNumber > 1 ? `${guest.seatNumber}/${guest.totalSeats}` : '-'
          ])

          doc.autoTable({
            startY: yPosition,
            head: [['#', '姓名', '方', '葷/素', '同行']],
            body: tableData,
            theme: 'grid',
            headStyles: {
              fillColor: [66, 139, 202],
              fontSize: 9,
              halign: 'center'
            },
            bodyStyles: {
              fontSize: 9,
              halign: 'center'
            },
            columnStyles: {
              0: { cellWidth: 10 },
              1: { cellWidth: 50, halign: 'left' },
              2: { cellWidth: 20 },
              3: { cellWidth: 20 },
              4: { cellWidth: 20 }
            },
            margin: { left: 15, right: 15 },
            didDrawPage: (data) => {
              yPosition = data.cursor.y + 5
            }
          })

          yPosition = doc.lastAutoTable.finalY + 10
        } else {
          doc.setFontSize(9)
          doc.setTextColor(150)
          doc.text('此桌尚無賓客', 15, yPosition)
          doc.setTextColor(0)
          yPosition += 10
        }
      })

      // 未安排座位
      if (unassignedSeats.value.length > 0) {
        if (yPosition > 220) {
          doc.addPage()
          yPosition = 20
        }

        doc.setFontSize(14)
        doc.text('未安排座位', 15, yPosition)
        yPosition += 7

        const unassignedData = unassignedSeats.value.map((seat, index) => [
          (index + 1).toString(),
          seat.guestName,
          getSideName(seat.side),
          seat.mealType || '未設定',
          seat.seatNumber > 1 ? `${seat.seatNumber}/${seat.totalSeats}` : '-'
        ])

        doc.autoTable({
          startY: yPosition,
          head: [['#', '姓名', '方', '葷/素', '同行']],
          body: unassignedData,
          theme: 'grid',
          headStyles: {
            fillColor: [217, 83, 79],
            fontSize: 9,
            halign: 'center'
          },
          bodyStyles: {
            fontSize: 9,
            halign: 'center'
          },
          columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 50, halign: 'left' },
            2: { cellWidth: 20 },
            3: { cellWidth: 20 },
            4: { cellWidth: 20 }
          },
          margin: { left: 15, right: 15 }
        })
      }

      // 儲存 PDF
      const fileName = `婚禮座位表_${new Date().toLocaleDateString('zh-TW').replace(/\//g, '')}.pdf`
      doc.save(fileName)
    }

    onMounted(async () => {
      await loadConfig()
      await loadResponses()
      await loadSeating()

      const assignModalElement = document.getElementById('assignModal')
      if (assignModalElement) {
        assignModalInstance = new Modal(assignModalElement)
      }

      const editTableModalElement = document.getElementById('editTableModal')
      if (editTableModalElement) {
        editTableModalInstance = new Modal(editTableModalElement)
      }
    })

    return {
      tables,
      responses,
      selectedGuest,
      selectedTableIndex,
      editingTableIndex,
      editingTableName,
      editingTableType,
      unassignedGuests,
      unassignedSeats,
      unassignedGuestsList,
      getCurrentSeats,
      getSideName,
      getSeatColorClass,
      getMealTypeBadgeClass,
      cloneGuest,
      getUnassignedSeatCount,
      loadConfig,
      loadResponses,
      loadSeating,
      addTable,
      removeTable,
      showAssignModal,
      assignGuest,
      editTableName,
      saveTableEdit,
      removeGuestFromTable,
      autoArrange,
      saveSeating,
      onTableReorder,
      exportToPDF
    }
  }
}
