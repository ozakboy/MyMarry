#!/bin/sh

# Docker 容器啟動腳本
# 此腳本會在容器啟動時執行,用於初始化所有必要的資料檔案

echo "========================================="
echo "婚禮管理系統 - 資料檔案初始化"
echo "========================================="

# 初始化 responses.json
if [ ! -f /app/data/responses.json ]; then
  echo "[]" > /app/data/responses.json
  echo "✓ responses.json 已初始化"
else
  echo "✓ responses.json 已存在,跳過初始化"
fi

# 初始化 wedding-config.json (僅在不存在時從預設範本複製)
if [ ! -f /app/data/wedding-config.json ]; then
  if [ -f /app/public/wedding-config.json ]; then
    cp /app/public/wedding-config.json /app/data/wedding-config.json
    echo "✓ wedding-config.json 已從預設範本複製到 data 目錄"
  else
    echo "✗ 找不到預設的 wedding-config.json 範本"
  fi
else
  echo "✓ wedding-config.json 已存在,跳過初始化 (保留現有設定)"
fi

# 初始化 expenses.json
if [ ! -f /app/data/expenses.json ]; then
  echo "[]" > /app/data/expenses.json
  echo "✓ expenses.json 已初始化"
else
  echo "✓ expenses.json 已存在,跳過初始化"
fi

# 初始化 wedding-schedule.json
if [ ! -f /app/data/wedding-schedule.json ]; then
  echo "[]" > /app/data/wedding-schedule.json
  echo "✓ wedding-schedule.json 已初始化"
else
  echo "✓ wedding-schedule.json 已存在,跳過初始化"
fi

# 初始化 staff-assignment.json
if [ ! -f /app/data/staff-assignment.json ]; then
  echo "[]" > /app/data/staff-assignment.json
  echo "✓ staff-assignment.json 已初始化"
else
  echo "✓ staff-assignment.json 已存在,跳過初始化"
fi

# 初始化 seating-chart.json
if [ ! -f /app/data/seating-chart.json ]; then
  echo '{"tables":[],"unassigned":[]}' > /app/data/seating-chart.json
  echo "✓ seating-chart.json 已初始化"
else
  echo "✓ seating-chart.json 已存在,跳過初始化"
fi

echo "========================================="
echo "資料檔案初始化完成,啟動伺服器..."
echo "========================================="

# 啟動 Node.js 伺服器
node server/index.js
