import { SupportedLocale } from '@school/shared';

export interface TranslationDictionary {
  nav: {
    about: string;
    aboutSchool: string;
    leadership: string;
    teachers: string;
    gallery: string;
    admission: string;
    schoolLife: string;
    news: string;
    education: string;
    directions: string;
    exactSciences: string;
    naturalSciences: string;
    contact: string;
    applyCta: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    applyBtn: string;
    learnMoreBtn: string;
  };
  stats: {
    title: string;
    students: string;
    studentsDesc: string;
    teachers: string;
    teachersDesc: string;
    admissionRate: string;
    admissionRateDesc: string;
    labs: string;
    labsDesc: string;
  };
  directions: {
    tag: string;
    title: string;
    subtitle: string;
    exactTitle: string;
    exactDesc: string;
    exactSubjects: string[];
    naturalTitle: string;
    naturalDesc: string;
    naturalSubjects: string[];
    detailsBtn: string;
  };
  news: {
    tag: string;
    title: string;
    subtitle: string;
    allNewsBtn: string;
    readMore: string;
  };
  gallery: {
    tag: string;
    title: string;
    subtitle: string;
    allPhotosBtn: string;
  };
  cta: {
    title: string;
    subtitle: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    applyBtn: string;
    guideBtn: string;
  };
  footer: {
    description: string;
    quickLinks: string;
    contactInfo: string;
    address: string;
    workingHours: string;
    rights: string;
  };
}

