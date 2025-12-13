# 多階段建置 - 階段 1: 建置前端
FROM node:22-alpine AS frontend-builder

WORKDIR /app

# 安裝 pnpm
RUN npm install -g pnpm

# 複製所有檔案
COPY . .

# 安裝依賴（如果 pnpm-lock.yaml 存在則使用 frozen-lockfile，否則正常安裝）
RUN if [ -f pnpm-lock.yaml ]; then \
      pnpm install --frozen-lockfile; \
    else \
      pnpm install; \
    fi

# 建置前端
RUN pnpm run build

# 多階段建置 - 階段 2: 後端運行環境
FROM node:22-alpine AS backend

WORKDIR /app

# 安裝生產環境依賴
RUN npm install express@5.2.1 cors@2.8.5

# 複製後端程式碼
COPY server ./server

# 建立資料目錄
RUN mkdir -p /app/data && \
    echo '[]' > /app/data/responses.json

# 暴露後端 API port
EXPOSE 4600

# 啟動後端服務
CMD ["node", "server/index.js"]

# 多階段建置 - 階段 3: Nginx 服務前端
FROM nginx:alpine AS production

# 複製前端建置結果
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# 複製 nginx 設定
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 HTTP port
EXPOSE 4500

CMD ["nginx", "-g", "daemon off;"]
