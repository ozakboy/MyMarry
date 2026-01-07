import { ref, onMounted } from 'vue'

export default {
  name: 'Settings',
  setup() {
    const isSaving = ref(false)
    const weddingConfig = ref({
      groom: {
        name: '',
        fullName: ''
      },
      bride: {
        name: '',
        fullName: ''
      },
      wedding: {
        date: '',
        dayOfWeek: '',
        time: '',
        venue: {
          name: '',
          type: '',
          address: '',
          floor: '',
          phone: '',
          googleMapUrl: ''
        }
      },
      invitation: {
        greeting: '',
        message: '',
        rsvpText: ''
      },
      contact: {
        groomPhone: '',
        bridePhone: '',
        email: ''
      },
      defaultCookieCount: 1,
      seatsPerTable: 10
    })

    // 載入設定
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/config')
        const config = await response.json()
        weddingConfig.value = config
      } catch (error) {
        console.error('載入設定錯誤:', error)
        alert('載入設定失敗')
      }
    }

    // 儲存設定
    const saveConfig = async () => {
      isSaving.value = true

      try {
        const response = await fetch('/api/config', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify(weddingConfig.value)
        })

        if (response.ok) {
          alert('設定儲存成功! ✅')
        } else {
          throw new Error('儲存失敗')
        }
      } catch (error) {
        console.error('儲存設定錯誤:', error)
        alert('儲存設定失敗')
      } finally {
        isSaving.value = false
      }
    }

    onMounted(() => {
      loadConfig()
    })

    return {
      isSaving,
      weddingConfig,
      loadConfig,
      saveConfig
    }
  }
}
