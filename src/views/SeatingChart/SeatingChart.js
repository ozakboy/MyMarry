import { ref, computed, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import draggable from 'vuedraggable'
import NavBar from '@/components/NavBar/NavBar.vue'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

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

    async function exportToPDF() {
      try {
        // 找出最多賓客的桌次數量，以決定需要多少欄位
        const maxGuests = Math.max(...tables.value.map(t => t.guests.length), 1)

        // 建立 PDF
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        })

        const tablesPerPage = 10
        const totalPages = Math.ceil(tables.value.length / tablesPerPage)

        // 為每一頁生成內容
        for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
          if (pageIndex > 0) {
            pdf.addPage()
          }

          // 建立臨時的 HTML 容器
          const container = document.createElement('div')
          container.style.position = 'absolute'
          container.style.left = '-9999px'
          container.style.top = '0'
          container.style.width = '1200px'
          container.style.backgroundColor = '#ffffff'
          container.style.padding = '20px'
          container.style.fontFamily = 'Microsoft YaHei, Arial, sans-serif'

          // 取得當前頁面的桌次
          const startIndex = pageIndex * tablesPerPage
          const endIndex = Math.min(startIndex + tablesPerPage, tables.value.length)
          const currentPageTables = tables.value.slice(startIndex, endIndex)

          // 組裝 HTML 內容
          let htmlContent = `
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="font-size: 28px; margin-bottom: 10px; font-weight: bold;">婚禮座位表</h1>
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="background-color: #FF9999; color: #333;">
                  <th style="border: 2px solid #333; padding: 8px; text-align: center; width: 60px; font-weight: bold;">桌次</th>
                  <th style="border: 2px solid #333; padding: 8px; text-align: center; width: 100px; font-weight: bold;">桌名</th>
          `

          // 動態生成賓客欄位標題
          for (let i = 1; i <= maxGuests; i++) {
            htmlContent += `<th style="border: 2px solid #333; padding: 8px; text-align: center; font-weight: bold;">賓客${i}</th>`
          }

          htmlContent += `
                </tr>
              </thead>
              <tbody>
          `

          // 為每個桌次生成內容
          currentPageTables.forEach((table, relativeIndex) => {
            const tableIndex = startIndex + relativeIndex
            const tableNumber = `第${tableIndex + 1}桌`
            const tableTypeText = table.tableType === 'vegetarian' ? ' (素桌)' : table.tableType === 'meat' ? ' (葷桌)' : ''
            const tableName = table.name + tableTypeText

            htmlContent += `
              <tr style="background-color: ${relativeIndex % 2 === 0 ? '#f9f9f9' : '#ffffff'};">
                <td style="border: 2px solid #333; padding: 8px; text-align: center; font-weight: bold;">${tableNumber}</td>
                <td style="border: 2px solid #333; padding: 8px; text-align: center; font-weight: bold; white-space: nowrap;">${tableName}</td>
            `

            // 填入賓客名字
            for (let i = 0; i < maxGuests; i++) {
              const guestName = table.guests[i] ? (table.guests[i].guestName || '') : ''
              const cellStyle = guestName ? '' : 'color: #ccc;'
              htmlContent += `<td style="border: 2px solid #333; padding: 8px; text-align: center; white-space: nowrap; ${cellStyle}">${guestName || '-'}</td>`
            }

            htmlContent += `</tr>`
          })

          htmlContent += `
              </tbody>
            </table>
          `

          container.innerHTML = htmlContent
          document.body.appendChild(container)

          // 使用 html2canvas 將 HTML 轉換為圖片
          const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
          })

          // 移除臨時容器
          document.body.removeChild(container)

          // 將圖片加入 PDF
          const imgData = canvas.toDataURL('image/png')
          const imgWidth = 297 // A4 橫式寬度
          const imgHeight = (canvas.height * imgWidth) / canvas.width

          // 如果圖片高度超過頁面，需要縮放
          if (imgHeight > 210) {
            const scale = 210 / imgHeight
            const scaledWidth = imgWidth * scale
            const scaledHeight = 210
            const xOffset = (297 - scaledWidth) / 2
            pdf.addImage(imgData, 'PNG', xOffset, 0, scaledWidth, scaledHeight)
          } else {
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
          }
        }

        // 儲存 PDF
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
        const fileName = `婚禮座位表_${timestamp}.pdf`
        pdf.save(fileName)

        alert('PDF匯出成功！')
      } catch (error) {
        console.error('PDF匯出錯誤：', error)
        alert('PDF匯出失敗：' + error.message)
      }
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
