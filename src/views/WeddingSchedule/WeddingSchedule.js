import { ref, computed, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import NavBar from '@/components/NavBar/NavBar.vue'

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
      deleteSchedule
    }
  }
}
