<template>
  <div class="quick-view-page">
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
              <router-link to="/MarryList" class="nav-link">出席名單</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/QuickView" class="nav-link active">快速查詢</router-link>
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
          </ul>
        </div>
      </div>
    </nav>

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
