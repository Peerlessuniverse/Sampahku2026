import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, PlayCircle, Leaf, Recycle, AlertTriangle,
  Trash2, ArrowRight, Sparkles, Zap, Info, Factory,
  Layers, Database, Flame, Droplets, Sun, Wind, Cpu, Star
} from 'lucide-react';
import { addCredits, isMonthlyActivityCompleted, getMonthlyActivityId, getCurrentMonth } from '../services/creditService';
import SEO from '../components/SEO';


interface Step {
  title: string;
  desc: string;
  image?: string;
}

interface Recipe {
  label: string;
  items: string[];
}

interface TransformationMethod {
  title: string;
  description: string;
  image: string;
  fullDetail?: {
    overview: string;
    tools: string[];
    materials: string[];
    steps: Step[];
    tips?: { problem: string; solution: string }[];
    benefits: string[];
    historyNote?: { title: string; text: string };
  };
  researchList?: string[];
}

interface SubItem {
  name: string;
  image: string;
  methodTitle?: string;
}

interface PageData {
  title: string;
  subtitle: string;
  explanation: string;
  types: {
    title: string;
    items: string;
    subItems?: SubItem[];
  }[];
  sources: string[];
  energyTransformation: {
    title: string;
    description: string;
    result: string;
    icon: React.ReactNode;
  };
  color: string;
  icon: React.ReactNode;
  methods: TransformationMethod[];
}

