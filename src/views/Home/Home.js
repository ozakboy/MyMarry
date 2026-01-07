import { ref, onMounted } from 'vue'

export default {
  name: 'Home',
  setup() {
    const weddingInfo = ref(null)

    onMounted(async () => {
      try {
        const response = await fetch('/api/config')
        weddingInfo.value = await response.json()
      } catch (error) {
        console.error('載入婚禮資訊失敗:', error)
        // 如果 API 失敗,嘗試從靜態檔案讀取（開發環境備用）
        try {
          const fallbackResponse = await fetch('/wedding-config.json')
          weddingInfo.value = await fallbackResponse.json()
        } catch (fallbackError) {
          console.error('備用載入也失敗:', fallbackError)
        }
      }
    })

    return {
      weddingInfo
    }
  }
}
