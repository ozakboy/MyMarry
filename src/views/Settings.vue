<template>
  <div class="min-vh-100" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);">
    <!-- 導航列 -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container-fluid">
        <router-link to="/MarryList" class="navbar-brand fw-bold" style="color: #5f9ea0;">
          💒 婚禮管理系統
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/MarryList" class="nav-link">出席名單</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/QuickView" class="nav-link">快速查詢</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/Expenses" class="nav-link">花費統計</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/WeddingSchedule" class="nav-link">婚禮流程</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/StaffAssignment" class="nav-link">人員配置</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/SeatingChart" class="nav-link">座位表</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/Settings" class="nav-link active">系統設定</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- 主要內容 -->
    <div class="container py-3 py-sm-4 py-md-5">
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-8">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-3 p-sm-4 p-md-5">
              <div class="mb-4">
                <h2 class="fw-bold mb-0" style="color: #5f9ea0;">⚙️ 系統設定</h2>
              </div>

              <!-- 新人資訊 -->
              <div class="card mb-4">
                <div class="card-header bg-primary text-white">
                  <h5 class="mb-0">💑 新人資訊</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label fw-bold">新郎名字</label>
                      <input type="text" class="form-control" v-model="weddingConfig.groom.name">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-bold">新郎全名</label>
                      <input type="text" class="form-control" v-model="weddingConfig.groom.fullName">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-bold">新娘名字</label>
                      <input type="text" class="form-control" v-model="weddingConfig.bride.name">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-bold">新娘全名</label>
                      <input type="text" class="form-control" v-model="weddingConfig.bride.fullName">
                    </div>
                  </div>
                </div>
              </div>

              <!-- 婚禮基本資訊 -->
              <div class="card mb-4">
                <div class="card-header" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                  <h5 class="mb-0 text-white">💒 婚禮基本資訊</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label fw-bold">婚禮日期</label>
                      <input type="text" class="form-control" v-model="weddingConfig.wedding.date" placeholder="例: 2025年02月07日">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-bold">星期幾</label>
                      <input type="text" class="form-control" v-model="weddingConfig.wedding.dayOfWeek" placeholder="例: 星期六">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-bold">婚禮時間</label>
                      <input type="text" class="form-control" v-model="weddingConfig.wedding.time" placeholder="例: 晚上 6:00">
                    </div>
                  </div>
                </div>
              </div>

              <!-- 宴客場地資訊 -->
              <div class="card mb-4">
                <div class="card-header bg-warning text-dark">
                  <h5 class="mb-0">🏛️ 宴客場地資訊</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label fw-bold">場地名稱</label>
                      <input type="text" class="form-control" v-model="weddingConfig.wedding.venue.name">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-bold">場地類型</label>
                      <input type="text" class="form-control" v-model="weddingConfig.wedding.venue.type" placeholder="例: 餐廳、飯店">
                    </div>
                    <div class="col-md-12">
                      <label class="form-label fw-bold">場地地址</label>
                      <input type="text" class="form-control" v-model="weddingConfig.wedding.venue.address">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-bold">樓層/廳別</label>
                      <input type="text" class="form-control" v-model="weddingConfig.wedding.venue.floor" placeholder="例: 宴會廳">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-bold">場地電話</label>
                      <input type="text" class="form-control" v-model="weddingConfig.wedding.venue.phone">
                    </div>
                    <div class="col-md-12">
                      <label class="form-label fw-bold">Google 地圖連結</label>
                      <input type="text" class="form-control" v-model="weddingConfig.wedding.venue.googleMapUrl">
                    </div>
                  </div>
                </div>
              </div>

              <!-- 邀請函文字 -->
              <div class="card mb-4">
                <div class="card-header bg-secondary text-white">
                  <h5 class="mb-0">✉️ 邀請函文字</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-12">
                      <label class="form-label fw-bold">開頭問候語</label>
                      <input type="text" class="form-control" v-model="weddingConfig.invitation.greeting" placeholder="例: 親愛的朋友：">
                    </div>
                    <div class="col-md-12">
                      <label class="form-label fw-bold">邀請訊息</label>
                      <textarea class="form-control" rows="3" v-model="weddingConfig.invitation.message" placeholder="邀請訊息內容"></textarea>
                    </div>
                    <div class="col-md-12">
                      <label class="form-label fw-bold">回覆提示文字</label>
                      <textarea class="form-control" rows="2" v-model="weddingConfig.invitation.rsvpText" placeholder="回覆提示文字"></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 聯絡資訊 -->
              <div class="card mb-4">
                <div class="card-header bg-dark text-white">
                  <h5 class="mb-0">📞 聯絡資訊</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label fw-bold">新郎電話</label>
                      <input type="text" class="form-control" v-model="weddingConfig.contact.groomPhone">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-bold">新娘電話</label>
                      <input type="text" class="form-control" v-model="weddingConfig.contact.bridePhone">
                    </div>
                    <div class="col-md-12">
                      <label class="form-label fw-bold">聯絡信箱</label>
                      <input type="email" class="form-control" v-model="weddingConfig.contact.email">
                    </div>
                  </div>
                </div>
              </div>

              <!-- 喜餅設定 -->
              <div class="card mb-4">
                <div class="card-header bg-info text-white">
                  <h5 class="mb-0">🍪 喜餅數量設定</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label fw-bold">每家庭預設喜餅數量</label>
                      <input type="number" class="form-control" v-model.number="weddingConfig.defaultCookieCount" min="0">
                      <small class="text-muted">出席家庭預設會收到的喜餅數量,可在管理頁面個別調整</small>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 其他設定 -->
              <div class="card mb-4">
                <div class="card-header bg-success text-white">
                  <h5 class="mb-0">📋 其他設定</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label fw-bold">每桌人數</label>
                      <input type="number" class="form-control" v-model.number="weddingConfig.seatsPerTable" min="1">
                      <small class="text-muted">用於計算預計桌數</small>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 儲存按鈕 -->
              <div class="d-grid gap-2">
                <button class="btn btn-primary btn-lg" @click="saveConfig" :disabled="isSaving">
                  <span v-if="!isSaving">💾 儲存設定</span>
                  <span v-else>
                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                    儲存中...
                  </span>
                </button>
              </div>

              <!-- 提示訊息 -->
              <div class="alert alert-info mt-3 mb-0">
                <small>
                  <strong>📌 提示：</strong>
                  修改後請點擊「儲存設定」按鈕，設定會立即生效於首頁和表單頁面。
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

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
    console.error('載入設定錯誤：', error)
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
    console.error('儲存設定錯誤：', error)
    alert('儲存設定失敗')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  loadConfig()
})
</script>

<style scoped>
/* 導航列樣式 */
.navbar {
  margin-bottom: 0;
}

.navbar-brand {
  font-size: 1.25rem;
}

.nav-link {
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #5f9ea0 !important;
  transform: translateY(-2px);
}

.nav-link.active {
  color: #5f9ea0 !important;
  font-weight: 600;
}

/* 卡片樣式 */
.card {
  transition: transform 0.2s;
}

.form-control:focus,
.form-select:focus {
  border-color: #5f9ea0;
  box-shadow: 0 0 0 0.25rem rgba(95, 158, 160, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #5f9ea0 0%, #4a7a7c 100%);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #4a7a7c 0%, #3d6365 100%);
}

@media (max-width: 768px) {
  .navbar-brand {
    font-size: 1rem;
  }
}
</style>
