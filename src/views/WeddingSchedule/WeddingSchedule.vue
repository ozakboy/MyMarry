<template>
  <div class="schedule-page">
    <NavBar />

    <div class="container mt-4">
      <h2 class="mb-4">訂結婚流程</h2>

      <div class="card mb-4">
        <div class="card-body d-flex gap-2">
          <button class="btn btn-primary" @click="openAddModal">新增流程</button>
          <button class="btn btn-success" @click="exportToPDF" :disabled="schedule.length === 0">
            <i class="bi bi-file-earmark-pdf"></i> 匯出PDF
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th style="width: 80px;">類型</th>
                  <th style="width: 140px;">日期時間</th>
                  <th style="width: 120px;">地點</th>
                  <th style="width: 120px;">活動名稱</th>
                  <th style="width: 200px;">工作內容</th>
                  <th style="width: 100px;">負責人員</th>
                  <th style="width: 150px;">需求物品</th>
                  <th style="width: 150px;">備註</th>
                  <th style="width: 140px;">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in sortedSchedule" :key="item.id">
                  <td style="white-space: normal;">
                    <span class="badge bg-info">{{ item.activityType }}</span>
                  </td>
                  <td style="white-space: nowrap;">{{ formatDateTime(item.datetime) }}</td>
                  <td>{{ item.location }}</td>
                  <td class="fw-bold">{{ item.activityName }}</td>
                  <td>{{ item.workDetails }}</td>
                  <td>{{ item.staff }}</td>
                  <td>{{ item.requiredItems }}</td>
                  <td>{{ item.note }}</td>
                  <td style="white-space: nowrap;">
                    <button class="btn btn-sm btn-outline-primary me-1" @click="openEditModal(item)">編輯</button>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteSchedule(item.id)">刪除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="schedule.length === 0" class="text-center text-muted py-4">
            <p>尚無流程安排</p>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="scheduleModal" tabindex="-1" ref="scheduleModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? '編輯流程' : '新增流程' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">活動類型</label>
                <select class="form-select" v-model="editingSchedule.activityType">
                  <option>訂婚</option>
                  <option>結婚</option>
                  <option>宴客</option>
                  <option>準備工作</option>
                  <option>其他</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">日期時間</label>
                <input type="datetime-local" class="form-control" v-model="editingSchedule.datetime" required>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">地點</label>
                <input type="text" class="form-control" v-model="editingSchedule.location" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">活動名稱</label>
                <input type="text" class="form-control" v-model="editingSchedule.activityName" required>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">工作內容</label>
              <textarea class="form-control" v-model="editingSchedule.workDetails" rows="2"></textarea>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">負責人員</label>
                <input type="text" class="form-control" v-model="editingSchedule.staff">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">需求物品</label>
                <input type="text" class="form-control" v-model="editingSchedule.requiredItems">
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">備註</label>
              <textarea class="form-control" v-model="editingSchedule.note" rows="2"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="saveSchedule">儲存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./WeddingSchedule.js"></script>

<style src="./WeddingSchedule.scss" scoped lang="scss"></style>
