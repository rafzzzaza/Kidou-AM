const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID;
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;

const DEFAULT_STATS = {
  total: 0,
  today: 0,
  lastDate: ""
};

/**
 * Mengambil data statistik dari JSONBin
 */
async function getStats() {
  if (!JSONBIN_BIN_ID || !JSONBIN_API_KEY) {
    console.warn('[Stats] JSONBIN_BIN_ID atau JSONBIN_API_KEY belum dikonfigurasi.');
    return DEFAULT_STATS;
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
      const record = data.record || {};
      const todayStr = new Date().toISOString().split('T')[0];

      // Jika hari berganti, reset counter today
      let todayCount = record.today || 0;
      if (record.lastDate !== todayStr) {
        todayCount = 0;
      }

      return {
        total_links: record.total || 0,
        totalActivations: record.total || 0,
        daily: {
          [todayStr]: todayCount
        },
        raw: record
      };
    }
  } catch (error) {
    console.error('[Stats] Error fetching stats:', error);
  }

  return DEFAULT_STATS;
}

/**
 * Menyimpan data statistik ke JSONBin
 */
async function saveStats(statsData) {
  if (!JSONBIN_BIN_ID || !JSONBIN_API_KEY) return;

  try {
    await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY
      },
      body: JSON.stringify(statsData)
    });
  } catch (error) {
    console.error('[Stats] Error saving stats:', error);
  }
}

/**
 * Menambahkan jumlah hitungan statistik
 */
async function incrementStats(isActivation = false) {
  const current = await getStats();
  const todayStr = new Date().toISOString().split('T')[0];

  let newTotal = (current.raw?.total || 0) + 1;
  let newToday = (current.raw?.today || 0);

  // Jika berganti hari, hitungan hari ini mulai dari 0
  if (current.raw?.lastDate !== todayStr) {
    newToday = 0;
  }
  newToday += 1;

  // Format JSON yang akan disimpan ke JSONBin kamu
  const updatedRecord = {
    total: newTotal,
    today: newToday,
    lastDate: todayStr
  };

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