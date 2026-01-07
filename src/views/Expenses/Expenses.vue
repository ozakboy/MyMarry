<template>
  <div class="expenses-page">
    <NavBar />

    <div class="container mt-4">
      <h2 class="mb-4">婚禮準備花費統計表</h2>

      <div class="row mb-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body text-center">
              <h5 class="card-title">總花費</h5>
              <p class="card-text fs-2 fw-bold text-danger">${{ totalExpense.toLocaleString() }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title mb-3">類別分佈</h5>
              <canvas ref="chartCanvas"></canvas>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-body">
          <button class="btn btn-primary" @click="openAddModal">新增花費</button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>類別</th>
                  <th>項目</th>
                  <th>金額</th>
                  <th>日期</th>
                  <th>備註</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="expense in expenses" :key="expense.id">
                  <td>{{ expense.category }}</td>
                  <td>{{ expense.item }}</td>
                  <td class="fw-bold">${{ expense.amount.toLocaleString() }}</td>
                  <td>{{ expense.date }}</td>
                  <td>{{ expense.note }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary me-2" @click="openEditModal(expense)">編輯</button>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteExpense(expense.id)">刪除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="expenses.length === 0" class="text-center text-muted py-4">
            <p>尚無花費記錄</p>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="expenseModal" tabindex="-1" ref="expenseModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? '編輯花費' : '新增花費' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">類別</label>
              <select class="form-select" v-model="editingExpense.category">
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div class="mb-3" v-if="editingExpense.category === '其他'">
              <label class="form-label">自訂類別</label>
              <input type="text" class="form-control" v-model="customCategory">
            </div>
            <div class="mb-3">
              <label class="form-label">項目</label>
              <input type="text" class="form-control" v-model="editingExpense.item" required>
            </div>
            <div class="mb-3">
              <label class="form-label">金額</label>
              <input type="number" class="form-control" v-model.number="editingExpense.amount" min="0" required>
            </div>
            <div class="mb-3">
              <label class="form-label">日期</label>
              <input type="date" class="form-control" v-model="editingExpense.date" required>
            </div>
            <div class="mb-3">
              <label class="form-label">備註</label>
              <textarea class="form-control" v-model="editingExpense.note" rows="2"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="saveExpense">儲存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./Expenses.js"></script>

<style src="./Expenses.scss" scoped lang="scss"></style>
