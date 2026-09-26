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
      return {
        total: data.record?.total || 0,
        today: data.record?.today || 0,
        lastDate: data.record?.lastDate || ""
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
  const stats = await getStats();
  const todayDate = new Date().toISOString().split('T')[0];

  // Reset today jika ganti hari
  if (stats.lastDate !== todayDate) {
    stats.today = 0;
    stats.lastDate = todayDate;
  }

  // Tambah total hanya jika aktivasi (sesuai logika lama kamu di auto/verify)
  if (isActivation) {
    stats.total = (stats.total || 0) + 1;
    stats.today = (stats.today || 0) + 1;
  }

  await saveStats(stats);
  return stats;
}

module.exports = {
  getStats,
  saveStats,
  incrementStats
};