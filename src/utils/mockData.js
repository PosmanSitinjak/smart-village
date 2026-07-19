export const INITIAL_REPORTS = [
  {
    id: "REP-001",
    title: "Jalan Berlubang di Dekat Balai Desa",
    description: "Terdapat lubang jalan berdiameter sekitar 50cm di jalan utama, sangat membahayakan pengendara motor saat hujan karena tergenang air.",
    category: "Jalan Rusak",
    severity: "Tinggi",
    status: "Selesai",
    latitude: -6.354400,
    longitude: 106.789200,
    image: "", // mock base64/placeholder
    reporterName: "Budi Santoso",
    createdAt: "2026-07-10T09:30:00Z",
    adminNote: "Jalan berlubang sudah ditambal oleh petugas kebersihan dan prasarana desa menggunakan aspal hotmix pada tanggal 12 Juli 2026."
  },
  {
    id: "REP-002",
    title: "Sampah Menumpuk di Selokan RT 04",
    description: "Saluran air tersumbat karena tumpukan sampah plastik bekas rumah tangga. Berpotensi menimbulkan banjir lokal jika hujan deras.",
    category: "Sampah",
    severity: "Sedang",
    status: "Diproses",
    latitude: -6.356200,
    longitude: 106.791500,
    image: "",
    reporterName: "Siti Aminah",
    createdAt: "2026-07-13T14:15:00Z",
    adminNote: "Tim kebersihan lingkungan RT 04 sudah dikerahkan dan proses pengerukan sampah sedang berlangsung hari ini."
  },
  {
    id: "REP-003",
    title: "Lampu Jalan Padam dekat Masjid Al-Ikhlas",
    description: "Lampu penerangan jalan umum mati total sejak 3 hari yang lalu. Area sekitar masjid menjadi sangat gelap pada malam hari.",
    category: "Penerangan Jalan",
    severity: "Tinggi",
    status: "Menunggu",
    latitude: -6.352100,
    longitude: 106.787500,
    image: "",
    reporterName: "Joko Widodo (Warga)",
    createdAt: "2026-07-14T20:00:00Z",
    adminNote: ""
  },
  {
    id: "REP-004",
    title: "Kebocoran Pipa Air Bersih",
    description: "Ada kebocoran pipa air bersih PDAM desa yang menggenangi area trotoar jalan utama RT 02.",
    category: "Fasilitas Umum",
    severity: "Rendah",
    status: "Menunggu",
    latitude: -6.353200,
    longitude: 106.790500,
    image: "",
    reporterName: "Rian Hidayat",
    createdAt: "2026-07-14T22:30:00Z",
    adminNote: ""
  }
];

