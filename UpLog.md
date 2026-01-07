
## 版本紀錄

### v1.2.0 (2026-01-07)
**五大管理功能模組上線 & 架構全面重構**

**新功能:**
- 新增快速查詢頁面 (`/QuickView`)
  - 快速查看所有賓客出席名單
  - 男方/女方賓客快速篩選功能
  - 姓名搜尋功能
  - 禮金總額統計 (總額、男方、女方分別統計)
  - 賓客數量統計 (總數、男方、女方分別統計)
  - 可即時編輯禮金金額
- 新增花費統計頁面 (`/Expenses`)
  - 婚禮準備花費分類管理 (場地、喜餅、喜帖、佈置、攝影、其他)
  - 圖形化統計 (圓餅圖顯示各類別支出佔比)
  - 新增/編輯/刪除花費項目功能
  - 花費總額即時計算
- 新增婚禮流程頁面 (`/WeddingSchedule`)
  - 訂婚/結婚流程時間表管理
  - 支援新增/編輯/刪除流程項目
  - 時間選擇器整合 (使用 @vuepic/vue-datepicker)
  - 流程類型分類 (訂婚、結婚)
- 新增人員配置頁面 (`/StaffAssignment`)
  - 婚禮工作人員職責分配管理
  - 可指定負責人員和備註說明
  - 新增/編輯/刪除人員配置功能
- 新增座位表頁面 (`/SeatingChart`)
  - 賓客座位安排管理
  - 桌次管理 (新增/刪除桌次)
  - 未分配賓客列表
  - 視覺化座位配置介面

**架構重構 (遵循 AI.md Separation of Concerns 原則):**
- 所有元件重構為三檔案分離架構
  - `.vue` 檔案:僅包含 template
  - `.js` 檔案:僅包含邏輯 (export default)
  - `.scss` 檔案:僅包含樣式 (具體數值,無變數)
- 9 個元件完成 SoC 重構:
  - Home, Form, Admin, Settings (既有元件)
  - QuickView, Expenses, WeddingSchedule, StaffAssignment, SeatingChart (新元件)
- 檔案命名統一為 PascalCase,消除 index.vue 模式
- 資料夾結構調整:每個元件獨立資料夾

**元件抽取:**
- 新增 NavBar 元件 (`/components/NavBar`)
  - 統一導航列元件,所有管理頁面共用
  - 包含所有選單項目 + 🏠 返回首頁選項
  - 自動高亮當前頁面
  - 應用於 7 個管理頁面

**技術改進:**
- 新增 SCSS 支援 (sass ^1.83.4, sass-loader ^16.0.4)
- 新增依賴套件:
  - `@vuepic/vue-datepicker` ^9.0.3 (日期時間選擇器)
  - `chart.js` ^4.5.1 (圖表庫)
  - `vue-chartjs` ^5.3.1 (Vue 3 圖表整合)
  - `vuedraggable` ^4.1.0 (拖拉功能)
- Vite 設定新增 `@` alias 支援 (`@/components/...`)
- 新增 4 個資料檔案:
  - `data/expenses.json` (花費統計資料)
  - `data/wedding-schedule.json` (婚禮流程資料)
  - `data/staff-assignment.json` (人員配置資料)
  - `data/seating-chart.json` (座位表資料)
- 新增完整 RESTful API 端點:
  - `/api/expenses` (GET, POST, PUT, DELETE)
  - `/api/schedule` (GET, POST, PUT, DELETE)
  - `/api/staff` (GET, POST, PUT, DELETE)
  - `/api/seating` (GET, POST)
- Docker 部署改進:
  - 新增獨立 `start.sh` 啟動腳本
  - 容器啟動時自動初始化所有 6 個資料檔案
  - 保留現有資料,僅在檔案不存在時初始化
  - `wedding-config.json` 從 public/ 範本複製

**修復:**
- 修復 QuickView 欄位名稱錯誤 (side, attendees, childSeatCount)
- 修復 package.json UTF-8 BOM 問題
- 修復路由指向新資料夾結構

**功能特色更新:**
- 提供完整婚禮準備管理工具組 (出席、查詢、花費、流程、人員、座位)
- 統一導航列設計,操作體驗一致
- 模組化架構,易於維護和擴充

---

### v1.1.0 (2025-12-22)
**功能增強與設定頁面新增**

**新功能:**
- 新增系統設定頁面 (`/Settings`)
  - 可修改新人資訊 (新郎/新娘名字、全名)
  - 可修改婚禮基本資訊 (日期、星期、時間)
  - 可修改宴客場地資訊 (名稱、類型、地址、樓層、電話、Google地圖連結)
  - 可修改邀請函文字 (問候語、邀請訊息、回覆提示)
  - 可修改聯絡資訊 (新郎/新娘電話、信箱)
  - 可調整預設喜餅數量和每桌人數
- MarryList 新增男/女方快速篩選功能
- MarryList 新增禮金功能 (可輸入訪客禮金金額)
- MarryList 新增禮金總額統計
- MarryList 新增男女方分別禮金統計 (顯示在男女方賓客卡片中)
- MarryList 新增預計桌數統計 (依據出席人數/每桌人數計算)
- MarryList 新增喜餅數量統計 (每個出席家庭預設數量,可個別調整)
- 統計區塊 UI/UX 重新設計 (使用漸層色卡片,更清晰的資訊分類)

**技術改進:**
- 新增 POST /api/config API 端點支援婚禮設定更新
- Settings 頁面完整整合所有 wedding-config.json 欄位
- Admin 頁面新增 giftMoneyByGender 計算邏輯
- 優化統計數據計算,支援動態喜餅數量和禮金統計

**功能特色更新:**
- Settings 頁面提供圖形化介面修改婚禮設定,無需手動編輯 JSON 檔案
- 禮金統計提供總額及男女方分別統計,方便新人追蹤
- 喜餅數量可彈性調整,支援基礎數量設定及個別家庭客製化

---

### v1.0.0 (2025-12-22)
**初始正式版本發布**

**新功能:**
- 完整的婚禮出席回覆系統
- 賓客資料編輯功能
- 完整喜帖寄送資訊顯示(收件人、電話、地址)
- 男女方賓客統計(回覆數、出席數、總人數)
- 關係類型統計(家人、朋友、同事等分類統計)

**修復:**
- 修復 pnpm dev 開發環境 API 呼叫問題,API Port 改為 4600

**技術改進:**
- 新增 PUT /api/responses/:id API 端點支援資料更新
- 前端新增編輯對話框(Modal)介面
- 優化統計數據顯示,新增詳細分類統計

---