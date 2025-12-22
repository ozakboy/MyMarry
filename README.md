# 婚禮出席詢問系統

基於 Vue 3 + Vite + Express 的婚禮賓客出席回覆系統

**當前版本**: v1.0.0

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
  - 編輯賓客資料功能
  - 統計總人數、葷素人數、座椅需求
  - 男女方賓客統計(回覆數、出席數、總人數)
  - 關係類型統計(家人、朋友、同事等)
  - 刪除功能
- 💾 **JSON 資料存儲** - 所有資料儲存於 `server/data/responses.json`
- 📱 **完整 RWD 響應式設計** - 使用 Bootstrap 5
- ✅ **動態婚禮資訊** - 透過 `public/wedding-config.json` 設定

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

- `GET /api/responses` - 取得所有回覆資料
- `POST /api/responses` - 新增回覆資料
- `PUT /api/responses/:id` - 更新指定回覆
- `DELETE /api/responses/:id` - 刪除指定回覆

## 技術棧

- **前端**: Vue 3 + Vue Router + Vite + Bootstrap 5
- **後端**: Node.js + Express
- **資料存儲**: JSON 檔案
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

## 版本紀錄

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

## 版本更新紀錄指令說明

**此系統使用手動版本管理,當需要記錄新版本時:**

### 建立新版本更新紀錄

1. 更新 `package.json` 中的版本號:
   ```json
   "version": "1.1.0"
   ```

2. 在 `README.md` 的「版本紀錄」區塊新增版本資訊:
   ```markdown
   ### v1.1.0 (YYYY-MM-DD)
   **版本說明**

   **新功能:**
   - 功能描述

   **修復:**
   - 修復項目

   **技術改進:**
   - 改進項目
   ```

3. 提交變更到 Git:
   ```bash
   git add .
   git commit -m "chore: bump version to 1.1.0"
   git tag v1.1.0
   git push origin master --tags
   ```

### 版本號規則 (語義化版本 Semantic Versioning)

- **主版本號 (Major)**: 不相容的 API 修改
- **次版本號 (Minor)**: 向下相容的功能新增
- **修訂號 (Patch)**: 向下相容的問題修正

範例:
- `1.0.0` → `1.0.1`: 修復 Bug
- `1.0.0` → `1.1.0`: 新增功能
- `1.0.0` → `2.0.0`: 重大變更

### AI 快速建立版本更新指令

**當你需要 AI 協助建立新版本時,可以使用以下指令:**

```
請幫我建立版本更新紀錄:
- 新版本號: [版本號,例如 1.1.0]
- 更新內容: [描述你做的修改]
```

**AI 會自動:**
1. 更新 package.json 的版本號
2. 在 README.md 新增格式化的版本紀錄
3. 包含日期和詳細分類的更新內容
