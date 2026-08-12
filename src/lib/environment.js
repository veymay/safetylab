// Bitta yaxlit, real ishlab chiqarish sexi: uchta "stansiya" (pres,
// elektr shchiti, gaz ombori) yaqinlashish/uzoqlashish orqali real hayotdagi
// kabi avtomatik aniqlanadi (romb bosish shart emas), qolgan xavflar esa
// sexda tarqoq joylashgan va ustiga bosib "aniqlanadi".

export const theme = {
  floorColor: "#868c92",
  wallColor: "#c7ccd1",
  fogColor: "#dde3ea",
};

export const stations = [
  {
    id: "press",
    name: "Sanoat presi (STAMP-200)",
    position: [-9.5, 0, -6],
    warningRadius: 4.5,
    dangerRadius: 2.4,
    hazard: {
      id: "machine",
      title: "Robot-manipulyatordan shikastlanishning oldini olish qoidalari",
      description:
        "Keng tarqalgan xavflar: ezilish, to'qnashish, qisilib qolish. Yuqori xavfli hududlar: robot-manipulyator va uning uchki asbobining harakatlanish doirasi. Uskuna ishlayotgan vaqtda unga qo'l bilan aralashish qat'iyan taqiqlanadi. Favqulodda to'xtatish tugmasi joylashgan joyni oldindan biling.",
    },
  },
  {
    id: "panel",
    name: "Elektr taqsimlagich shchiti (EDB-40)",
    position: [0, 0, -6],
    warningRadius: 4.5,
    dangerRadius: 2.4,
    hazard: {
      id: "electric",
      title: "Elektr toki urishidan ehtiyot choralari",
      description:
        "Uzoqda turing: Elektr qutisiga va uning yaqin atrofiga tegmang. Elektr energiyasini o'chiring: Asosiy quvvat manbasini darhol uzing. Boshqalarni ogohlantiring: Atrofdagilarga hududdan uzoqlashish kerakligini ayting. Mutaxassisga murojaat qiling: Muammoni bartaraf etish uchun litsenziyaga ega elektrikka murojaat qiling.",
    },
  },
  {
    id: "gas",
    name: "Yonuvchan gaz ballonlari ombori",
    position: [9.5, 0, -6],
    warningRadius: 4.5,
    dangerRadius: 2.4,
    hazard: {
      id: "fire",
      title: "Yong'in xavfsizligi va favqulodda harakat qo'llanmasi",
      description:
        "Yong'in shafqatsizdir, shuning uchun uning oldini olish favqulodda harakat qilish kabi muhimdir. Yong'in vaqtida tezkor harakat va to'g'ri evakuatsiya hal qiluvchi ahamiyatga ega. Signal berish, chiqish va yig'ilish nuqtasi qoidalari hayotni saqlab qoladi.",
    },
  },
];

