<template>
  <div class="staff-page">
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
              <router-link to="/StaffAssignment" class="nav-link active">人員配置</router-link>
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
      <h2 class="mb-4">人員配置表</h2>

      <div class="card mb-4">
        <div class="card-body">
          <button class="btn btn-primary" @click="openAddModal">新增人員配置</button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>名稱</th>
                  <th>人員</th>
                  <th>職責</th>
                  <th>備註</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="staff in staffList" :key="staff.id">
                  <td class="fw-bold">{{ staff.name }}</td>
                  <td>{{ staff.personnel }}</td>
                  <td>{{ staff.responsibilities }}</td>
                  <td>{{ staff.note }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary me-2" @click="openEditModal(staff)">編輯</button>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteStaff(staff.id)">刪除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="staffList.length === 0" class="text-center text-muted py-4">
            <p>尚無人員配置</p>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="staffModal" tabindex="-1" ref="staffModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? '編輯人員配置' : '新增人員配置' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">名稱</label>
              <input type="text" class="form-control" v-model="editingStaff.name" required>
            </div>
            <div class="mb-3">
              <label class="form-label">人員</label>
              <input type="text" class="form-control" v-model="editingStaff.personnel" required>
              <small class="form-text text-muted">多位人員請用逗號分隔</small>
            </div>
            <div class="mb-3">
              <label class="form-label">職責</label>
              <textarea class="form-control" v-model="editingStaff.responsibilities" rows="3" required></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">備註</label>
              <textarea class="form-control" v-model="editingStaff.note" rows="2"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="saveStaff">儲存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./StaffAssignment.js"></script>

<style src="./StaffAssignment.scss" scoped lang="scss"></style>
