<template>
  <div class="expenses-page">
    <NavBar />

    <div class="container mt-4 mb-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">婚禮準備花費統計表</h2>
        <button class="btn btn-primary" @click="openAddModal">
          <i class="bi bi-plus-circle me-1"></i>新增花費
        </button>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-md-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="card-subtitle text-muted mb-0">總預算</h6>
                <button class="btn btn-sm btn-outline-secondary" @click="openBudgetModal">設定</button>
              </div>
              <p class="card-text fs-2 fw-bold text-primary mb-0">${{ totalBudget.toLocaleString() }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h6 class="card-subtitle text-muted mb-3">已花費</h6>
              <p class="card-text fs-2 fw-bold text-danger mb-1">${{ totalExpense.toLocaleString() }}</p>
              <small class="text-muted">佔預算 {{ budgetPercentage }}%</small>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h6 class="card-subtitle text-muted mb-3">剩餘預算</h6>
              <p class="card-text fs-2 fw-bold mb-1" :class="remainingBudget >= 0 ? 'text-success' : 'text-danger'">
                ${{ remainingBudget.toLocaleString() }}
              </p>
              <small v-if="remainingBudget < 0" class="text-danger fw-bold">⚠ 超支!</small>
              <small v-else class="text-success">尚可使用</small>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <h5 class="card-title mb-3">預算使用進度</h5>
          <div class="progress" style="height: 35px;">
            <div
              class="progress-bar fw-bold"
              :class="budgetPercentage >= 100 ? 'bg-danger' : (budgetPercentage >= 80 ? 'bg-warning' : 'bg-success')"
              role="progressbar"
              :style="`width: ${Math.min(budgetPercentage, 100)}%`"
              :aria-valuenow="budgetPercentage"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {{ budgetPercentage }}%
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-5">
        <div class="col-lg-5 mx-auto">
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title text-center mb-4">花費類別分佈</h5>
              <div style="max-width: 350px; margin: 0 auto;">
                <canvas ref="chartCanvas"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow-sm">
        <div class="card-header bg-white">
          <h5 class="mb-0">花費明細</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>類別</th>
                  <th>項目</th>
                  <th>金額</th>
                  <th>日期</th>
                  <th>備註</th>
                  <th style="width: 160px;">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="expense in expenses" :key="expense.id">
                  <td><span class="badge bg-secondary">{{ expense.category }}</span></td>
                  <td class="fw-medium">{{ expense.item }}</td>
                  <td class="fw-bold text-danger">${{ expense.amount.toLocaleString() }}</td>
                  <td class="text-muted">{{ expense.date }}</td>
                  <td class="text-muted">{{ expense.note }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary me-1" @click="openEditModal(expense)">編輯</button>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteExpense(expense.id)">刪除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="expenses.length === 0" class="text-center text-muted py-5">
            <p class="mb-0">尚無花費記錄，點擊上方「新增花費」按鈕開始記錄</p>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="budgetModal" tabindex="-1" ref="budgetModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">設定總預算</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">總預算金額</label>
              <input type="number" class="form-control" v-model.number="editingBudget" min="0" required>
              <small class="form-text text-muted">設定婚禮準備的總預算金額</small>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="saveBudget">儲存</button>
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
