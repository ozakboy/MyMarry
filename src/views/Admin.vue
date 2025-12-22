<template>
  <div class="min-vh-100 py-3 py-sm-4 py-md-5" style="background: linear-gradient(135deg, #ffd1dc 0%, #ffb6c1 100%);">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-12 col-xl-11">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-3 p-sm-4 p-md-5">
              <!-- 標題 -->
              <div class="d-flex justify-content-between align-items-center mb-3 mb-md-4">
                <h2 class="fw-bold mb-0" style="color: #d4357f;">📊 出席回覆管理</h2>
                <router-link to="/" class="btn btn-outline-secondary">
                  ← 返回首頁
                </router-link>
              </div>

              <!-- 統計卡片 -->
              <div class="row g-3 mb-3 mb-md-4">
                <div class="col-6 col-md-3">
                  <div class="card bg-success text-white h-100">
                    <div class="card-body text-center">
                      <h6 class="card-title mb-2">✅ 出席</h6>
                      <h3 class="mb-0">{{ attendanceStats.willAttend }}</h3>
                    </div>
                  </div>
                </div>
                <div class="col-6 col-md-3">
                  <div class="card bg-danger text-white h-100">
                    <div class="card-body text-center">
                      <h6 class="card-title mb-2">❌ 不出席</h6>
                      <h3 class="mb-0">{{ attendanceStats.wontAttend }}</h3>
                    </div>
                  </div>
                </div>
                <div class="col-6 col-md-3">
                  <div class="card text-white h-100" style="background-color: #ff69b4;">
                    <div class="card-body text-center">
                      <h6 class="card-title mb-2">🍽️ 總人數</h6>
                      <h3 class="mb-0">{{ totalAttendees }}</h3>
                    </div>
                  </div>
                </div>
                <div class="col-6 col-md-3">
                  <div class="card text-white h-100" style="background-color: #ffb6c1;">
                    <div class="card-body text-center">
                      <h6 class="card-title mb-2">👶 兒童座椅</h6>
                      <h3 class="mb-0">{{ childSeatCount }}</h3>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 次要統計 -->
              <div class="row g-3 mb-3 mb-md-4">
                <div class="col-6 col-md-3">
                  <div class="card bg-light h-100">
                    <div class="card-body text-center">
                      <h6 class="card-title mb-2">🥩 葷食</h6>
                      <h5 class="mb-0">{{ mealStats.meat }}</h5>
                    </div>
                  </div>
                </div>
                <div class="col-6 col-md-3">
                  <div class="card bg-light h-100">
                    <div class="card-body text-center">
                      <h6 class="card-title mb-2">🥗 素食</h6>
                      <h5 class="mb-0">{{ mealStats.vegetarian }}</h5>
                    </div>
                  </div>
                </div>
                <div class="col-6 col-md-3">
                  <div class="card bg-light h-100">
                    <div class="card-body text-center">
                      <h6 class="card-title mb-2">📮 需要喜帖</h6>
                      <h5 class="mb-0">{{ invitationCount }}</h5>
                    </div>
                  </div>
                </div>
                <div class="col-6 col-md-3">
                  <div class="card bg-light h-100">
                    <div class="card-body text-center">
                      <h6 class="card-title mb-2">📝 總回覆</h6>
                      <h5 class="mb-0">{{ responses.length }}</h5>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 男女方統計 -->
              <div class="row g-3 mb-3 mb-md-4">
                <div class="col-12 col-md-6">
                  <div class="card h-100">
                    <div class="card-header text-white" style="background-color: #d4357f;">
                      <h6 class="mb-0">🤵 男方賓客統計</h6>
                    </div>
                    <div class="card-body">
                      <div class="row text-center">
                        <div class="col-4">
                          <small class="text-muted">回覆數</small>
                          <h5>{{ sideStats.groom.count }}</h5>
                        </div>
                        <div class="col-4">
                          <small class="text-muted">出席數</small>
                          <h5>{{ sideStats.groom.attending }}</h5>
                        </div>
                        <div class="col-4">
                          <small class="text-muted">總人數</small>
                          <h5>{{ sideStats.groom.totalAttendees }}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="card h-100">
                    <div class="card-header text-white" style="background-color: #ff69b4;">
                      <h6 class="mb-0">👰 女方賓客統計</h6>
                    </div>
                    <div class="card-body">
                      <div class="row text-center">
                        <div class="col-4">
                          <small class="text-muted">回覆數</small>
                          <h5>{{ sideStats.bride.count }}</h5>
                        </div>
                        <div class="col-4">
                          <small class="text-muted">出席數</small>
                          <h5>{{ sideStats.bride.attending }}</h5>
                        </div>
                        <div class="col-4">
                          <small class="text-muted">總人數</small>
                          <h5>{{ sideStats.bride.totalAttendees }}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 關係類型統計 -->
              <div class="card mb-3 mb-md-4">
                <div class="card-header text-white" style="background-color: #ffb6c1;">
                  <h6 class="mb-0">👥 關係類型統計</h6>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-6 col-md-2" v-for="(stat, rel) in relationshipStats" :key="rel">
                      <div class="text-center">
                        <small class="text-muted d-block">{{ rel }}</small>
                        <h5 class="mb-0">{{ stat.count }}</h5>
                        <small class="text-muted">{{ stat.attendees }}人</small>
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
                      <th style="min-width: 200px;">喜帖資訊</th>
                      <th style="min-width: 150px;">祝福</th>
                      <th style="min-width: 150px;">備註</th>
                      <th style="min-width: 120px;">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="response in responses" :key="response.id">
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
                        <small v-if="response.blessing">{{ response.blessing.substring(0, 30) }}{{ response.blessing.length > 30 ? '...' : '' }}</small>
                        <span v-else class="text-muted">-</span>
                      </td>
                      <td>
                        <small v-if="response.note">{{ response.note.substring(0, 30) }}{{ response.note.length > 30 ? '...' : '' }}</small>
                        <span v-else class="text-muted">-</span>
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
                <div v-for="response in responses" :key="response.id" class="card mb-3">
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
                      </small>
                    </div>

                    <div v-if="response.blessing" class="mb-2">
                      <small><strong>祝福：</strong>{{ response.blessing }}</small>
                    </div>

                    <div v-if="response.note" class="mb-2">
                      <small><strong>備註：</strong>{{ response.note }}</small>
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
.table {
  font-size: 0.9rem;
}

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}
</style>
