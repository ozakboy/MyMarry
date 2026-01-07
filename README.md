# 婚禮出席詢問系統

基於 Vue 3 + Vite + Express 的婚禮賓客出席回覆系統

**當前版本**: v1.2.0

## 功能特色

- 💒 **首頁/婚禮邀請頁** - 溫馨的婚禮邀請介面
- 📝 **出席表單填寫** - 訪客可填寫出席資訊
  - 基本資料（姓名、電話、關係、男方/女方）
  - 出席意願（是/否）
  - 出席人數、餐點選擇
  - 兒童座椅需求
  - 喜帖寄送地址
  - 祝福留言
- 📊 **表單查閱頁面** - 管理員專用（隱藏路由 `/MarryList`）
  - 查看所有回覆資料(含完整喜帖寄送資訊)
  - 編輯賓客資料功能(含禮金、喜餅數量)
  - 男/女方快速篩選功能
  - 統計總人數、預計桌數、禮金總額、喜餅總數
  - 男女方賓客統計(回覆數、出席數、總人數、禮金)
  - 餐點統計(葷素人數)、兒童座椅需求
  - 關係類型統計(家人、朋友、同事等)
  - 刪除功能
- ⚙️ **系統設定頁面** - 管理員專用（隱藏路由 `/Settings`）
  - 修改新人資訊、婚禮日期時間
  - 修改宴客場地完整資訊
  - 修改邀請函文字內容
  - 修改聯絡資訊
  - 調整預設喜餅數量和每桌人數
- 🔍 **快速查詢頁面** - 管理員專用（隱藏路由 `/QuickView`）
  - 快速查看所有賓客出席名單
  - 男方/女方賓客快速篩選
  - 姓名搜尋功能
  - 禮金總額統計（總額、男方、女方分別統計）
  - 賓客數量統計（總數、男方、女方分別統計）
  - 可即時編輯禮金金額
- 💰 **花費統計頁面** - 管理員專用（隱藏路由 `/Expenses`）
  - 婚禮準備花費分類管理（場地、喜餅、喜帖、佈置、攝影、其他）
  - 圖形化統計（圓餅圖顯示各類別支出佔比）
  - 新增/編輯/刪除花費項目
  - 花費總額即時計算
- 📅 **婚禮流程頁面** - 管理員專用（隱藏路由 `/WeddingSchedule`）
  - 訂婚/結婚流程時間表管理
  - 支援新增/編輯/刪除流程項目
  - 時間選擇器整合
  - 流程類型分類（訂婚、結婚）
- 👥 **人員配置頁面** - 管理員專用（隱藏路由 `/StaffAssignment`）
  - 婚禮工作人員職責分配管理
  - 可指定負責人員和備註說明
  - 新增/編輯/刪除人員配置
- 🪑 **座位表頁面** - 管理員專用（隱藏路由 `/SeatingChart`）
  - 賓客座位安排管理
  - 桌次管理（新增/刪除桌次）
  - 拖拉式座位分配（支援賓客拖放到桌次）
  - 即時顯示座位人數（當前/最大，顏色提示）
  - 未分配賓客列表
  - 視覺化座位配置介面
  - 自動安排功能
- 💾 **JSON 資料存儲** - 所有資料儲存於 `data/` 目錄
- 📱 **完整 RWD 響應式設計** - 使用 Bootstrap 5
- ✅ **動態婚禮資訊** - 透過圖形化設定頁面或 `public/wedding-config.json` 修改

## 安裝與啟動

### 1. 安裝依賴

```bash
pnpm install
```

### 2. 啟動後端 API 伺服器

```bash
pnpm run server
```

### 3. 啟動前端開發伺服器

```bash
pnpm run dev
```

訪問：http://localhost:5173

## 建置生產版本

```bash
# 建置前端
pnpm run build

# 建置後端獨立執行檔（Windows）
pnpm run build:server
```

## 部署方式

### 方式 1: Docker 部署（推薦用於 Linux）

```bash
# 快速啟動
docker-compose up -d

# 查看狀態
docker-compose ps

# 查看日誌
docker-compose logs -f
```

**適用場景**: Linux 主機、雲端伺服器、容器化環境

---

### 方式 2: Windows 獨立執行檔（推薦用於 Windows）

```batch
# 1. 打包專案
一鍵部署打包.bat

# 2. 複製 marry-deploy 資料夾到伺服器
# 3. 雙擊 啟動服務.bat
```

**適用場景**: Windows Server、IIS 環境、無需安裝 Node.js

---

### 方式 3: 傳統 Node.js 部署

```bash
pnpm run build
pnpm install --production
node server/index.js
```

**適用場景**: 已有 Node.js 環境的任何平台

## API 端點

**API 伺服器預設 Port**: 4600 (可透過環境變數 PORT 調整)

**賓客回覆相關**
- `GET /api/responses` - 取得所有回覆資料
- `POST /api/responses` - 新增回覆資料
- `PUT /api/responses/:id` - 更新指定回覆
- `DELETE /api/responses/:id` - 刪除指定回覆

**系統設定相關**
- `POST /api/config` - 更新婚禮設定 (wedding-config.json)

**花費統計相關**
- `GET /api/expenses` - 取得所有花費資料
- `POST /api/expenses` - 新增花費項目
- `PUT /api/expenses/:id` - 更新指定花費
- `DELETE /api/expenses/:id` - 刪除指定花費

**婚禮流程相關**
- `GET /api/schedule` - 取得所有流程資料
- `POST /api/schedule` - 新增流程項目
- `PUT /api/schedule/:id` - 更新指定流程
- `DELETE /api/schedule/:id` - 刪除指定流程

**人員配置相關**
- `GET /api/staff` - 取得所有人員配置
- `POST /api/staff` - 新增人員配置
- `PUT /api/staff/:id` - 更新指定配置
- `DELETE /api/staff/:id` - 刪除指定配置

**座位表相關**
- `GET /api/seating` - 取得座位表資料
- `POST /api/seating` - 更新座位表資料

## 技術棧

- **前端**: Vue 3 + Vue Router + Vite + Bootstrap 5
- **UI 元件**: Chart.js + Vue-Chartjs (圖表)、VueDraggable (拖拉)、Vue Datepicker (日期選擇)
- **樣式**: SCSS (Sass)
- **後端**: Node.js + Express
- **資料存儲**: JSON 檔案 (responses.json, expenses.json, wedding-schedule.json, staff-assignment.json, seating-chart.json)
- **部署**: Docker / IIS / Node.js

## 修改婚禮資訊

編輯 `public/wedding-config.json`：

```json
{
  "groom": { "name": "新郎名字" },
  "bride": { "name": "新娘名字" },
  "wedding": {
    "date": "2025年02月07日",
    "time": "晚上 6:00",
    "venue": {
      "name": "宴客地點",
      "address": "詳細地址"
    }
  }
}
```

無需重新建置，直接生效！

