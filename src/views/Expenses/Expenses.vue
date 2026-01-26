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

      <!-- 統計看板：第一排 -->
      <div class="row g-3 mb-3">
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
              <h6 class="card-subtitle text-muted mb-3">總支出金額</h6>
              <p class="card-text fs-2 fw-bold text-danger mb-0">${{ totalExpense.toLocaleString() }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h6 class="card-subtitle text-muted mb-3">贊助總額</h6>
              <p class="card-text fs-2 fw-bold text-info mb-0">${{ totalSponsor.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 統計看板：第二排 -->
      <div class="row g-3 mb-4">
        <div class="col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h6 class="card-subtitle text-muted mb-3">實付金額 <small class="fw-normal">(總支出 - 贊助)</small></h6>
              <p class="card-text fs-2 fw-bold text-warning mb-1">${{ actualPaid.toLocaleString() }}</p>
              <small class="text-muted">佔預算 {{ budgetPercentage }}%</small>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h6 class="card-subtitle text-muted mb-3">預算餘額 <small class="fw-normal">(預算 - 實付)</small></h6>
              <p class="card-text fs-2 fw-bold mb-1" :class="remainingBudget >= 0 ? 'text-success' : 'text-danger'">
                ${{ remainingBudget.toLocaleString() }}
              </p>
              <small v-if="remainingBudget < 0" class="text-danger fw-bold">⚠ 超支!</small>
              <small v-else class="text-success">尚可使用</small>
            </div>
          </div>
        </div>
      </div>

      <!-- 預算使用進度 -->
      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <h5 class="card-title mb-3">預算使用進度 (依實付金額)</h5>
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

      <!-- 支付方負擔統計 + 贊助貢獻榜 -->
      <div class="row g-3 mb-4">
        <div class="col-lg-6">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <h5 class="card-title mb-3">支付方負擔統計</h5>
              <div class="row text-center">
                <div class="col-4">
                  <div class="p-2">
                    <div class="text-muted small mb-1">新郎負擔</div>
                    <div class="fs-5 fw-bold text-primary">${{ payerData.groom.toLocaleString() }}</div>
                  </div>
                </div>
                <div class="col-4">
                  <div class="p-2">
                    <div class="text-muted small mb-1">新娘負擔</div>
                    <div class="fs-5 fw-bold text-danger">${{ payerData.bride.toLocaleString() }}</div>
                  </div>
                </div>
                <div class="col-4">
                  <div class="p-2">
                    <div class="text-muted small mb-1">共同負擔</div>
                    <div class="fs-5 fw-bold text-success">${{ payerData.mutual.toLocaleString() }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <h5 class="card-title mb-3">贊助貢獻榜</h5>
              <div v-if="sponsorRanking.length === 0" class="text-center text-muted py-3">
                <small>尚無贊助記錄</small>
              </div>
              <div v-else>
                <div v-for="(sponsor, index) in sponsorRanking" :key="sponsor.name" class="d-flex justify-content-between align-items-center py-2" :class="{ 'border-bottom': index < sponsorRanking.length - 1 }">
                  <div>
                    <span class="badge bg-warning text-dark me-2">{{ index + 1 }}</span>
                    <span class="fw-medium">{{ sponsor.name }}</span>
                  </div>
                  <span class="fw-bold text-info">${{ sponsor.amount.toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 花費類別分佈圖 -->
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

      <!-- 花費明細表 -->
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
                  <th>支付方</th>
                  <th>贊助</th>
                  <th>實付</th>
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
                  <td>
                    <span class="badge" :class="{
                      'bg-primary': expense.main_payer === 'groom',
                      'bg-danger': expense.main_payer === 'bride',
                      'bg-success': expense.main_payer === 'mutual' || !expense.main_payer
                    }">{{ getPayerLabel(expense.main_payer) }}</span>
                  </td>
                  <td>
                    <span v-if="getExpenseSponsorTotal(expense) > 0" class="text-info fw-bold">
                      ${{ getExpenseSponsorTotal(expense).toLocaleString() }}
                    </span>
                    <span v-else class="text-muted">-</span>
                  </td>
                  <td class="fw-bold text-warning">${{ getExpenseActualPaid(expense).toLocaleString() }}</td>
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

    <!-- 預算設定 Modal -->
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

    <!-- 花費編輯 Modal -->
    <div class="modal fade" id="expenseModal" tabindex="-1" ref="expenseModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? '編輯花費' : '新增花費' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">類別</label>
                <select class="form-select" v-model="editingExpense.category">
                  <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>
              <div class="col-md-6 mb-3" v-if="editingExpense.category === '其他'">
                <label class="form-label">自訂類別</label>
                <input type="text" class="form-control" v-model="customCategory">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">項目</label>
                <input type="text" class="form-control" v-model="editingExpense.item" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">金額</label>
                <input type="number" class="form-control" v-model.number="editingExpense.amount" min="0" required>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">日期</label>
                <input type="date" class="form-control" v-model="editingExpense.date" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">支付方</label>
                <select class="form-select" v-model="editingExpense.main_payer">
                  <option v-for="opt in payerOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">備註</label>
              <textarea class="form-control" v-model="editingExpense.note" rows="2"></textarea>
            </div>

            <!-- 贊助清單 -->
            <div class="mb-3">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <label class="form-label mb-0 fw-bold">贊助清單</label>
                <button type="button" class="btn btn-sm btn-outline-info" @click="addSponsorship">
                  <i class="bi bi-plus-circle me-1"></i>新增贊助人
                </button>
              </div>
              <div v-if="editingExpense.sponsorships && editingExpense.sponsorships.length > 0">
                <div v-for="(sponsor, index) in editingExpense.sponsorships" :key="sponsor.id" class="row g-2 mb-2 align-items-center">
                  <div class="col-5">
                    <input type="text" class="form-control form-control-sm" v-model="sponsor.name" placeholder="贊助人名稱">
                  </div>
                  <div class="col-5">
                    <div class="input-group input-group-sm">
                      <span class="input-group-text">$</span>
                      <input type="number" class="form-control" v-model.number="sponsor.amount" min="0" placeholder="金額">
                    </div>
                  </div>
                  <div class="col-2">
                    <button type="button" class="btn btn-sm btn-outline-danger w-100" @click="removeSponsorship(index)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="text-muted small">
                尚無贊助，點擊上方按鈕新增
              </div>

              <!-- 即時計算顯示 -->
              <div v-if="editingExpense.sponsorships && editingExpense.sponsorships.length > 0" class="mt-3 p-2 bg-light rounded">
                <div class="d-flex justify-content-between small">
                  <span>總額: ${{ (editingExpense.amount || 0).toLocaleString() }}</span>
                  <span>贊助: ${{ editingSponsorTotal.toLocaleString() }}</span>
                  <span class="fw-bold">實付: ${{ editingActualPaid.toLocaleString() }}</span>
                </div>
              </div>
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