export const hazards = [
  {
    id: "conveyor",
    title: "Konveyer lentasi bilan ishlash xavfsizligi qoidalari",
    description:
      "Konveyer lentasida shikastlanish va begona narsalar yo'qligiga ishonch hosil qiling. Ishga tushirishdan oldin konveyer yaqinida hech kim yo'qligiga ishonch hosil qiling. Ishlayotgan konveyerga tegmang. Erkin (keng) kiyim kiymang va xavfli hududlardan uzoqroqda bo'ling.",
    position: [-12.5, 0.8, -7],
  },
  {
    id: "noise",
    title: "Zavodda shovqinni nazorat qilish va xavfsizlik",
    description:
      "Shovqinni izolyatsiya qiluvchi uskunalar va shovqin yutuvchi materiallar yordamida kamaytiring. Xodimlarning eshitish qobiliyatini himoya qilish va shovqin ta'sirini kamaytirish uchun ularni quloqchin yoki quloq tiqinlari bilan ta'minlang.",
    position: [-6, 1.4, -3],
  },
  {
    id: "wear",
    title: "Tegishli xavfsizlik jihozlarini kiying",
    description:
      "Maxsus himoya poyabzali va kaskani to'g'ri kiyish og'ir buyum tushishi, sirg'anib yiqilish va boshga zarba kabi keng tarqalgan baxtsiz hodisalarning oldini samarali olishga hamda xodimlarni har tomonlama xavfsizlik bilan ta'minlashga yordam beradi.",
    position: [-9.5, 1.2, 1.5],
  },
  {
    id: "lockout",
    title: "Energiya manbasini bloklash (Lockout-Tagout) qoidasi",
    description:
      "Ta'mirlash yoki tozalash ishlaridan oldin uskunaning barcha energiya manbalari (elektr, gidravlika, pnevmatika) o'chirilib, maxsus qulf va yorliq bilan bloklanishi shart. Bu boshqa xodim tasodifan uskunani ishga tushirib yubormasligini kafolatlaydi.",
    position: [-12, 1.3, -2],
  },
  {
    id: "cable",
    title: "Shikastlangan elektr kabellari bilan ishlash qoidalari",
    description:
      "Izolyatsiyasi shilingan yoki ochiq qolgan kabelga hech qachon qo'l bilan tegmang. Bunday kabelni darhol xavfli hudud sifatida belgilang va vaziyat haqida mas'ul mutaxassisga xabar bering. Kabellarni pol bo'ylab tekis va himoyalangan holda yotqizish kerak.",
    position: [-3.5, 0.15, -3],
  },
  {
    id: "wetfloor",
    title: "Nam pol yaqinida elektr uskunalari xavfsizligi",
    description:
      "Suv elektr tokini yaxshi o'tkazadi, shuning uchun nam yoki suv to'kilgan pol yaqinida elektr uskunasidan foydalanish tok urish xavfini keskin oshiradi. To'kilgan suyuqlikni darhol artib, hududni quritish va ogohlantiruvchi belgi qo'yish lozim.",
    position: [3.5, 0.05, -3],
  },
  {
    id: "overload",
    title: "Elektr tarmog'ini ortiqcha yuklashning oldini olish",
    description:
      "Bitta rozetka yoki uzaytirgichga juda ko'p asbob ulash tarmoqni ortiqcha yuklaydi, kabelni qizdiradi va yong'in xavfini keltirib chiqaradi. Har bir uskuna quvvatiga mos alohida liniyadan foydalaning va uzaytirgichlarni bir-biriga ulamang.",
    position: [2, 0.6, 1],
  },
  {
    id: "extinguisher",
    title: "O't o'chirgichdan foydalanish qoidalari",
    description:
      "Har bir sex hududida o't o'chirgich bo'lishi va uning muddati o'tmaganligi muntazam tekshirilishi shart. Xodimlar o't o'chirgichning joylashgan joyini va undan qanday foydalanishni oldindan bilishi kerak.",
    position: [6.5, 1.2, -2],
  },
  {
    id: "mask",
    title: "Havoning ifloslanishidan himoyalanish uchun niqob kiying",
    description:
      "Omborda uzoq vaqt nafas olinganda salomatlikka zarar yetkazishi mumkin bo'lgan chang yoki zararli gazlar bo'lishi mumkin. Xodimlar himoya niqobini to'g'ri kiyishlari, muhitga mos turini tanlashlari va uni muntazam almashtirib turishlari lozim.",
    position: [12.5, 1.4, -2],
  },
  {
    id: "exit",
    title: "Favqulodda chiqish yo'lini band qilmaslik qoidasi",
    description:
      "Favqulodda chiqish eshigi oldiga quti yoki boshqa yuklarni qo'yish taqiqlanadi — bu favqulodda vaziyatda evakuatsiyani sekinlashtiradi va hayotga xavf tug'diradi. Chiqish yo'llari doimo ochiq va erkin bo'lishi shart.",
    position: [9.5, 1.0, 1.5],
  },
];

