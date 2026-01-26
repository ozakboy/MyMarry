import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import NavBar from '@/components/NavBar/NavBar.vue'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export default {
  name: 'StaffAssignment',
  components: { NavBar },
  setup() {
    const staffList = ref([])
    const editingStaff = ref({})
    const isEditing = ref(false)
    let staffModalInstance = null

    async function loadStaff() {
      try {
        const response = await fetch('/api/staff')
        if (response.ok) {
          staffList.value = await response.json()
        }
      } catch (error) {
        console.error('載入人員配置失敗：', error)
      }
    }

    function openAddModal() {
      isEditing.value = false
      editingStaff.value = {
        name: '',
        personnel: '',
        responsibilities: '',
        note: ''
      }
      staffModalInstance.show()
    }

    function openEditModal(staff) {
      isEditing.value = true
      editingStaff.value = { ...staff }
      staffModalInstance.show()
    }

    async function saveStaff() {
      try {
        const url = isEditing.value
          ? `/api/staff/${editingStaff.value.id}`
          : '/api/staff'

        const response = await fetch(url, {
          method: isEditing.value ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editingStaff.value)
        })

        if (response.ok) {
          await loadStaff()
          staffModalInstance.hide()
          alert(isEditing.value ? '人員配置更新成功' : '人員配置新增成功')
        }
      } catch (error) {
        console.error('儲存人員配置失敗：', error)
        alert('儲存人員配置失敗')
      }
    }

    async function deleteStaff(id) {
      if (!confirm('確定要刪除此人員配置嗎？')) return

      try {
        const response = await fetch(`/api/staff/${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          await loadStaff()
          alert('人員配置刪除成功')
        }
      } catch (error) {
        console.error('刪除人員配置失敗：', error)
        alert('刪除人員配置失敗')
      }
    }

    async function exportToPDF() {
      try {
        if (staffList.value.length === 0) {
          alert('目前沒有人員配置資料可匯出')
          return
        }

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        })

        const container = document.createElement('div')
        container.style.position = 'absolute'
        container.style.left = '-9999px'
        container.style.top = '0'
        container.style.width = '800px'
        container.style.backgroundColor = '#ffffff'
        container.style.padding = '20px'
        container.style.fontFamily = 'Microsoft YaHei, Arial, sans-serif'

        let htmlContent = `
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="font-size: 28px; margin-bottom: 10px; font-weight: bold;">人員配置表</h1>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="background-color: #FF9999; color: #333;">
                <th style="border: 2px solid #333; padding: 10px; text-align: center; width: 60px; font-weight: bold;">序號</th>
                <th style="border: 2px solid #333; padding: 10px; text-align: center; width: 120px; font-weight: bold;">名稱</th>
                <th style="border: 2px solid #333; padding: 10px; text-align: center; width: 150px; font-weight: bold;">人員</th>
                <th style="border: 2px solid #333; padding: 10px; text-align: center; width: 280px; font-weight: bold;">職責</th>
                <th style="border: 2px solid #333; padding: 10px; text-align: center; width: 180px; font-weight: bold;">備註</th>
              </tr>
            </thead>
            <tbody>
        `

        staffList.value.forEach((staff, index) => {
          const bgColor = index % 2 === 0 ? '#f9f9f9' : '#ffffff'
          const responsibilities = (staff.responsibilities || '').replace(/\n/g, '<br>')
          const note = (staff.note || '').replace(/\n/g, '<br>')

          htmlContent += `
            <tr style="background-color: ${bgColor};">
              <td style="border: 2px solid #333; padding: 10px; text-align: center;">${index + 1}</td>
              <td style="border: 2px solid #333; padding: 10px; text-align: center; font-weight: bold;">${staff.name || ''}</td>
              <td style="border: 2px solid #333; padding: 10px; text-align: center;">${staff.personnel || ''}</td>
              <td style="border: 2px solid #333; padding: 10px; text-align: left;">${responsibilities}</td>
              <td style="border: 2px solid #333; padding: 10px; text-align: left;">${note}</td>
            </tr>
          `
        })

        htmlContent += `
            </tbody>
          </table>
        `

        container.innerHTML = htmlContent
        document.body.appendChild(container)

        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        })

        document.body.removeChild(container)

        const imgData = canvas.toDataURL('image/png')
        const imgWidth = 210 // A4 直式寬度
        const pageHeight = 297 // A4 直式高度
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // 如果內容超過一頁，自動分頁
        if (imgHeight > pageHeight) {
          let heightLeft = imgHeight
          let position = 0

          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight

          while (heightLeft > 0) {
            position -= pageHeight
            pdf.addPage()
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight
          }
        } else {
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
        }

        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
        const fileName = `人員配置表_${timestamp}.pdf`
        pdf.save(fileName)

        alert('PDF匯出成功！')
      } catch (error) {
        console.error('PDF匯出錯誤：', error)
        alert('PDF匯出失敗：' + error.message)
      }
    }

    onMounted(async () => {
      await loadStaff()
      const modalElement = document.getElementById('staffModal')
      if (modalElement) {
        staffModalInstance = new Modal(modalElement)
      }
    })

    return {
      staffList,
      editingStaff,
      isEditing,
      loadStaff,
      openAddModal,
      openEditModal,
      saveStaff,
      deleteStaff,
      exportToPDF
    }
  }
}
