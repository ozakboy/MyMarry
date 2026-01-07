<template>
  <div class="min-vh-100 py-3 py-sm-4 py-md-5" style="background: linear-gradient(135deg, #ffb6c1 0%, #ff69b4 100%);">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-8">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-3 p-sm-4 p-md-5">
              <!-- 標題 -->
              <div class="text-center mb-3 mb-md-4">
                <h2 class="fw-bold mb-2" style="color: #d4357f;">📝 出席回覆表單</h2>
                <p class="text-muted">請填寫以下資訊,謝謝您!</p>
              </div>

              <!-- 表單 -->
              <form @submit.prevent="submitForm">
                <!-- 基本資訊 -->
                <div class="mb-3 mb-md-4">
                  <h5 class="text-secondary mb-3">基本資訊</h5>

                  <!-- 姓名 -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">姓名 <span class="text-danger">*</span></label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.name"
                      required
                      placeholder="請輸入您的姓名"
                    >
                  </div>

                  <!-- 聯絡電話 -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">聯絡電話 <span class="text-danger">*</span></label>
                    <input
                      type="tel"
                      class="form-control"
                      v-model="formData.phone"
                      required
                      placeholder="請輸入您的聯絡電話"
                    >
                  </div>

                  <!-- 關係 -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">您與新人的關係 <span class="text-danger">*</span></label>
                    <select class="form-select" v-model="formData.relationship" required>
                      <option value="">請選擇</option>
                      <option v-for="option in relationshipOptions" :key="option" :value="option">
                        {{ option }}
                      </option>
                    </select>
                  </div>

                  <!-- 自訂關係 -->
                  <div class="mb-3" v-if="formData.relationship === '其他'">
                    <label class="form-label fw-bold">請說明 <span class="text-danger">*</span></label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.customRelationship"
                      :required="formData.relationship === '其他'"
                      placeholder="請輸入您與新人的關係"
                    >
                  </div>

                  <!-- 男方/女方 -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">賓客屬性 <span class="text-danger">*</span></label>
                    <div class="d-flex gap-3">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="side"
                          id="sideGroom"
                          value="groom"
                          v-model="formData.side"
                          required
                        >
                        <label class="form-check-label" for="sideGroom">
                          🤵 男方賓客
                        </label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="side"
                          id="sideBride"
                          value="bride"
                          v-model="formData.side"
                          required
                        >
                        <label class="form-check-label" for="sideBride">
                          👰 女方賓客
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <hr class="my-3 my-md-4">

                <!-- 出席意願 -->
                <div class="mb-3 mb-md-4">
                  <h5 class="text-secondary mb-3">出席意願</h5>

                  <div class="mb-3">
                    <label class="form-label fw-bold">是否出席 <span class="text-danger">*</span></label>
                    <div class="d-flex gap-3">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="willAttend"
                          id="attendYes"
                          value="yes"
                          v-model="formData.willAttend"
                          required
                        >
                        <label class="form-check-label" for="attendYes">
                          ✅ 會出席
                        </label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="willAttend"
                          id="attendNo"
                          value="no"
                          v-model="formData.willAttend"
                          required
                        >
                        <label class="form-check-label" for="attendNo">
                          ❌ 不出席
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 出席相關資訊（僅在選擇"會出席"時顯示） -->
                <div v-if="formData.willAttend === 'yes'">
                  <hr class="my-3 my-md-4">

                  <div class="mb-3 mb-md-4">
                    <h5 class="text-secondary mb-3">出席資訊</h5>

                    <!-- 出席人數 -->
                    <div class="mb-3">
                      <label class="form-label fw-bold">出席人數（含您本人） <span class="text-danger">*</span></label>
                      <input
                        type="number"
                        class="form-control"
                        v-model.number="formData.attendees"
                        min="1"
                        max="20"
                        :required="formData.willAttend === 'yes'"
                      >
                    </div>

                    <!-- 餐點類型 -->
                    <div class="mb-3">
                      <label class="form-label fw-bold">餐點類型 <span class="text-danger">*</span></label>
                      <select class="form-select" v-model="formData.mealType" :required="formData.willAttend === 'yes'">
                        <option value="葷食">葷食</option>
                        <option value="素食">素食</option>
                      </select>
                    </div>

                    <!-- 兒童座椅 -->
                    <div class="mb-3">
                      <label class="form-label fw-bold">是否需要兒童座椅?</label>
                      <div class="d-flex gap-3 mb-2">
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="radio"
                            name="needChildSeat"
                            id="childSeatYes"
                            value="yes"
                            v-model="formData.needChildSeat"
                          >
                          <label class="form-check-label" for="childSeatYes">
                            需要
                          </label>
                        </div>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="radio"
                            name="needChildSeat"
                            id="childSeatNo"
                            value="no"
                            v-model="formData.needChildSeat"
                          >
                          <label class="form-check-label" for="childSeatNo">
                            不需要
                          </label>
                        </div>
                      </div>

                      <!-- 座椅數量 -->
                      <div v-if="formData.needChildSeat === 'yes'" class="mt-2">
                        <label class="form-label">需要幾張? <span class="text-danger">*</span></label>
                        <input
                          type="number"
                          class="form-control"
                          v-model.number="formData.childSeatCount"
                          min="1"
                          max="10"
                          :required="formData.needChildSeat === 'yes'"
                        >
                      </div>
                    </div>

                    <!-- 喜帖寄送 -->
                    <div class="mb-3">
                      <label class="form-label fw-bold">是否需要寄送實體喜帖?</label>
                      <div class="d-flex gap-3 mb-2">
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="radio"
                            name="needInvitation"
                            id="invitationYes"
                            value="yes"
                            v-model="formData.needInvitation"
                          >
                          <label class="form-check-label" for="invitationYes">
                            需要
                          </label>
                        </div>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="radio"
                            name="needInvitation"
                            id="invitationNo"
                            value="no"
                            v-model="formData.needInvitation"
                          >
                          <label class="form-check-label" for="invitationNo">
                            不需要
                          </label>
                        </div>
                      </div>

                      <!-- 收件資料 -->
                      <div v-if="formData.needInvitation === 'yes'" class="mt-3 p-3 bg-light rounded">
                        <h6 class="mb-3">收件資料</h6>

                        <div class="mb-3">
                          <label class="form-label">收件人 <span class="text-danger">*</span></label>
                          <input
                            type="text"
                            class="form-control"
                            v-model="formData.invitationRecipient"
                            :required="formData.needInvitation === 'yes'"
                            placeholder="收件人姓名"
                          >
                        </div>

                        <div class="mb-3">
                          <label class="form-label">收件地址 <span class="text-danger">*</span></label>
                          <input
                            type="text"
                            class="form-control"
                            v-model="formData.invitationAddress"
                            :required="formData.needInvitation === 'yes'"
                            placeholder="完整收件地址"
                          >
                        </div>

                        <div class="mb-0">
                          <label class="form-label">收件人電話 <span class="text-danger">*</span></label>
                          <input
                            type="tel"
                            class="form-control"
                            v-model="formData.invitationPhone"
                            :required="formData.needInvitation === 'yes'"
                            placeholder="收件人聯絡電話"
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr class="my-3 my-md-4">

                <!-- 祝福與備註 -->
                <div class="mb-3 mb-md-4">
                  <h5 class="text-secondary mb-3">祝福與備註</h5>

                  <!-- 祝福留言 -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">給新人的祝福</label>
                    <textarea
                      class="form-control"
                      v-model="formData.blessing"
                      rows="3"
                      placeholder="請留下您對新人的祝福..."
                    ></textarea>
                  </div>

                  <!-- 其他備註 -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">其他備註</label>
                    <textarea
                      class="form-control"
                      v-model="formData.note"
                      rows="2"
                      placeholder="如有特殊需求或其他事項,請在此說明"
                    ></textarea>
                  </div>
                </div>

                <!-- 提交按鈕 -->
                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary btn-lg" :disabled="isSubmitting">
                    <span v-if="!isSubmitting">✅ 送出表單</span>
                    <span v-else>
                      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      送出中...
                    </span>
                  </button>
                  <router-link to="/" class="btn btn-outline-secondary">
                    ← 返回首頁
                  </router-link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./Form.js"></script>

<style src="./Form.scss" scoped></style>