const dataMap: Record<string, PageData> = {
  organic: {
    title: 'Transformasi Sampah Organik',
    subtitle: 'Kembalikan material alami ke tanah untuk melahirkan kehidupan baru.',
    explanation: 'Sampah organik adalah materi yang berasal dari sisa-sisa makhluk hidup, baik tumbuhan maupun hewan. Karakteristik utamanya adalah mudah membusuk dan dapat terurai secara alami oleh mikroorganisme tanah dalam waktu yang relatif singkat.',
    types: [
      {
        title: 'Sampah Hijau',
        items: 'Sisa sayuran, kulit buah, potongan rumput segar, sisa makanan.',
        subItems: [
          { name: 'Sisa Masakan', image: '/images/cooking_scraps.png', methodTitle: 'Kompos Takakura' },
          { name: 'Sisa Dapur', image: '/images/loseda_method.png', methodTitle: 'Loseda' },
          { name: 'Kulit Buah', image: '/images/fruit_peels.png', methodTitle: 'Eco-Enzyme' },
          { name: 'Sisa Makanan', image: '/images/food_leftovers.png', methodTitle: 'Budidaya Maggot BSF' },
          { name: 'Tulang', image: '/images/bones_leftovers.png', methodTitle: 'Budidaya Maggot BSF' }
        ]
      },
      {
        title: 'Sampah Cokelat',
        items: 'Daun kering, ranting pohon, serbuk gergaji, jerami, kertas cokelat.',
        subItems: [
          { name: 'Sampah Daun', image: '/images/dry_leaves.png', methodTitle: 'Lubang Biopori' },
          { name: 'Ranting Pohon', image: '/images/tree_twigs.png', methodTitle: 'Lubang Biopori' },
          { name: 'Serbuk Gergaji', image: '/images/sawdust.png', methodTitle: 'Kompos Takakura' },
          { name: 'Jerami', image: '/images/straw.png', methodTitle: 'Lubang Biopori' },
          { name: 'Kertas Cokelat', image: '/images/brown_paper.png', methodTitle: 'Kompos Takakura' }
        ]
      }
    ],
    sources: ['Dapur Rumah Tangga', 'Pasar Tradisional', 'Area Taman & Perkebunan', 'Sisa Pertanian & Peternakan'],
    energyTransformation: {
      title: 'Manifestasi Energi Organik',
      description: 'Melalui proses dekomposisi terkontrol, materi organik tidak lagi menjadi limbah, melainkan diubah menjadi sumber kehidupan baru.',
      result: 'Kompos (Emas Hitam), Biogas (Bahan Bakar), & Protein Maggot.',
      icon: <Sun className="w-16 h-16 text-emerald-400" />
    },
    color: 'emerald',
    icon: <Leaf className="w-12 h-12 text-white" />,
    methods: [
      {
        title: 'Kompos Takakura',
        description: 'Metode pengomposan rumah tangga yang bersih dan tidak berbau menggunakan keranjang khusus.',
        image: '/images/takakura_compost_detail_1768667650440.png',
        fullDetail: {
          overview: 'Metode pengomposan praktis ciptaan Mr. Takakura yang menggunakan keranjang berventilasi untuk proses aerob di lingkungan rumah tangga.',
          tools: ['Keranjang Plastik Berlubang', 'Kain Hitam Berpori', 'Kardus Bekas'],
          materials: ['Bantal Sekam (Atas & Bawah)', 'Sampah Organik Dapur (Tanpa Cairan)', 'Starter Kompos'],
          steps: [
            { title: 'Persiapan Dasar', desc: 'Letakkan bantal sekam di dasar keranjang untuk menyerap cairan dan menjaga sirkulasi udara.', image: '/images/takakura_step1.png' },
            { title: 'Pelapisan Kardus', desc: 'Pasang kardus mengelilingi sisi dalam keranjang sebagai pengatur kelembapan.', image: '/images/takakura_step2.png' },
            { title: 'Input Sampah', desc: 'Masukkan sampah dapur yang sudah dicacah kecil (hilangkan airnya).', image: '/images/takakura_step3.png' },
            { title: 'Penutupan', desc: 'Tutup dengan bantal sekam atas, kain hitam, dan tutup keranjang rapat-rapat.', image: '/images/takakura_step4.png' }
          ],
          benefits: ['Praktis & Hemat Lahan', 'Tanpa Bau Busuk (Fermentasi)', 'Hasil Kompos Berkualitas']
        },
        researchList: [
          'Efikasi Starter Mikroba dalam Mempercepat Dekomposisi Aerob.',
          'Optimasi Sirkulasi Udara pada Desain Keranjang Takakura Komersial.',
          'Analisis Kandungan Hara NPK Kompos Hasil Metode Takakura.'
        ]
      },
      {
        title: 'Komposter Karung',
        description: 'Efektif untuk lahan sempit menggunakan wadah karung berpori yang menjaga kelembapan dan sirkulasi udara.',
        image: '/images/compost_bag.png',
        fullDetail: {
          overview: 'Menggunakan karung HDPE/Goni sebagai komposter vertikal yang sangat fleksibel dan murah bagi pemula.',
          tools: ['Karung HDPE/Goni', 'Pipa Aerasi (Pilihan)', 'Tatakan'],
          materials: ['Sampah Hijau & Cokelat', 'Aktivator/MOL', 'Tanah/Kompos Lama'],
          steps: [
            { title: 'Lubang Udara', desc: 'Pastikan karung memiliki pori-pori yang cukup untuk sirkulasi oksigen.', image: '/images/karung_step1.png' },
            { title: 'Metode Lasagna', desc: 'Susun selapis sampah cokelat (kering), kemudian selapis sampah hijau (basah).', image: '/images/karung_step2.png' },
            { title: 'Aktivasi', desc: 'Semprotkan cairan MOL atau taburkan starter kompos untuk mempercepat proses.', image: '/images/karung_step3.png' },
            { title: 'Tunggu Matang', desc: 'Letakkan di tempat teduh dan panen kompos dalam 2-3 bulan.', image: '/images/karung_step4.png' }
          ],
          benefits: ['Budget Rendah', 'Sirkulasi Udara Alami Baik', 'Bisa Dipindah dengan Mudah']
        },
        researchList: [
          'Laju Dekomposisi Sampah Domestik pada Berbagai Jenis Material Karung.',
          'Pemanfaatan MOL Nasi Basi sebagai Aktivator Komposter Karung.',
          'Efisiensi Lahan Komposter Vertikal di Pemukiman Padat Penduduk.'
        ]
      },
      {
        title: 'Budidaya Maggot BSF',
        description: 'Mengurai sampah organik menggunakan larva Black Soldier Fly yang bernilai ekonomis tinggi.',
        image: '/images/maggot_bsf_detail_1768667684274.png',
        fullDetail: {
          overview: 'Metode pengolahan sampah organik tercepat dengan memanfaatkan larva lalat tentara hitam (BSF) sebagai agen pengurai.',
          tools: ['Biopond (Wadah)', 'Media Bertelur (Kayu)', 'Jaring Kandang'],
          materials: ['Larva BSF (Maggot)', 'Sampah Organik Melimpah', 'Dapur/Sisa Pasar'],
          steps: [
            { title: 'Persiapan Media', desc: 'Siapkan wadah berisi bibit maggot dan sampah yang sudah dihaluskan.', image: '/images/maggot_step1.png' },
            { title: 'Pemberian Pakan', desc: 'Taburkan sampah organik setiap hari seiring pertumbuhan maggot.', image: '/images/maggot_step2.png' },
            { title: 'Monitoring', desc: 'Jaga kelembapan media agar tidak terlalu basah atau berbau.', image: '/images/maggot_step3.png' },
            { title: 'Panen Ganda', desc: 'Panen maggot untuk pakan ternak dan sisa urainya menjadi pupuk organik cair (Kasgot).', image: '/images/maggot_step4.png' }
          ],
          benefits: ['Tercepat Mengurai Sampah', 'Bernilai Ekonomi (Pakan Ternak)', 'Zero Waste System']
        },
        researchList: [
          'Laju Konversi Massa Sampah Organik Menjadi Biomassa Larva BSF.',
          'Pengaruh Jenis Pakan Terhadap Kandungan Protein Maggot Sebagai Pakan Ternak.',
          'Analisis Kualitas Kasgot (Bekas Maggot) Sebagai Pupuk Organik Padat.'
        ]
      },
      {
        title: 'Komposter Drum',
        description: 'Solusi pengolahan sampah organik kapasitas besar dengan sistem pemutaran untuk aerasi optimal.',
        image: '/images/compost_drum.png',
        fullDetail: {
          overview: 'Sistem komposter drum/tong bekas dengan lubang aerasi untuk mengolah sampah organik dalam jumlah massal.',
          tools: ['Drum/Tong Plastik', 'Sekop', 'Sarung Tangan'],
          materials: ['Sampah Terpilah (Cacah)', 'Aktivator MOL', 'Air', 'Serabut Gergaji'],
          steps: [
            { title: 'Pencacahan', desc: 'Potong sampah organik hingga berukuran 2-3 cm untuk memudahkan penguraian.', image: '/images/drum_step1.png' },
            { title: 'Pencampuran', desc: 'Campur 2 bagian sampah basah dengan 1 bagian sampah kering dalam drum.', image: '/images/drum_step2.png' },
            { title: 'Aplikasi MOL', desc: 'Siram merata dengan larutan MOL untuk memicu mikroorganisme.', image: '/images/drum_step3.png' },
            { title: 'Penutupan', desc: 'Aduk rata setiap beberapa hari dan tutup rapat. Matang dalam 3-4 minggu.', image: '/images/drum_step4.png' }
          ],
          tips: [
            { problem: 'Belatung', solution: 'Adukan kurang kering. Tambah serabut gergaji/sekam dan MOL.' },
            { problem: 'Bau Busuk', solution: 'Terlalu banyak sampah cokelat/kering. Tambah sampah sayuran/buah.' },
            { problem: 'Terlalu Kering', solution: 'Proses melambat. Semprotkan air/MOL secukupnya.' }
          ],
          benefits: ['Kapasitas Besar', 'Terlindungi dari Hama', 'Proses Cukup Cepat']
        },
        researchList: [
          'Optimasi Frekuensi Pemutaran Drum Terhadap Suhu Kematangan Kompos.',
          'Desain Drum Komposter Skala Lingkungan dengan Filtrasi Cairan Lindi.',
          'Uji Coba Pengolahan Sampah Pasar Induk Menggunakan Drum Komposter Raksa.'
        ]
      },
      {
        title: 'Komposter Pot',
        description: 'Mengubah sisa dapur langsung di pot tanaman, menciptakan nutrisi yang langsung terserap akar.',
        image: '/images/compost_pot.png',
        fullDetail: {
          overview: 'Metode pengomposan langsung pada pot tanaman hidup, menciptakan siklus nutrisi tertutup (Close-loop).',
          tools: ['Pot Tanah Liat/Plastik', 'Penyiram'],
          materials: ['Sisa Sayur/Buah', 'Tanah Pot', 'Tanaman Hidup'],
          steps: [
            { title: 'Lubang Tanam', desc: 'Gali lubang kecil di pinggir pot tanaman yang sedang tumbuh.', image: '/images/pot_step1.png' },
            { title: 'Kubur Sampah', desc: 'Masukkan sisa dapur organik ke dalam lubang tersebut.', image: '/images/pot_step2.png' },
            { title: 'Penutupan', desc: 'Tutup kembali dengan tanah agar tidak mengundang lalat.', image: '/images/pot_step3.png' },
            { title: 'Nutrisi Alami', desc: 'Sampah akan terurai dan diserap langsung sebagai energi tanaman.', image: '/images/pot_step4.png' }
          ],
          benefits: ['Tanpa Perlu Wadah Khusus', 'Nutrisi Langsung ke Akar', 'Sangat Mudah Dilakukan']
        },
        researchList: [
          'Siklus Nutrisi Tertutup: Integrasi Sampah Dapur Langsung ke Pot Sayuran.',
          'Pengaruh Kompos Pot Terhadap Laju Pertumbuhan Tanaman Holtikultura.',
          'Analisis Kehadiran Fauna Tanah pada Metode Komposter Pot Mandiri.'
        ]
      },
      {
        title: 'Lubang Biopori',
        description: 'Teknologi lubang resapan untuk meningkatkan daya serap air tanah dan mengubah sampah menjadi kompos.',
        image: '/images/biopori_detail_1768667700168.png',
        fullDetail: {
          overview: 'Lubang silindris vertikal ke dalam tanah sebagai metode resapan air sekaligus komposter bawah tanah.',
          tools: ['Bor Tanah', 'Pipa PVC Berlubang', 'Tutup Biopori'],
          materials: ['Sampah Daun/Rumput', 'Sisa Buah', 'Tanah Lembap'],
          steps: [
            { title: 'Pelubangan', desc: 'Buat lubang sedalam 1 meter dengan diameter 10-30 cm.', image: '/images/biopori_step1.png' },
            { title: 'Pemasangan Pipa', desc: 'Masukkan pipa PVC yang sudah dilubangi ke dalam tanah.', image: '/images/biopori_step2.png' },
            { title: 'Isi Sampah', desc: 'Masukkan sampah organik ke dalam pipa hingga penuh.', image: '/images/biopori_step3.png' },
            { title: 'Penutupan', desc: 'Tutup dengan kawat atau tutup biopori. Panen kompos dalam 3 bulan.', image: '/images/biopori_step4.png' }
          ],
          benefits: ['Mencegah Banjir (Resapan)', 'Memperbaiki Struktur Tanah', 'Tanpa Mengambil Lahan Permukaan']
        },
        researchList: [
          'Laju Resapan Air Hujan di Wilayah Urban dengan Lubang Resapan Biopori.',
          'Pemanfaatan Sampah Daun Kering Sebagai Media Biopori di Area Perkantoran.',
          'Konservasi Air Tanah Melalui Gerakan 1000 Biopori di Lahan Sempit.'
        ]
      },
      {
        title: 'Bata Terawang',
        description: 'Bak pengomposan estetik dengan ventilasi alami dari celah bata, cocok untuk area halaman belakang.',
        image: '/images/bata_terawang.png',
        fullDetail: {
          overview: 'Sarana pengomposan skala komunitas menggunakan susunan bata berongga untuk oksigenasi maksimal.',
          tools: ['Susunan Bata (Kubus)', 'Semprotan'],
          materials: ['Sampah Daun Hijau/Cokelat', 'MOL (Mikro Organisme Lokal)'],
          steps: [
            { title: 'Input Sampah', desc: 'Masukkan cacahan sampah organik kasar ke dalam bak bata.', image: '/images/bata_step1.png' },
            { title: 'Aerasi Alami', desc: 'Udara masuk melalui celah bata tanpa perlu pengadukan sering.', image: '/images/bata_step2.png' },
            { title: 'Penyemprotan', desc: 'Semprot dengan MOL setiap 3 hari sekali untuk kelembapan.', image: '/images/bata_step3.png' },
            { title: 'Panen Mudah', desc: 'Ambil kompos yang sudah matang dari lubang bawah dalam 30 hari.', image: '/images/bata_step4.png' }
          ],
          benefits: ['Skala Menengah/Komunitas', 'Aerasi Sangat Baik', 'Perawatan Sangat Minim']
        },
        researchList: [
          'Analisis Aliran Udara Konvektif pada Bak Kompos Model Bata Terawang.',
          'Studi Kapasitas Dekomposisi Kompos Komunal di Kompleks Perumahan.',
          'Estetika dan Efisiensi Bak Komposter Bata Terawang Sebagai Elemen Taman.'
        ]
      },
      {
        title: 'Loseda',
        description: 'Lodong Sesa Dapur: Pipa vertikal sederhana untuk mengolah sisa makanan langsung di halaman.',
        image: '/images/loseda_method.png',
        fullDetail: {
          overview: 'Pipa vertikal (Lodong) yang ditanam ke tanah sebagai tempat pembuangan sisa makanan harian yang efisien.',
          tools: ['Pipa PVC (Dia >4 inch)', 'Bor/Gergaji'],
          materials: ['Sisa Makanan Dapur', 'Limbah Organik Cair'],
          steps: [
            { title: 'Tanam Pipa', desc: 'Tanam pipa PVC setengah badan ke dalam tanah di area taman.', image: '/images/loseda_step1.png' },
            { title: 'Pembuangan', desc: 'Buang sisa makanan langsung ke dalam mulut pipa setiap hari.', image: '/images/loseda_step2.png' },
            { title: 'Dekomposisi', desc: 'Biarkan mikroorganisme tanah mengolahnya menjadi nutrisi bawah tanah.', image: '/images/loseda_step3.png' },
            { title: 'Tutup Pipa', desc: 'Gunakan tutup pipa agar tidak ada serangga yang masuk.', image: '/images/loseda_step4.png' }
          ],
          benefits: ['Paling Hemat Tempat', 'Langsung di Titik Sumber', 'Tanah Sekitar Jadi Sangat Subur']
        },
        researchList: [
          'Efektivitas Loseda dalam Mereduksi Sampah Sisa Makanan Rumah Tangga.',
          'Sebaran Akar Tanaman Sekitar Loseda: Studi Kasus Kesuburan Tanah.',
          'Pelatihan Masyarakat dalam Implementasi Lodong Sesa Dapur di Pedesaan.'
        ]
      },
      {
        title: 'Eco-Enzyme',
        description: 'Fermentasi limbah kulit buah menjadi cairan serbaguna untuk pembersih dan pupuk alami.',
        image: '/images/eco_enzyme_detail_1768667666422.png',
        fullDetail: {
          overview: 'Fermentasi limbah kulit buah menjadi cairan serbaguna yang sangat bermanfaat untuk lingkungan.',
          tools: ['Wadah Kedap Udara', 'Label'],
          materials: ['Kulit Buah (Jeruk, Nanas, dll)', 'Gula Merah/Molase', 'Air'],
          steps: [
            { title: 'Perbandingan', desc: 'Gunakan rumus 1:3:10 (Gula:Sampah:Air).', image: '/images/eco_enzyme_step1.png' },
            { title: 'Pencampuran', desc: 'Larutkan gula dalam air, masukkan cacahan kulit buah segar.', image: '/images/eco_enzyme_step2.png' },
            { title: 'Fermentasi', desc: 'Simpan selama 3 bulan di tempat teduh.', image: '/images/eco_enzyme_step3.png' },
            { title: 'Pembuangan Gas', desc: 'Buka tutup wadah secara berkala di bulan pertama untuk membuang gas.', image: '/images/eco_enzyme_step4.png' }
          ],
          benefits: ['Pembersih Alami', 'Pupuk Cair Organik', 'Mengurangi Gas Metana']
        },
        researchList: [
          'Aktivitas Antimikroba Eco-Enzyme dari Berbagai Variasi Kulit Buah.',
          'Aplikasi Eco-Enzyme Sebagai Cairan Pembersih Lantai Ramah Lingkungan.',
          'Pengaruh Eco-Enzyme Terhadap Pemurnian Air Sungai yang Tercemar Limbah Domestik.'
        ]
      },
      {
        title: 'Biogas Digester',
        description: 'Teknologi fermentasi limbah basah menjadi gas metana untuk memasak dan pupuk cair.',
        image: '/images/biogas_detail.png',
        fullDetail: {
          overview: 'Sistem pengolahan limbah organik basah (kotoran ternak/sisa makanan) dalam ruang kedap udara (anaerob) untuk memanen gas bio.',
          tools: ['Tangki Digester', 'Pipa Gas', 'Kompor Biogas', 'Manometer'],
          materials: ['Kotoran Ternak/Limbah Dapur', 'Air', 'Starter Bakteri Methanogen'],
          steps: [
            { title: 'Pembuatan Slurry', desc: 'Campur kotoran atau limbah dapur halus dengan air (rasio 1:1) hingga menjadi lumpur encer.', image: '/images/biogas_step1.png' },
            { title: 'Feeding Reactor', desc: 'Masukkan slurry ke dalam saluran inlet digester. Pastikan tidak ada bahan keras yang masuk.', image: '/images/biogas_step2.jpg' },
            { title: 'Fermentasi Anaerob', desc: 'Bakteri akan mengurai material dalam tangki kedap udara. Gas akan terbentuk di bagian atas (kubah).', image: '/images/biogas_step3.jpg' },
            { title: 'Pemanfaatan Gas', desc: 'Buka kran gas, alirkan ke kompor untuk memasak. Ampas (bio-slurry) yang keluar sangat bagus untuk pupuk.', image: '/images/biogas_step4.jpg' }
          ],
          tips: [
            { problem: 'Api Tidak Menyala', solution: 'Gas masih tercampur udara. Buang gas awal beberapa kali hingga murni.' },
            { problem: 'Tekanan Rendah', solution: 'Suhu dingin atau kurang feeding. Tambah isian bahan organik.' },
            { problem: 'Bau Busuk Menyengat', solution: 'Kebocoran pada pipa atau sambungan. Cek dengan air sabun.' }
          ],
          benefits: ['Pengganti Elpiji (Hemat)', 'Pupuk Cair Bio-Slurry', 'Mengurangi Emisi Metana Liar'],
          historyNote: {
            title: 'Kearifan Lokal: Saung Gas Desa',
            text: 'Di banyak desa mandiri energi, kotoran dari 2-3 ekor sapi cukup untuk menyalakan kompor gas satu keluarga seharian penuh, membuktikan bahwa "limbah" adalah "emas" yang salah tempat.'
          }
        },
        researchList: [
          'Rancang Bangun Digester Biogas Portable Berbahan Polyethylene untuk Skala Rumah Tangga.',
          'Analisis Kadar Nitrogen, Fosfor, dan Kalium pada Pupuk Organik Cair Limbah Biogas.',
          'Efektivitas Co-Digestion Kotoran Sapi dan Limbah Sayuran Pasar dalam Meningkatkan Produksi Metana.'
        ]
      }
    ]
  },
  inorganic: {
    title: 'Siklus Anorganik',
    subtitle: 'Olah kembali material padat menjadi produk baru yang bernilai manfaat.',
    explanation: 'Sampah anorganik adalah sampah yang dihasilkan dari bahan-bahan non-hayati, baik berupa produk sintetik maupun hasil proses teknologi pengolahan bahan tambang. Sampah ini sangat sulit terurai secara alami dan membutuhkan waktu puluhan hingga ratusan tahun.',
    types: [
      {
        title: 'Plastik & Polimer',
        items: 'Botol PET, kantong kresek, kemasan sachet, wadah plastik.',
        subItems: [
          { name: 'Plastik PET', image: '/images/inorganic_transformation_landing_1768667593705.png', methodTitle: 'Pencacahan Plastik' },
          { name: 'Kemasan Sachet', image: '/images/recycle_crafts_detail_1768667747171.png', methodTitle: 'Kerajinan Daur Ulang' },
          { name: 'Botol Plastik', image: '/images/ecobrick_detail_1768667714907.png', methodTitle: 'Ecobrick' }
        ]
      },
      {
        title: 'Logam & Kaca',
        items: 'Kaleng aluminium, besi tua, botol kaca, pecahan keramik.',
        subItems: [
          { name: 'Kaleng', image: '/images/can_waste.png', methodTitle: 'Bank Sampah' },
          { name: 'Botol Kaca', image: '/images/glass_waste.png', methodTitle: 'Bank Sampah' }
        ]
      },
      {
        title: 'Kertas & Karton',
        items: 'Kardus bekas, kertas koran, majalah, kemasan tetra pak.',
        subItems: [
          { name: 'Koran/Kertas', image: '/images/paper_waste.png', methodTitle: 'Bank Sampah' },
          { name: 'Kardus', image: '/images/cardboard_waste.png', methodTitle: 'Bank Sampah' }
        ]
      }
    ],
    sources: ['Kemasan Produk Konsumsi', 'Kegiatan Perkantoran', 'Limbah Industri Manufaktur', 'Proyek Konstruksi'],
    energyTransformation: {
      title: 'Rekonstruksi Materi Anorganik',
      description: 'Materi yang sebelumnya mati dihidupkan kembali melalui sirkularitas ekonomi untuk mengurangi eksploitasi alam.',
      result: 'Raw Material (Bahan Baku Baru), Produk Upcycling, & Nilai Ekonomi.',
      icon: <Zap className="w-16 h-16 text-green-400" />
    },
    color: 'green',
    icon: <Recycle className="w-12 h-12 text-white" />,
    methods: [
      {
        title: 'Ecobrick',
        description: 'Memadatkan plastik bersih ke dalam botol untuk membuat bata ramah lingkungan.',
        image: '/images/ecobrick_detail_1768667714907.png',
        fullDetail: {
          overview: 'Ecobrick adalah inovasi visioner sebagai solusi pengolahan limbah plastik menjadi bata ramah lingkungan yang kuat dan awet.',
          tools: ['Gunting', 'Sendok (Pendorong)', 'Sabun Anti Bakteri'],
          materials: ['Botol Plastik 600ml', 'Sampah Plastik Bersih (Kering)', 'Air'],
          steps: [
            { title: 'Sterilisasi', desc: 'Cuci dan sterilkan semua sampah plastik maupun perlengkapan menggunakan sabun anti bakteri untuk menghilangkan kuman.', image: '/images/ecobrick_step1.png' },
            { title: 'Pengeringan', desc: 'Pastikan semua sampah plastik benar-benar kering sebelum dimasukkan agar tidak membusuk atau berjamur.', image: '/images/ecobrick_step2.png' },
            { title: 'Pemotongan', desc: 'Jika sampah plastik berukuran besar, potong menjadi bagian kecil menggunakan gunting agar mudah masuk ke botol.', image: '/images/ecobrick_step3.png' },
            { title: 'Pemadatan', desc: 'Padatkan sampah ke dalam botol menggunakan ujung bawah sendok. Botol harus keras dan tidak kempes saat ditekan.', image: '/images/ecobrick_step4.png' },
            { title: 'Penyelesaian', desc: 'Tutup botol dengan rapat setelah penuh dan padat. Satu batang ecobrick siap digunakan.', image: '/images/ecobrick_step5.png' }
          ],
          benefits: ['Material Bangunan Kuat', 'Kedap Air & Tahan Lama', 'Mengunci Plastik dari Lingkungan']
        },
        researchList: [
          'Uji Kuat Tekan Ecobrick Sebagai Pengganti Bata Merah pada Konstruksi Non-Struktural.',
          'Analisis Degradasi Plastik Terkunci di Dalam Ecobrick Setelah 10 Tahun.',
          'Pemanfaatan Ecobrick Dalam Pembangunan Fasilitas Publik di Desa Wisata.'
        ]
      },
      {
        title: 'Bank Sampah',
        description: 'Menabung sampah terpilah untuk ditukar dengan nilai ekonomi yang memberdayakan masyarakat.',
        image: '/images/bank_sampah_detail_1768667731142.png',
        fullDetail: {
          overview: 'Sistem pengelolaan sampah kolektif yang mengubah limbah anorganik menjadi saldo tabungan bernilai ekonomi.',
          tools: ['Timbangan', 'Buku Tabungan', 'Aplikasi Mobile (Optional)'],
          materials: ['Plastik', 'Kertas/Kardus', 'Logam/Kaleng', 'Kaca'],
          steps: [
            { title: 'Pemilahan', desc: 'Pilah sampah berdasarkan kategori (Plastik, Kertas, Kaleng, Kaca). Pastikan dalam kondisi bersih.', image: '/images/bank_sampah_step1.png' },
            { title: 'Dropping & Timbang', desc: 'Bawa sampah ke lokasi Bank Sampah terdekat. Petugas akan menimbang sesuai kategori.', image: '/images/bank_sampah_step2.png' },
            { title: 'Pencatatan Tabungan', desc: 'Hasil timbangan dikonversi ke rupiah dan dicatat dalam buku tabungan nasabah.', image: '/images/bank_sampah_step3.png' },
            { title: 'Siklus Industri', desc: 'Sampah yang terkumpul akan diangkut ke offtaker/pabrik daur ulang untuk diproses menjadi material baru.', image: '/images/bank_sampah_step4.png' }
          ],
          benefits: ['Tambahan Penghasilan', 'Lingkungan Lebih Bersih', 'Mendukung Ekonomi Sirkular']
        },
        researchList: [
          'Dampak Keberadaan Bank Sampah Terhadap Perilaku Pemilahan Limbah di Tingkat Rumah Tangga.',
          'Optimasi Managemen Logistik Bank Sampah Berbasis Aplikasi Digital.',
          'Analisis Ekonomi Sirkular pada Ekosistem Bank Sampah Unit dan Wilayah.'
        ]
      },
      {
        title: 'Kerajinan Daur Ulang',
        description: 'Mengubah kemasan sachet atau tekstil menjadi tas, fashion, dan aksesoris bernilai tinggi.',
        image: '/images/recycle_crafts_detail_1768667747171.png',
        fullDetail: {
          overview: 'Proses kreatif mengubah limbah non-degradable menjadi produk kriya bernilai estetika dan fungsional.',
          tools: ['Gunting/Cutter', 'Mesin Jahit atau Jarum', 'Glue Gun (Lem Tembak)'],
          materials: ['Kemasan Sachet (Kopi/Detergen)', 'Kain Perca', 'Benang & Resleting'],
          steps: [
            { title: 'Pilih & Bersihkan', desc: 'Pilih sachet dengan motif menarik, cuci bersih, dan keringkan.', image: '/images/craft_step1.png' },
            { title: 'Pembuatan Pola', desc: 'Potong bahan sesuai desain tas atau dompet yang diinginkan.', image: '/images/craft_step2.png' },
            { title: 'Anyaman/Jahit', desc: 'Anyam sachet atau jahit paku bersama kain pelapis agar lebih kuat.', image: '/images/craft_step3.png' },
            { title: 'Finishing', desc: 'Tambahkan resleting atau hiasan lainnya untuk mempercantik tampilan.', image: '/images/craft_step4.png' }
          ],
          benefits: ['Produk Unik & Eksklusif', 'Mengurangi Beban TPA', 'Peluang Bisnis UMKM']
        },
        researchList: [
          'Inovasi Desain Produk Fashion dari Limbah Multi-Layer Plastic (MLP).',
          'Analisis Ketahanan Luntur dan Kekuatan Tarik Tas Produk Upcycling Sachet.',
          'Strategi Pemasaran Produk Kerajinan Daur Ulang di Pasar Internasional.'
        ]
      },
      {
        title: 'Pencacahan Plastik',
        description: 'Proses mekanis mereduksi ukuran plastik menjadi flakes untuk bahan baku industri tekstil.',
        image: '/images/plastic_shredding_detail_1768667762429.png',
        fullDetail: {
          overview: 'Teknologi pemrosesan plastik menjadi serpihan kecil (flakes) untuk mempermudah pemurnian kembali menjadi bijih plastik.',
          tools: ['Mesin Shredder (Pencacah)', 'Wadah Besar', 'Masker & Sarung Tangan'],
          materials: ['Botol PET', 'Tutup Botol HDPE', 'Limbah Plastik Keras'],
          steps: [
            { title: 'Sortir Polimer', desc: 'Pisahkan plastik berdasarkan jenisnya (PET, HDPE, PP) agar tidak tercampur.', image: '/images/shredder_step1.png' },
            { title: 'Penghilangan Label', desc: 'Lepaskan label dan lem yang menempel pada permukaan plastik.', image: '/images/shredder_step2.png' },
            { title: 'Proses Shredding', desc: 'Masukkan plastik ke mesin pencacah hingga menjadi flakes berukuran seragam.', image: '/images/shredder_step3.png' },
            { title: 'Pencucian & Pengeringan', desc: 'Cuci flakes untuk menghilangkan kotoran sisa, lalu keringkan sebelum dikemas.', image: '/images/shredder_step4.jpg' }
          ],
          benefits: ['Efisiensi Logistik', 'Bahan Baku Industri Serat/Kain', 'Meningkatkan Harga Jual Limbah']
        },
        researchList: [
          'Karakterisasi Flakes PET Hasil Cacahan Lokal Untuk Standar Industri Tekstil.',
          'Efisiensi Mesin Shredder Skala IKM Dalam Menurunkan Biaya Logistik Sampah.',
          'Studi Pengurangan Kontaminan Kimia pada Flakes Plastik Melalui Metode Pencucian Hot-Wash.'
        ]
      }
    ]
  },
  b3: {
    title: 'Limbah Khusus B3',
    subtitle: 'Kelola dengan sangat hati-hati demi menjaga keamanan ekosistem kita.',
    explanation: 'Limbah B3 (Bahan Berbahaya dan Beracun) adalah sisa suatu usaha atau kegiatan yang mengandung bahan berbahaya karena sifat, konsentrasi, atau jumlahnya dapat mencemarkan dan merusak lingkungan hidup.',
    types: [
      {
        title: 'Elektronik & Baterai',
        items: 'Baterai bekas, lampu neon, kabel, komponen HP/Laptop.',
        subItems: [
          { name: 'HP Bekas', image: '/images/ewaste_icon.png', methodTitle: 'Dropbox E-Waste' },
          { name: 'Baterai', image: '/images/battery_icon.png', methodTitle: 'Daur Ulang Batrai' },
          { name: 'Lampu Neon', image: '/images/ewaste_dropbox_detail_1768667787270.png', methodTitle: 'Dropbox E-Waste' }
        ]
      },
      {
        title: 'Kimia & Cairan',
        items: 'Sisa oli, pelarut kimia, deterjen keras, cat, pestisida.',
        subItems: [
          { name: 'Minyak Jelantah', image: '/images/cooking_oil_collection_detail_1768667805271.png', methodTitle: 'Minyak Jelantah' },
          { name: 'Oli Bekas', image: '/images/cooking_oil_collection_detail_1768667805271.png', methodTitle: 'Minyak Jelantah' }
        ]
      },
      {
        title: 'Medis & Farmasi',
        items: 'Obat kadaluarsa, masker bekas, jarum suntik, perban.',
        subItems: [
          { name: 'Masker', image: '/images/medical_icon.png', methodTitle: 'Solidifikasi Medis' },
          { name: 'Obat Bekas', image: '/images/medical_waste_detail_1768667824540.png', methodTitle: 'Solidifikasi Medis' }
        ]
      }
    ],
    sources: ['Fasilitas Kesehatan', 'Bengkel & Industri Kecil', 'Penggunaan Elektronik Rumah Tangga', 'Area Pembersihan'],
    energyTransformation: {
      title: 'Penetralan & Recovery B3',
      description: 'Mencegah racun memasuki rantai makanan sembari mengekstraksi potensi energi yang tersisa secara aman.',
      result: 'Bio-Fuels (dari jelantah), Logam Berharga (ekstraksi e-waste), & Keamanan Tanah.',
      icon: <Droplets className="w-16 h-16 text-lime-400" />
    },
    color: 'lime',
    icon: <AlertTriangle className="w-12 h-12 text-white" />,
    methods: [
      {
        title: 'Dropbox E-Waste',
        description: 'Titik pengumpulan khusus untuk menjamin sampah elektronik masuk ke jalur pemurnian profesional.',
        image: '/images/ewaste_dropbox_detail_1768667787270.png',
        fullDetail: {
          overview: 'Layanan dropbox khusus untuk memisahkan limbah elektronik dari sampah umum guna mencegah kebocoran logam berat ke tanah.',
          tools: ['Kotak Dropbox Berventilasi', 'Label Kategori E-Waste'],
          materials: ['Smartphone Bekas', 'Laptop/Tablet Rusak', 'Kabel & Adaptor', 'Motherboard'],
          steps: [
            { title: 'Drop Off', desc: 'Identifikasi perangkat elektronik yang sudah tidak berfungsi dan masukkan ke dropbox resmi.', image: '/images/ewaste_step2.jpg' },
            { title: 'Sortir Tenaga Ahli', desc: 'Perangkat dibawa ke fasilitas pemurnian untuk dibongkar secara hati-hati.', image: '/images/ewaste_step1.jpg' },
            { title: 'Ekstraksi Komponen', desc: 'Pemisahan material berharga (emas, perak, tembaga) dari sirkuit elektronik.', image: '/images/ewaste_step4.jpg' },
            { title: 'Pembuangan Aman', desc: 'Komponen yang benar-benar residu berbahaya dihancurkan dengan metode enkapsulasi.', image: '/images/ewaste_step3.jpg' }
          ],
          benefits: ['Mencegah Pencemaran Merkuri', 'Konservasi Logam Mulia', 'Keamanan Data Fisik']
        },
        researchList: [
          'Analisis Konsentrasi Logam Berat di Sekitar Titik Pengumpulan E-Waste Urban.',
          'Implementasi Blockchain Untuk Penelusuran (Traceability) Limbah Elektronik.',
          'Efektivitas Kampanye Insentif Terhadap Partisipasi Masyarakat dalam Pengumpulan E-Waste.'
        ]
      },
      {
        title: 'Minyak Jelantah',
        description: 'Pengumpulan minyak goreng bekas untuk diubah menjadi biodiesel berkualitas sebagai energi bersih.',
        image: '/images/cooking_oil_collection_detail_1768667805271.png',
        fullDetail: {
          overview: 'Transformasi limbah cair dapur menjadi bahan bakar ramah lingkungan (Biodiesel) melalui proses transesterifikasi.',
          tools: ['Jerigen Penampung', 'Saringan Halus', 'Corong'],
          materials: ['Minyak Goreng Bekas (Jelantah)', 'Larutan Katalis (Bila di Lab)', 'Metanol'],
          steps: [
            { title: 'Penyaringan', desc: 'Saring minyak jelantah dari sisa makanan atau kotoran padat.', image: '/images/jelantah_step1.png' },
            { title: 'Penampungan', desc: 'Simpan minyak dalam jerigen tertutup. Hindari mencampur dengan air.', image: '/images/jelantah_step2.png' },
            { title: 'Pengiriman ke Depot', desc: 'Setorkan minyak ke titik pengumpulan yang bekerja sama dengan pabrik biodiesel.', image: '/images/jelantah_step3.png' },
            { title: 'Konversi Energi', desc: 'Minyak diproses secara kimiawi untuk menjadi Bio-Solar (B35/B100).', image: '/images/jelantah_step4.png' }
          ],
          benefits: ['Mencegah Penyumbatan Saluran', 'Bahan Baku Energi Terbarukan', 'Mengurangi Emisi Karbon']
        },
        researchList: [
          'Optimasi Proses Transesterifikasi Minyak Jelantah Menjadi Biodiesel Standar EN 14214.',
          'Studi Kelayakan Ekonomi Pengumpulan Jelantah Skala Rumah Tangga Untuk Industri Energi.',
          'Analisis Penurunan Emisi Gas Buang Kendaraan Bermotor Menggunakan Campuran Bio-Solar Jelantah.'
        ]
      },
      {
        title: 'Solidifikasi Medis',
        description: 'Proses sterilisasi dan penstabilan limbah infeksius sebelum dikelola lebih lanjut.',
        image: '/images/medical_waste_detail_1768667824540.png',
        fullDetail: {
          overview: 'Pengamanan limbah infeksius dengan cara sterilisasi panas tinggi (Autoclave) atau pembakaran suhu tinggi (Insinerasi Medis).',
          tools: ['Autoclave / Insinerator Medis', 'Container Safety Box', 'APD Lengkap'],
          materials: ['Masker Bekas', 'Jarum Suntik', 'Verban'],
          steps: [
            { title: 'Segregasi', desc: 'Pisahkan limbah medis berdasarkan jenis (tajam, infeksius, kimia).', image: '/images/med_step1.jpg' },
            { title: 'Inaktivasi Virus', desc: 'Proses sterilisasi menggunakan uap panas bertekanan tinggi untuk membunuh patogen.', image: '/images/med_step2.jpg' },
            { title: 'Penghancuran Mekanis', desc: 'Limbah yang sudah steril dicacah agar tidak dapat digunakan kembali.', image: '/images/med_step3.jpg' },
            { title: 'Pembuangan Terkendali', desc: 'Residu steril akhir dibuang ke lahan urug khusus B3.', image: '/images/med_step4.jpg' }
          ],
          benefits: ['Mutus Rantai Infeksi', 'Kepatuhan Regulasi Kesehatan', 'Keamanan Tenaga Sanitasi']
        },
        researchList: [
          'Inaktivasi Virus Berbahaya pada Limbah Medis Menggunakan Teknologi Autoclave Suhu Tinggi.',
          'Analisis Karakteristik Abu Insinerasi Medis Sebagai Bahan Campuran Batako.',
          'Manajemen Rantai Pasok Limbah Medis di Wilayah Tertinggal Sepanjang Pandemi.'
        ]
      },
      {
        title: 'Daur Ulang Batrai',
        description: 'Ekstraksi kimiawi untuk memisahkan lithium, nikel, dan kobalt demi baterai masa depan.',
        image: '/images/battery_recycling_detail_1768667840238.png',
        fullDetail: {
          overview: 'Pemulihan mineral kritis dari baterai bekas untuk mendukung keberlanjutan kendaraan listrik dan gadget.',
          tools: ['Wadah Anti Korosi', 'Tang Sirkuit', 'Peralatan Ekstraksi Logam'],
          materials: ['Baterai Lithium-ion', 'Baterai Alkaline', 'Baterai Timbal (Accu)'],
          steps: [
            { title: 'Pembebanan Kosong', desc: 'Pastikan baterai benar-benar kosong dari energi listrik untuk mencegah ledakan.', image: '/images/battery_step1.jpg' },
            { title: 'Crushing Berpendingin', desc: 'Proses pelumatan baterai dalam lingkungan nitrogen atau argon.', image: '/images/battery_step2.jpg' },
            { title: 'Hidrometalurgi', desc: 'Penggunaan larutan asam untuk memisahkan kobalt, nikel, dan lithium.', image: '/images/battery_step3.jpg' },
            { title: 'Kristalisasi Logam', desc: 'Pembentukan kembali logam murni untuk digunakan sebagai bahan baku baterai baru.', image: '/images/battery_step4.jpg' }
          ],
          benefits: ['Kemandirian Bahan Baku Baterai', 'Mencegah Ledakan di TPA', 'Mengurangi Penambangan Baru']
        },
        researchList: [
          'Pemulihan Lithium dan Cobalt dari Baterai Bekas Melalui Metode Hidrometalurgi Ramah Lingkungan.',
          'Studi Siklus Hidup (LCA) Baterai Kendaraan Listrik: Dari Bahan Baku Hingga Daur Ulang.',
          'Desain Sistem Pengumpulan Baterai Bekas Berbasis Komunitas Untuk Mencegah Ledakan di TPA.'
        ]
      }
    ]
  },
  residu: {
    title: 'Material Residu',
    subtitle: 'Tahap akhir pengelolaan untuk sampah yang tidak lagi dapat didaur ulang.',
    explanation: 'Residu adalah jenis sampah yang tidak dapat didaur ulang lagi baik karena kondisi fisiknya yang sudah kotor, rusak, maupun karena materialnya memang tidak memiliki teknologi daur ulang yang ekonomis saat ini.',
    types: [
      {
        title: 'Higiene & Sanitasi',
        items: 'Popok sekali pakai, pembalut, tisu basah, puntung rokok.',
        subItems: [
          { name: 'Popok/Pembalut', image: '/images/sanitary_landfill_detail_final_1768667885382.png', methodTitle: 'Teknologi RDF' },
          { name: 'Tisu Basah', image: '/images/sanitary_landfill_detail_final_1768667885382.png', methodTitle: 'Sanitary Landfill' }
        ]
      },
      {
        title: 'Plastik Laminasi',
        items: 'Kemasan kopi berlapis alumunium foil yang sulit dipisahkan.',
        subItems: [
          { name: 'Sachet Kopi', image: '/images/rdf_fuel_detail_final_1768667869504.png', methodTitle: 'Teknologi RDF' }
        ]
      },
      {
        title: 'Material Terkontaminasi',
        items: 'Materi yang sudah terkena minyak atau zat kimia yang merusak pori material.',
        subItems: [
          { name: 'Kain Berminyak', image: '/images/residue_transformation_landing_1768667627944.png', methodTitle: 'Insinerasi Modern' }
        ]
      }
    ],
    sources: ['Konsumen Rumah Tangga', 'Fasilitas Umum', 'Sisa Proses Daur Ulang', 'Kegiatan Komersial'],
    energyTransformation: {
      title: 'Waste to Energy (WtE)',
      description: 'Sampah yang tidak bisa kembali menjadi barang diubah menjadi panas untuk membangkitkan listrik bagi kota.',
      result: 'Refuse Derived Fuel (RDF), Listrik, & Produk Konstruksi (Abu FABA).',
      icon: <Flame className="w-16 h-16 text-teal-400" />
    },
    color: 'teal',
    icon: <Trash2 className="w-12 h-12 text-white" />,
    methods: [
      {
        title: 'Teknologi RDF',
        description: 'Pemrosesan sampah menjadi pelet bahan bakar industri semen sebagai pengganti batu bara.',
        image: '/images/rdf_fuel_detail_final_1768667869504.png',
        fullDetail: {
          overview: 'Refuse Derived Fuel (RDF) adalah proses mengolah sampah residu menjadi bahan bakar padat berkalori tinggi.',
          tools: ['Mesin Dryer (Pengering)', 'Mesin Press Pellet'],
          materials: ['Plastik Laminasi', 'Kertas Terkontaminasi', 'Sisa Tekstil'],
          steps: [
            { title: 'Pengurangan Kadar Air', desc: 'Sampah residu dikeringkan hingga kadar air di bawah 20%.', image: '/images/rdf_step1.jpg' },
            { title: 'Pencacahan Halus', desc: 'Material dipotong menjadi serpihan kecil agar mudah dipadatkan.', image: '/images/rdf_step2.jpg' },
            { title: 'Pemadatan (Pelletizing)', desc: 'Sampah ditekan menjadi pelet silindris padat berkalori tinggi.', image: '/images/rdf_step3.jpg' },
            { title: 'Pengiriman ke Industri', desc: 'Pelet RDF dikirim ke pabrik semen atau PLTU sebagai bahan bakar alternatif.', image: '/images/rdf_step4.jpg' }
          ],
          benefits: ['Substitusi Batu Bara', 'Mereduksi Volume Sampah Drastis', 'Menghasilkan Listrik']
        },
        researchList: [
          'Analisis Nilai Kalor Pelet RDF dari Sampah Pemukiman di Wilayah Tropis.',
          'Substitusi Batu Bara Dengan RDF pada Kiln Semen: Dampak Terhadap Kualitas Produk.',
          'Optimasi Proses Biodrying Untuk Penurunan Kadar Air Sampah Residu Secara Ekonomis.'
        ]
      },
      {
        title: 'Sanitary Landfill',
        description: 'Lahan urug terkontrol dengan sistem pelapis membran untuk mencegah pencemaran air tanah.',
        image: '/images/sanitary_landfill_detail_final_1768667885382.png',
        fullDetail: {
          overview: 'Metode penimbunan sampah secara terkendali yang dirancang khusus untuk meminimalkan dampak lingkungan.',
          tools: ['Bulldozer', 'Geomembran', 'Pipa Lindi'],
          materials: ['Sampah Residu Domestik', 'Tanah Penutup'],
          steps: [
            { title: 'Pelapisan Dasar', desc: 'Pemasangan lapisan kedap air (Geomembran) di dasar landfill.', image: '/images/landfill_step1.jpg' },
            { title: 'Penghamparan Sampah', desc: 'Sampah ditumpuk dan dipadatkan menggunakan alat berat.', image: '/images/landfill_step2.jpg' },
            { title: 'Penutupan Harian', desc: 'Lapisan sampah ditutup dengan tanah setiap hari untuk mencegah bau dan lalat.', image: '/images/landfill_step3.jpg' },
            { title: 'Pengelolaan Lindi', desc: 'Cairan lindi dialirkan melalui pipa menuju unit pengolahan air limbah.', image: '/images/landfill_step4.jpg' }
          ],
          benefits: ['Pencegahan Pencemaran Air Tanah', 'Stabilisasi Lahan', 'Area Bisa Direklamasi']
        },
        researchList: [
          'Analisis Efektivitas Geomembran dalam Mencegah Kebocoran Lindi (Leachate) ke Akuifer.',
          'Model Prediksi Penurunan (Settlement) Timbunan Sampah di TPA Sanitary Landfill.',
          'Evaluasi Pengolahan Air Lindi Menggunakan Metode Koagulasi-Flokulasi dan Filtrasi Karbon Aktif.'
        ]
      },
      {
        title: 'Ekstraksi Metana',
        description: 'Penangkapan gas metana dari tumpukan sampah TPA untuk dikonversi menjadi energi listrik.',
        image: '/images/methane_extraction_detail_final_1768667900017.png',
        fullDetail: {
          overview: 'Pemanfaatan gas metana hasil dekomposisi sampah di TPA untuk dibakar guna menggerakkan turbin listrik.',
          tools: ['Pipa Gas Vertikal', 'Separator Gas', 'Gas Engine / Generator'],
          materials: ['Tumpukan Sampah Lama (Anaerob)', 'Gas Metana (CH4)'],
          steps: [
            { title: 'Pemasangan Sumur Gas', desc: 'Menanam pipa-pipa berlubang ke dalam gunungan sampah yang sudah stabil.', image: '/images/methane_step1.jpg' },
            { title: 'Penyedotan Gas', desc: 'Gas metana ditarik menggunakan alat penghisap (blower).', image: '/images/methane_step2.jpg' },
            { title: 'Pemurnian', desc: 'Gas dipisahkan dari uap air dan partikel lain agar aman untuk mesin.', image: '/images/methane_step3.jpg' },
            { title: 'Pembangkitan Listrik', desc: 'Gas metana dibakar dalam mesin untuk menghasilkan energi listrik.', image: '/images/methane_step4.jpg' }
          ],
          benefits: ['Mengurangi Emisi Gas Rumah Kaca', 'Pemanfaatan Energi Gratis', 'Mencegah Kebakaran di TPA'],
          historyNote: {
            title: 'Refleksi Sejarah: Tragedi Leuwigajah (2005)',
            text: 'Ledakan TPA Leuwigajah yang menelan korban jiwa terjadi akibat akumulasi gas metana dari sampah organik yang tertimbun rapat tanpa ventilasi (sistem Open Dumping). Ekstraksi Metana terkontrol adalah solusi mutlak agar tragedi serupa tidak pernah terulang, mengubah "bom waktu" menjadi energi listrik yang aman.'
          }
        },
        researchList: [
          'Estimasi Potensi Pembangkitan Listrik dari Sumur Gas Metana TPA Skala Kota Madya.',
          'Analisis Pengurangan Gas Rumah Kaca (GRK) Melalui Proyek CDM Ekstraksi Metana.',
          'Perbandingan Metoda Adsorpsi dan Absorpsi dalam Pemurnian Gas Metana TPA.'
        ]
      },
      {
        title: 'Insinerasi Modern',
        description: 'Pembakaran terkendali dengan filter partikel mikro untuk meminimalkan dampak udara.',
        image: '/images/residue_transformation_landing_1768667627944.png',
        fullDetail: {
          overview: 'Teknologi pembakaran sampah pada suhu ekstrem (>850°C) yang dilengkapi sistem kontrol polusi canggih.',
          tools: ['Furnace (Tungku)', 'Gas Cleaning System (Scrubber)', 'Cerobong Monitoring Online'],
          materials: ['Segala Jenis Sampah Residu Tercampur'],
          steps: [
            { title: 'Thermal Oxidation', desc: 'Membakar sampah hingga habis menjadi abu (Residual Ash) dan panas.', image: '/images/incin_step1.jpg' },
            { title: 'Energy Recovery', desc: 'Panas yang dihasilkan digunakan untuk mendidihkan air menjadi uap turbin.', image: '/images/incin_step2.jpg' },
            { title: 'Flue Gas Cleaning', desc: 'Asap hasil pembakaran disaring melalui berbagai filter kimiawi agar bersih.', image: '/images/incin_step3.jpg' },
            { title: 'Monitoring Emisi', desc: 'Sistem memantau kualitas udara buangan secara real-time untuk memastikan keamanan.', image: '/images/incin_step4.jpg' }
          ],
          benefits: ['Reduksi Volume Hingga 90%', 'Listrik Skala Kota', 'Lahan yang Dibutuhkan Kecil']
        },
        researchList: [
          'Karakteristik Emisi Dioxin dan Furan pada Insinerator Modern Suhu Tinggi.',
          'Efisiensi Konversi Energi Panas Menjadi Listrik pada Fasilitas Waste-to-Energy (WtE).',
          'Pemanfaatan Abu Bottom Ash Insinerasi Sebagai Bahan Baku Paving Block Ramah Lingkungan.'
        ]
      }
    ]
  }
};

