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

// 初始化資料檔案
const dataDir = path.dirname(dataFile)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([]), 'utf-8')
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

app.listen(PORT, () => {
  console.log(`後端伺服器運行於 http://localhost:${PORT}`)
  console.log(`資料檔案位置：${dataFile}`)
})
