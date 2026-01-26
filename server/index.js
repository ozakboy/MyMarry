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
app.use(express.json({ charset: 'utf-8', limit: '10mb' }))

// JSON 資料檔案路徑
const dataFile = process.env.NODE_ENV === 'production'
  ? '/app/data/responses.json'
  : path.join(__dirname, '..', 'data', 'responses.json')

console.log('Data file path:', dataFile)

// wedding-config.json 路徑
const configFile = process.env.NODE_ENV === 'production'
  ? '/app/data/wedding-config.json'
  : path.join(__dirname, '..', 'data', 'wedding-config.json')

console.log('config file path:', configFile)

// 其他資料檔案路徑
const expensesFile = process.env.NODE_ENV === 'production'
  ? '/app/data/expenses.json'
  : path.join(__dirname, '..', 'data', 'expenses.json')

const scheduleFile = process.env.NODE_ENV === 'production'
  ? '/app/data/wedding-schedule.json'
  : path.join(__dirname, '..', 'data', 'wedding-schedule.json')

const staffFile = process.env.NODE_ENV === 'production'
  ? '/app/data/staff-assignment.json'
  : path.join(__dirname, '..', 'data', 'staff-assignment.json')

const seatingFile = process.env.NODE_ENV === 'production'
  ? '/app/data/seating-chart.json'
  : path.join(__dirname, '..', 'data', 'seating-chart.json')

// 初始化資料檔案
const dataDir = path.dirname(dataFile)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([]), 'utf-8')
}

// 初始化 wedding-config.json (如果不存在則從 public 複製)
const configDir = path.dirname(configFile)
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true })
}

if (!fs.existsSync(configFile)) {
  const defaultConfigPath = process.env.NODE_ENV === 'production'
    ? '/app/public/wedding-config.json'
    : path.join(__dirname, '..', 'public', 'wedding-config.json')

  if (fs.existsSync(defaultConfigPath)) {
    fs.copyFileSync(defaultConfigPath, configFile)
    console.log('wedding-config.json 已從預設範本複製到 data 目錄')
  } else {
    console.error('找不到預設的 wedding-config.json 範本:', defaultConfigPath)
  }
}

// 初始化其他資料檔案
if (!fs.existsSync(expensesFile)) {
  fs.writeFileSync(expensesFile, JSON.stringify({ expenses: [], totalBudget: 0 }), 'utf-8')
  console.log('expenses.json 已初始化')
}

if (!fs.existsSync(scheduleFile)) {
  fs.writeFileSync(scheduleFile, JSON.stringify([]), 'utf-8')
  console.log('wedding-schedule.json 已初始化')
}

if (!fs.existsSync(staffFile)) {
  fs.writeFileSync(staffFile, JSON.stringify([]), 'utf-8')
  console.log('staff-assignment.json 已初始化')
}