import { getActiveSponsor } from '../services/sponsorService';
import SponsorScreen from '../components/SponsorScreen';

const MethodModal: React.FC<{ method: TransformationMethod, onClose: () => void }> = ({ method, onClose }) => {
  if (!method.fullDetail) return null;

  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto px-4 py-12 md:p-12 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose}></div>

      <div className="relative bg-[#050510] border-2 border-white/10 rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-[0_0_100px_rgba(74,222,128,0.15)] animate-in fade-in zoom-in slide-in-from-bottom-12 duration-500">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors z-20 p-2 bg-white/5 rounded-full"
        >
          <ArrowLeft className="rotate-90 md:rotate-0 w-6 h-6" />
        </button>

        <div className="p-8 md:p-16 space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">
              {method.title}
            </h2>
            <div className="p-8 bg-gradient-to-r from-white/[0.03] to-transparent border-l-4 border-[#4ade80] rounded-r-3xl">
              <p className="text-xl md:text-2xl text-white/60 font-medium italic tracking-tight leading-relaxed">
                {method.fullDetail.overview}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Specs & Hardware */}
            <div className="lg:col-span-4 space-y-10">
              <div className="space-y-6">
                <h3 className="text-xs font-black text-[#4ade80] uppercase tracking-[0.4em] italic flex items-center gap-3">
                  <Cpu size={16} /> Hardware Matrix
                </h3>
                <div className="flex flex-wrap gap-2">
                  {method.fullDetail.tools.map((t, i) => (
                    <span key={i} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-white/50 font-black text-[9px] uppercase tracking-wider">{t}</span>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black text-[#4ade80] uppercase tracking-[0.4em] italic flex items-center gap-3">
                  <Layers size={16} /> Material Inputs
                </h3>
                <div className="flex flex-wrap gap-2">
                  {method.fullDetail.materials.map((m, i) => (
                    <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-black text-[9px] uppercase tracking-wider">{m}</span>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                <h3 className="text-[10px] font-black text-white/20 uppercase tracking-widest">Core Impact</h3>
                {method.fullDetail.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/70 font-bold italic uppercase text-[10px] tracking-tight">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]"></div> {b}
                  </div>
                ))}
              </div>

              {/* History Contex/Safety Warning */}
              {method.fullDetail.historyNote && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-3xl p-6 space-y-4 animate-pulse-slow">
                  <h3 className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle size={12} /> {method.fullDetail.historyNote.title}
                  </h3>
                  <p className="text-white/80 font-medium italic text-xs leading-relaxed">
                    "{method.fullDetail.historyNote.text}"
                  </p>
                </div>
              )}
            </div>

            {/* Implementation Steps with Comic Styling */}
            <div className="lg:col-span-8 space-y-8">
              <h3 className="text-xs font-black text-[#4ade80] uppercase tracking-[0.4em] italic flex items-center gap-3 border-b border-white/5 pb-4">
                <PlayCircle size={16} /> Execution Protocol
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {method.fullDetail.steps.map((s, i) => (
                  <div key={i} className="group relative flex flex-col p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all hover:bg-white/[0.04] overflow-hidden">
                    {/* Comic Panel Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-8 h-8 rounded-lg bg-[#4ade80] flex items-center justify-center text-black font-black italic text-sm shadow-[0_0_15px_rgba(74,222,128,0.4)]">
                        {i + 1}
                      </div>
                      <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] italic">Protocol Phase</span>
                    </div>

                    {/* Comic Illustration Placeholder/Frame */}
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#0a0a20] border-2 border-white/10 mb-6 group-hover:border-[#4ade80]/40 transition-all transform group-hover:rotate-1 shadow-inner">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:10px_10px]"></div>

                      {s.image ? (
                        <img src={s.image} alt={s.title} className="w-full h-full object-cover mix-blend-lighten opacity-40 group-hover:opacity-80 transition-opacity" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-x-0 h-[2px] bg-[#4ade80]/50 blur-sm animate-[scan_3s_ease-in-out_infinite]"></div>

                          <div className="text-center group-hover:scale-110 transition-transform relative z-10">
                            <Sparkles className="w-10 h-10 text-[#4ade80]/40 mx-auto mb-3 animate-pulse" />
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.5em] italic">System Schematic</p>
                            <div className="mt-2 w-16 h-1 bg-white/5 mx-auto rounded-full overflow-hidden">
                              <div className="w-full h-full bg-[#4ade80]/40 animate-[loading-bar_2s_ease-in-out_infinite]"></div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent"></div>
                    </div>

                    <div className="space-y-2 relative z-10">
                      <h4 className="text-white font-black uppercase italic tracking-tighter text-base group-hover:text-[#4ade80] transition-colors">{s.title}</h4>
                      <p className="text-white/40 font-bold text-xs leading-relaxed tracking-tight group-hover:text-white/60 transition-colors">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Research & Applications List */}
              {method.researchList && method.researchList.length > 0 && (
                <div className="p-10 rounded-[3rem] bg-emerald-500/[0.03] border border-emerald-500/10 space-y-8 mt-12">
                  <h3 className="text-xs font-black text-emerald-400 uppercase tracking-[0.4em] italic flex items-center gap-3">
                    <Database size={16} /> Case Studies & Research
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {method.researchList.map((res, i) => (
                      <div key={i} className="flex gap-4 items-start group">
                        <span className="shrink-0 w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-white/40 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                          {i + 1}
                        </span>
                        <p className="text-sm font-bold text-white/50 italic uppercase tracking-tight leading-relaxed group-hover:text-white transition-colors">
                          {res}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Troubleshooting Guide */}
          {method.fullDetail.tips && (
            <div className="p-10 rounded-[3rem] bg-amber-500/5 border border-amber-500/10 space-y-8">
              <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.4em] italic flex items-center gap-3">
                <Info size={16} /> Optimization & Troubleshooting
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {method.fullDetail.tips.map((tip, i) => (
                  <div key={i} className="space-y-3 p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                    <span className="text-[8px] font-black text-amber-500/40 uppercase italic tracking-widest block">Issue: {tip.problem}</span>
                    <p className="text-white font-bold italic uppercase text-[10px] leading-relaxed group-hover:text-white transition-colors">
                      {tip.solution}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <Info className="text-[#4ade80]" size={24} />
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest max-w-md italic">
                Data riset ini disediakan untuk tujuan edukasi. Poin dapat diklaim ulang setiap bulan!
              </p>
            </div>
            <button
              onClick={async () => {
                const baseActivityId = `transformation_${method.title.replace(/\s+/g, '_').toLowerCase()}`;
                const monthlyActivityId = getMonthlyActivityId(baseActivityId);
                const success = await addCredits(200, `Mempelajari Metode: ${method.title}`, monthlyActivityId);
                if (success) {
                  alert(`Energi Tersinkronisasi! +200 Eco-Credits berhasil ditambahkan.`);
                }
                onClose();
              }}
              disabled={isMonthlyActivityCompleted(`transformation_${method.title.replace(/\s+/g, '_').toLowerCase()}`)}
              className={`px-12 py-5 font-black uppercase italic tracking-[0.2em] rounded-2xl transition-all shadow-[0_0_30px_rgba(74,222,128,0.3)] ${isMonthlyActivityCompleted(`transformation_${method.title.replace(/\s+/g, '_').toLowerCase()}`)
                ? 'bg-white/10 text-white/20 cursor-not-allowed border border-white/5'
                : 'bg-[#4ade80] text-black hover:scale-105'
                }`}
            >
              {isMonthlyActivityCompleted(`transformation_${method.title.replace(/\s+/g, '_').toLowerCase()}`)
                ? `Selesai Bulan Ini (${getCurrentMonth()})`
                : 'Selesai Mempelajari (+200)'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

const ResponsibilityNotice: React.FC = () => (
  <div className="mb-16 p-8 md:p-12 bg-amber-500/10 border-2 border-amber-500/30 rounded-[3rem] backdrop-blur-3xl relative overflow-hidden group shadow-[0_0_50px_rgba(245,158,11,0.1)]">
    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
      <div className="shrink-0 w-20 h-20 rounded-3xl bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
        <Info size={40} className="animate-bounce" />
      </div>
      <div className="space-y-4">
        <h3 className="text-xl md:text-2xl font-black text-amber-400 italic uppercase tracking-tighter">
          PENTING: Batas Tanggung Jawab Rumah Tangga
        </h3>
        <p className="text-white font-bold italic uppercase tracking-tight text-sm md:text-base leading-relaxed opacity-80">
          "Untuk skala mandiri, fokuslah pada pengolahan <span className="text-amber-400">Organik & Anorganik</span>. Khusus B3 & Residu, tanggung jawab <span className="text-amber-400">Skala Rumah Tangga</span> adalah <span className="text-white underline decoration-amber-500 decoration-4 underline-offset-4">Memilah dengan Benar</span>.
          Pengolahan teknis di bawah ini adalah wawasan tambahan—kecuali jika <span className="text-amber-400">Skala Rumah Tangga tersebut mampu untuk memiliki</span> fasilitas pemusnahan mandiri khusus."
        </p>
      </div>
    </div>
  </div>
);

const TransformationDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [selectedMethod, setSelectedMethod] = React.useState<TransformationMethod | null>(null);
  const [showTransition, setShowTransition] = React.useState(false);
  const [activeSponsor, setActiveSponsor] = React.useState<any>(null);

  // Normalize ID with more flexibility
  const rawId = id?.toLowerCase() || '';
  const categoryId =
    rawId.includes('inorganic') || rawId.includes('anorganic') || rawId.includes('anorganik') ? 'inorganic' :
      rawId.includes('organic') || rawId.includes('organik') ? 'organic' :
        rawId.includes('b3') || rawId.includes('bahaya') ? 'b3' :
          rawId.includes('residu') || rawId.includes('residue') ? 'residu' : 'organic';

  const data = dataMap[categoryId as keyof typeof dataMap];

  if (!data) return (
    <div className="min-h-screen bg-[#022c22] flex items-center justify-center text-white p-6 text-center">
      <div>
        <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
          <AlertTriangle size={40} />
        </div>
        <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Sinyal Terdistorsi</h1>
        <p className="text-white/40 font-bold mb-8 uppercase text-xs tracking-widest italic">Data Transformasi Terhapus di Blackhole</p>
        <button onClick={() => navigate('/transformasi')} className="px-8 py-4 bg-white text-black font-black uppercase italic tracking-tighter rounded-2xl hover:scale-105 transition-all">Kembali ke Orbit</button>
      </div>
    </div>
  );

  const handleLearnMethod = (method: TransformationMethod) => {
    if (!method.fullDetail) {
      // Just fallback or alert if no detail yet
      alert(`Tutorial for ${method.title} is coming soon!`);
      return;
    }
    setActiveSponsor(getActiveSponsor());
    setShowTransition(true);
    setSelectedMethod(method);
    // Disable body scroll when modal/transition is active
    document.body.style.overflow = 'hidden';
  };

  const closeMethod = () => {
    setSelectedMethod(null);
    document.body.style.overflow = 'unset';
  };

  const getTheme = () => {
    switch (categoryId) {
      case 'organic': return { border: 'border-emerald-600', button: 'bg-emerald-600 hover:bg-emerald-700', glow: 'group-hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]' };
      case 'inorganic': return { border: 'border-green-600', button: 'bg-green-600 hover:bg-green-700', glow: 'group-hover:shadow-[0_0_40px_rgba(34,197,94,0.4)]' };
      case 'b3': return { border: 'border-lime-600', button: 'bg-lime-600 hover:bg-lime-700', glow: 'group-hover:shadow-[0_0_40px_rgba(132,204,22,0.4)]' };
      case 'residu': return { border: 'border-teal-600', button: 'bg-teal-600 hover:bg-teal-700', glow: 'group-hover:shadow-[0_0_40px_rgba(20,184,166,0.4)]' };
      default: return { border: 'border-emerald-600', button: 'bg-emerald-600' };
    }
  };

  const theme = getTheme();

  const scrollToMethod = (title?: string) => {
    if (!title) return;
    const element = document.getElementById(`method-${title.replace(/\s+/g, '-').toLowerCase()}`);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#022c22] pt-32 pb-24 px-6 overflow-hidden relative">
      <SEO
        title={data.title}
        description={data.subtitle}
      />
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_0%,_#064e3b_0%,_transparent_70%)] z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Navigation & Header */}
        <div className="mb-24">
          <button
            onClick={() => navigate('/transformasi')}
            className="flex items-center gap-2 text-[#4ade80] hover:text-white mb-12 transition-all font-black uppercase tracking-widest text-xs group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" /> Kembali ke Kategori
          </button>

          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-emerald-500/10 border-4 border-emerald-500/20 shadow-3xl">
              {data.icon}
            </div>
            <div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter leading-[1.1] uppercase italic drop-shadow-[0_10px_30px_rgba(16,185,129,0.3)]">
                {data.title}
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-[#4ade80] font-bold italic uppercase tracking-tighter drop-shadow-md">
                {data.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Penjelasan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
          <div className="bg-white/[0.03] backdrop-blur-3xl p-10 md:p-16 rounded-[4rem] border-2 border-white/5 space-y-8">
            <div className="flex items-center gap-4 text-white/20">
              <Info size={24} />
              <span className="font-black uppercase tracking-[0.5em] text-xs">Penjelasan Materi</span>
            </div>
            <p className="text-2xl md:text-3xl font-black text-white leading-tight italic uppercase tracking-tighter">
              "{data.explanation}"
            </p>
          </div>
          <div className="space-y-12">
            <div className="space-y-6">
              <h3 className="text-xs font-black text-emerald-400 uppercase tracking-[0.5em] italic flex items-center gap-4">
                <Layers size={16} /> Anatomi Jenis
              </h3>
              <div className="space-y-4">
                {data.types.map((t, idx) => (
                  <div key={idx} className="bg-white/5 p-6 rounded-3xl border border-white/5 group hover:border-[#4ade80]/30 transition-all">
                    <h4 className="text-white font-black text-xl mb-1 uppercase italic tracking-tighter group-hover:text-[#4ade80]">{t.title}</h4>
                    <p className="text-white/30 font-bold uppercase text-xs italic mb-4">{t.items}</p>

                    {t.subItems && (
                      <div className="flex flex-wrap gap-4 mt-4">
                        {t.subItems.map((sub, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => scrollToMethod(sub.methodTitle)}
                            className="flex flex-col items-center gap-2 group/item"
                          >
                            <div className="w-16 h-16 rounded-2xl bg-white/10 p-2 border border-white/10 group-hover/item:border-[#4ade80]/50 group-hover/item:scale-110 transition-all overflow-hidden shadow-lg">
                              <img src={sub.image} alt={sub.name} className="w-full h-full object-contain" />
                            </div>
                            <span className="text-[10px] font-black text-white/50 uppercase italic tracking-tighter group-hover/item:text-[#4ade80]">{sub.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-xs font-black text-emerald-400 uppercase tracking-[0.5em] italic flex items-center gap-4">
                <Database size={16} /> Sumber Utama
              </h3>
              <div className="flex flex-wrap gap-3">
                {data.sources.map((s, idx) => (
                  <span key={idx} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white/50 font-black text-xs uppercase tracking-widest italic">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Cara Mengolah (Methods) */}
        <div className="mb-24">
          {(categoryId === 'b3' || categoryId === 'residu') && <ResponsibilityNotice />}
          <h2 className="text-4xl md:text-5xl font-black text-white mb-12 tracking-tighter uppercase italic text-center underline decoration-[#4ade80]/30 underline-offset-8">
            Metode Pengolahan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.methods.map((method, idx) => (
              <div
                key={idx}
                id={`method-${method.title.replace(/\s+/g, '-').toLowerCase()}`}
                className={`group relative bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] overflow-hidden border-2 ${theme.border} transition-all duration-700 hover:-translate-y-4 shadow-2xl ${theme.glow}`}
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-black/40 z-10 transition-opacity group-hover:bg-black/10"></div>
                  <img
                    src={method.image}
                    alt={method.title}
                    className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transform transition-all duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-6 right-6 z-20">
                    <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-2xl">
                      <PlayCircle size={24} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-4 flex flex-col min-h-[250px]">
                  <h4 className="text-2xl font-black text-white tracking-tighter uppercase italic group-hover:text-[#4ade80] transition-colors">{method.title}</h4>
                  <p className="text-white/30 text-base font-bold italic leading-relaxed uppercase tracking-tighter flex-grow">
                    {method.description}
                  </p>

                  <button
                    onClick={() => handleLearnMethod(method)}
                    className={`w-full py-5 px-6 rounded-2xl text-white font-black text-sm tracking-[0.2em] uppercase transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3 ${theme.button} shadow-xl mt-auto italic`}
                  >
                    {method.fullDetail ? 'PELAJARI METODE' : 'COMING SOON'} <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Inti (Transformation to Energy) */}
        <div className="bg-gradient-to-br from-emerald-900/60 to-transparent border-t-8 border-emerald-500 p-12 md:p-24 rounded-[4rem] flex flex-col lg:flex-row items-center gap-16 shadow-3xl">
          <div className="shrink-0 p-10 bg-white/5 rounded-[3.5rem] border-2 border-white/10 shadow-2xl animate-float">
            {data.energyTransformation.icon}
          </div>
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-emerald-400 uppercase tracking-[0.8em] italic">The Core Outcome</h3>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                {data.energyTransformation.title}
              </h2>
            </div>
            <p className="text-xl md:text-2xl text-white/40 font-bold italic uppercase tracking-tighter leading-relaxed">
              "{data.energyTransformation.description}"
            </p>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-grow p-8 bg-emerald-500 rounded-[2.5rem] shadow-[0_20px_60px_rgba(16,185,129,0.3)] group hover:scale-105 transition-transform cursor-default">
                <span className="text-[10px] font-black text-[#022c22] uppercase tracking-[0.5em] mb-2 block">Transformasi Menjadi:</span>
                <p className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter drop-shadow-md">
                  {data.energyTransformation.result}
                </p>
              </div>

              <Link to="/wte" className="flex items-center justify-center p-8 bg-white/10 hover:bg-white/20 border border-white/20 rounded-[2.5rem] transition-all group/wte">
                <div className="text-center">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] mb-2 block">Advanced Vision</span>
                  <div className="flex items-center gap-2 text-white font-black uppercase italic tracking-tighter group-hover/wte:text-yellow-400">
                    Eksplorasi WTE <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer CTA - E-book Hook Section (Mini Version) */}
        <div className="mt-24 text-center max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom duration-1000">
          {/* Quote about waste and consciousness */}
          <div className="space-y-4">
            <p className="text-[#4ade80] text-lg md:text-xl font-bold italic uppercase tracking-[0.2em] opacity-40 leading-relaxed md:px-12">
              "{categoryId === 'organic' ? "Materi yang berasal dari bumi, biarkan ia kembali memupuk kehidupan di pangkuan bumi." :
                categoryId === 'inorganic' ? "Materi padat yang tercipta dari akal manusia, biarkan ia terus berputar dalam siklus kemanfaatan tanpa akhir." :
                  categoryId === 'b3' ? "Keamanan adalah bentuk penghormatan tertinggi kita terhadap keseimbangan ekosistem yang rentan." :
                    categoryId === 'residu' ? "Apa yang tak bisa lagi dibentuk, biarkan ia mewujud menjadi tenaga yang menggerakkan kota." :
                      "Dalam luasnya kosmos, tidak ada yang benar-benar terbuang. Segala sisa adalah materi yang menanti untuk dicerahkan kembali."}"
            </p>
          </div>

          {/* Hook Sentence */}
          <div className="space-y-4">
            <h4 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase italic leading-tight drop-shadow-[0_0_20px_rgba(74,222,128,0.3)]">
              Terlalu jelimet dengan sistem pengolahan sampah?
            </h4>
            <p className="text-white/30 text-base md:text-xl font-bold italic uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
              Miliki panduan cepat Eksklusif - <span className="text-[#4ade80] font-black">Sistem Sampah Masuk Akal</span> untuk orang sibuk.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => window.location.href = "/landing3harisampah.html"}
              className="inline-flex items-center gap-4 bg-white text-[#064e3b] font-black px-10 py-5 rounded-[2rem] hover:scale-105 transition-all shadow-[0_20px_60px_rgba(74,222,128,0.1)] uppercase tracking-tighter text-xl italic group cursor-pointer"
            >
              Dapatkan Akses <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Overlays */}
      {showTransition && (
        <SponsorScreen
          onComplete={() => setShowTransition(false)}
        />
      )}

      {selectedMethod && !showTransition && (
        <MethodModal
          method={selectedMethod}
          onClose={closeMethod}
        />
      )}
    </div>
  );
};

export default TransformationDetail;