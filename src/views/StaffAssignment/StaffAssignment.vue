<template>
  <div class="staff-page">
    <NavBar />

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
                  <th style="width: 150px;">名稱</th>
                  <th style="width: 200px;">人員</th>
                  <th style="width: 300px;">職責</th>
                  <th style="width: 200px;">備註</th>
                  <th style="width: 140px;">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="staff in staffList" :key="staff.id">
                  <td class="fw-bold">{{ staff.name }}</td>
                  <td>{{ staff.personnel }}</td>
                  <td>{{ staff.responsibilities }}</td>
                  <td>{{ staff.note }}</td>
                  <td style="white-space: nowrap;">
                    <button class="btn btn-sm btn-outline-primary me-1" @click="openEditModal(staff)">編輯</button>
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
