<template>
  <div class="quick-view-page">
    <NavBar />

    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">快速查詢出席名單</h2>
        <button class="btn btn-primary" @click="openAddGuestModal">
          <i class="bi bi-person-plus me-1"></i>快速新增來賓
        </button>
      </div>

      <div class="row mb-4">
        <div class="col-md-4">
          <div class="card text-center">
            <div class="card-body">
              <h5 class="card-title">總禮金</h5>
              <p class="card-text fs-3 fw-bold text-success">${{ totalGiftMoney.toLocaleString() }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-center">
            <div class="card-body">
              <h5 class="card-title">新郎方禮金</h5>
              <p class="card-text fs-3 fw-bold text-primary">${{ groomGiftMoney.toLocaleString() }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-center">
            <div class="card-body">
              <h5 class="card-title">新娘方禮金</h5>
              <p class="card-text fs-3 fw-bold bride-gift-money">${{ brideGiftMoney.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-md-6">
              <input
                type="text"
                class="form-control"
                placeholder="搜尋姓名..."
                v-model="searchQuery"
              >
            </div>
            <div class="col-md-6">
              <div class="btn-group w-100" role="group">
                <button
                  type="button"
                  class="btn"
                  :class="sideFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'"
                  @click="sideFilter = 'all'"
                >
                  全部 ({{ responses.length }})
                </button>
                <button
                  type="button"
                  class="btn"
                  :class="sideFilter === 'groom' ? 'btn-primary' : 'btn-outline-primary'"
                  @click="sideFilter = 'groom'"
                >
                  新郎方 ({{ groomCount }})
                </button>
                <button
                  type="button"
                  class="btn"
                  :class="sideFilter === 'bride' ? 'btn-danger' : 'btn-outline-danger'"
                  @click="sideFilter = 'bride'"
                >
                  新娘方 ({{ brideCount }})
                </button>
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>姓名</th>
                  <th>關係</th>
                  <th>賓客方</th>
                  <th>出席人數</th>
                  <th>用餐類型</th>
                  <th>兒童座椅</th>
                  <th>禮金</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="response in filteredResponses" :key="response.id">
                  <td>{{ response.name }}</td>
                  <td>{{ response.relationship }}</td>
                  <td>
                    <span
                      class="badge"
                      :class="response.side === 'groom' ? 'bg-primary' : 'bg-danger'"
                    >
                      {{ response.side === 'groom' ? '新郎' : '新娘' }}
                    </span>
                  </td>
                  <td>{{ response.attendees }}</td>
                  <td>{{ response.mealType }}</td>
                  <td>{{ response.childSeatCount }}</td>
                  <td class="fw-bold">${{ (response.giftMoney || 0).toLocaleString() }}</td>
                  <td>
                    <button
                      class="btn btn-sm btn-outline-primary"
                      @click="openEditGiftModal(response)"
                    >
                      編輯禮金
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="filteredResponses.length === 0" class="text-center text-muted py-4">
            <p>沒有找到符合的資料</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 編輯禮金 Modal -->
    <div
      class="modal fade"
      id="editGiftModal"
      tabindex="-1"
      ref="editGiftModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">編輯禮金 - {{ editingResponse?.name }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">禮金金額</label>
              <input
                type="number"
                class="form-control"
                v-model.number="editingResponse.giftMoney"
                min="0"
                step="100"
              >
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="saveGiftMoney">儲存</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速新增來賓 Modal -->
    <div class="modal fade" id="addGuestModal" tabindex="-1" ref="addGuestModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">快速新增來賓</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">姓名 <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="newGuest.name" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">電話</label>
                <input type="text" class="form-control" v-model="newGuest.phone">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">關係</label>
                <select class="form-select" v-model="newGuest.relationship">
                  <option v-for="rel in relationshipOptions" :key="rel" :value="rel">{{ rel }}</option>
                </select>
              </div>
              <div class="col-md-6 mb-3" v-if="newGuest.relationship === '其他'">
                <label class="form-label">自訂關係</label>
                <input type="text" class="form-control" v-model="newGuest.customRelationship">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">賓客方</label>
                <select class="form-select" v-model="newGuest.side">
                  <option value="groom">新郎方</option>
                  <option value="bride">新娘方</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">是否出席</label>
                <select class="form-select" v-model="newGuest.willAttend">
                  <option value="yes">出席</option>
                  <option value="no">不出席</option>
                </select>
              </div>
              <div class="col-md-6 mb-3" v-if="newGuest.willAttend === 'yes'">
                <label class="form-label">出席人數</label>
                <input type="number" class="form-control" v-model.number="newGuest.attendees" min="1" max="20">
              </div>
            </div>
            <div class="row" v-if="newGuest.willAttend === 'yes'">
              <div class="col-md-6 mb-3">
                <label class="form-label">用餐類型</label>
                <select class="form-select" v-model="newGuest.mealType">
                  <option value="葷食">葷食</option>
                  <option value="素食">素食</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">兒童座椅</label>
                <select class="form-select" v-model="newGuest.needChildSeat">
                  <option value="no">不需要</option>
                  <option value="yes">需要</option>
                </select>
              </div>
            </div>
            <div class="row" v-if="newGuest.willAttend === 'yes' && newGuest.needChildSeat === 'yes'">
              <div class="col-md-6 mb-3">
                <label class="form-label">兒童座椅數量</label>
                <input type="number" class="form-control" v-model.number="newGuest.childSeatCount" min="1">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">禮金</label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input type="number" class="form-control" v-model.number="newGuest.giftMoney" min="0" step="100">
                </div>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">備註</label>
              <textarea class="form-control" v-model="newGuest.note" rows="2"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="saveNewGuest">新增</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./QuickView.js"></script>

<style src="./QuickView.scss" scoped lang="scss"></style>
