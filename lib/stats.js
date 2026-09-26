const BIN_ID = process.env.JSONBIN_BIN_ID || '6ab73e9fffd5d160533025b3'
const ACCESS_KEY = process.env.JSONBIN_ACCESS_KEY

function getTodayDateString() {
  return new Date().toISOString().split('T')[0]
}

// Membaca data dari JSONBin
async function readBin() {
  if (!ACCESS_KEY) {
    console.warn('JSONBIN_ACCESS_KEY belum dipasang di Environment Variables!')
    return { total: 0, today: 0, lastDate: '' }
  }

  const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
    method: 'GET',
    headers: {
      'X-Master-Key': ACCESS_KEY
    }
  })

  if (!res.ok) throw new Error('Gagal membaca JSONBin')
  const data = await res.json()
  return data.record || { total: 0, today: 0, lastDate: '' }
}

// Menyimpan data balik ke JSONBin
async function updateBin(data) {
  if (!ACCESS_KEY) return

  await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': ACCESS_KEY
    },
    body: JSON.stringify(data)
  })
}

async function getStats() {
  try {
    const current = await readBin()
    const todayStr = getTodayDateString()

    const todayCount = current.lastDate === todayStr ? Number(current.today || 0) : 0

    return {
      total: Number(current.total || 0),
      today: todayCount
    }
  } catch (err) {
    console.error('Error JSONBin Get:', err)
    return { total: 0, today: 0 }
  }
}

async function incrementStats() {
  try {
    const current = await readBin()
    const todayStr = getTodayDateString()

    let todayCount = Number(current.today || 0)

    if (current.lastDate !== todayStr) {
      todayCount = 0
    }

    const updatedData = {
      total: Number(current.total || 0) + 1,
      today: todayCount + 1,
      lastDate: todayStr
    }

    await updateBin(updatedData)

    return {
      total: updatedData.total,
      today: updatedData.today
    }
  } catch (err) {
    console.error('Error JSONBin Incr:', err)
    return { total: 0, today: 0 }
  }
}

module.exports = { getStats, incrementStats }