export const EDUCATION_ARTICLES = [
  {
    id: "edu-1",
    title: "Panduan Memilah Sampah 3R (Reduce, Reuse, Recycle)",
    category: "Sampah",
    summary: "Mari pelajari cara memilah sampah organik, anorganik, dan B3 untuk menjaga kebersihan desa kita.",
    content: "Memilah sampah dari rumah adalah langkah awal yang paling penting untuk menyelamatkan kelestarian bumi. Kebiasaan kecil ini, jika dilakukan bersama-sama oleh seluruh warga SmartVillage, dapat mengurangi timbulan sampah di TPA hingga 70% dan meningkatkan kebersihan lingkungan secara signifikan.\n\nLangkah pertama dalam pengelolaan sampah adalah mengelompokkannya ke dalam tiga kategori utama:\n\n1. Sampah Organik (Sampah Hijau): Merupakan sisa-sisa makanan, kulit buah, sayuran, sisa masakan dapur, dan daun kering. Kategori sampah ini sangat mudah membusuk secara alami. Warga dihimbau untuk menampung sampah ini di wadah terpisah agar bisa dialihfungsikan menjadi kompos tanaman yang bernilai guna tinggi bagi pertanian warga desa.\n\n2. Sampah Anorganik (Sampah Biru): Terdiri dari botol plastik, kantong kresek, kardus bekas, kaleng logam, dan botol kaca. Sampah ini tidak dapat membusuk secara alami tetapi memiliki nilai ekonomis karena dapat didaur ulang. Warga dapat menyetorkan sampah ini ke Bank Sampah Desa SmartVillage untuk ditukarkan dengan uang atau dikonversi menjadi Eco-Points.\n\n3. Sampah B3 (Bahan Berbahaya dan Beracun): Meliputi baterai bekas, lampu LED rusak, kabel listrik, wadah obat-obatan, dan kaleng semprotan aerosol. Sampah jenis ini mengandung logam berat beracun seperti merkuri dan timbal yang dapat merembes dan mencemari air tanah desa. Warga WAJIB mengumpulkan sampah B3 ini secara terpisah dan membuangnya ke wadah khusus di Balai Desa agar dikelola oleh pihak berwenang secara aman.",
    readTime: "3 menit",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=60",
    youtubeId: "KHdCNbEp3sM",
    sourceLabel: "Edukasi Pemilahan Sampah DLH",
    sourceUrl: "https://www.youtube.com/watch?v=KHdCNbEp3sM",
    quizQuestions: [
      {
        question: "Apakah kepanjangan dari prinsip pengelolaan sampah 3R?",
        options: ["Reduce, Reuse, Recycle", "Relief, Recover, Reform", "Reduce, Remove, Repair", "Refuse, Refund, Replace"],
        answer: 0,
        explanation: "Prinsip 3R terdiri atas Reduce (mengurangi sampah), Reuse (menggunakan kembali), dan Recycle (mendaur ulang)."
      },
      {
        question: "Manakah di bawah ini yang tergolong sebagai Sampah Organik?",
        options: ["Botol kaca", "Kabel listrik", "Sisa makanan dan daun kering", "Baterai bekas"],
        answer: 2,
        explanation: "Sisa makanan, kulit buah, dan daun kering mudah terurai secara alami sehingga tergolong sampah organik."
      },
      {
        question: "Ke manakah warga sebaiknya menyetorkan sampah anorganik bersih untuk didaur ulang?",
        options: ["Ke selokan terdekat", "Ke Bank Sampah Desa SmartVillage", "Membakarnya di pekarangan", "Membuangnya ke kebun tetangga"],
        answer: 1,
        explanation: "Bank Sampah memfasilitasi penukaran sampah anorganik yang bernilai ekonomis untuk dikonversi menjadi Eco-Points atau uang."
      },
      {
        question: "Di manakah lokasi khusus pembuangan sampah B3 (seperti lampu dan baterai) di desa?",
        options: ["Di pinggir parit", "Di wadah khusus di Balai Desa", "Di bawah pohon rindang", "Di tempat pembuangan sampah RT umum"],
        answer: 1,
        explanation: "Sampah B3 harus dikumpulkan terpisah di tempat aman (seperti Balai Desa) agar tidak meracuni air tanah desa."
      },
      {
        question: "Mengapa baterai bekas tidak boleh dicampur dengan sampah daun kering?",
        options: ["Karena baterai dapat tumbuh menjadi tanaman", "Karena mengandung logam berat beracun yang membahayakan tanah dan air jika merembes", "Karena baterai akan membusuk terlalu lambat", "Karena daun kering bisa meledak"],
        answer: 1,
        explanation: "Baterai mengandung merkuri dan timbal (B3) yang dapat bocor dan mencemari sumber air bersih warga desa jika dicampur sembarangan."
      }
    ]
  },
  {
    id: "edu-2",
    title: "Mengapa Lampu Jalan LED Lebih Hemat Energi?",
    category: "Energi",
    summary: "Ketahui kelebihan lampu hemat energi untuk jalan desa yang ramah lingkungan.",
    content: "Penerangan Jalan Umum (PJU) merupakan salah satu fasilitas vital di Desa SmartVillage untuk memastikan keamanan warga saat berkendara atau berjalan kaki di malam hari. Namun, penggunaan lampu pijar konvensional seringkali memakan daya listrik yang sangat tinggi dan memerlukan perawatan berkala karena cepat putus.\n\nPemerintah Desa SmartVillage kini berkomitmen untuk mengganti seluruh lampu penerangan jalan umum dengan teknologi Light Emitting Diode (LED). Mengapa lampu jalan LED jauh lebih baik?\n\nPertama, efisiensi energi yang luar biasa. Lampu jalan LED mengonsumsi listrik hingga 60% lebih sedikit dibandingkan dengan lampu natrium bertekanan tinggi atau lampu pijar biasa. Hal ini secara langsung mengurangi beban tagihan listrik desa, sehingga anggaran desa dapat dialokasikan untuk pembangunan prasarana penting lainnya.\n\nKedua, masa pakai yang sangat panjang. Lampu LED berkualitas tinggi memiliki daya tahan operasional hingga 50.000 jam atau sekitar 10 hingga 12 tahun penggunaan konvensional. Ini berarti petugas prasarana desa tidak perlu terlalu sering melakukan penggantian lampu tiang yang tinggi dan berisiko.\n\nKetiga, pencahayaan terarah yang ramah lingkungan. Lampu LED memancarkan cahaya ke arah bawah secara fokus, sehingga meminimalkan hamburan cahaya liar ke angkasa (polusi cahaya). Hal ini sangat penting untuk mempertahankan ekosistem serangga dan burung malam hari di pedesaan, sekaligus mengurangi silau yang membahayakan pandangan pengendara motor di jalan utama desa.",
    readTime: "3 menit",
    image: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=600&auto=format&fit=crop&q=60",
    youtubeId: "6buBsNfhk10",
    sourceLabel: "Transisi Energi Surya & LED - Kok Bisa?",
    sourceUrl: "https://www.youtube.com/watch?v=6buBsNfhk10",
    quizQuestions: [
      {
        question: "Berapa persentase penghematan daya listrik lampu LED dibanding lampu jalan biasa?",
        options: ["Sekitar 10%", "Tidak menghemat sama sekali", "Hingga 60%", "Lebih boros 30%"],
        answer: 2,
        explanation: "Lampu LED mengonsumsi daya listrik hingga 60% lebih sedikit dibanding lampu pijar konvensional."
      },
      {
        question: "Berapa perkiraan daya tahan operasional lampu jalan LED berkualitas tinggi?",
        options: ["Hanya 1.000 jam", "Hingga 50.000 jam (10-12 tahun)", "Maksimal 6 bulan saja", "Sekitar 5 tahun jika menyala siang malam"],
        answer: 1,
        explanation: "Lampu LED awet dan tahan lama, bertahan hingga 50.000 jam penggunaan wajar."
      },
      {
        question: "Mengapa lampu jalan LED dikatakan ramah lingkungan dalam meminimalkan polusi cahaya?",
        options: ["Karena lampunya mati saat malam hari", "Karena memancarkan cahaya terarah ke bawah secara fokus", "Karena lampunya berwarna hijau daun", "Karena memancarkan cahaya ke langit malam"],
        answer: 1,
        explanation: "LED memancarkan cahaya langsung ke bawah, menghindari hamburan cahaya liar ke angkasa yang mengganggu burung/serangga malam."
      },
      {
        question: "Apa keuntungan finansial yang didapatkan desa dari penggantian lampu jalan LED?",
        options: ["Desa mendapatkan subsidi minyak tanah", "Beban tagihan listrik desa berkurang sehingga kas desa bisa dialihkan untuk fasilitas lain", "Warga desa dibayar oleh perusahaan lampu", "Warga mendapatkan poin belanja gratis"],
        answer: 1,
        explanation: "Efisiensi LED menekan biaya bulanan PJU desa, menghemat anggaran daerah untuk operasional prasarana lain."
      },
      {
        question: "Jenis lampu lama apa yang digantikan oleh LED di pedesaan?",
        options: ["Lampu gas asetilen", "Lampu pijar atau lampu natrium konvensional berdaya tinggi", "Obor bambu tradisional", "Lampu neon panjang rumahan"],
        answer: 1,
        explanation: "Lampu jalan lama (natrium/pijar) berdaya tinggi diganti dengan LED yang jauh lebih efisien daya."
      }
    ]
  },
  {
    id: "edu-3",
    title: "Menjaga Saluran Air dari Penyumbatan Banjir",
    category: "Banjir",
    summary: "Tips gotong royong warga dalam memelihara kelancaran aliran parit desa.",
    content: "Selokan dan parit yang bersih di sekitar pekarangan rumah warga adalah jaminan utama bahwa desa kita terbebas dari ancaman banjir genangan air dan sarang nyamuk penular penyakit demam berdarah dengue (DBD).\n\nPenyumbatan parit desa paling sering disebabkan oleh penumpukan sedimen tanah dan sampah plastik rumah tangga. Untuk mengatasinya, mari kita budayakan gotong royong dan tindakan preventif mandiri melalui beberapa tips berikut:\n\nPertama, stop membuang sampah sekecil apa pun ke selokan. Kebiasaan membuang bungkus permen plastik, puntung rokok, atau sisa sedotan plastik ke saluran air lambat laun akan menumpuk di area penyaringan parit dan menyumbat total aliran air. Pastikan sampah tersebut dibuang ke tempat sampah kering yang semestinya.\n\nKedua, cegah penimbunan sedimentasi tanah dan daun. Daun-daun kering yang berguguran di halaman rumah sebaiknya disapu dan dikumpulkan ke dalam lubang biopori untuk dijadikan kompos, bukan disapu masuk ke dalam selokan yang dapat menyisakan endapan tanah lumpur tebal di dasar parit.\n\nKetiga, adakan kegiatan gotong royong pembersihan parit berkala. Setiap bulan, terutama menjelang musim penghujan, warga dihimbau untuk bergotong royong mengeruk lumpur endapan di selokan depan rumah masing-masing agar kedalaman parit tetap optimal. Saluran air yang mengalir lancar adalah kunci kelestarian dan kesehatan warga SmartVillage.",
    readTime: "4 menit",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&auto=format&fit=crop&q=60",
    youtubeId: "dGMtqjYlAbg",
    sourceLabel: "Krisis Sampah Indonesia & Banjir - Kok Bisa?",
    sourceUrl: "https://www.youtube.com/watch?v=dGMtqjYlAbg",
    quizQuestions: [
      {
        question: "Apa penyebab utama penyumbatan pada saluran parit desa?",
        options: ["Pohon tumbang", "Penumpukan sedimen tanah/lumpur dan sampah plastik rumah tangga", "Aliran air yang terlalu jernih", "Ikan air tawar bertelur"],
        answer: 1,
        explanation: "Sedimen lumpur yang tebal dan sampah plastik yang tersangkut di penyaring parit adalah biang kerok utama banjir genangan."
      },
      {
        question: "Ke mana daun-daun kering pekarangan rumah sebaiknya dikumpulkan?",
        options: ["Sapu dan masukkan ke parit", "Kumpulkan ke dalam lubang biopori untuk dijadikan kompos", "Biarkan saja menumpuk di jalan umum", "Dibuang ke selokan tetangga"],
        answer: 1,
        explanation: "Memasukkan daun kering ke biopori mengolahnya menjadi humus tanah, daripada dibuang ke parit yang menyumbat air."
      },
      {
        question: "Dampak kesehatan apa yang timbul jika saluran parit depan rumah tergenang air tersumbat?",
        options: ["Ikan berkembang biak dengan cepat", "Menjadi tempat perkembangbiakan jentik nyamuk demam berdarah (DBD)", "Air parit bisa langsung diminum", "Mengurangi bau busuk parit"],
        answer: 1,
        explanation: "Genangan air tenang di selokan tersumbat adalah habitat sempurna bagi nyamuk Aedes aegypti penular DBD."
      },
      {
        question: "Kapan warga desa sangat dianjurkan bergotong royong mengeruk lumpur selokan?",
        options: ["Saat kemarau panjang melanda", "Setiap bulan secara berkala, terutama menjelang musim penghujan", "Hanya saat ada banjir besar datang", "Setelah musim hujan berakhir"],
        answer: 1,
        explanation: "Pembersihan preventif sebelum musim hujan tiba memastikan saluran siap menampung air hujan berkapasitas besar."
      },
      {
        question: "Tindakan preventif terkecil apa yang bisa dilakukan secara individu untuk menjaga kelancaran parit?",
        options: ["Mengecat parit dengan warna cerah", "Tidak membuang sampah sekecil apa pun (seperti puntung rokok/bungkus permen) ke selokan", "Menutup selokan rapat dengan cor beton tanpa celah", "Menanam pohon besar di dalam selokan"],
        answer: 1,
        explanation: "Menghentikan kebiasaan membuang sampah kecil ke selokan mencegah penumpukan sampah plastis di saringan air."
      }
    ]
  },
  {
    id: "edu-4",
    title: "Membuat Lubang Resapan Biopori di Pekarangan Rumah",
    category: "Fasilitas Umum",
    summary: "Panduan praktis pembuatan biopori untuk menyerap genangan air hujan dan membuat kompos alami.",
    content: "Lubang Resapan Biopori (LRB) adalah teknologi ramah lingkungan yang sangat sederhana namun memiliki dampak luar biasa bagi penyerapan air tanah desa.LRB berupa lubang silindris yang dibuat vertikal ke dalam tanah sebagai metode resapan air untuk mengatasi genangan air sekaligus mengolah sampah organik rumah tangga menjadi pupuk.\n\nLangkah-langkah pembuatan lubang biopori yang benar di pekarangan Anda:\n\n1. Penentuan Lokasi: Pilih area pekarangan yang sering digenangi air hujan, seperti di dekat saluran pembuangan air terbuka atau di bawah pohon peneduh pekarangan rumah.\n\n2. Melubangi Tanah: Basahi tanah terlebih dahulu agar lunak, lalu gunakan bor tanah manual untuk membuat lubang vertikal berdiameter 10 cm dengan kedalaman sekitar 80 cm hingga 100 cm.\n\n3. Memasang Pipa Casing: Masukkan pipa PVC berlubang yang sudah disiapkan ke dalam lubang agar dinding tanah tidak longsor saat terguyur hujan deras, lalu semen/rapikan bagian bibir pipa agar kuat.\n\n4. Memasukkan Sampah Organik: Isi lubang biopori dengan sampah organik dapur Anda (sisa buah/sayur). Sampah ini akan memancing cacing tanah membuat liang resapan air (biopori) alami di sekitarnya.",
    readTime: "5 menit",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=60",
    youtubeId: "7-_szTU15to",
    sourceLabel: "Langkah Membuat Biopori DLH",
    sourceUrl: "https://www.youtube.com/watch?v=7-_szTU15to",
    quizQuestions: [
      {
        question: "Berapa kedalaman vertikal yang ideal untuk membuat lubang biopori?",
        options: ["Cukup 10 - 20 cm", "Sekitar 80 cm hingga 100 cm (1 meter)", "Harus sedalam 5 meter", "Minimal 2 meter"],
        answer: 1,
        explanation: "Kedalaman 80-100 cm optimal untuk memicu resapan tanpa menembus akuifer air tanah utama secara berlebihan."
      },
      {
        question: "Berapa diameter bor tanah atau pipa casing biopori yang biasa digunakan?",
        options: ["Sekitar 10 cm", "Hampir 50 cm", "Cukup 2 cm saja", "Bebas sesuai selera"],
        answer: 0,
        explanation: "Diameter 10 cm adalah ukuran ideal untuk lubang biopori pekarangan rumah tangga."
      },
      {
        question: "Apa tujuan utama memasukkan sampah organik sisa dapur ke dalam lubang biopori?",
        options: ["Agar pekarangan berbau busuk", "Memancing cacing/fauna tanah membuat liang pori mikro penyerap air alami", "Menimbun sampah agar tidak terlihat", "Membuat lubang tersumbat"],
        answer: 1,
        explanation: "Sampah organik memancing cacing tanah aktif bergerak di sekitar dinding lubang, menciptakan liang-liang halus (biopori) yang menyerap air."
      },
      {
        question: "Area pekarangan seperti apa yang paling tepat dipasang lubang biopori?",
        options: ["Di dalam teras rumah yang berubin keramik", "Di area tanah terbuka yang sering tergenang air hujan", "Di bawah lantai dapur dalam rumah", "Tepat di tengah jalan aspal utama"],
        answer: 1,
        explanation: "Menempatkan biopori di tanah terbuka rawan genangan memaksimalkan laju peresapan air hujan ke tanah."
      },
      {
        question: "Hasil akhir apa yang diperoleh dari pembusukan sampah organik di dalam lubang biopori setelah beberapa bulan?",
        options: ["Plastik daur ulang", "Pupuk kompos alami penyubur tanaman", "Gas elpiji alam", "Batu bara muda"],
        answer: 1,
        explanation: "Sampah organik yang membusuk diurai cacing tanah menjadi pupuk kompos humus bernilai guna tinggi bagi kebun."
      }
    ]
  },
  {
    id: "edu-5",
    title: "Ketahanan Pangan Desa Melalui Kebun Hidroponik Pekarangan",
    category: "Fasilitas Umum",
    summary: "Manfaatkan lahan pekarangan rumah yang sempit untuk menanam sayur sehat bebas pestisida.",
    content: "Hidroponik adalah salah satu solusi inovatif untuk melakukan cocok tanam di pemukiman padat desa tanpa memerlukan area lahan tanah yang luas. Sistem hidroponik memanfaatkan air bernutrisi khusus sebagai pengganti tanah untuk mensuplai makanan bagi tanaman sayuran secara efisien.\n\nKelebihan utama menanam dengan hidroponik di lingkungan desa:\n\n1. Hemat Lahan & Bersih: Rak hidroponik dapat disusun secara vertikal di teras rumah, pagar, atau dinding pekarangan luar yang sempit sehingga pekarangan terlihat hijau dan asri.\n\n2. Lebih Cepat Panen: Nutrisi mineral langsung disalurkan ke akar tanaman secara terlarut dalam air sehingga sayuran (seperti kangkung, pakcoy, selada) tumbuh 30% lebih cepat dibanding media tanah.\n\n3. Kualitas Sayur Premium: Bebas dari hama tanah dan ulat, sehingga warga tidak perlu menggunakan pestisida kimia berbahaya yang mencemari lingkungan. Hasil sayur menjadi jauh lebih sehat dikonsumsi sehari-hari.\n\n4. Nilai Ekonomi Mandiri: Hasil panen melimpah dapat dikonsumsi keluarga untuk menghemat pengeluaran dapur, atau disetor ke koperasi desa untuk dipasarkan keluar desa guna meningkatkan kas ekonomi keluarga.",
    readTime: "5 menit",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&auto=format&fit=crop&q=60",
    youtubeId: "004jdaG12y4",
    sourceLabel: "Belajar Hidroponik Pemula Sederhana",
    sourceUrl: "https://www.youtube.com/watch?v=004jdaG12y4",
    quizQuestions: [
      {
        question: "Apakah pengganti media tanah yang digunakan dalam sistem pertanian hidroponik?",
        options: ["Pasir pantai asin", "Air yang dilarutkan nutrisi mineral khusus", "Minyak goreng bekas", "Potongan styrofoam kering"],
        answer: 1,
        explanation: "Hidroponik menumbuhkan tanaman menggunakan media air kaya unsur hara mineral terlarut."
      },
      {
        question: "Apa nama racikan nutrisi mineral yang larut dalam air hidroponik?",
        options: ["Pestisida Organik", "Nutrisi AB Mix", "Kompos Basah", "Pupuk Urea Granul"],
        answer: 1,
        explanation: "AB Mix adalah formulasi garam mineral makro/mikro khusus untuk menyuplai nutrisi hidroponik."
      },
      {
        question: "Manakah media penyangga akar berpori pengganti tanah yang populer dalam hidroponik?",
        options: ["Batu kali abu-abu", "Rockwool (serat batu vulkanis) atau sekam bakar", "Serutan kayu pinus", "Tisu dapur bekas"],
        answer: 1,
        explanation: "Rockwool dan sekam bakar menahan air bernutrisi dengan baik sekaligus memberi ruang udara bagi akar tanaman."
      },
      {
        question: "Mengapa sayuran hidroponik (seperti selada/pakcoy) tumbuh lebih cepat dibanding ditanam di tanah?",
        options: ["Karena disinari lampu UV 24 jam", "Karena akar menyerap nutrisi terlarut dalam air secara langsung dan efisien", "Karena tanaman tidak bernapas", "Karena menggunakan pestisida kimia tinggi"],
        answer: 1,
        explanation: "Unsur mineral larut air langsung tersedia bagi akar, meniadakan energi ekstra tanaman mencari makanan di sela butir tanah."
      },
      {
        question: "Mengapa wadah penampung air nutrisi pada wick system (hidroponik sumbu) harus gelap/tertutup rapat?",
        options: ["Agar tanaman tidur dengan tenang", "Mencegah pertumbuhan alga/lumut hijau yang memakan nutrisi tanaman dan mencemari sumbu", "Agar suhu air tetap membeku", "Menghindari pencurian air warga"],
        answer: 1,
        explanation: "Sinar matahari memicu lumut berkembang biak di wadah nutrisi, yang berebut oksigen/nutrisi dengan akar sayuran."
      }
    ]
  }
];

