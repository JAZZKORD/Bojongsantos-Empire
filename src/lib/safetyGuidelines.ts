import type { FoodCategory } from '@/types';

export interface FoodSafetySpec {
  category: FoodCategory;
  categoryName: string;
  storageTemp: string;
  maxSafeHours: number; // Suhu ruang
  maxRefrigeratedHours: number; // Suhu dingin
  reheatingInstructions: string;
  dos: string[];
  donts: string[];
  spoilageSigns: string[];
}

export const SAFETY_GUIDELINES: Record<FoodCategory, FoodSafetySpec> = {
  nasi: {
    category: 'nasi',
    categoryName: 'Nasi & Karbohidrat',
    storageTemp: 'Suhu dingin (< 4°C) atau di atas 60°C (Rice Cooker)',
    maxSafeHours: 4,
    maxRefrigeratedHours: 24,
    reheatingInstructions: 'Kukus selama 10-15 menit atau microwave 2-3 menit hingga berasap (min 70°C). Tambahkan sedikit percikan air agar tetap pulen.',
    dos: [
      'Segera konsumsi atau masukkan lemari es dalam waktu 2 jam setelah diambil',
      'Panaskan kembali secara merata sampai mengepul panas sebelum disantap',
      'Simpan dalam wadah kedap udara yang bersih dan kering',
    ],
    donts: [
      'Dilarang membiarkan nasi di suhu ruang > 4 jam setelah diambil',
      'Dilarang memanaskan ulang lebih dari 1 kali',
      'Jangan dikonsumsi jika tekstur menjadi lembek berlendir atau berbau asam',
    ],
    spoilageSigns: ['Aroma masam/apek', 'Tekstur berlendir atau lengket berlebih', 'Perubahan warna kekuningan mencolok'],
  },

  lauk: {
    category: 'lauk',
    categoryName: 'Lauk Pauk (Daging/Ayam/Ikan/Telur)',
    storageTemp: 'Lemari Pendingin (< 4°C)',
    maxSafeHours: 3,
    maxRefrigeratedHours: 24,
    reheatingInstructions: 'Goreng ulang, tumis, atau microwave hingga suhu bagian dalam makanan mencapai 75°C. Untuk lauk berkuah, didihkan hingga meletup-letup.',
    dos: [
      'Pisahkan lauk basah/berkuah dari lauk kering saat disimpan',
      'Pastikan pemanasan ulang mencapai bagian terdalam daging/ayam',
      'Habiskan dalam sekali makan setelah dipanaskan',
    ],
    donts: [
      'Jangan biarkan di suhu ruang terbuka yang rentan dihinggapi lalat/debu',
      'Jangan mencampur lauk lama dengan bahan makanan segar baru',
      'Hindari mengonsumsi lauk bersantan jika sudah berubah warna atau ada lapisan busa',
    ],
    spoilageSigns: ['Lendir berlebih pada daging/ayam', 'Aroma masam atau bau amis menyengat', 'Kuah bersantan berbusa atau pecah minyak tidak wajar'],
  },

  sayur: {
    category: 'sayur',
    categoryName: 'Sayur & Salad',
    storageTemp: 'Suhu Dingin Kulkas (4-8°C)',
    maxSafeHours: 3,
    maxRefrigeratedHours: 12,
    reheatingInstructions: 'Untuk sayur tumis/kuah: Panaskan sebentar di atas kompor hingga mendidih. Untuk salad segar: Jangan dipanaskan, langsung konsumsi setelah dicuci.',
    dos: [
      'Simpan dalam wadah tertutup di dalam kulkas jika tidak langsung dihabiskan',
      'Cuci tangan sebelum mengambil dan memindahkan sayuran',
      'Habiskan sayuran hijau berkuah sebelum 12 jam',
    ],
    donts: [
      'Hindari memanaskan berulang kali sayur hijau (seperti bayam/sawi)',
      'Dilarang mengonsumsi salad mentah jika kemasan sudah mengembun parah & layu busuk',
      'Jangan biarkan terjemur sinar matahari langsung',
    ],
    spoilageSigns: ['Daun menghitam dan lembek berair', 'Aroma fermentasi masam', 'Kuah sayur keruh berbusa'],
  },

  roti: {
    category: 'roti',
    categoryName: 'Roti & Pastry',
    storageTemp: 'Suhu Ruang Kering (20-25°C) & Wadah Kedap',
    maxSafeHours: 12,
    maxRefrigeratedHours: 48,
    reheatingInstructions: 'Panggang dalam oven/toaster pada suhu 160°C selama 3-5 menit untuk mengembalikan tekstur renyah dan kehangatan.',
    dos: [
      'Simpan di tempat kering sejuk jauh dari paparan kelembapan',
      'Panggang sebentar sebelum disajikan agar krispi kembali',
      'Periksa bagian selai/isian krim apakah masih segar',
    ],
    donts: [
      'Jangan simpan roti di tempat lembap yang memicu timbulnya kapang/jamur',
      'Jangan dikonsumsi jika terdapat bintik putih/hijau halus sekecil apa pun',
      'Hindari menumpuk roti krim dengan benda berat',
    ],
    spoilageSigns: ['Bintik jamur putih/hijau/hitam', 'Tekstur sangat keras atau tengik', 'Krim isian meleleh masam'],
  },

  kue: {
    category: 'kue',
    categoryName: 'Kue & Snack Basah',
    storageTemp: 'Suhu Dingin Kulkas (< 4°C)',
    maxSafeHours: 4,
    maxRefrigeratedHours: 24,
    reheatingInstructions: 'Untuk kue kukus: Kukus kembali 5 menit. Untuk cake/tart krim: Langsung nikmati dalam keadaan dingin.',
    dos: [
      'Simpan kue berkrim/santan di kulkas segera setelah tiba',
      'Gunakan pisau/sendok bersih saat memotong',
      'Tutup rapat wadah kue agar tidak menyerap bau makanan lain di kulkas',
    ],
    donts: [
      'Jangan biarkan kue basah bersantan di suhu panas > 3 jam',
      'Jangan mengonsumsi kue jika ada lapisan minyak tengik di permukaan',
      'Hindari mengocok wadah kemasan kue cair/puding',
    ],
    spoilageSigns: ['Lapisan krim memisah masam', 'Bintik jamur di permukaan kue', 'Tekstur berlendir atau pahit'],
  },

  buah: {
    category: 'buah',
    categoryName: 'Buah-buahan Potong & Segar',
    storageTemp: 'Suhu Dingin Kulkas (4-8°C)',
    maxSafeHours: 4,
    maxRefrigeratedHours: 24,
    reheatingInstructions: 'Tidak perlu dipanaskan. Nikmati langsung dalam keadaan dingin segar setelah dikeluarkan dari pendingin.',
    dos: [
      'Jaga kebersihan alat makan saat mengonsumsi buah potong',
      'Simpan di wadah kedap makanan di dalam kulkas',
      'Segera nikmati buah potong segar untuk nutrisi maksimal',
    ],
    donts: [
      'Jangan makan buah potong yang sudah dibiarkan di suhu terbuka seharian',
      'Dilarang mengonsumsi jika sudah berfermentasi menjadi alkoholis/masam',
      'Hindari membiarkan buah bersentuhan langsung dengan daging mentah',
    ],
    spoilageSigns: ['Tekstur sangat lembek kecokelatan berair', 'Aroma masam fermentasi alkohol', 'Cairan buah berbusa'],
  },

  minuman: {
    category: 'minuman',
    categoryName: 'Minuman Segar & Jus',
    storageTemp: 'Suhu Dingin Kulkas (< 4°C) / Dingin Es',
    maxSafeHours: 4,
    maxRefrigeratedHours: 24,
    reheatingInstructions: 'Untuk minuman hangat: Didihkan sebentar di panci/microwave. Untuk jus/kopi susu: Nikmati dingin bersama es batu segar.',
    dos: [
      'Kocok pelan sebelum diminum jika ada endapan alami',
      'Simpan botol/kemasan tetap tertutup rapat di kulkas',
      'Habiskan segera setelah kemasan botol dibuka',
    ],
    donts: [
      'Jangan minum langsung dari botol jika ingin disimpan kembali',
      'Jangan dikonsumsi jika botol/kemasan membengkak atau menggelembung',
      'Hindari membekukan minuman kemasan kaca',
    ],
    spoilageSigns: ['Kemasan botol menggelembung bertekanan gas', 'Endapan bergumpal pecah masam (susu/santan)', 'Rasa masam menyengat tidak wajar'],
  },

  lainnya: {
    category: 'lainnya',
    categoryName: 'Makanan Surplus Lainnya',
    storageTemp: 'Suhu Kulkas (< 4°C)',
    maxSafeHours: 4,
    maxRefrigeratedHours: 24,
    reheatingInstructions: 'Panaskan hingga mendidih atau berasap panas sebelum dikonsumsi.',
    dos: [
      'Periksa kondisi fisik kemasan dan segel makanan',
      'Simpan di tempat bersih & terlindung',
      'Habiskan secepatnya setelah diterima',
    ],
    donts: [
      'Jangan dikonsumsi jika timbul aroma masam atau tekstur tidak wajar',
      'Jangan biarkan terbuka di suhu ruang lebih dari 4 jam',
    ],
    spoilageSigns: ['Aroma masam/tengik', 'Tekstur berlendir', 'Perubahan rasa menyengat'],
  },
};

export function getSafetyGuideline(category: FoodCategory): FoodSafetySpec {
  return SAFETY_GUIDELINES[category] || SAFETY_GUIDELINES.lainnya;
}
