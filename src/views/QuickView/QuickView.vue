<template>
  <div class="quick-view-page">
    <NavBar />

    <div class="container mt-4">
      <h2 class="mb-4">快速查詢出席名單</h2>

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
          <div class="mb-3">
            <input
              type="text"
              class="form-control"
              placeholder="搜尋姓名..."
              v-model="searchQuery"
            >
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
                      :class="response.guestSide === '新郎' ? 'bg-primary' : 'bg-danger'"
                    >
                      {{ response.guestSide }}
                    </span>
                  </td>
                  <td>{{ response.attendeeCount }}</td>
                  <td>{{ response.mealType }}</td>
                  <td>{{ response.childSeats }}</td>
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
  </div>
</template>

<script src="./QuickView.js"></script>

<style src="./QuickView.scss" scoped lang="scss"></style>