export const translations: Record<SupportedLocale, TranslationDictionary> = {
  uz: {
    nav: {
      about: 'Biz haqimizda',
      aboutSchool: 'Maktab haqida',
      leadership: 'Rahbariyat',
      teachers: "Öqituvçilar",
      gallery: 'Galereya',
      admission: 'Qabul',
      schoolLife: 'Maktab hayoti',
      news: 'Yangiliklar',
      education: "Ta'lim",
      directions: "Yönalişlar",
      exactSciences: 'Aniq fanlar',
      naturalSciences: 'Tabiiy fanlar',
      contact: "Boğlaniş",
      applyCta: 'Ariza topşiriş',
    },
    hero: {
      badge: "2026/2027 öquv yili uçun qabul tartibi e'lon qilindi",
      title: "Törtköl tuman ixtisoslaştirilgan maktabi",
      subtitle: "Kelajak yetakçilari va intellektual salohiyatli yoşlar maskani. Çuqurlaştirilgan aniq va tabiiy fanlar ta'limi.",
      applyBtn: 'Ariza topşiriş',
      learnMoreBtn: 'Maktab haqida',
    },
    stats: {
      title: 'Maktab raqamlarda',
      students: '500+',
      studentsDesc: "Iqtidorli va saralangan öquvçilar",
      teachers: '40+',
      teachersDesc: 'Oliy toifali va xalqaro sertifikatli ustozlar',
      admissionRate: '100%',
      admissionRateDesc: 'Bitiruvçilarning OTMga kiriş körsatkiçi',
      labs: 'Zamonaviy',
      labsDesc: 'Fizika, kimyo va IT laboratoriyalari',
    },
    directions: {
      tag: "Ta'lim yönalişlari",
      title: 'Çuqurlaştirilgan öquv dasturlari',
      subtitle: "Maktabimizda öquvçilar ikkita asosiy yönaliş böyiça çuqur bilim oladilar",
      exactTitle: 'Aniq fanlar yönalişi',
      exactDesc: 'Mantiqiy fikrlaş, tahlil qiliş va xalqaro olimpiadalarga tayyorgarlik.',
      exactSubjects: ['Matematika', 'Fizika', 'Ingliz tili'],
      naturalTitle: 'Tabiiy fanlar yönalişi',
      naturalDesc: 'Tibbiyot, biotexnologiya va ekologiya sohalari uçun fundamental poydevor.',
      naturalSubjects: ['Kimyo', 'Biologiya', 'Ingliz tili'],
      detailsBtn: "Batafsil ma'lumot",
    },
    news: {
      tag: 'Maktab hayoti',
      title: "Sönggi yangiliklar va e'lonlar",
      subtitle: "Maktabimiz faoliyatidagi eng muhim voqealar va yutuqlar",
      allNewsBtn: 'Barça yangiliklar',
      readMore: "Batafsil öqiş",
    },
    gallery: {
      tag: 'Fotogalereya',
      title: 'Maktab hayotidan fotolavhalar',
      subtitle: 'Dars jarayonlari, laboratoriya amaliyotlari va madaniy tadbirlar',
      allPhotosBtn: 'Barça fotolar',
    },
    cta: {
      title: "Ixtisoslaştirilgan maktabga qabul jarayoni",
      subtitle: "Hujjatlar qabuli rasmiy ariza.piima.uz portali orqali onlayn amalga oşiriladi",
      step1: '1. Onlayn ariza',
      step2: '2. Hujjatlar tekşiruvi',
      step3: '3. Imtihonlar',
      step4: '4. Natijalar',
      applyBtn: 'Rasmiy portalga ötiş',
      guideBtn: 'Qabul tartibi',
    },
    footer: {
      description: "Qoraqalpoğiston Respublikasi Törtköl tuman ixtisoslaştirilgan maktabining rasmiy veb-platformasi.",
      quickLinks: 'Tezkor havolalar',
      contactInfo: 'Aloqa maʼlumotlari',
      address: "Törtköl tumani, Mustaqillik köçasi",
      workingHours: 'Duş - Şan: 08:00 - 17:00',
      rights: 'Barça huquqlar himoyalangan.',
    },
  },
  qq: {
    nav: {
      about: 'Biz haqqımızda',
      aboutSchool: 'Mektep haqqında',
      leadership: 'Basshılıq',
      teachers: 'Oqıtıwshılar',
      gallery: 'Galereya',
      admission: 'Qabıllaw',
      schoolLife: 'Mektep turmısı',
      news: 'Jańalıqlar',
      education: 'Bilimlendiriw',
      directions: 'Baǵdarlar',
      exactSciences: 'Anıq pánler',
      naturalSciences: 'Tábiyiy pánler',
      contact: 'Baylanıs',
      applyCta: 'Arza tapsırıw',
    },
    hero: {
      badge: '2026/2027-oqıw jılı ushın qabıllaw baslandı',
      title: "Tórtkúl qánigelestirilgen mektebi",
      subtitle: 'Keleshek jetekshileri hám intellektual jaslar maskanı. Terńlestirilgen anıq hám tábiyiy pánler bilimi.',
      applyBtn: 'Arza tapsırıw',
      learnMoreBtn: 'Mektep haqqında',
    },
    stats: {
      title: 'Mektep sanlarda',
      students: '500+',
      studentsDesc: 'Qábiletli hám saralanǵan oqıwshılar',
      teachers: '40+',
      teachersDesc: 'Joqarı qániygeli hám tájiriybeli ustazlar',
      admissionRate: '100%',
      admissionRateDesc: 'JOOǵa kiriw kórsetkishi',
      labs: 'Zamanagóy',
      labsDesc: 'Fizika, ximiya hám IT laboratoriyaları',
    },
    directions: {
      tag: 'Bilimlendiriw baǵdarları',
      title: 'Terńlestirilgen oqıw baǵdarları',
      subtitle: 'Mektebimizde oqıwshılar eki tiykarǵı baǵdar boyınsha tereń bilim aladı',
      exactTitle: 'Anıq pánler baǵdarı',
      exactDesc: 'Logikalıq pikirlew, tallaw hám xalıqaralıq olimpiadalarǵa tayarlıq.',
      exactSubjects: ['Matematika', 'Fizika', 'Inglis tili'],
      naturalTitle: 'Tábiyiy pánler baǵdarı',
      naturalDesc: 'Mediciniya, biotexnologiya hám ekologiya tarawları ushın tiykarǵı fundament.',
      naturalSubjects: ['Ximiya', 'Biologiya', 'Inglis tili'],
      detailsBtn: 'Tolıq maǵlıwmat',
    },
    news: {
      tag: 'Mektep turmısı',
      title: 'Sońǵı jańalıqlar hám daǵazalar',
      subtitle: 'Mektebimiz jumısındagı eń áhmiyetli waqıyalar',
      allNewsBtn: 'Barlıq jańalıqlar',
      readMore: 'Tolıq oqıw',
    },
    gallery: {
      tag: 'Fotogalereya',
      title: 'Mektep turmısınan fotolawhalar',
      subtitle: 'Sabıq processleri, laboratoriya ámeliyatları hám ilajlar',
      allPhotosBtn: 'Barlıq fotolar',
    },
    cta: {
      title: 'Qánigelestirilgen mektepke qabıllaw procesi',
      subtitle: 'Hújjetler qabıllaw rásmiy ariza.piima.uz portalı arqalı onlayn ámelge asırıladı',
      step1: '1. Onlayn arza',
      step2: '2. Hújjetlerdi tekseriw',
      step3: '3. Imtixanlar',
      step4: '4. Nátiyjeler',
      applyBtn: 'Rásmiy portalǵa ótiw',
      guideBtn: 'Qabıllaw tártibi',
    },
    footer: {
      description: "Qaraqalpaqstan Respublikası Tórtkúl rayonı qánigelestirilgen mektebiniń rásmiy veb-platforması.",
      quickLinks: 'Tezkor siltemeler',
      contactInfo: 'Baylanıs maǵlıwmatları',
      address: "Tórtkúl rayonı, Mustaqıllıq kóshesi",
      workingHours: 'Dúyshembi - Shembilik: 08:00 - 17:00',
      rights: 'Barlıq huqıqlar qorǵalǵan.',
    },
  },
  ru: {
    nav: {
      about: 'О нас',
      aboutSchool: 'О школе',
      leadership: 'Руководство',
      teachers: 'Учителя',
      gallery: 'Галерея',
      admission: 'Прием',
      schoolLife: 'Школьная жизнь',
      news: 'Новости',
      education: 'Образование',
      directions: 'Направления',
      exactSciences: 'Точные науки',
      naturalSciences: 'Естественные науки',
      contact: 'Контакты',
      applyCta: 'Подать заявку',
    },
    hero: {
      badge: 'Объявлен прием на 2026/2027 учебный год',
      title: 'Турткульская специализированная школа',
      subtitle: 'Центр будущих лидеров и интеллектуальной молодежи. Углубленное обучение точным и естественным наукам.',
      applyBtn: 'Подать заявку',
      learnMoreBtn: 'О школе',
    },
    stats: {
      title: 'Школа в цифрах',
      students: '500+',
      studentsDesc: 'Одаренные и прошедшие строгий отбор ученики',
      teachers: '40+',
      teachersDesc: 'Педагоги высшей категории и международной квалификации',
      admissionRate: '100%',
      admissionRateDesc: 'Поступление выпускников в престижные вузы',
      labs: 'Современные',
      labsDesc: 'Лаборатории физики, химии и информационных технологий',
    },
    directions: {
      tag: 'Образовательные направления',
      title: 'Программы углубленного обучения',
      subtitle: 'В нашей школе учащиеся получают глубокие знания по двум ключевым профилям',
      exactTitle: 'Профиль точных наук',
      exactDesc: 'Логическое мышление, углубленный анализ и подготовка к международным олимпиадам.',
      exactSubjects: ['Математика', 'Физика', 'Английский язык'],
      naturalTitle: 'Профиль естественных наук',
      naturalDesc: 'Фундаментальная подготовка для будущих специалистов в медицине и биотехнологиях.',
      naturalSubjects: ['Химия', 'Биология', 'Английский язык'],
      detailsBtn: 'Подробнее',
    },
    news: {
      tag: 'Школьная жизнь',
      title: 'Последние новости и события',
      subtitle: 'Главные достижения и актуальные мероприятия нашей школы',
      allNewsBtn: 'Все новости',
      readMore: 'Читать далее',
    },
    gallery: {
      tag: 'Фотогалерея',
      title: 'Моменты школьной жизни',
      subtitle: 'Учебный процесс, лабораторные практикумы и творческие мероприятия',
      allPhotosBtn: 'Все фотографии',
    },
    cta: {
      title: 'Приемная кампания в специализированную школу',
      subtitle: 'Подача документов осуществляется онлайн через официальный портал ariza.piima.uz',
      step1: '1. Онлайн заявка',
      step2: '2. Проверка документов',
      step3: '3. Экзамены',
      step4: '4. Результаты',
      applyBtn: 'Перейти на портал',
      guideBtn: 'Правила приема',
    },
    footer: {
      description: 'Официальная веб-платформа Турткульской специализированной школы Республики Каракалпакстан.',
      quickLinks: 'Быстрые ссылки',
      contactInfo: 'Контактные данные',
      address: 'Турткульский район, улица Мустакиллик',
      workingHours: 'Пн - Сб: 08:00 - 17:00',
      rights: 'Все права защищены.',
    },
  },
  en: {
    nav: {
      about: 'About Us',
      aboutSchool: 'About School',
      leadership: 'Leadership',
      teachers: 'Teachers',
      gallery: 'Gallery',
      admission: 'Admissions',
      schoolLife: 'School Life',
      news: 'News',
      education: 'Education',
      directions: 'Curriculum',
      exactSciences: 'Exact Sciences',
      naturalSciences: 'Natural Sciences',
      contact: 'Contact',
      applyCta: 'Apply Now',
    },
    hero: {
      badge: 'Admissions announced for 2026/2027 Academic Year',
      title: 'Turtkul Specialized School',
      subtitle: 'Nurturing future leaders and intellectual youth through advanced STEM education in exact and natural sciences.',
      applyBtn: 'Apply Now',
      learnMoreBtn: 'About School',
    },
    stats: {
      title: 'School in Numbers',
      students: '500+',
      studentsDesc: 'Selected and talented academic achievers',
      teachers: '40+',
      teachersDesc: 'Certified top-tier educators and mentors',
      admissionRate: '100%',
      admissionRateDesc: 'University admission and placement record',
      labs: 'Modern',
      labsDesc: 'State-of-the-art physics, chemistry, and IT laboratories',
    },
    directions: {
      tag: 'Academic Tracks',
      title: 'In-Depth Curriculum Tracks',
      subtitle: 'Empowering students across two specialized academic streams',
      exactTitle: 'Exact Sciences Track',
      exactDesc: 'Advanced mathematical logic, physics research, and international Olympiad preparation.',
      exactSubjects: ['Mathematics', 'Physics', 'English Language'],
      naturalTitle: 'Natural Sciences Track',
      naturalDesc: 'Rigorous foundation for medicine, biochemistry, and modern scientific research.',
      naturalSubjects: ['Chemistry', 'Biology', 'English Language'],
      detailsBtn: 'Explore Track',
    },
    news: {
      tag: 'Campus Updates',
      title: 'Latest News & Announcements',
      subtitle: 'Key highlights, student accomplishments, and academic updates',
      allNewsBtn: 'View All News',
      readMore: 'Read Article',
    },
    gallery: {
      tag: 'Photo Gallery',
      title: 'Campus Life & Moments',
      subtitle: 'Interactive classes, laboratory workshops, and cultural events',
      allPhotosBtn: 'View All Photos',
    },
    cta: {
      title: 'Specialized School Admissions',
      subtitle: 'Online applications are processed directly via the official portal ariza.piima.uz',
      step1: '1. Online Application',
      step2: '2. Document Verification',
      step3: '3. Examination',
      step4: '4. Results',
      applyBtn: 'Visit Official Portal',
      guideBtn: 'Admission Guide',
    },
    footer: {
      description: 'Official digital platform of Turtkul Specialized School, Republic of Karakalpakstan.',
      quickLinks: 'Quick Links',
      contactInfo: 'Contact Information',
      address: 'Turtkul District, Mustaqillik Street',
      workingHours: 'Mon - Sat: 08:00 - 17:00',
      rights: 'All rights reserved.',
    },
  },
};
