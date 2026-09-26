import fs from 'fs';
import path from 'path';

const STATS_FILE = path.join(process.cwd(), 'data', 'stats.json');

// Mengambil variabel lingkungan untuk JSONBin
const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID;
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;

// Data bawaan jika belum ada record sama sekali
const DEFAULT_STATS = {
  total_links: 0,
  totalActivations: 0,
  daily: {}
};

/**
 * Mengambil data statistik terbaru (dari JSONBin atau File Lokal)
 */
export async function getStats() {
  // 1. Coba ambil dari JSONBin jika API Key & Bin ID tersedia
  if (JSONBIN_BIN_ID && JSONBIN_API_KEY) {
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
        headers: {
          'X-Master-Key': JSONBIN_API_KEY
        },
        cache: 'no-store' // Mematikan cache agar data selalu paling baru
      });

      if (res.ok) {
        const data = await res.json();
        return {
          total_links: data.record?.total_links || 0,
          totalActivations: data.record?.totalActivations || 0,
          daily: data.record?.daily || {}
        };
      }
    } catch (error) {
      console.error('[Stats] Gagal mengambil data dari JSONBin:', error);
    }
  }

  // 2. Fallback: Ambil dari file lokal jika JSONBin tidak diset / gagal
  try {
    if (fs.existsSync(STATS_FILE)) {
      const fileData = fs.readFileSync(STATS_FILE, 'utf-8');
      const parsed = JSON.parse(fileData);
      return {
        total_links: parsed.total_links || 0,
        totalActivations: parsed.totalActivations || 0,
        daily: parsed.daily || {}
      };
    }
  } catch (error) {
    console.error('[Stats] Gagal membaca stats lokal:', error);
  }

  return DEFAULT_STATS;
}

/**
 * Menyimpan data statistik (ke JSONBin atau File Lokal)
 */
export async function saveStats(statsData) {
  // 1. Simpan ke JSONBin jika konfigurasi tersedia
  if (JSONBIN_BIN_ID && JSONBIN_API_KEY) {
    try {
      await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_API_KEY
        },
        body: JSON.stringify(statsData)
      });
      return;
    } catch (error) {
      console.error('[Stats] Gagal menyimpan data ke JSONBin:', error);
    }
  }

  // 2. Fallback: Simpan ke penyimpanan file lokal
  try {
    const dir = path.dirname(STATS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STATS_FILE, JSON.stringify(statsData, null, 2), 'utf-8');
  } catch (error) {
    console.error('[Stats] Gagal menyimpan stats lokal:', error);
  }
}

/**
 * Menambahkan jumlah statistik
 * @param {boolean} isActivation - Set true jika pemanggilan berasal dari proses aktivasi link
 */
export async function incrementStats(isActivation = false) {
  const stats = await getStats();
  const today = new Date().toISOString().split('T')[0];

  // Tambah total link umum
  stats.total_links = (stats.total_links || 0) + 1;

  // Tambah total activation jika parameter isActivation diset true
  if (isActivation) {
    stats.totalActivations = (stats.totalActivations || 0) + 1;
  }

  // Tambah hitungan harian
  if (!stats.daily) stats.daily = {};
  stats.daily[today] = (stats.daily[today] || 0) + 1;

  // Simpan perubahan secara permanen
  await saveStats(stats);
  return stats;
}