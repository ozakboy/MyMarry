<template>
  <div class="min-vh-100" style="background: linear-gradient(135deg, #ffd1dc 0%, #ffb6c1 100%);">
    <!-- 導航列 -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container-fluid">
        <router-link to="/MarryList" class="navbar-brand fw-bold" style="color: #d4357f;">
          💒 婚禮管理系統
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                    <router-link to="/MarryList" class="nav-link active">出席名單</router-link>
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
                    <router-link to="/Settings" class="nav-link">系統設定</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/" class="nav-link">
                        🏠 返回首頁
                    </router-link>
                </li>
            </ul>
        </div>
      </div>
    </nav>

    <!-- 主要內容 -->
    <div class="container-fluid py-3 py-sm-4 py-md-5">
      <div class="row justify-content-center">
        <div class="col-12 col-xl-11">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-3 p-sm-4 p-md-5">
              <!-- 標題和篩選器 -->
              <div class="mb-3 mb-md-4">
                <div class="mb-3">
                  <h2 class="fw-bold mb-0" style="color: #d4357f;">📊 出席回覆管理</h2>
                </div>

                <!-- 快速篩選 -->
                <div class="btn-group w-100" role="group">
                  <button type="button" class="btn" :class="filter === 'all' ? 'btn-primary' : 'btn-outline-primary'" @click="filter = 'all'">
                    全部 ({{ responses.length }})
                  </button>
                  <button type="button" class="btn" :class="filter === 'groom' ? 'btn-primary' : 'btn-outline-primary'" @click="filter = 'groom'">
                    🤵 男方 ({{ sideStats.groom.count }})
                  </button>
                  <button type="button" class="btn" :class="filter === 'bride' ? 'btn-primary' : 'btn-outline-primary'" @click="filter = 'bride'">
                    👰 女方 ({{ sideStats.bride.count }})
                  </button>
                </div>
              </div>

              <!-- 統計總覽 - 重新設計 -->
              <div class="row g-3 mb-4">
                <!-- 第一行:基本統計 -->
                <div class="col-12">
                  <div class="card border-0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <div class="card-body text-white">
                      <h5 class="card-title mb-3">📈 總體統計</h5>
                      <div class="row g-3 text-center">
                        <div class="col-6 col-md-3">
                          <div class="stat-item">
                            <div class="stat-label">總回覆</div>
                            <div class="stat-value">{{ responses.length }}</div>
                          </div>
                        </div>
                        <div class="col-6 col-md-3">
                          <div class="stat-item">
                            <div class="stat-label">出席人數</div>
                            <div class="stat-value">{{ totalAttendees }}</div>
                          </div>
                        </div>
                        <div class="col-6 col-md-3">
                          <div class="stat-item">
                            <div class="stat-label">預計桌數</div>
                            <div class="stat-value">{{ estimatedTables }}</div>
                          </div>
                        </div>
                        <div class="col-6 col-md-3">
                          <div class="stat-item">
                            <div class="stat-label">禮金總額</div>
                            <div class="stat-value">{{ totalGiftMoney.toLocaleString() }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 第二行:出席/餐點/需求 -->
                <div class="col-md-4">
                  <div class="card h-100">
                    <div class="card-header bg-light">
                      <h6 class="mb-0">👥 出席狀況</h6>
                    </div>
                    <div class="card-body">
                      <div class="d-flex justify-content-around">
                        <div class="text-center">
                          <div class="text-success fs-4 fw-bold">{{ attendanceStats.willAttend }}</div>
                          <small class="text-muted">出席</small>
                        </div>
                        <div class="text-center">
                          <div class="text-danger fs-4 fw-bold">{{ attendanceStats.wontAttend }}</div>
                          <small class="text-muted">不出席</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="card h-100">
                    <div class="card-header bg-light">
                      <h6 class="mb-0">🍽️ 餐點統計</h6>
                    </div>
                    <div class="card-body">
                      <div class="d-flex justify-content-around">
                        <div class="text-center">
                          <div class="fs-4 fw-bold">{{ mealStats.meat }}</div>
                          <small class="text-muted">葷食</small>
                        </div>
                        <div class="text-center">
                          <div class="fs-4 fw-bold">{{ mealStats.vegetarian }}</div>
                          <small class="text-muted">素食</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="card h-100">
                    <div class="card-header bg-light">
                      <h6 class="mb-0">📦 需求統計</h6>
                    </div>
                    <div class="card-body">
                      <div class="d-flex justify-content-around">
                        <div class="text-center">
                          <div class="fs-4 fw-bold">{{ childSeatCount }}</div>
                          <small class="text-muted">座椅</small>
                        </div>
                        <div class="text-center">
                          <div class="fs-4 fw-bold">{{ invitationCount }}</div>
                          <small class="text-muted">喜帖</small>
                        </div>
                        <div class="text-center">
                          <div class="fs-4 fw-bold">{{ totalCookies }}</div>
                          <small class="text-muted">喜餅</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 第三行:男女方統計 -->
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-header text-white" style="background-color: #d4357f;">
                      <h6 class="mb-0">🤵 男方賓客</h6>
                    </div>
                    <div class="card-body">
                      <div class="row text-center g-3">
                        <div class="col-3">
                          <div class="text-muted small">回覆</div>
                          <div class="fw-bold">{{ sideStats.groom.count }}</div>
                        </div>
                        <div class="col-3">
                          <div class="text-muted small">出席</div>
                          <div class="fw-bold">{{ sideStats.groom.attending }}</div>
                        </div>
                        <div class="col-3">
                          <div class="text-muted small">人數</div>
                          <div class="fw-bold">{{ sideStats.groom.totalAttendees }}</div>
                        </div>
                        <div class="col-3">
                          <div class="text-muted small">禮金</div>
                          <div class="fw-bold text-success">{{ giftMoneyByGender.groom.toLocaleString() }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="card">
                    <div class="card-header text-white" style="background-color: #ff69b4;">
                      <h6 class="mb-0">👰 女方賓客</h6>
                    </div>
                    <div class="card-body">
                      <div class="row text-center g-3">
                        <div class="col-3">
                          <div class="text-muted small">回覆</div>
                          <div class="fw-bold">{{ sideStats.bride.count }}</div>
                        </div>
                        <div class="col-3">
                          <div class="text-muted small">出席</div>
                          <div class="fw-bold">{{ sideStats.bride.attending }}</div>
                        </div>
                        <div class="col-3">
                          <div class="text-muted small">人數</div>
                          <div class="fw-bold">{{ sideStats.bride.totalAttendees }}</div>
                        </div>
                        <div class="col-3">
                          <div class="text-muted small">禮金</div>
                          <div class="fw-bold text-success">{{ giftMoneyByGender.bride.toLocaleString() }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 關係類型統計 -->
                <div class="col-12">
                  <div class="card">
                    <div class="card-header text-white" style="background-color: #ffb6c1;">
                      <h6 class="mb-0">👥 關係類型統計</h6>
                    </div>
                    <div class="card-body">
                      <div class="row g-3">
                        <div class="col-6 col-md-2" v-for="(stat, rel) in relationshipStats" :key="rel">
                          <div class="text-center">
                            <small class="text-muted d-block">{{ rel }}</small>
                            <div class="fw-bold">{{ stat.count }}組</div>
                            <small class="text-muted">{{ stat.attendees }}人</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 資料表格（桌面版） -->
              <div class="table-responsive d-none d-lg-block">
                <table class="table table-hover align-middle">
                  <thead class="table-light">
                    <tr>
                      <th style="min-width: 100px;">姓名</th>
                      <th style="min-width: 110px;">電話</th>
                      <th>關係</th>
                      <th>賓客</th>
                      <th>出席</th>
                      <th>人數</th>
                      <th>餐點</th>
                      <th>座椅</th>
                      <th style="min-width: 100px;">禮金</th>
                      <th style="min-width: 80px;">喜餅</th>
                      <th style="min-width: 200px;">喜帖資訊</th>
                      <th style="min-width: 120px;">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="response in filteredResponses" :key="response.id">
                      <td class="fw-bold">{{ response.name }}</td>
                      <td>{{ response.phone }}</td>
                      <td>{{ response.relationship }}</td>
                      <td>
                        <span class="badge" :style="response.side === 'groom' ? 'background-color: #d4357f;' : 'background-color: #ff69b4;'">
                          {{ response.side === 'groom' ? '🤵 男方' : '👰 女方' }}
                        </span>
                      </td>
                      <td>
                        <span :class="response.willAttend === 'yes' ? 'badge bg-success' : 'badge bg-secondary'">
                          {{ response.willAttend === 'yes' ? '✅ 出席' : '❌ 不出席' }}
                        </span>
                      </td>
                      <td>{{ response.attendees || 0 }}</td>
                      <td>{{ response.mealType || '-' }}</td>
                      <td>
                        {{ response.needChildSeat === 'yes' ? `✅ ${response.childSeatCount}張` : '❌' }}
                      </td>
                      <td>
                        <span v-if="response.giftMoney" class="text-success fw-bold">
                          ${{ response.giftMoney.toLocaleString() }}
                        </span>
                        <span v-else class="text-muted">-</span>
                      </td>
                      <td>
                        <span class="badge bg-info">{{ response.cookieCount || defaultCookieCount }}</span>
                      </td>
                      <td>
                        <div v-if="response.needInvitation === 'yes'">
                          <span class="badge bg-success mb-1">✅ 需要</span>
                          <div class="small">
                            <div><strong>收件人:</strong> {{ response.invitationRecipient }}</div>
                            <div><strong>電話:</strong> {{ response.invitationPhone }}</div>
                            <div><strong>地址:</strong> {{ response.invitationAddress }}</div>
                          </div>
                        </div>
                        <span v-else class="badge bg-secondary">❌ 不需要</span>
                      </td>
                      <td>
                        <div class="btn-group-vertical w-100" role="group">
                          <button @click="editResponse(response)" class="btn btn-sm btn-outline-primary mb-1">
                            編輯
                          </button>
                          <button @click="deleteResponse(response.id)" class="btn btn-sm btn-outline-danger">
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- 卡片列表（手機版） -->
              <div class="d-lg-none">
                <div v-for="response in filteredResponses" :key="response.id" class="card mb-3">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                      <h5 class="card-title mb-0">{{ response.name }}</h5>
                      <span :class="response.willAttend === 'yes' ? 'badge bg-success' : 'badge bg-secondary'">
                        {{ response.willAttend === 'yes' ? '✅ 出席' : '❌ 不出席' }}
                      </span>
                    </div>

                    <div class="mb-2">
                      <small class="text-muted">
                        <div><strong>電話：</strong>{{ response.phone }}</div>
                        <div><strong>關係：</strong>{{ response.relationship }}</div>
                        <div>
                          <strong>賓客：</strong>
                          <span class="badge" :style="response.side === 'groom' ? 'background-color: #d4357f;' : 'background-color: #ff69b4;'">
                            {{ response.side === 'groom' ? '🤵 男方' : '👰 女方' }}
                          </span>
                        </div>
                      </small>
                    </div>

                    <div v-if="response.willAttend === 'yes'" class="mb-2">
                      <small class="text-muted">
                        <div><strong>人數：</strong>{{ response.attendees }}人</div>
                        <div><strong>餐點：</strong>{{ response.mealType }}</div>
                        <div><strong>兒童座椅：</strong>{{ response.needChildSeat === 'yes' ? `需要 ${response.childSeatCount}張` : '不需要' }}</div>
                        <div v-if="response.giftMoney"><strong>禮金：</strong><span class="text-success fw-bold">${{ response.giftMoney.toLocaleString() }}</span></div>
                        <div><strong>喜餅：</strong>{{ response.cookieCount || defaultCookieCount }}個</div>
                      </small>
                    </div>

                    <div v-if="response.needInvitation === 'yes'" class="mb-2 p-2 bg-light rounded">
                      <small>
                        <strong>📮 喜帖資訊：</strong><br>
                        收件人: {{ response.invitationRecipient }}<br>
                        電話: {{ response.invitationPhone }}<br>
                        地址: {{ response.invitationAddress }}
                      </small>
                    </div>

                    <div class="d-grid gap-2">
                      <button @click="editResponse(response)" class="btn btn-sm btn-outline-primary">
                        編輯此筆資料
                      </button>
                      <button @click="deleteResponse(response.id)" class="btn btn-sm btn-outline-danger">
                        刪除此筆資料
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 無資料提示 -->
              <div v-if="responses.length === 0" class="text-center py-5">
                <p class="text-muted">目前還沒有任何回覆資料</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 編輯對話框 -->
    <div v-if="editingResponse" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">編輯賓客資料</h5>
            <button type="button" class="btn-close" @click="cancelEdit"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveEdit">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold">姓名</label>
                  <input type="text" class="form-control" v-model="editingResponse.name" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">電話</label>
                  <input type="tel" class="form-control" v-model="editingResponse.phone" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">關係</label>
                  <input type="text" class="form-control" v-model="editingResponse.relationship" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">賓客屬性</label>
                  <select class="form-select" v-model="editingResponse.side" required>
                    <option value="groom">🤵 男方</option>
                    <option value="bride">👰 女方</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">是否出席</label>
                  <select class="form-select" v-model="editingResponse.willAttend" required>
                    <option value="yes">✅ 出席</option>
                    <option value="no">❌ 不出席</option>
                  </select>
                </div>
                <div class="col-md-6" v-if="editingResponse.willAttend === 'yes'">
                  <label class="form-label fw-bold">出席人數</label>
                  <input type="number" class="form-control" v-model.number="editingResponse.attendees" min="1">
                </div>
                <div class="col-md-6" v-if="editingResponse.willAttend === 'yes'">
                  <label class="form-label fw-bold">餐點類型</label>
                  <select class="form-select" v-model="editingResponse.mealType">
                    <option value="葷食">葷食</option>
                    <option value="素食">素食</option>
                  </select>
                </div>
                <div class="col-md-6" v-if="editingResponse.willAttend === 'yes'">
                  <label class="form-label fw-bold">禮金金額</label>
                  <input type="number" class="form-control" v-model.number="editingResponse.giftMoney" min="0" placeholder="選填">
                </div>
                <div class="col-md-6" v-if="editingResponse.willAttend === 'yes'">
                  <label class="form-label fw-bold">喜餅數量</label>
                  <input type="number" class="form-control" v-model.number="editingResponse.cookieCount" min="0" step="1" :placeholder="`預設 ${defaultCookieCount}`">
                </div>
                <div class="col-md-6" v-if="editingResponse.willAttend === 'yes'">
                  <label class="form-label fw-bold">需要兒童座椅</label>
                  <select class="form-select" v-model="editingResponse.needChildSeat">
                    <option value="no">不需要</option>
                    <option value="yes">需要</option>
                  </select>
                </div>
                <div class="col-md-6" v-if="editingResponse.willAttend === 'yes' && editingResponse.needChildSeat === 'yes'">
                  <label class="form-label fw-bold">座椅數量</label>
                  <input type="number" class="form-control" v-model.number="editingResponse.childSeatCount" min="1">
                </div>
                <div class="col-md-6" v-if="editingResponse.willAttend === 'yes'">
                  <label class="form-label fw-bold">需要喜帖</label>
                  <select class="form-select" v-model="editingResponse.needInvitation">
                    <option value="no">不需要</option>
                    <option value="yes">需要</option>
                  </select>
                </div>
                <div class="col-12" v-if="editingResponse.willAttend === 'yes' && editingResponse.needInvitation === 'yes'">
                  <div class="border rounded p-3 bg-light">
                    <h6 class="mb-3">📮 喜帖寄送資訊</h6>
                    <div class="row g-2">
                      <div class="col-md-4">
                        <label class="form-label">收件人</label>
                        <input type="text" class="form-control" v-model="editingResponse.invitationRecipient">
                      </div>
                      <div class="col-md-4">
                        <label class="form-label">收件電話</label>
                        <input type="tel" class="form-control" v-model="editingResponse.invitationPhone">
                      </div>
                      <div class="col-md-12">
                        <label class="form-label">收件地址</label>
                        <input type="text" class="form-control" v-model="editingResponse.invitationAddress">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <label class="form-label fw-bold">祝福留言</label>
                  <textarea class="form-control" v-model="editingResponse.blessing" rows="2"></textarea>
                </div>
                <div class="col-12">
                  <label class="form-label fw-bold">備註</label>
                  <textarea class="form-control" v-model="editingResponse.note" rows="2"></textarea>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cancelEdit">取消</button>
            <button type="button" class="btn btn-primary" @click="saveEdit">儲存變更</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const responses = ref([])
const editingResponse = ref(null)
const filter = ref('all')
const defaultCookieCount = ref(1) // 預設每家庭1個喜餅

// 篩選後的資料
const filteredResponses = computed(() => {
  if (filter.value === 'all') return responses.value
  return responses.value.filter(r => r.side === filter.value)
})

// 出席統計
const attendanceStats = computed(() => {
  const stats = { willAttend: 0, wontAttend: 0 }
  responses.value.forEach(r => {
    if (r.willAttend === 'yes') {
      stats.willAttend++
    } else {
      stats.wontAttend++
    }
  })
  return stats
})

// 總出席人數
const totalAttendees = computed(() => {
  return responses.value.reduce((sum, r) => {
    return sum + (r.willAttend === 'yes' ? r.attendees : 0)
  }, 0)
})

// 預計桌數 (每桌10人)
const estimatedTables = computed(() => {
  return Math.ceil(totalAttendees.value / 10)
})

// 禮金總額
const totalGiftMoney = computed(() => {
  return responses.value.reduce((sum, r) => {
    return sum + (r.willAttend === 'yes' && r.giftMoney ? r.giftMoney : 0)
  }, 0)
})

// 男女方禮金統計
const giftMoneyByGender = computed(() => {
  const stats = { groom: 0, bride: 0 }
  responses.value.forEach(r => {
    if (r.willAttend === 'yes' && r.giftMoney) {
      if (r.side === 'groom') {
        stats.groom += r.giftMoney
      } else {
        stats.bride += r.giftMoney
      }
    }
  })
  return stats
})

// 喜餅總數
const totalCookies = computed(() => {
  return responses.value.reduce((sum, r) => {
    if (r.willAttend === 'yes') {
      return sum + (r.cookieCount || defaultCookieCount.value)
    }
    return sum
  }, 0)
})

// 餐點統計
const mealStats = computed(() => {
  const stats = { meat: 0, vegetarian: 0 }
  responses.value.forEach(r => {
    if (r.willAttend === 'yes') {
      if (r.mealType === '葷食') {
        stats.meat += r.attendees
      } else if (r.mealType === '素食') {
        stats.vegetarian += r.attendees
      }
    }
  })
  return stats
})

// 兒童座椅總數
const childSeatCount = computed(() => {
  return responses.value.reduce((sum, r) => {
    return sum + (r.needChildSeat === 'yes' ? r.childSeatCount : 0)
  }, 0)
})

// 需要喜帖的數量
const invitationCount = computed(() => {
  return responses.value.filter(r => r.needInvitation === 'yes').length
})

// 男女方統計
const sideStats = computed(() => {
  const stats = {
    groom: { count: 0, attending: 0, totalAttendees: 0 },
    bride: { count: 0, attending: 0, totalAttendees: 0 }
  }

  responses.value.forEach(r => {
    const side = r.side === 'groom' ? 'groom' : 'bride'
    stats[side].count++
    if (r.willAttend === 'yes') {
      stats[side].attending++
      stats[side].totalAttendees += r.attendees || 0
    }
  })

  return stats
})

// 關係類型統計
const relationshipStats = computed(() => {
  const stats = {}

  responses.value.forEach(r => {
    const rel = r.relationship || '未知'
    if (!stats[rel]) {
      stats[rel] = { count: 0, attendees: 0 }
    }
    stats[rel].count++
    if (r.willAttend === 'yes') {
      stats[rel].attendees += r.attendees || 0
    }
  })

  return stats
})

// 載入資料
const loadResponses = async () => {
  try {
    const response = await fetch('/api/responses')
    responses.value = await response.json()
  } catch (error) {
    console.error('載入資料錯誤：', error)
    alert('載入資料失敗')
  }
}

// 編輯資料
const editResponse = (response) => {
  editingResponse.value = { ...response }
}

// 取消編輯
const cancelEdit = () => {
  editingResponse.value = null
}

// 儲存編輯
const saveEdit = async () => {
  if (!editingResponse.value) return

  try {
    const response = await fetch(`/api/responses/${editingResponse.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(editingResponse.value)
    })

    if (response.ok) {
      await loadResponses()
      editingResponse.value = null
      alert('更新成功')
    } else {
      throw new Error('更新失敗')
    }
  } catch (error) {
    console.error('更新錯誤：', error)
    alert('更新失敗')
  }
}

// 刪除資料
const deleteResponse = async (id) => {
  if (!confirm('確定要刪除這筆資料嗎？')) return

  try {
    const response = await fetch(`/api/responses/${id}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      await loadResponses()
      alert('刪除成功')
    } else {
      throw new Error('刪除失敗')
    }
  } catch (error) {
    console.error('刪除錯誤：', error)
    alert('刪除失敗')
  }
}

onMounted(() => {
  loadResponses()
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
  color: #d4357f !important;
  transform: translateY(-2px);
}

.nav-link.active {
  color: #d4357f !important;
  font-weight: 600;
}

/* 表格樣式 */
.table {
  font-size: 0.9rem;
}

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}

.stat-item {
  padding: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  .stat-value {
    font-size: 1.5rem;
  }

  .navbar-brand {
    font-size: 1rem;
  }
}
</style>
