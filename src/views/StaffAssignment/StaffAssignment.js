import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'

export default {
  name: 'StaffAssignment',
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
      deleteStaff
    }
  }
}