// Romb bosish o'rniga jismonan bajariladigan vazifa: yukni ko'tarib,
// belgilangan (sariq) maydonga olib borib qo'yish. Shuning uchun
// `hazards` massividan alohida — Experience.jsx bu xavfni o'z maxsus
// interaktiv mexanikasi (CrateStack/DropPallet) orqali boshqaradi.
export const liftingHazard = {
  id: "lifting",
  title: "Og'ir yukni to'g'ri ko'tarish qoidalari",
  description:
    "Og'ir yukni ko'tarishda beliningizni emas, tizzalaringizni buking va yukni tanangizga yaqin tuting. Keskin burilish va egilishlardan saqlaning. Juda og'ir yukni yolg'iz emas, boshqa xodim yordamida yoki ko'tarish uskunasi bilan tashing.",
  position: [-6, 1, -0.8],
};

export const quiz = [
  {
    question:
      "Robot-manipulyator yoki mexanik pres ishlab turgan vaqtda unga qo'l bilan aralashish mumkinmi?",
    options: [
      "Ha, ehtiyot bo'lib harakat qilinsa mumkin",
      "Yo'q, bu qat'iyan taqiqlanadi",
      "Faqat qo'lqop kiyilsa mumkin",
      "Faqat tajribali xodim uchun mumkin",
    ],
    correctIndex: 1,
  },
  {
    question: "Konveyer lentasini ishga tushirishdan oldin nima qilish kerak?",
    options: [
      "Darhol tugmani bosish",
      "Konveyer yaqinida hech kim yo'qligiga ishonch hosil qilish",
      "Faqat nazoratchiga xabar berish",
      "Hech narsa, u avtomatik xavfsiz",
    ],
    correctIndex: 1,
  },
  {
    question: "Erkin (keng) kiyimda mexanik uskunalar yaqinida ishlash xavfsizmi?",
    options: [
      "Ha, qulay bo'lgani uchun xavfsiz",
      "Yo'q, kiyim uskunaga ilinib qolishi mumkin",
      "Faqat qishda xavfli",
      "Kiyim turi ahamiyatsiz",
    ],
    correctIndex: 1,
  },
  {
    question: "Favqulodda to'xtatish (Emergency Stop) tugmasi haqida nima to'g'ri?",
    options: [
      "Uni oldindan bilish shart emas",
      "Joylashgan joyini oldindan bilish va zarur bo'lsa darhol bosish kerak",
      "Faqat ustaxona boshlig'i bosishi mumkin",
      "Faqat yong'in vaqtida ishlatiladi",
    ],
    correctIndex: 1,
  },
  {
    question: "Shovqinli uskunalar yaqinida uzoq muddat ishlaganda nima kiyish tavsiya etiladi?",
    options: [
      "Quloqchin yoki quloq tiqinlari",
      "Qo'shimcha ko'zoynak",
      "Issiqlikdan saqlovchi qo'lqop",
      "Hech narsa kerak emas",
    ],
    correctIndex: 0,
  },
  {
    question:
      "Elektr qutisi yaqinida g'alati tovush yoki uchqun sezsangiz birinchi navbatda nima qilasiz?",
    options: [
      "Qutini ochib o'zingiz tekshirasiz",
      "Uzoqlashib, asosiy quvvatni o'chirasiz yoki mutaxassisga murojaat qilasiz",
      "E'tibor bermay ishni davom ettirasiz",
      "Qutiga suv sepib sovutasiz",
    ],
    correctIndex: 1,
  },
  {
    question: "Izolyatsiyasi shikastlangan elektr kabeliga qanday munosabatda bo'lish kerak?",
    options: [
      "Qo'l bilan ehtiyotlik bilan taxlab qo'yish mumkin",
      "Unga tegmay, xavfli hudud sifatida belgilab, mutaxassisga xabar berish",
      "Skotch bilan yopishtirib qo'yish yetarli",
      "E'tiborsiz qoldirish mumkin, kuchsiz tok bor",
    ],
    correctIndex: 1,
  },
  {
    question: "Pol nam yoki suv to'kilgan joyda elektr uskunasi ishlatish nima uchun xavfli?",
    options: [
      "Xavfli emas, suv tokni o'tkazmaydi",
      "Suv elektr tokini yaxshi o'tkazadi va tok urish xavfini oshiradi",
      "Faqat uskuna buziladi, odamga xavf yo'q",
      "Faqat metall pollarda xavfli",
    ],
    correctIndex: 1,
  },
  {
    question: "Elektr toki urgan odamga birinchi yordam ko'rsatishdan oldin nima qilish shart?",
    options: [
      "Darhol unga qo'l bilan tegib tortib olish",
      "Avval quvvat manbasini o'chirish yoki uzish",
      "Uning ustiga suv sepish",
      "Hech narsa, o'zi tuzaladi",
    ],
    correctIndex: 1,
  },
  {
    question: "Elektr taqsimlagichi (shchit) oldida qanday tartib bo'lishi kerak?",
    options: [
      "Har doim qulflangan va faqat vakolatli shaxs kirishi mumkin",
      "Ochiq va hammaga erkin",
      "Turli jihozlar bilan to'ldirilgan",
      "Muhim emas, tartib shart emas",
    ],
    correctIndex: 0,
  },
  {
    question: "Yong'in chiqqanda birinchi navbatda nima qilish kerak?",
    options: [
      "Narsalarni yig'ishtirishga tushish",
      "Signal berish va xavfsiz evakuatsiyani boshlash",
      "Liftdan foydalanib tezda chiqish",
      "Yong'inni chetdan kuzatib turish",
    ],
    correctIndex: 1,
  },
  {
    question:
      "Gaz ballonlari yoki yonuvchan moddalar saqlanadigan joy yaqinida ochiq olov bilan ishlash mumkinmi?",
    options: [
      "Ha, ehtiyot bo'lsa mumkin",
      "Yo'q, bu qat'iyan taqiqlanadi",
      "Faqat kunduzi mumkin",
      "Faqat ventilyatsiya yoqilgan bo'lsa mumkin",
    ],
    correctIndex: 1,
  },
  {
    question: "O't o'chirgichdan foydalanishdan oldin nimaga e'tibor berish kerak?",
    options: [
      "Uning rangiga",
      "Muddati o'tmaganligi va ishlash holatiga",
      "Og'irligiga",
      "Hech narsaga, u har doim tayyor",
    ],
    correctIndex: 1,
  },
  {
    question: "Zavod muhitida chang yoki zararli gaz bo'lganda nima kiyish lozim?",
    options: [
      "Oddiy tibbiy niqob",
      "Muhitga mos maxsus himoya niqobi (respirator)",
      "Hech narsa kiymasa ham bo'ladi",
      "Faqat quyoshdan himoya ko'zoynagi",
    ],
    correctIndex: 1,
  },
  {
    question: "Favqulodda chiqish (evakuatsiya) yo'llari doimo qanday bo'lishi kerak?",
    options: [
      "Jihozlar qo'yilgan bo'lsa ham bo'ladi",
      "Har doim ochiq va to'siqsiz",
      "Faqat rahbariyat uchun ochiq",
      "Ularning holati muhim emas",
    ],
    correctIndex: 1,
  },
  {
    question: "Og'ir yukni yerdan ko'tarayotganda to'g'ri texnika qanday?",
    options: [
      "Belni bukib, tizzalarni tik ushlab ko'tarish",
      "Tizzalarni bukib, yukni tanaga yaqin tutib ko'tarish",
      "Yukni imkon qadar tanadan uzoqroq tutish",
      "Texnika farqi yo'q, tezroq ko'tarish muhim",
    ],
    correctIndex: 1,
  },
];
