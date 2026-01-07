<template>
  <div class="min-vh-100 d-flex align-items-center" style="background: linear-gradient(135deg, #ffd1dc 0%, #ffb6c1 100%);">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-8">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-3 p-sm-4 p-md-5">
              <!-- 標題區 -->
              <div class="text-center mb-3 mb-md-4">
                <h1 class="display-4 fw-bold mb-2 mb-md-3" style="color: #d4357f;">💒 婚禮邀請 💒</h1>
                <p class="lead text-muted mb-3 mb-md-4" v-if="weddingInfo">{{ weddingInfo.invitation?.greeting || '親愛的朋友:' }}</p>
                <p class="fs-5 mb-0" style="white-space: pre-line;" v-if="weddingInfo">
                  {{ weddingInfo.invitation?.message || '我們即將攜手步入人生的新階段\n誠摯邀請您蒞臨見證我們的幸福時刻' }}
                </p>
              </div>

              <hr class="my-3 my-md-4">

              <!-- 新人資訊 -->
              <div class="row text-center mb-3 mb-md-4" v-if="weddingInfo">
                <div class="col-6">
                  <h3 class="mb-2" style="color: #d4357f;">🤵 新郎</h3>
                  <p class="fs-4 fw-bold mb-0">{{ weddingInfo.groom?.name || '新郎' }}</p>
                </div>
                <div class="col-6">
                  <h3 class="mb-2" style="color: #ff69b4;">👰 新娘</h3>
                  <p class="fs-4 fw-bold mb-0">{{ weddingInfo.bride?.name || '新娘' }}</p>
                </div>
              </div>

              <hr class="my-3 my-md-4">

              <!-- 婚禮資訊 -->
              <div class="mb-3 mb-md-4" v-if="weddingInfo">
                <h4 class="text-center mb-3 mb-md-4">📅 婚禮資訊</h4>
                <div class="row g-3">
                  <div class="col-12 col-sm-6">
                    <div class="d-flex align-items-center">
                      <span class="badge me-2" style="background-color: #ff69b4;">日期</span>
                      <span class="fs-6">{{ weddingInfo.wedding?.date || '2025年02月07日' }} {{ weddingInfo.wedding?.dayOfWeek || '星期六' }}</span>
                    </div>
                  </div>
                  <div class="col-12 col-sm-6">
                    <div class="d-flex align-items-center">
                      <span class="badge me-2" style="background-color: #ff69b4;">時間</span>
                      <span class="fs-6">{{ weddingInfo.wedding?.time || '晚上 6:00' }}</span>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="d-flex align-items-start">
                      <span class="badge me-2" style="background-color: #ff69b4;">地點</span>
                      <div class="flex-grow-1">
                        <div class="fs-6 mb-1">{{ weddingInfo.wedding?.venue?.name || '新喜樓' }} {{ weddingInfo.wedding?.venue?.type || '餐廳' }}</div>
                        <div class="text-muted small">{{ weddingInfo.wedding?.venue?.address || '428台灣臺中市大雅區民生路四段198號' }}</div>
                        <div class="text-muted small" v-if="weddingInfo.wedding?.venue?.floor">{{ weddingInfo.wedding?.venue?.floor }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Google 地圖 -->
              <div class="mb-3 mb-md-4" v-if="weddingInfo?.wedding?.venue?.googleMapUrl">
                <a :href="weddingInfo.wedding.venue.googleMapUrl" target="_blank" class="btn btn-outline-success w-100 d-flex align-items-center justify-content-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                  </svg>
                  <span>在 Google 地圖中查看</span>
                </a>
              </div>

              <hr class="my-3 my-md-4">

              <!-- RSVP 說明 -->
              <div class="text-center mb-3 mb-md-4" v-if="weddingInfo">
                <p class="mb-3" style="white-space: pre-line;">{{ weddingInfo.invitation?.rsvpText || '請您填寫以下表單\n讓我們知道您的出席狀況' }}</p>
                <router-link to="/form" class="btn btn-lg px-4 px-md-5" style="background-color: #ff69b4; border: none; color: white;">
                  📝 填寫出席表單
                </router-link>
              </div>

              <!-- 聯絡資訊 -->
              <div class="text-center mt-3 mt-md-4 pt-3 pt-md-4 border-top" v-if="weddingInfo?.contact">
                <p class="text-muted small mb-2">- 如有任何問題 , 歡迎聯絡我們 -</p>
                <p class="text-muted small mb-0" v-if="weddingInfo.contact.groomPhone || weddingInfo.contact.bridePhone">
                  新郎:{{ weddingInfo.contact.groomPhone || 'N/A' }} |
                  新娘:{{ weddingInfo.contact.bridePhone || 'N/A' }}
                </p>
                <p class="text-muted small mb-0" v-if="weddingInfo.contact.email">
                  Email: {{ weddingInfo.contact.email }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./Home.js"></script>

<style src="./Home.scss" scoped></style>
