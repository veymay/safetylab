// Barcha o'quv matnlari shu yerda markazlashtirilgan — kontentni
// o'zgartirish uchun komponentlarga tegishning hojati yo'q.

export const content = {
  appTitle: "Sanoat texnik xavfsizligi bo'yicha VR trening",

  landing: {
    badge: "Sanoat xavfsizligi • VR trening platformasi",
    heroTitle: "Xodimlaringizni xavfni ko'rgach emas, ko'rishdan oldin tayyorlang",
    heroSubtitle:
      "SafetyLab — real ishlab chiqarish sexini jonlantiruvchi interaktiv trening platformasi. Xodim brauzerda yoki VR ko'zoynakda pres, elektr shchiti va gaz omboriga yaqinlashib-uzoqlashib, haqiqiy xavf manbalarini his qiladi, so'ng 15 savoldan iborat test bilan bilimini mustahkamlaydi.",
    ctaStart: "Mashg'ulotni boshlash",
    ctaHow: "Qanday ishlaydi",
    stats: [
      { value: "1", label: "yaxlit real sex" },
      { value: "14", label: "xavf turi bo'yicha mashq" },
      { value: "16", label: "yakuniy test savoli" },
      { value: "0", label: "o'rnatiladigan ilova" },
    ],
    featuresTitle: "Platforma haqida",
    featuresSubtitle:
      "Kompyuterda sichqoncha bilan ham, Meta Quest 3 ko'zoynagida to'liq VR rejimida ham, hech qanday ilova o'rnatmasdan ishlaydi.",
    features: [
      {
        title: "Real sex muhiti",
        description:
          "Sanoat presi, elektr taqsimlagich shchiti va gaz ballonlari ombori bitta yaxlit sexda joylashgan — xuddi haqiqiy ishlab chiqarishdagidek.",
      },
      {
        title: "Yaqinlashish — real xavf",
        description:
          "Xavfli uskunaga romb bosish shart emas: unga jismonan yaqinlashsangiz, ogohlantirish va xavf zonasi avtomatik ishga tushadi — xuddi hayotdagidek.",
      },
      {
        title: "Brauzer va VR — bitta kod",
        description:
          "Qo'shimcha o'rnatishsiz istalgan kompyuter yoki Meta Quest 3 brauzerida ochiladi, VR headset aniqlansa avtomatik VR rejimida ishga tushadi.",
      },
    ],
    stepsTitle: "Qanday ishlaydi",
    steps: [
      { title: "Mashg'ulotni boshlaysiz", description: "Bitta tugma bilan darhol yo'riqnomaga o'tasiz — qo'shimcha tanlov kerak emas." },
      { title: "Amaliyot (praktikum)", description: "Real sexda erkin harakatlanib, uskunalarga yaqinlashib-uzoqlashib va qolgan xavflarni topib mashq qilasiz." },
      { title: "Fikr-mulohaza", description: "Aniqlangan va e'tibordan chetda qolgan xavflar bo'yicha to'liq tushuntirish olasiz." },
      { title: "Test topshirasiz", description: "15 savoldan iborat yakuniy test bilan bilimingiz baholanadi." },
    ],
    hazardsTitle: "Nimalarni aniqlashni o'rganasiz",
    finalCtaTitle: "Trening uchun tayyor bo'lganda — tugmani bosing",
    finalCtaSubtitle: "Boshlash bilan darhol yo'riqnoma va virtual sexga kirasiz.",
    footerNote: "SafetyLab — sanoat texnik xavfsizligi bo'yicha VR/veb trening platformasi.",
  },

  instructions: {
    title: "Xavfsizlik yo'riqnomasi",
    intro: "Trening maydoniga kirishdan oldin quyidagi qoidalar bilan tanishing:",
    rules: [
      "Ishni boshlashdan oldin uskunani va ish joyini tekshiring.",
      "Xavfli uskunalarga yaqinlashganda ogohlantirish belgilariga e'tibor bering.",
      "Xavfli hudud (qizil zona)ga hech qachon ruxsatsiz kirmang.",
      "Aniqlangan har bir xavf manbasini belgilang va sababini tushunib oling.",
      "Individual himoya vositalarisiz ishlash uchun sanoat sexiga kirish taqiqlanadi.",
    ],
    controlsTitle: "Boshqaruv",
    controls: [
      "Ko'rish uchun sichqonchani bosib torting (360° aylanish) yoki VR headsetda boshingizni buring.",
      "Harakatlanish uchun pol yuzasida istalgan nuqtani bosing.",
      "Yirik uskunalar (pres, elektr shchiti, gaz ombori) shunchaki yaqinlashsangiz avtomatik aniqlanadi — bosish shart emas.",
      "Boshqa xavf manbalarini aniqlash uchun ularning ustiga bosing.",
      "Yukni ko'tarish uchun quti ustiga bosing, so'ng uni sariq belgilangan maydonga olib borib qo'ying.",
    ],
    continueButton: "Mashg'ulotni boshlash",
  },

  hud: {
    objectivesTitle: "Vazifalar",
    hazardsProgress: (found, total) => `Aniqlangan xavflar: ${found}/${total}`,
    violationsLabel: "Xavfsizlik qoidabuzarliklari",
    finishButton: "Mashqni yakunlash",
    finishHint: "Barcha xavflarni aniqlagach, mashqni yakunlashingiz mumkin.",
  },

  zones: {
    safe: null,
    warning: {
      badge: "OGOHLANTIRISH",
      message: "DIQQAT — Siz xavfli uskunaga yaqinlashmoqdasiz.",
    },
    danger: {
      badge: "XAVFLI HUDUD",
      message: "XAVFLI HUDUD — Siz uskunaning xavfli ish zonasiga kirdingiz. Zudlik bilan orqaga qayting!",
    },
  },

  quiz: {
    title: "Bilimni tekshirish testi",
    subtitle: "Amaliyotni yakunladingiz. Endi 15 savoldan iborat yakuniy testni topshiring.",
    questionLabel: (index, total) => `Savol ${index}/${total}`,
    checkButton: "Javoblarni tekshirish",
    viewResultButton: "Natijani ko'rish",
    correctLabel: "To'g'ri",
    incorrectLabel: "Noto'g'ri",
    correctAnswerPrefix: "To'g'ri javob:",
    scoreSummary: (correct, total) => `Siz ${total} savoldan ${correct} tasiga to'g'ri javob berdingiz.`,
  },

  feedback: {
    title: "Natijalar bo'yicha fikr-mulohaza",
    hazardsFoundLabel: "Aniqlangan xavflar",
    hazardsMissedLabel: "Aniqlanmagan xavflar",
    violationsGood: "Siz xavfli hududga hech qachon kirmadingiz — ajoyib natija!",
    violationsBad: (count) =>
      `Siz xavfli hududga ${count} marta kirdingiz. Ishlab chiqarish sharoitida bu jiddiy xavfsizlik qoidabuzarligi hisoblanadi.`,
    continueButton: "Testga o'tish",
  },

  result: {
    title: "Trening yakunlandi",
    scoreLabel: "Umumiy ball",
    passTitle: "TRENING MUVAFFAQIYATLI YAKUNLANDI",
    failTitle: "TRENINGNI QAYTA O'TASH TAVSIYA ETILADI",
    passMessage:
      "Siz xavfsizlik qoidalariga rioya qilib, asosiy xavf manbalarini to'g'ri aniqladingiz va testdan yaxshi natija ko'rsatdingiz.",
    failMessage:
      "Ba'zi xavf manbalari e'tibordan chetda qoldi, xavfli hududga kirish holatlari qayd etildi yoki test natijasi past bo'ldi. Mashqni qaytadan o'tashingiz tavsiya etiladi.",
    breakdownTitle: "Ball taqsimoti",
    hazardsScoreLabel: "Aniqlangan xavflar",
    safetyScoreLabel: "Xavfsizlik qoidalariga rioya",
    quizScoreLabel: "Test natijasi",
    restartButton: "Qaytadan boshlash",
    homeButton: "Bosh sahifaga qaytish",
  },
};
