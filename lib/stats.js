const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID;
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;

const DEFAULT_RECORD = {
  total: 0,
  today: 0,
  lastDate: ""
};

/**
 * Mengambil data mentah langsung dari JSONBin
 */
async function getRawRecord() {
  if (!JSONBIN_BIN_ID || !JSONBIN_API_KEY) {
    console.warn('[Stats] Missing JSONBIN_BIN_ID or JSONBIN_API_KEY');
    return DEFAULT_RECORD;
  }

  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': JSONBIN_API_KEY
      },
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      return {
        total: Number(data.record?.total) || 0,
        today: Number(data.record?.today) || 0,
        lastDate: data.record?.lastDate || ""
      };
    }
  } catch (error) {
    console.error('[Stats] Error fetching from JSONBin:', error);
  }

  return DEFAULT_RECORD;
}

/**
 * Fungsi GET untuk kebutuhan API Frontend (index.html)
 */
async function getStats() {
  const record = await getRawRecord();
  const todayStr = new Date().toISOString().split('T')[0];

  // Reset hitungan harian jika tanggal berubah
  const activeToday = (record.lastDate === todayStr) ? record.today : 0;

  return {
    total_links: record.total,
    totalActivations: record.total,
    daily: {
      [todayStr]: activeToday
    }
  };
}

/**
 * Fungsi PUT untuk menyimpan perubahan ke JSONBin
 */
async function saveStats(record) {
  if (!JSONBIN_BIN_ID || !JSONBIN_API_KEY) return;

  try {
    await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY
      },
      body: JSON.stringify(record)
    });
  } catch (error) {
    console.error('[Stats] Error saving to JSONBin:', error);
  }
}

/**
 * Menambahkan statistik (+1) setiap kali aktivasi berhasil
 */
async function incrementStats(isActivation = false) {
  const record = await getRawRecord();
  const todayStr = new Date().toISOString().split('T')[0];

  // Hitung angka baru
  const newTotal = record.total + 1;
  let newToday = record.today;

  if (record.lastDate !== todayStr) {
    newToday = 1; // Jika beda hari, reset ke 1
  } else {
    newToday += 1; // Jika hari sama, tambah 1
  }

  const updatedRecord = {
    total: newTotal,
    today: newToday,
    lastDate: todayStr
  };

  // Simpan permanen ke JSONBin
  await saveStats(updatedRecord);

  return {
    total_links: newTotal,
    totalActivations: newTotal,
    daily: {
      [todayStr]: newToday
    }
  };
}

module.exports = {
  getStats,
  saveStats,
  incrementStats
};