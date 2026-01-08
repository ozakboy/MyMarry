<template>
  <div class="seating-page">
    <NavBar />

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
              <h6 class="mb-0">未安排座位 ({{ getUnassignedSeatCount() }} 個座位)</h6>
            </div>
            <div class="card-body" style="max-height: 500px; overflow-y: auto;">
              <draggable
                v-model="unassignedGuestsList"
                :group="{ name: 'guests', pull: 'clone', put: false }"
                :clone="cloneGuest"
                item-key="seatId"
                class="draggable-list"
              >
                <template #item="{ element: seat }">
                  <div class="seat-card mb-2 p-2 border rounded bg-light" style="cursor: move;">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{{ seat.guestName }}</strong>
                        <span class="badge bg-secondary ms-1">{{ seat.seatNumber }}/{{ seat.totalSeats }}</span>
                        <span class="badge ms-1" :class="getMealTypeBadgeClass(seat.mealType)">{{ seat.mealType || '未設定' }}</span>
                        <br>
                        <small class="text-muted">{{ getSideName(seat.side) }}</small>
                      </div>
                      <button class="btn btn-sm btn-outline-primary" @click="showAssignModal(seat)">
                        安排
                      </button>
                    </div>
                  </div>
                </template>
              </draggable>
              <div v-if="getUnassignedSeatCount() === 0" class="text-center text-muted">
                <p>所有座位都已安排</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-9">
          <div class="mb-3">
            <button class="btn btn-primary" @click="exportToPDF">
              <i class="bi bi-file-earmark-pdf me-1"></i>匯出 PDF
            </button>
          </div>
          <draggable
            :list="tables"
            item-key="id"
            class="row"
            handle=".drag-handle"
            ghost-class="sortable-ghost"
            chosen-class="sortable-chosen"
            drag-class="sortable-drag"
            @end="onTableReorder"
          >
            <template #item="{ element: table, index }">
              <div class="col-md-6 col-lg-4 mb-4">
                <div class="card table-card">
                  <div class="card-header d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center flex-grow-1">
                      <i class="bi bi-grip-vertical drag-handle me-2" style="cursor: move; font-size: 20px;" title="拖曳排序"></i>
                      <h6 class="mb-0" @click="editTableName(index)" style="cursor: pointer;" title="點擊編輯桌名">
                        {{ table.name }}
                        <i class="bi bi-pencil-square ms-1 small"></i>
                        <span v-if="table.tableType" class="badge ms-1" :class="table.tableType === 'vegetarian' ? 'bg-success' : 'bg-danger'">
                          {{ table.tableType === 'vegetarian' ? '素桌' : '葷桌' }}
                        </span>
                      </h6>
                    </div>
                    <button class="btn btn-sm btn-outline-danger" @click="removeTable(index)">刪除</button>
                  </div>
                  <div class="card-body">
                    <p class="mb-2">
                      <small class="fw-bold" :class="getSeatColorClass(table)">
                        座位: {{ getCurrentSeats(table) }} / {{ table.maxSeats }}
                      </small>
                      <span v-if="getCurrentSeats(table) > table.maxSeats" class="ms-2">
                        <small class="text-danger">⚠ 超額</small>
                      </span>
                    </p>
                  <draggable
                    v-model="table.guests"
                    group="guests"
                    item-key="seatId"
                    class="guests-list"
                    :class="{ 'empty-table': table.guests.length === 0 }"
                  >
                    <template #item="{ element: seat, index: seatIndex }">
                      <div class="seat-card mb-2 p-2 border rounded" style="cursor: move;">
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{{ seat.guestName }}</strong>
                            <span class="badge bg-primary ms-1">{{ seat.seatNumber }}/{{ seat.totalSeats }}</span>
                            <span class="badge ms-1" :class="getMealTypeBadgeClass(seat.mealType)">{{ seat.mealType || '未設定' }}</span>
                            <br>
                            <small class="text-muted">{{ getSideName(seat.side) }}</small>
                          </div>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            @click="removeGuestFromTable(index, seatIndex)"
                          >
                            移除
                          </button>
                        </div>
                      </div>
                    </template>
                  </draggable>
                    <div v-if="table.guests.length === 0" class="text-center text-muted py-3">
                      <small>拖曳座位到此處</small>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </draggable>

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
            <h5 class="modal-title">
              安排座位 - {{ selectedGuest?.guestName }}
              <span class="badge bg-secondary">{{ selectedGuest?.seatNumber }}/{{ selectedGuest?.totalSeats }}</span>
            </h5>
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

    <div class="modal fade" id="editTableModal" tabindex="-1" ref="editTableModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">編輯桌次</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">桌次名稱</label>
              <input type="text" class="form-control" v-model="editingTableName" placeholder="例如：主桌、第1桌">
            </div>
            <div class="mb-3">
              <label class="form-label">桌次類型</label>
              <select class="form-select" v-model="editingTableType">
                <option value="">不設定</option>
                <option value="meat">葷桌</option>
                <option value="vegetarian">素桌</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="saveTableEdit">確定</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./SeatingChart.js"></script>

<style src="./SeatingChart.scss" scoped lang="scss"></style>
