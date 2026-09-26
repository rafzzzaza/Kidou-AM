const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID;
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;
const JSONBIN_ACCESS_KEY = process.env.JSONBIN_ACCESS_KEY; // Tambahan access key baru

const DEFAULT_STATS = {
  total: 0,
  today: 0,
  lastDate: ""
};

/**
 * Mengambil data statistik dari JSONBin
 */
async function getStats() {
  if (!JSONBIN_BIN_ID || (!JSONBIN_API_KEY && !JSONBIN_ACCESS_KEY)) {
    console.warn('[Stats] JSONBin credentials belum dikonfigurasi.');
    return DEFAULT_STATS;
  }

  try {
    const timestamp = Date.now();
    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache'
    };
    
    // Gunakan Access Key atau Master Key
    if (JSONBIN_ACCESS_KEY) {
      headers['X-Access-Key'] = JSONBIN_ACCESS_KEY;
    } else {
      headers['X-Master-Key'] = JSONBIN_API_KEY;
    }

    const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest?t=${timestamp}`, {
      headers
    });

    if (res.ok) {
      const data = await res.json();
      return {
        total: data.record?.total || 0,
        today: data.record?.today || 0,
        lastDate: data.record?.lastDate || ""
      };
    } else {
      console.error('[Stats] Gagal fetch JSONBin:', res.status, await res.text());
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
  if (!JSONBIN_BIN_ID || (!JSONBIN_API_KEY && !JSONBIN_ACCESS_KEY)) {
    console.error('[Stats] JSONBin credentials tidak lengkap!');
    return false;
  }

  try {
    const headers = {
      'Content-Type': 'application/json',
      'X-Bin-Versioning': 'false'
    };

    // Gunakan Access Key atau Master Key untuk update
    if (JSONBIN_ACCESS_KEY) {
      headers['X-Access-Key'] = JSONBIN_ACCESS_KEY;
    } else {
      headers['X-Master-Key'] = JSONBIN_API_KEY;
    }

    const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(statsData)
    });
    
    if (!res.ok) {
      console.error('[Stats] Gagal save ke JSONBin:', res.status, await res.text());
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('[Stats] Error saving stats:', error);
    return false;
  }
}

/**
 * Menambahkan jumlah hitungan statistik
 */
async function incrementStats(isActivation = false) {
  console.log('[Stats] incrementStats called, isActivation:', isActivation);
  
  const stats = await getStats();
  console.log('[Stats] Stats setelah getStats:', stats);
  
  const todayDate = new Date().toISOString().split('T')[0];

  // Reset today jika ganti hari
  if (stats.lastDate !== todayDate) {
    console.log('[Stats] Ganti hari, reset today');
    stats.today = 0;
    stats.lastDate = todayDate;
  }

  // Tambah total dan today jika isActivation true
  if (isActivation) {
    stats.total = (stats.total || 0) + 1;
    stats.today = (stats.today || 0) + 1;
    console.log('[Stats] After increment:', stats);
  }

  const saved = await saveStats(stats);
  console.log('[Stats] Save result:', saved);

  return stats;
}

module.exports = {
  getStats,
  saveStats,
  incrementStats
};