if (!fs.existsSync(seatingFile)) {
  fs.writeFileSync(seatingFile, JSON.stringify({ tables: [], unassigned: [] }), 'utf-8')
  console.log('seating-chart.json 已初始化')
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

// ========== 花費統計 API ==========
// 讀取所有花費
app.get('/api/expenses', (req, res) => {
  try {
    const data = fs.readFileSync(expensesFile, 'utf-8')
    let parsedData = JSON.parse(data)

    // 兼容舊格式 (純陣列) 和新格式 (物件含 expenses 和 totalBudget)
    if (Array.isArray(parsedData)) {
      parsedData = { expenses: parsedData, totalBudget: 0 }
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.json(parsedData)
  } catch (error) {
    console.error('讀取花費資料錯誤：', error)
    res.status(500).json({ error: '讀取花費資料失敗' })
  }
})

// 設定總預算
app.post('/api/expenses/budget', (req, res) => {
  try {
    const data = fs.readFileSync(expensesFile, 'utf-8')
    let parsedData = JSON.parse(data)

    // 兼容舊格式
    if (Array.isArray(parsedData)) {
      parsedData = { expenses: parsedData, totalBudget: 0 }
    }

    parsedData.totalBudget = req.body.totalBudget || 0

    fs.writeFileSync(expensesFile, JSON.stringify(parsedData, null, 2), 'utf-8')
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.json({ message: '預算設定成功' })
  } catch (error) {
    console.error('設定預算錯誤：', error)
    res.status(500).json({ error: '設定預算失敗' })
  }
})

// 新增花費
app.post('/api/expenses', (req, res) => {
  try {
    const data = fs.readFileSync(expensesFile, 'utf-8')
    let parsedData = JSON.parse(data)

    // 兼容舊格式
    if (Array.isArray(parsedData)) {
      parsedData = { expenses: parsedData, totalBudget: 0 }
    }

    const expenses = parsedData.expenses

    const newExpense = {
      id: Date.now(),
      ...req.body
    }

    expenses.push(newExpense)
    parsedData.expenses = expenses
    fs.writeFileSync(expensesFile, JSON.stringify(parsedData, null, 2), 'utf-8')

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.status(201).json({ message: '花費新增成功', data: newExpense })
  } catch (error) {
    console.error('新增花費錯誤：', error)
    res.status(500).json({ error: '新增花費失敗' })
  }
})

// 更新花費
app.put('/api/expenses/:id', (req, res) => {
  try {
    const data = fs.readFileSync(expensesFile, 'utf-8')
    let parsedData = JSON.parse(data)

    // 兼容舊格式
    if (Array.isArray(parsedData)) {
      parsedData = { expenses: parsedData, totalBudget: 0 }
    }

    const expenses = parsedData.expenses

    const index = expenses.findIndex(e => e.id === parseInt(req.params.id))
    if (index === -1) {
      return res.status(404).json({ error: '找不到該花費' })
    }

    expenses[index] = {
      ...expenses[index],
      ...req.body,
      id: expenses[index].id
    }

    parsedData.expenses = expenses
    fs.writeFileSync(expensesFile, JSON.stringify(parsedData, null, 2), 'utf-8')

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.json({ message: '花費更新成功', data: expenses[index] })
  } catch (error) {
    console.error('更新花費錯誤：', error)
    res.status(500).json({ error: '更新花費失敗' })
  }
})

// 刪除花費
app.delete('/api/expenses/:id', (req, res) => {
  try {
    const data = fs.readFileSync(expensesFile, 'utf-8')
    let parsedData = JSON.parse(data)

    // 兼容舊格式
    if (Array.isArray(parsedData)) {
      parsedData = { expenses: parsedData, totalBudget: 0 }
    }

    const expenses = parsedData.expenses
    const filteredExpenses = expenses.filter(e => e.id !== parseInt(req.params.id))
    parsedData.expenses = filteredExpenses
    fs.writeFileSync(expensesFile, JSON.stringify(parsedData, null, 2), 'utf-8')

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.json({ message: '花費刪除成功' })
  } catch (error) {
    console.error('刪除花費錯誤：', error)
    res.status(500).json({ error: '刪除花費失敗' })
  }
})

// ========== 婚禮流程 API ==========
// 讀取所有流程
app.get('/api/schedule', (req, res) => {
  try {
    const data = fs.readFileSync(scheduleFile, 'utf-8')
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.json(JSON.parse(data))
  } catch (error) {
    console.error('讀取流程資料錯誤：', error)
    res.status(500).json({ error: '讀取流程資料失敗' })
  }
})

// 新增流程
app.post('/api/schedule', (req, res) => {
  try {
    const data = fs.readFileSync(scheduleFile, 'utf-8')
    const schedule = JSON.parse(data)

    const newItem = {
      id: Date.now(),
      ...req.body
    }

    schedule.push(newItem)
    fs.writeFileSync(scheduleFile, JSON.stringify(schedule, null, 2), 'utf-8')

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.status(201).json({ message: '流程新增成功', data: newItem })
  } catch (error) {
    console.error('新增流程錯誤：', error)
    res.status(500).json({ error: '新增流程失敗' })
  }
})

// 更新流程
app.put('/api/schedule/:id', (req, res) => {
  try {
    const data = fs.readFileSync(scheduleFile, 'utf-8')
    const schedule = JSON.parse(data)

    const index = schedule.findIndex(s => s.id === parseInt(req.params.id))
    if (index === -1) {
      return res.status(404).json({ error: '找不到該流程' })
    }

    schedule[index] = {
      ...schedule[index],
      ...req.body,
      id: schedule[index].id
    }

    fs.writeFileSync(scheduleFile, JSON.stringify(schedule, null, 2), 'utf-8')

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.json({ message: '流程更新成功', data: schedule[index] })
  } catch (error) {
    console.error('更新流程錯誤：', error)
    res.status(500).json({ error: '更新流程失敗' })
  }
})

// 刪除流程
app.delete('/api/schedule/:id', (req, res) => {
  try {
    const data = fs.readFileSync(scheduleFile, 'utf-8')
    const schedule = JSON.parse(data)

    const filteredSchedule = schedule.filter(s => s.id !== parseInt(req.params.id))
    fs.writeFileSync(scheduleFile, JSON.stringify(filteredSchedule, null, 2), 'utf-8')

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.json({ message: '流程刪除成功' })
  } catch (error) {
    console.error('刪除流程錯誤：', error)
    res.status(500).json({ error: '刪除流程失敗' })
  }
})

// ========== 人員配置 API ==========
// 讀取所有人員配置
app.get('/api/staff', (req, res) => {
  try {
    const data = fs.readFileSync(staffFile, 'utf-8')
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.json(JSON.parse(data))
  } catch (error) {
    console.error('讀取人員配置錯誤：', error)
    res.status(500).json({ error: '讀取人員配置失敗' })
  }
})

// 新增人員配置
app.post('/api/staff', (req, res) => {
  try {
    const data = fs.readFileSync(staffFile, 'utf-8')
    const staff = JSON.parse(data)

    const newStaff = {
      id: Date.now(),
      ...req.body
    }

    staff.push(newStaff)
    fs.writeFileSync(staffFile, JSON.stringify(staff, null, 2), 'utf-8')

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.status(201).json({ message: '人員配置新增成功', data: newStaff })
  } catch (error) {
    console.error('新增人員配置錯誤：', error)
    res.status(500).json({ error: '新增人員配置失敗' })
  }
})

// 更新人員配置
app.put('/api/staff/:id', (req, res) => {
  try {
    const data = fs.readFileSync(staffFile, 'utf-8')
    const staff = JSON.parse(data)

    const index = staff.findIndex(s => s.id === parseInt(req.params.id))
    if (index === -1) {
      return res.status(404).json({ error: '找不到該人員配置' })
    }

    staff[index] = {
      ...staff[index],
      ...req.body,
      id: staff[index].id
    }

    fs.writeFileSync(staffFile, JSON.stringify(staff, null, 2), 'utf-8')

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.json({ message: '人員配置更新成功', data: staff[index] })
  } catch (error) {
    console.error('更新人員配置錯誤：', error)
    res.status(500).json({ error: '更新人員配置失敗' })
  }
})

// 刪除人員配置
app.delete('/api/staff/:id', (req, res) => {
  try {
    const data = fs.readFileSync(staffFile, 'utf-8')
    const staff = JSON.parse(data)

    const filteredStaff = staff.filter(s => s.id !== parseInt(req.params.id))
    fs.writeFileSync(staffFile, JSON.stringify(filteredStaff, null, 2), 'utf-8')

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.json({ message: '人員配置刪除成功' })
  } catch (error) {
    console.error('刪除人員配置錯誤：', error)
    res.status(500).json({ error: '刪除人員配置失敗' })
  }
})

// ========== 座位表 API ==========
// 讀取座位表
app.get('/api/seating', (req, res) => {
  try {
    const data = fs.readFileSync(seatingFile, 'utf-8')
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.json(JSON.parse(data))
  } catch (error) {
    console.error('讀取座位表錯誤：', error)
    res.status(500).json({ error: '讀取座位表失敗' })
  }
})

// 更新座位表
app.post('/api/seating', (req, res) => {
  try {
    fs.writeFileSync(seatingFile, JSON.stringify(req.body, null, 2), 'utf-8')

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.json({ message: '座位表更新成功' })
  } catch (error) {
    console.error('更新座位表錯誤：', error)
    res.status(500).json({ error: '更新座位表失敗' })
  }
})

app.listen(PORT, () => {
  console.log(`後端伺服器運行於 http://localhost:${PORT}`)
  console.log(`資料檔案位置：${dataFile}`)
  console.log(`設定檔案位置：${configFile}`)
})