export const QUIZ_QUESTIONS = [
  {
    question: "Manakah jenis sampah di bawah ini yang tergolong sebagai sampah Organik?",
    options: [
      "Plastik bungkus makanan",
      "Sisa sayuran and daun kering",
      "Baterai bekas",
      "Kabel listrik"
    ],
    answer: 1,
    explanation: "Sampah organik berasal dari makhluk hidup yang mudah membusuk, seperti sisa makanan, kulit buah, dan daun kering."
  },
  {
    question: "Apa tujuan utama dari program Bank Sampah di desa?",
    options: [
      "Tempat pembuangan sampah akhir (TPA)",
      "Membakar seluruh sampah warga",
      "Mengumpulkan, memilah, dan mendaur ulang sampah bernilai ekonomis",
      "Menyimpan uang tunai warga"
    ],
    answer: 2,
    explanation: "Bank Sampah memfasilitasi warga untuk menyetorkan sampah anorganik yang sudah dipilah untuk didaur ulang, sekaligus memberikan keuntungan ekonomi."
  },
  {
    question: "Tindakan apa yang paling tepat jika Anda menemukan lampu jalan mati pada malam hari?",
    options: [
      "Mengabaikannya karena bukan urusan pribadi",
      "Mencoba memanjat tiang lampu untuk memperbaikinya sendiri",
      "Melaporkannya melalui aplikasi SmartVillage dengan foto dan koordinat presisi",
      "Mengeluh di media sosial tanpa melapor ke perangkat desa"
    ],
    answer: 2,
    explanation: "Melaporkan secara terstruktur melalui SmartVillage memudahkan petugas untuk langsung mengetahui lokasi presisi dan melakukan perbaikan cepat."
  },
  {
    question: "Berapa persen penghematan energi listrik yang ditawarkan oleh lampu jalan LED dibanding lampu biasa?",
    options: [
      "Sekitar 10% - 20%",
      "Hingga 60%",
      "Tidak ada perbedaan",
      "Lebih boros"
    ],
    answer: 1,
    explanation: "Teknologi LED modern sangat efisien dan mampu mengurangi konsumsi listrik penerangan jalan umum hingga 60%."
  },
  {
    question: "Apa dampak buruk jika warga membuang sampah baterai bekas sembarangan di pekarangan rumah?",
    options: [
      "Menyebabkan pekarangan menjadi indah",
      "Kandungan logam berat beracun dapat merembes dan mencemari air tanah desa",
      "Baterai akan tumbuh menjadi pohon energi",
      "Tidak ada dampak sama sekali"
    ],
    answer: 1,
    explanation: "Baterai mengandung bahan berbahaya beracun (B3) seperti merkuri dan timbal yang dapat mencemari air tanah yang dikonsumsi warga."
  },
  {
    question: "Bagaimanakah teknologi Lubang Resapan Biopori membantu menyerap air hujan?",
    options: [
      "Dengan menguapkan air kembali ke langit",
      "Membuat rongga atau liang di dalam tanah akibat aktivitas organisme tanah yang terpancing sampah organik",
      "Mengubah air menjadi batuan keras",
      "Menampung air di wadah plastik bawah tanah"
    ],
    answer: 1,
    explanation: "Sampah organik di dalam biopori akan memancing aktivitas fauna tanah (cacing), yang membuat liang-liang pori penyerap air ke dalam tanah."
  },
  {
    question: "Manakah sayuran di bawah ini yang sangat umum ditanam menggunakan sistem hidroponik pekarangan?",
    options: [
      "Pohon kelapa dan mangga",
      "Selada, kangkung, dan pakcoy",
      "Singkong dan ubi jalar",
      "Jagung manis dan padi"
    ],
    answer: 1,
    explanation: "Sayuran daun seperti selada, kangkung, pakcoy, dan sawi sangat cocok ditanam dengan sistem hidroponik pekarangan yang praktis."
  },
  {
    question: "Mengapa pembakaran sampah secara terbuka di area pemukiman warga sangat dilarang?",
    options: [
      "Karena menyebabkan udara menjadi dingin",
      "Karena menghasilkan asap beracun (dioksin) yang memicu kanker dan infeksi pernapasan (ISPA)",
      "Karena memakan waktu terlalu lama",
      "Karena menghasilkan pupuk nitrogen alami"
    ],
    answer: 1,
    explanation: "Pembakaran sampah melepaskan zat kimia berbahaya seperti dioksin dan karbon monoksida yang merusak kesehatan paru-paru warga."
  },
  {
    question: "Apa singkatan dari prinsip pengelolaan sampah 3R?",
    options: [
      "Relief, Recover, Reform",
      "Reduce, Reuse, Recycle",
      "Reduce, Remove, Repair",
      "Refuse, Refund, Replace"
    ],
    answer: 1,
    explanation: "Prinsip 3R adalah Reduce (mengurangi sampah), Reuse (menggunakan kembali), dan Recycle (mendaur ulang sampah)."
  },
  {
    question: "Manakah contoh tindakan 'Reduce' (mengurangi timbulan sampah) yang paling tepat?",
    options: [
      "Membawa kantong belanja kain sendiri saat berbelanja ke pasar desa",
      "Membakar sampah plastik di halaman belakang",
      "Membuang sisa makanan langsung ke selokan",
      "Membeli air mineral kemasan plastik sekali pakai setiap hari"
    ],
    answer: 0,
    explanation: "Membawa tas belanja sendiri mengurangi konsumsi kantong plastik sekali pakai yang sulit terurai secara alami."
  },
  {
    question: "Apa bahaya utama membuang sampah sisa makanan rumah tangga ke dalam parit atau selokan desa?",
    options: [
      "Mengurangi populasi nyamuk",
      "Menyebabkan penyumbatan saluran air, bau tidak sedap, dan perkembangbiakan jentik nyamuk demam berdarah",
      "Membuat air selokan menjadi jernih dan harum",
      "Membantu ikan air tawar bertelur"
    ],
    answer: 1,
    explanation: "Sampah organik yang membusuk di parit menyumbat aliran air, memicu banjir genangan, dan menjadi sarang nyamuk penular penyakit."
  },
  {
    question: "Berapa lama rata-rata waktu yang dibutuhkan oleh kantong plastik sekali pakai untuk hancur/terurai secara alami di tanah?",
    options: [
      "Hanya 1 sampai 2 hari",
      "Sekitar 2 sampai 3 minggu",
      "Ratusan hingga 500 tahun lamanya",
      "Plastik langsung terurai dalam 1 jam"
    ],
    answer: 2,
    explanation: "Plastik terbuat dari polimer sintetis yang sangat kuat dan membutuhkan waktu ratusan tahun untuk bisa terurai di dalam tanah."
  },
  {
    question: "Apakah kegunaan utama dari hasil kompos yang berasal dari sampah organik biopori?",
    options: [
      "Sebagai bahan bakar kendaraan bermotor",
      "Sebagai pupuk alami untuk menyuburkan tanaman hias dan kebun sayur warga",
      "Sebagai bahan pengawet makanan",
      "Sebagai pengganti aspal jalan desa"
    ],
    answer: 1,
    explanation: "Sampah organik yang membusuk di dalam biopori akan berubah menjadi humus kaya nutrisi yang sangat baik sebagai pupuk kompos tanaman."
  },
  {
    question: "Manakah contoh sampah B3 (Bahan Berbahaya dan Beracun) rumah tangga yang wajib dipisahkan?",
    options: [
      "Daun pisang dan sisa sayur sop",
      "Botol kaca sirup dan kardus mi instan",
      "Lampu neon rusak, baterai bekas, dan botol pembunuh serangga",
      "Kertas koran dan sisa potongan kayu"
    ],
    answer: 2,
    explanation: "Neon, baterai, dan pestisida rumah tangga tergolong B3 karena mengandung zat beracun yang dapat membahayakan kesehatan dan tanah jika tercampur."
  },
  {
    question: "Mengapa sistem pertanian hidroponik pekarangan dikatakan lebih hemat air dibandingkan pertanian konvensional?",
    options: [
      "Karena tanaman hidroponik tidak membutuhkan air untuk hidup",
      "Karena air nutrisi disirkulasikan kembali secara tertutup dalam wadah rak tanaman tanpa merembes hilang ke tanah",
      "Karena tanaman hidroponik disiram hanya 1 tahun sekali",
      "Karena menggunakan air hujan beracun"
    ],
    answer: 1,
    explanation: "Dalam hidroponik, air berada dalam wadah tertutup yang dialirkan berulang kali, sehingga meminimalisir kehilangan air akibat penguapan tanah."
  },
  {
    question: "Apa dampak jangka panjang dari polusi cahaya akibat penggunaan lampu jalan yang tidak terarah ke bawah?",
    options: [
      "Mengurangi tagihan listrik secara drastis",
      "Mengganggu siklus hidup burung malam, serangga penyerbuk, dan mengacaukan navigasi ekosistem alami",
      "Membuat langit malam menjadi lebih indah dan cerah",
      "Membantu tanaman berfotosintesis lebih cepat"
    ],
    answer: 1,
    explanation: "Hamburan cahaya liar ke angkasa mengganggu perilaku fauna malam (nokturnal) yang bergantung pada kegelapan malam untuk navigasi dan kawin."
  },
  {
    question: "Jenis sampah manakah yang bernilai ekonomis tinggi jika disetorkan ke Bank Sampah Desa?",
    options: [
      "Daun basah, nasi basi, dan tulang ayam",
      "Baterai bocor dan obat kadaluarsa",
      "Botol plastik PET, gelas kaca bening, kertas koran, dan kardus tebal",
      "Tisu bekas pakai"
    ],
    answer: 2,
    explanation: "Bahan-bahan anorganik bersih seperti botol plastik (PET), kardus, kertas, dan logam sangat dicari oleh industri daur ulang sehingga bernilai jual."
  },
  {
    question: "Bagaimanakah kedalaman ideal pembuatan lubang biopori di pekarangan rumah?",
    options: [
      "Cukup 5 sampai 10 cm saja",
      "Mencapai 80 cm hingga 100 cm (1 meter)",
      "Harus sedalam 10 meter hingga menembus air tanah utama",
      "Bebas sesuai selera tanpa batasan"
    ],
    answer: 1,
    explanation: "Kedalaman 80-100 cm direkomendasikan agar lubang berada di bawah permukaan tanah aktif dan memiliki volume yang cukup untuk menampung air serta sampah."
  },
  {
    question: "Apakah peran cacing tanah dalam ekosistem lubang resapan biopori?",
    options: [
      "Memakan pipa PVC hingga hancur",
      "Membuat terowongan-terowongan kecil (biopori) di dalam tanah saat mencari makan organik, meningkatkan laju resapan air",
      "Menyebarkan penyakit bakteri berbahaya bagi warga sekitar",
      "Mengurangi kadar air di pekarangan"
    ],
    answer: 1,
    explanation: "Cacing memakan sampah organik di LRB dan membuat liang-liang pori mikro (biopori) di tanah yang mempercepat air hujan meresap ke dalam tanah."
  },
  {
    question: "Tindakan pelestarian lingkungan manakah yang paling mudah dan berdampak luas bagi warga desa?",
    options: [
      "Menebang pohon peneduh jalan desa agar tidak mengotori jalan dengan daun",
      "Membeli mobil baru setiap tahun",
      "Menerapkan pemilahan sampah organik/anorganik dari rumah dan aktif melaporkan kerusakan fasilitas lingkungan via SmartVillage",
      "Membakar daun kering di pekarangan setiap sore"
    ],
    answer: 2,
    explanation: "Memilah sampah dari sumbernya dan berkontribusi melapor masalah lingkungan secara gotong-royong digital adalah kunci SmartVillage yang sukses."
  },
  {
    question: "Apa keunggulan menyetorkan sampah plastik ke Bank Sampah dibanding membuangnya ke TPA?",
    options: [
      "Mengurangi volume sampah di TPA desa dan mendaur ulang menjadi produk baru bernilai jual",
      "Membuat sampah cepat membusuk",
      "Mendapatkan kupon bahan bakar fosil",
      "Mengurangi cadangan air bersih desa"
    ],
    answer: 0,
    explanation: "Menyetorkan sampah plastik ke Bank Sampah mengurangi beban TPA dan mendukung ekonomi sirkular melalui proses daur ulang industri."
  },
  {
    question: "Apa warna wadah sampah standar yang biasa digunakan khusus untuk menampung sampah organik kering/basah?",
    options: [
      "Wadah berwarna Merah",
      "Wadah berwarna Hijau",
      "Wadah berwarna Kuning",
      "Wadah berwarna Biru"
    ],
    answer: 1,
    explanation: "Tempat sampah berwarna Hijau secara universal digunakan khusus untuk menampung sampah organik yang mudah terurai seperti sisa makanan dan daun."
  },
  {
    question: "Mengapa panel surya sangat cocok dikombinasikan dengan lampu jalan LED di pedesaan?",
    options: [
      "Keperluan daya listrik lampu LED sangat kecil, sehingga baterai solar panel bisa menyala stabil semalaman suntuk",
      "Lampu LED hanya menyala siang hari jika terkena matahari",
      "Lampu LED memancarkan panas yang diserap panel surya",
      "Karena tidak memakai kabel sama sekali"
    ],
    answer: 0,
    explanation: "Konsumsi daya LED yang rendah memastikan energi listrik yang disimpan di dalam baterai panel surya selama siang hari cukup untuk menerangi jalan semalaman."
  },
  {
    question: "Selain mencegah genangan banjir, apa manfaat utama biopori bagi ketersediaan air bersih di pedesaan?",
    options: [
      "Menyaring limbah industri secara kimiawi",
      "Meningkatkan cadangan air tanah (akuifer) melalui penyerapan air hujan yang efisien",
      "Menguapkan genangan air secara instan ke udara",
      "Menampung air hujan di dalam pipa plastik tertutup"
    ],
    answer: 1,
    explanation: "Dengan meresapkan air hujan langsung ke dalam tanah, lubang biopori membantu mengisi kembali cadangan air tanah desa (water table) untuk sumur warga."
  },
  {
    question: "Apa fungsi penting dari larutan nutrisi AB Mix dalam sistem cocok tanam hidroponik?",
    options: [
      "Menyediakan seluruh unsur hara makro dan mikro yang dibutuhkan tanaman sebagai pengganti nutrisi tanah",
      "Membunuh seluruh bakteri baik di dalam air",
      "Membuat air nutrisi menjadi manis rasanya",
      "Mencegah tanaman terkena sinar matahari"
    ],
    answer: 0,
    explanation: "Tanaman hidroponik tidak ditanam di tanah, sehingga nutrisi AB Mix khusus diformulasikan untuk memasok seluruh kebutuhan makanan mineral tanaman larut dalam air."
  },
  {
    question: "Manakah bahan di bawah ini yang merupakan media tanam pengganti tanah yang sangat populer dan berpori tinggi dalam sistem hidroponik?",
    options: [
      "Tanah liat merah dan pupuk kandang basah",
      "Rockwool (serat batu vulkanis) atau sekam padi bakar",
      "Plastik kresek bekas yang digunting halus",
      "Potongan kertas koran basah"
    ],
    answer: 1,
    explanation: "Rockwool dan sekam bakar sangat disukai dalam hidroponik karena steril, mampu menahan air dengan baik, dan memberikan ruang udara yang optimal bagi akar tanaman."
  },
  {
    question: "Seberapa sering sebaiknya gotong royong pembersihan sedimentasi lumpur di saluran parit desa dilakukan?",
    options: [
      "Hanya jika banjir besar sudah menenggelamkan rumah warga",
      "Secara berkala, minimal satu bulan sekali terutama menjelang musim penghujan",
      "Cukup 10 tahun sekali saat ada kunjungan bupati",
      "Tidak perlu dibersihkan sama sekali karena lumpur akan hanyut sendiri"
    ],
    answer: 1,
    explanation: "Pembersihan berkala (minimal sebulan sekali) mencegah endapan lumpur mengeras dan memastikan kapasitas parit tetap maksimal saat menampung hujan deras."
  },
  {
    question: "Apa yang terjadi jika sampah B3 seperti baterai bekas dibuang sembarangan ke dalam aliran parit desa?",
    options: [
      "Air parit akan menjadi sumber energi listrik gratis bagi warga",
      "Kandungan logam berat berbahaya (merkuri/timbal) akan bocor, mencemari air, dan meracuni ekosistem sungai serta ikan",
      "Baterai akan larut dan menjadi air jernih",
      "Aliran air parit menjadi lebih kencang"
    ],
    answer: 1,
    explanation: "Sampah B3 mengandung bahan kimia berbahaya yang bersifat racun bioakumulatif, merusak ekosistem perairan parit dan berbahaya jika dikonsumsi."
  },
  {
    question: "Mengapa wadah penampung air nutrisi pada hidroponik sumbu (wick system) sebaiknya dibuat gelap atau ditutup rapat dari sinar matahari?",
    options: [
      "Agar tanaman tidak kepanasan di malam hari",
      "Untuk mencegah pertumbuhan lumut yang dapat mencuri nutrisi tanaman dan menyumbat sumbu aliran",
      "Agar tanaman tumbuh ke arah bawah",
      "Untuk menyembunyikan jentik nyamuk"
    ],
    answer: 1,
    explanation: "Sinar matahari langsung yang mengenai air bernutrisi akan memicu tumbuhnya alga/lumut hijau yang mengonsumsi nutrisi tanaman dan mengurangi kadar oksigen air."
  },
  {
    question: "Tindakan gotong royong warga manakah yang paling efektif mencegah terjadinya luapan banjir parit saat hujan lebat tiba?",
    options: [
      "Membakar sampah plastik bersama-sama di jalanan desa",
      "Mengeruk sedimentasi lumpur tebal dan membuang sampah penyumbat parit secara berkala",
      "Mengecat seluruh dinding parit dengan warna hijau",
      "Menutup seluruh permukaan selokan dengan beton semen tanpa lubang kontrol"
    ],
    answer: 1,
    explanation: "Membersihkan parit secara fisik dari lumpur endapan dan sampah plastik adalah cara paling praktis mempertahankan debit tampung saluran air desa."
  }
];
