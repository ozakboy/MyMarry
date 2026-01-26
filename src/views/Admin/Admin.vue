<template>
  <div class="min-vh-100" style="background: linear-gradient(135deg, #ffd1dc 0%, #ffb6c1 100%);">
    <!-- 導航列 -->
    <NavBar />

    <!-- 主要內容 -->
    <div class="container-fluid py-3 py-sm-4 py-md-5">
      <div class="row justify-content-center">
        <div class="col-12 col-xl-11">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-3 p-sm-4 p-md-5">
              <!-- 標題和篩選器 -->
              <div class="mb-3 mb-md-4">
                <div class="mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <h2 class="fw-bold mb-0" style="color: #d4357f;">📊 出席回覆管理</h2>
                  <button class="btn btn-primary" @click="openAddGuest">
                    <i class="bi bi-person-plus me-1"></i>快速新增來賓
                  </button>
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

    <!-- 快速新增來賓對話框 -->
    <div v-if="addingGuest" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">快速新增來賓</h5>
            <button type="button" class="btn-close" @click="cancelAddGuest"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-bold">姓名 <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="addingGuest.name" required>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">電話</label>
                <input type="tel" class="form-control" v-model="addingGuest.phone">
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">關係</label>
                <select class="form-select" v-model="addingGuest.relationship">
                  <option v-for="rel in relationshipOptions" :key="rel" :value="rel">{{ rel }}</option>
                </select>
              </div>
              <div class="col-md-6" v-if="addingGuest.relationship === '其他'">
                <label class="form-label fw-bold">自訂關係</label>
                <input type="text" class="form-control" v-model="addingGuest.customRelationship">
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">賓客屬性</label>
                <select class="form-select" v-model="addingGuest.side">
                  <option value="groom">🤵 男方</option>
                  <option value="bride">👰 女方</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">是否出席</label>
                <select class="form-select" v-model="addingGuest.willAttend">
                  <option value="yes">✅ 出席</option>
                  <option value="no">❌ 不出席</option>
                </select>
              </div>
              <div class="col-md-6" v-if="addingGuest.willAttend === 'yes'">
                <label class="form-label fw-bold">出席人數</label>
                <input type="number" class="form-control" v-model.number="addingGuest.attendees" min="1" max="20">
              </div>
              <div class="col-md-6" v-if="addingGuest.willAttend === 'yes'">
                <label class="form-label fw-bold">用餐類型</label>
                <select class="form-select" v-model="addingGuest.mealType">
                  <option value="葷食">葷食</option>
                  <option value="素食">素食</option>
                </select>
              </div>
              <div class="col-md-6" v-if="addingGuest.willAttend === 'yes'">
                <label class="form-label fw-bold">兒童座椅</label>
                <select class="form-select" v-model="addingGuest.needChildSeat">
                  <option value="no">不需要</option>
                  <option value="yes">需要</option>
                </select>
              </div>
              <div class="col-md-6" v-if="addingGuest.willAttend === 'yes' && addingGuest.needChildSeat === 'yes'">
                <label class="form-label fw-bold">座椅數量</label>
                <input type="number" class="form-control" v-model.number="addingGuest.childSeatCount" min="1">
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">禮金</label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input type="number" class="form-control" v-model.number="addingGuest.giftMoney" min="0" step="100">
                </div>
              </div>
              <div class="col-12">
                <label class="form-label fw-bold">備註</label>
                <textarea class="form-control" v-model="addingGuest.note" rows="2"></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cancelAddGuest">取消</button>
            <button type="button" class="btn btn-primary" @click="saveAddGuest">新增</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./Admin.js"></script>

<style src="./Admin.scss" scoped></style>
