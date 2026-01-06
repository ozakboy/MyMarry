import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 4600

// 中介軟體
app.use(cors())
app.use(express.json({ charset: 'utf-8' }))

// JSON 資料檔案路徑
const dataFile = process.env.NODE_ENV === 'production'
  ? '/app/data/responses.json'
    : path.join(__dirname, 'data', 'responses.json')

console.log('Data file path:', dataFile)

// wedding-config.json 路徑
const configFile = process.env.NODE_ENV === 'production'
  ? '/app/data/wedding-config.json'
    : path.join(__dirname, 'data', 'wedding-config.json')

console.log('config file path:', configFile)
// 初始化資料檔案
const dataDir = path.dirname(dataFile)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([]), 'utf-8')
}

// 初始化 wedding-config.json (僅在生產環境且檔案不存在時複製)
if (process.env.NODE_ENV === 'production' && !fs.existsSync(configFile)) {
  const defaultConfigPath = '/app/public/wedding-config.json'
  if (fs.existsSync(defaultConfigPath)) {
    fs.copyFileSync(defaultConfigPath, configFile)
    console.log('wedding-config.json 已從預設範本複製到 data 目錄')
  }
}

// 讀取所有回覆資料
app.get('/api/responses', (req, res) => {
  try {
    const data = fs.readFileSync(dataFile, 'utf-8')
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.json(JSON.parse(data))
  } catch (error) {
    console.error('讀取資料錯誤：', error)
    res.status(500).json({ error: '讀取資料失敗' })
  }
})

// 新增回覆資料
app.post('/api/responses', (req, res) => {
  try {
    const data = fs.readFileSync(dataFile, 'utf-8')
    const responses = JSON.parse(data)

    const newResponse = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...req.body
    }

    console.log('收到新資料：', newResponse)

    responses.push(newResponse)
    fs.writeFileSync(dataFile, JSON.stringify(responses, null, 2), 'utf-8')

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.status(201).json({ message: '資料儲存成功', data: newResponse })
  } catch (error) {
    console.error('儲存資料錯誤：', error)
    res.status(500).json({ error: '儲存資料失敗' })
  }
})

// 更新回覆資料
app.put('/api/responses/:id', (req, res) => {
  try {
    const data = fs.readFileSync(dataFile, 'utf-8')
    const responses = JSON.parse(data)

    const index = responses.findIndex(r => r.id === parseInt(req.params.id))
    if (index === -1) {
      return res.status(404).json({ error: '找不到該資料' })
    }

    responses[index] = {
      ...responses[index],
      ...req.body,
      id: responses[index].id,
      timestamp: responses[index].timestamp
    }

    fs.writeFileSync(dataFile, JSON.stringify(responses, null, 2), 'utf-8')

    console.log(`更新資料 ID: ${req.params.id}`)
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.json({ message: '資料更新成功', data: responses[index] })
  } catch (error) {
    console.error('更新資料錯誤：', error)
    res.status(500).json({ error: '更新資料失敗' })
  }
})

// 刪除回覆資料
app.delete('/api/responses/:id', (req, res) => {
  try {
    const data = fs.readFileSync(dataFile, 'utf-8')
    const responses = JSON.parse(data)

    const filteredResponses = responses.filter(r => r.id !== parseInt(req.params.id))
    fs.writeFileSync(dataFile, JSON.stringify(filteredResponses, null, 2), 'utf-8')

    console.log(`刪除資料 ID: ${req.params.id}`)
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.json({ message: '資料刪除成功' })
  } catch (error) {
    console.error('刪除資料錯誤：', error)
    res.status(500).json({ error: '刪除資料失敗' })
  }
})

// 讀取婚禮設定
app.get('/api/config', (req, res) => {
  try {
    const data = fs.readFileSync(configFile, 'utf-8')
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.json(JSON.parse(data))
  } catch (error) {
    console.error('讀取設定錯誤：', error)
    res.status(500).json({ error: '讀取設定失敗' })
  }
})

// 更新婚禮設定
app.post('/api/config', (req, res) => {
  try {
    fs.writeFileSync(configFile, JSON.stringify(req.body, null, 2), 'utf-8')

    console.log('婚禮設定已更新')
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.json({ message: '設定更新成功' })
  } catch (error) {
    console.error('更新設定錯誤：', error)
    res.status(500).json({ error: '設定更新失敗' })
  }
})

app.listen(PORT, () => {
  console.log(`後端伺服器運行於 http://localhost:${PORT}`)
  console.log(`資料檔案位置：${dataFile}`)
  console.log(`設定檔案位置：${configFile}`)
})
