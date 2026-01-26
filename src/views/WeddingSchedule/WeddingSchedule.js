import { ref, computed, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import NavBar from '@/components/NavBar/NavBar.vue'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export default {
  name: 'WeddingSchedule',
  components: { NavBar },
  setup() {
    const schedule = ref([])
    const editingSchedule = ref({})
    const isEditing = ref(false)
    let scheduleModalInstance = null

    const sortedSchedule = computed(() => {
      return [...schedule.value].sort((a, b) => {
        return new Date(a.datetime) - new Date(b.datetime)
      })
    })

    function formatDateTime(datetime) {
      if (!datetime) return ''
      const date = new Date(datetime)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}/${month}/${day} ${hours}:${minutes}`
    }

    async function loadSchedule() {
      try {
        const response = await fetch('/api/schedule')
        if (response.ok) {
          schedule.value = await response.json()
        }
      } catch (error) {
        console.error('載入流程資料失敗：', error)
      }
    }

    function openAddModal() {
      isEditing.value = false
      editingSchedule.value = {
        activityType: '訂婚',
        datetime: '',
        location: '',
        activityName: '',
        workDetails: '',
        staff: '',
        requiredItems: '',
        note: ''
      }
      scheduleModalInstance.show()
    }

    function openEditModal(item) {
      isEditing.value = true
      editingSchedule.value = { ...item }
      scheduleModalInstance.show()
    }

    async function saveSchedule() {
      try {
        const url = isEditing.value
          ? `/api/schedule/${editingSchedule.value.id}`
          : '/api/schedule'

        const response = await fetch(url, {
          method: isEditing.value ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editingSchedule.value)
        })

        if (response.ok) {
          await loadSchedule()
          scheduleModalInstance.hide()
          alert(isEditing.value ? '流程更新成功' : '流程新增成功')
        }
      } catch (error) {
        console.error('儲存流程失敗：', error)
        alert('儲存流程失敗')
      }
    }

    async function deleteSchedule(id) {
      if (!confirm('確定要刪除此流程嗎？')) return

      try {
        const response = await fetch(`/api/schedule/${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          await loadSchedule()
          alert('流程刪除成功')
        }
      } catch (error) {
        console.error('刪除流程失敗：', error)
        alert('刪除流程失敗')
      }
    }

    function buildScheduleTableHTML(items) {
      const theadStyle = 'background-color: #FF9999; color: #333;'
      const thStyle = 'border: 2px solid #333; padding: 8px; text-align: center; font-weight: bold;'

      let html = `
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="${theadStyle}">
              <th style="${thStyle} width: 80px;">類型</th>
              <th style="${thStyle} width: 140px;">日期時間</th>
              <th style="${thStyle} width: 100px;">地點</th>
              <th style="${thStyle} width: 120px;">活動名稱</th>
              <th style="${thStyle} width: 200px;">工作內容</th>
              <th style="${thStyle} width: 100px;">負責人員</th>
              <th style="${thStyle} width: 150px;">需求物品</th>
              <th style="${thStyle} width: 150px;">備註</th>
            </tr>
          </thead>
          <tbody>
      `

      items.forEach((item, index) => {
        const bgColor = index % 2 === 0 ? '#f9f9f9' : '#ffffff'
        const workDetails = (item.workDetails || '').replace(/\n/g, '<br>')
        const note = (item.note || '').replace(/\n/g, '<br>')
        const requiredItems = (item.requiredItems || '').replace(/\n/g, '<br>')

        html += `
          <tr style="background-color: ${bgColor};">
            <td style="border: 2px solid #333; padding: 8px; text-align: center;"><span style="background-color: #0dcaf0; color: #000; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${item.activityType || ''}</span></td>
            <td style="border: 2px solid #333; padding: 8px; text-align: center; white-space: nowrap;">${formatDateTime(item.datetime)}</td>
            <td style="border: 2px solid #333; padding: 8px; text-align: center;">${item.location || ''}</td>
            <td style="border: 2px solid #333; padding: 8px; text-align: center; font-weight: bold;">${item.activityName || ''}</td>
            <td style="border: 2px solid #333; padding: 8px; text-align: left;">${workDetails}</td>
            <td style="border: 2px solid #333; padding: 8px; text-align: center;">${item.staff || ''}</td>
            <td style="border: 2px solid #333; padding: 8px; text-align: left;">${requiredItems}</td>
            <td style="border: 2px solid #333; padding: 8px; text-align: left;">${note}</td>
          </tr>
        `
      })

      html += `
          </tbody>
        </table>
      `
      return html
    }

    async function exportToPDF() {
      try {
        if (sortedSchedule.value.length === 0) {
          alert('目前沒有流程資料可匯出')
          return
        }

        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        })

        const rowsPerPage = 15
        const allItems = sortedSchedule.value
        const totalPages = Math.ceil(allItems.length / rowsPerPage)

        for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
          if (pageIndex > 0) {
            pdf.addPage()
          }

          const container = document.createElement('div')
          container.style.position = 'absolute'
          container.style.left = '-9999px'
          container.style.top = '0'
          container.style.width = '1200px'
          container.style.backgroundColor = '#ffffff'
          container.style.padding = '20px'
          container.style.fontFamily = 'Microsoft YaHei, Arial, sans-serif'

          const startIndex = pageIndex * rowsPerPage
          const endIndex = Math.min(startIndex + rowsPerPage, allItems.length)
          const pageItems = allItems.slice(startIndex, endIndex)

          container.innerHTML = buildScheduleTableHTML(pageItems)
          document.body.appendChild(container)

          const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
          })

          document.body.removeChild(container)

          const imgData = canvas.toDataURL('image/png')
          const imgWidth = 297
          const imgHeight = (canvas.height * imgWidth) / canvas.width

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

        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
        const fileName = `訂結婚流程表_${timestamp}.pdf`
        pdf.save(fileName)

        alert('PDF匯出成功！')
      } catch (error) {
        console.error('PDF匯出錯誤：', error)
        alert('PDF匯出失敗：' + error.message)
      }
    }

    onMounted(async () => {
      await loadSchedule()
      const modalElement = document.getElementById('scheduleModal')
      if (modalElement) {
        scheduleModalInstance = new Modal(modalElement)
      }
    })

    return {
      schedule,
      editingSchedule,
      isEditing,
      sortedSchedule,
      formatDateTime,
      loadSchedule,
      openAddModal,
      openEditModal,
      saveSchedule,
      deleteSchedule,
      exportToPDF
    }
  }
}
