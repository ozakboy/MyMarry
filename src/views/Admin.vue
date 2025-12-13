<template>
  <div class="min-vh-100 py-3 py-sm-4 py-md-5" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-12 col-xl-11">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-3 p-sm-4 p-md-5">
              <!-- 標題 -->
              <div class="d-flex justify-content-between align-items-center mb-3 mb-md-4">
                <h2 class="fw-bold text-primary mb-0">📊 出席回覆管理</h2>
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
                  <div class="card bg-primary text-white h-100">
                    <div class="card-body text-center">
                      <h6 class="card-title mb-2">🍽️ 總人數</h6>
                      <h3 class="mb-0">{{ totalAttendees }}</h3>
                    </div>
                  </div>
                </div>
                <div class="col-6 col-md-3">
                  <div class="card bg-info text-white h-100">
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

              <!-- 資料表格（桌面版） -->
              <div class="table-responsive d-none d-lg-block">
                <table class="table table-hover align-middle">
                  <thead class="table-light">
                    <tr>
                      <th>姓名</th>
                      <th>電話</th>
                      <th>關係</th>
                      <th>賓客屬性</th>
                      <th>出席</th>
                      <th>人數</th>
                      <th>餐點</th>
                      <th>兒童座椅</th>
                      <th>喜帖</th>
                      <th>祝福</th>
                      <th>備註</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="response in responses" :key="response.id">
                      <td class="fw-bold">{{ response.name }}</td>
                      <td>{{ response.phone }}</td>
                      <td>{{ response.relationship }}</td>
                      <td>
                        <span :class="response.side === 'groom' ? 'badge bg-primary' : 'badge bg-danger'">
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
                        <span v-if="response.needInvitation === 'yes'" class="text-success">
                          ✅
                          <span class="small d-block">{{ response.invitationRecipient }}</span>
                        </span>
                        <span v-else>❌</span>
                      </td>
                      <td>
                        <small v-if="response.blessing">{{ response.blessing.substring(0, 20) }}{{ response.blessing.length > 20 ? '...' : '' }}</small>
                        <span v-else class="text-muted">-</span>
                      </td>
                      <td>
                        <small v-if="response.note">{{ response.note.substring(0, 20) }}{{ response.note.length > 20 ? '...' : '' }}</small>
                        <span v-else class="text-muted">-</span>
                      </td>
                      <td>
                        <button @click="deleteResponse(response.id)" class="btn btn-sm btn-outline-danger">
                          刪除
                        </button>
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
                          <span :class="response.side === 'groom' ? 'badge bg-primary' : 'badge bg-danger'">
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
                        <div><strong>喜帖：</strong>{{ response.needInvitation === 'yes' ? `需要 (${response.invitationRecipient})` : '不需要' }}</div>
                      </small>
                    </div>

                    <div v-if="response.blessing" class="mb-2">
                      <small><strong>祝福：</strong>{{ response.blessing }}</small>
                    </div>

                    <div v-if="response.note" class="mb-2">
                      <small><strong>備註：</strong>{{ response.note }}</small>
                    </div>

                    <button @click="deleteResponse(response.id)" class="btn btn-sm btn-outline-danger w-100">
                      刪除此筆資料
                    </button>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const responses = ref([])

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
