<template>
  <div class="seating-page">
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
              <router-link to="/SeatingChart" class="nav-link active">座位表</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/Settings" class="nav-link">系統設定</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container-fluid mt-4">
      <h2 class="mb-4">賓客座位表</h2>

      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card">
            <div class="card-body">
              <button class="btn btn-primary w-100 mb-2" @click="addTable">新增桌次</button>
              <button class="btn btn-success w-100 mb-2" @click="autoArrange">自動安排</button>
              <button class="btn btn-info w-100" @click="saveSeating">儲存座位表</button>
            </div>
          </div>

          <div class="card mt-3">
            <div class="card-header">
              <h6 class="mb-0">未安排賓客 ({{ unassignedGuests.length }})</h6>
            </div>
            <div class="card-body" style="max-height: 500px; overflow-y: auto;">
              <div
                v-for="guest in unassignedGuests"
                :key="guest.id"
                class="guest-item mb-2 p-2 border rounded bg-light"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{{ guest.name }}</strong>
                    <br>
                    <small class="text-muted">{{ guest.guestSide }} - {{ guest.attendeeCount }}人</small>
                  </div>
                  <button class="btn btn-sm btn-outline-primary" @click="showAssignModal(guest)">
                    安排
                  </button>
                </div>
              </div>
              <div v-if="unassignedGuests.length === 0" class="text-center text-muted">
                <p>所有賓客都已安排</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-9">
          <div class="row">
            <div v-for="(table, index) in tables" :key="index" class="col-md-6 col-lg-4 mb-4">
              <div class="card table-card">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h6 class="mb-0">{{ table.name }}</h6>
                  <button class="btn btn-sm btn-outline-danger" @click="removeTable(index)">刪除</button>
                </div>
                <div class="card-body">
                  <p class="mb-2">
                    <small>座位: {{ getCurrentSeats(table) }} / {{ table.maxSeats }}</small>
                  </p>
                  <div class="guests-list">
                    <div
                      v-for="(guest, gIndex) in table.guests"
                      :key="gIndex"
                      class="guest-item mb-2 p-2 border rounded"
                    >
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{{ guest.name }}</strong>
                          <br>
                          <small>{{ guest.attendeeCount }}人</small>
                        </div>
                        <button
                          class="btn btn-sm btn-outline-danger"
                          @click="removeGuestFromTable(index, gIndex)"
                        >
                          移除
                        </button>
                      </div>
                    </div>
                    <div v-if="table.guests.length === 0" class="text-center text-muted py-3">
                      <small>尚無賓客</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="tables.length === 0" class="text-center text-muted py-5">
            <p>請新增桌次開始安排座位</p>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="assignModal" tabindex="-1" ref="assignModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">安排賓客 - {{ selectedGuest?.name }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">選擇桌次</label>
              <select class="form-select" v-model="selectedTableIndex">
                <option v-for="(table, index) in tables" :key="index" :value="index">
                  {{ table.name }} ({{ getCurrentSeats(table) }}/{{ table.maxSeats }})
                </option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="assignGuest">確定</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./SeatingChart.js"></script>

<style src="./SeatingChart.scss" scoped lang="scss"></style>
