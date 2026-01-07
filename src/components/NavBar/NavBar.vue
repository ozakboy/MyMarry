<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
    <div class="container-fluid">
      <router-link to="/MarryList" class="navbar-brand fw-bold">
        💒 婚禮管理系統
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/MarryList" class="nav-link" :class="{ active: currentRoute === '/MarryList' }">
              出席名單
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/QuickView" class="nav-link" :class="{ active: currentRoute === '/QuickView' }">
              快速查詢
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/Expenses" class="nav-link" :class="{ active: currentRoute === '/Expenses' }">
              花費統計
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/WeddingSchedule" class="nav-link" :class="{ active: currentRoute === '/WeddingSchedule' }">
              婚禮流程
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/StaffAssignment" class="nav-link" :class="{ active: currentRoute === '/StaffAssignment' }">
              人員配置
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/SeatingChart" class="nav-link" :class="{ active: currentRoute === '/SeatingChart' }">
              座位表
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/Settings" class="nav-link" :class="{ active: currentRoute === '/Settings' }">
              系統設定
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/" class="nav-link">
              🏠 返回首頁
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script src="./NavBar.js"></script>

<style src="./NavBar.scss" scoped lang="scss"></style>
