export interface SchoolBits {
  name: string;
  address: string;
  eiin: string;
  year: string;
  established: string;
}

export interface PageSection {
  headingBn: string;
  headingEn: string;
  bn: string;
  en: string;
  itemsBn: string[];
  itemsEn: string[];
}

export interface PageCopy {
  leadBn: string;
  leadEn: string;
  summaryBn: string;
  summaryEn: string;
  sections: PageSection[];
}

const STALE = [
  "ক্যাম্পাস ধীরে ধীরে",
  "শিক্ষক প্রতিটি শ্রেণিতে",
  "আমি চাই শিক্ষার্থী সময়মতো",
  "যে সুবিধা এখন আছে",
  "সাফল্যের তালিকায় শুধু",
  "আবেদন তিন ধাপে",
  "বয়স ও আসন প্রতি বছরের",
  "ফটোকপি স্পষ্ট হতে হবে",
  "রসিদ অফিস থেকে নেবেন",
  "ক্লাস ও বিষয়ের নাম একাডেমিক",
  "বিশেষ ছুটি বা পরীক্ষার",
  "খেলা ও সাংস্কৃতিক চর্চা ক্লাসের",
  "ইউনিফর্ম ও ক্লাসের সময়",
  "ক্যাম্পাস দেখতে যোগাযোগ পাতায়",
  "প্রতিনিধিরা শ্রেণির কথা",
  "ক্লাবে যোগ দিতে শ্রেণি",
  "মোবাইল ক্লাসে বন্ধ",
  "স্থানীয় অভিভাবক ও শিক্ষকদের উদ্যোগে",
  "মিশন প্রতিটি শিক্ষার্থীকে নিরাপদ",
  "প্রিয় অভিভাবক ও শিক্ষার্থী",
  "শ্রেণিকক্ষ, পাঠাগার ও খেলার মাঠ আছে",
  "এই তালিকায় শুধু যাচাই করা ফল থাকে",
  "ভর্তি নোটিশ প্রকাশের পর এক পাতার",
  "প্রতি শ্রেণির আসন ও বয়সসীমা",
  "সাধারণত লাগে জন্মনিবন্ধন",
  "ভর্তি ফি, সেশন ফি ও মাসিক বেতন",
  "শ্রেণি ও বিষয় একাডেমিক মডিউল থেকে",
  "ছুটি, পরীক্ষার সম্ভাব্য সপ্তাহ",
  "খেলা, বিতর্ক, স্কাউট ও সাংস্কৃতিক চর্চা",
  "ইউনিফর্ম ও ক্লাসের সময় রুটিন অনুসারে",
  "ভর্তি তথ্য পড়ে এক পাতায়",
  "স্টুডেন্ট কাউন্সিল শ্রেণির কথা",
  "সাংস্কৃতিক ক্লাব চালু আছে",
  "ক্লাসে মোবাইল বন্ধ — এই তিনটি",
];

export function isStaleShowcase(text: string): boolean {
  return STALE.some((snippet) => text.includes(snippet));
}

function section(
  headingBn: string,
  headingEn: string,
  bn: string,
  en: string,
  itemsBn: string[],
  itemsEn: string[],
): PageSection {
  return { headingBn, headingEn, bn, en, itemsBn, itemsEn };
}

export function showcaseCopy(slug: string, school: SchoolBits): PageCopy | null {
  const place = school.address || "স্কুল অফিস";
  const eiin = school.eiin ? `EIIN ${school.eiin}` : "EIIN অফিসে জানা যাবে";
  const since = school.established ? `${school.established} সালে প্রতিষ্ঠিত` : "স্থানীয় উদ্যোগে প্রতিষ্ঠিত";
  const year = school.year;
  const pages: Record<string, PageCopy> = {
    history: {
      leadBn: `${school.name} ${since}। ক্যাম্পাস ${place}। ${eiin}।`,
      leadEn: `${school.name} was founded locally${school.established ? ` in ${school.established}` : ""}. The campus is at ${place}. ${school.eiin ? `EIIN ${school.eiin}.` : ""}`,
      summaryBn: "প্রতিষ্ঠা, ক্যাম্পাস ও শিক্ষাবর্ষের ধারা।",
      summaryEn: "Founding, campus, and the shape of the school year.",
      sections: [
        section("প্রতিষ্ঠা", "Founding", `${school.name} স্থানীয় অভিভাবক ও শিক্ষকদের উদ্যোগে গড়ে উঠেছে। নিয়মিত ক্লাস, পরীক্ষা ও সহশিক্ষা এখানকার দৈনন্দিন কাজ।`, "Local parents and teachers built the school. Regular classes, exams, and activities beyond class are the daily work.", ["স্থানীয় উদ্যোগ", since, eiin], ["A local start", school.established ? `Founded ${school.established}` : "Founded locally", school.eiin ? `EIIN ${school.eiin}` : "EIIN at the office"]),
        section("ক্যাম্পাস", "Campus", `ঠিকানা ${place}। শ্রেণিকক্ষ, পাঠাগার ও খেলার মাঠ যেগুলো চালু আছে সেগুলো গ্যালারিতে দেখা যায়।`, `The address is ${place}. Classrooms, the library, and the playing field that are in use appear in the gallery.`, ["শ্রেণিকক্ষ", "পাঠাগার", "খেলার মাঠ"], ["Classrooms", "Library", "Playing field"]),
        section(`${year} শিক্ষাবর্ষ`, `The ${year} year`, "রুটিন, সিলেবাস, নোটিশ ও প্রকাশিত ফলাফল এই সাইটে থাকে। তারিখ বদলালে আগে নোটিশ প্রকাশ করা হয়।", "The routine, syllabus, notices, and published results live on this site. A date change is announced by notice first.", ["রুটিন", "সিলেবাস", "নোটিশ", "প্রকাশিত ফলাফল"], ["Routine", "Syllabus", "Notices", "Published results"]),
        section("অভিভাবকের জন্য", "For families", "অফিস সময়ে ফোন বা সরাসরি এসে কথা বলা যায়। শিক্ষার্থীর ব্যক্তিগত ফোন, ঠিকানা বা জন্মনিবন্ধন এই সাইটে প্রকাশিত হয় না।", "Families can call or visit during office hours. Student phone numbers, addresses, and birth registration numbers are not published here.", ["অফিস সময়ে যোগাযোগ", "ব্যক্তিগত তথ্য প্রকাশিত হয় না"], ["Contact during office hours", "Personal details stay private"]),
      ],
    },
    mission: {
      leadBn: `${school.name}-এর মিশন নিরাপদ ক্যাম্পাসে শেখানো। ভিশন শৃঙ্খলাবদ্ধ, কৌতূহলী ও দায়িত্বশীল প্রজন্ম।`,
      leadEn: `The mission of ${school.name} is teaching on a safe campus. The vision is a disciplined, curious, and responsible generation.`,
      summaryBn: "মিশন, ভিশন এবং দৈনন্দিন অভ্যাস।",
      summaryEn: "Mission, vision, and the daily habits.",
      sections: [
        section("মিশন", "Mission", "প্রতিটি শ্রেণিতে শিক্ষক উপস্থিত থাকেন। পড়া, লেখা ও প্রশ্ন করার সুযোগ সবার জন্য সমান।", "A teacher is present in every class. Reading, writing, and asking questions are open to every student.", ["উপস্থিত শিক্ষক", "সমান সুযোগ"], ["A teacher present", "An equal chance"]),
        section("ভিশন", "Vision", "শিক্ষার্থী সময়মতো আসুক, বই পড়ুক, এবং সহপাঠীর সঙ্গে সম্মান করে কথা বলুক।", "Students arrive on time, read, and speak to classmates with respect.", ["সময়মতো আসা", "পড়ার অভ্যাস", "সম্মান"], ["Arrival on time", "A habit of reading", "Respect"]),
        section("অভিভাবক যা দেখেন", "What families see", "নোটিশ, রুটিন ও প্রকাশিত ফলাফল এই সাইটে। ফি অনলাইনে কাটা হয় না। রসিদ অফিস থেকে।", "Notices, the routine, and published results are on this site. Fees are not charged online. Receipts come from the office.", ["নোটিশ", "রুটিন", "প্রকাশিত ফলাফল", "ফি অফিসে"], ["Notices", "Routine", "Published results", "Fees at the office"]),
      ],
    },
    principal: {
      leadBn: `প্রিয় অভিভাবক ও শিক্ষার্থী, ${school.name}-এ আপনাদের স্বাগত। পড়াশোনা, চরিত্র ও সহশিক্ষা — তিনটিই আমাদের দৈনন্দিন কাজ।`,
      leadEn: `Dear families and students, welcome to ${school.name}. Study, character, and activities beyond class are our daily work.`,
      summaryBn: "প্রধান শিক্ষকের বাণী ও অফিস সময়।",
      summaryEn: "The principal's message and office hours.",
      sections: [
        section("বাণী", "Message", "আমি চাই শিক্ষার্থী ক্লাসে মন দিয়ে বসুক। দেরি হলে অফিসে কারণ জানানো হয়। প্রশ্ন অফিস সময়ে স্বাগত।", "I want students seated in class with attention. A late arrival is explained at the office. Questions are welcome during office hours.", ["মনোযোগ", "দেরির কারণ", "অফিস সময়ে প্রশ্ন"], ["Attention", "A reason for lateness", "Questions in office hours"]),
        section("যা আমরা দেখি", "What we look for", "উপস্থিতি, খাতা ও সহপাঠীর সঙ্গে আচরণ। পরীক্ষার ফল প্রকাশের পর আইডি দিয়ে দেখা যায়।", "Attendance, exercise books, and how students treat classmates. After a result is published, it can be seen with an ID.", ["উপস্থিতি", "খাতা", "প্রকাশিত ফল"], ["Attendance", "Exercise books", "Published results"]),
        section("যোগাযোগ", "Contact", `ক্যাম্পাস ${place}। ${eiin}। ফোন ও সময় যোগাযোগ পাতায়।`, `The campus is at ${place}. ${school.eiin ? `EIIN ${school.eiin}.` : ""} Phone and hours are on the contact page.`, ["যোগাযোগ পাতা", "অফিস সময়"], ["Contact page", "Office hours"]),
      ],
    },
    facilities: {
      leadBn: `${school.name}-এ যে সুবিধা চালু আছে তা এখানে ও গ্যালারিতে। যা নেই তা লেখা হয় না।`,
      leadEn: `What ${school.name} actually uses is listed here and in the gallery. We do not list rooms the campus does not have.`,
      summaryBn: "শ্রেণিকক্ষ, পাঠাগার, মাঠ ও নিরাপদ প্রবেশ।",
      summaryEn: "Classrooms, library, field, and a safe entrance.",
      sections: [
        section("শ্রেণিকক্ষ", "Classrooms", "ক্লাস রুটিন অনুযায়ী বসে। প্রতিটি শ্রেণির বিষয় একাডেমিক পাতায়।", "Classes sit according to the routine. Subjects for each class are on the academic page.", ["রুটিন অনুযায়ী ক্লাস", "বিষয়ের তালিকা"], ["Classes by the routine", "The subject list"]),
        section("পাঠাগার", "Library", "বই ও কার্ড গ্রন্থাগারিক দেখেন। পড়ার আসর হলে নোটিশে তারিখ থাকে।", "The librarian looks after books and cards. A reading hour, when held, is dated in a notice.", ["বই", "কার্ড", "পড়ার আসর"], ["Books", "Cards", "Reading hour"]),
        section("মাঠ ও প্রবেশ", "Field and entrance", "খেলা মাঠে হয়। প্রবেশের সময় অফিস জানে। নতুন কক্ষ যোগ হলে এই পাতা ও গ্যালারি একসঙ্গে বদলায়।", "Games are on the field. The office knows the entrance hours. A new room is added here and in the gallery together.", ["খেলার মাঠ", "নিরাপদ প্রবেশ"], ["Playing field", "A safe entrance"]),
      ],
    },
    achievements: {
      leadBn: "এই তালিকায় শুধু যাচাই করা ফল থাকে। ভুয়া সংখ্যা রাখা হয় না।",
      leadEn: "Only checked results go on this list. Invented numbers are not kept.",
      summaryBn: "পরীক্ষা, ক্রীড়া ও সাংস্কৃতিক পুরস্কার।",
      summaryEn: "Exam, sports, and cultural prizes.",
      sections: [
        section("পরীক্ষা", "Exams", `${year} শিক্ষাবর্ষের প্রকাশিত ফল ফলাফল পাতায়, শিক্ষার্থী আইডি দিয়ে। এখানে শুধু যাচাই করা সাফল্যের নাম।`, `Published results for ${year} are on the results page, with a student ID. This page names only checked successes.`, ["প্রকাশিত ফল", "আইডি দিয়ে দেখা"], ["Published results", "Seen with an ID"]),
        section("ক্রীড়া", "Sports", "বার্ষিক ক্রীড়া ও দলগত খেলার পুরস্কার আলাদা। তারিখ অনুষ্ঠান সেকশনে।", "Prizes from the annual sports day and team games are listed apart. Dates sit with the programmes.", ["বার্ষিক ক্রীড়া", "দলগত খেলা"], ["Annual sports", "Team games"]),
        section("সংস্কৃতি", "Culture", "সাংস্কৃতিক অনুষ্ঠানের পুরস্কার গ্যালারির অ্যালবামেও থাকে। নতুন নাম স্টাফ এই পাতায় যোগ করেন।", "Cultural prizes also appear in a gallery album. Staff add new names on this page.", ["সাংস্কৃতিক পুরস্কার", "গ্যালারি"], ["Cultural prizes", "Gallery"]),
      ],
    },
    "admission-info": {
      leadBn: `${year} শিক্ষাবর্ষের ভর্তি নোটিশের পর এক পাতায় আবেদন করা যায়। জমা মানে সিট নিশ্চিত নয়।`,
      leadEn: `After the ${year} admission notice, families apply on one page. Submitting does not confirm a seat.`,
      summaryBn: "নোটিশ, এক পাতার আবেদন, অফিসে ফি।",
      summaryEn: "The notice, a one-page form, and the fee at the office.",
      sections: [
        section("কখন আবেদন", "When to apply", "নোটিশ প্রকাশের আগে ফর্ম বন্ধ থাকতে পারে। আসন পূর্ণ হলে আবেদন বন্ধ হয়। চূড়ান্ত তারিখ নোটিশে।", "The form can stay closed before the notice. Applications close when seats are full. The final date is in the notice.", ["নোটিশ আগে", "আসন পূর্ণ হলে বন্ধ"], ["Notice first", "Closed when seats are full"]),
        section("এক পাতার ফর্ম", "One-page form", "নাম, লিঙ্গ, ক্লাস, অভিভাবক, ফোন, জেলা ও উপজেলা একসাথে। আলাদা ধাপ নেই। স্কুল কাগজ দেখে জানায়।", "Name, gender, class, guardian, phone, district, and upazila sit together. There is no second step. The school replies after it checks the papers.", ["সব ঘর এক পাতায়", "যাচাইয়ের পর জবাব"], ["Every field on one page", "A reply after checking"]),
        section("ফি", "Fee", "এই সাইটে টাকা কাটা হয় না। ভর্তি ফি অফিসে — নগদ, বিকাশ, নগদ, রকেট, ব্যাংক বা চেক। রসিদ অফিস থেকে নিন।", "This site does not take payment. Pay the admission fee at the office by cash, bKash, Nagad, Rocket, bank, or cheque, and collect the receipt there.", ["অফিসে জমা", "রসিদ বাধ্যতামূলক", "অনলাইনে কাটা হয় না"], ["Pay at the office", "A receipt is required", "Not charged online"]),
      ],
    },
    eligibility: {
      leadBn: "আসন ও বয়সসীমা সেই বছরের ভর্তি নোটিশে চূড়ান্ত। এই পাতায় উদ্ভাবিত সংখ্যা রাখা হয় না।",
      leadEn: "Seats and age range are final in that year's admission notice. This page does not invent numbers.",
      summaryBn: "শ্রেণি, আসন ও বয়স — নোটিশই চূড়ান্ত।",
      summaryEn: "Class, seats, and age — the notice is final.",
      sections: [
        section("শ্রেণি", "Classes", `${school.name}-এর চলতি শ্রেণি একাডেমিক পাতায়। ${year} শিক্ষাবর্ষে যে শ্রেণি খোলা, ভর্তি নোটিশে তা লেখা থাকে।`, `Current classes at ${school.name} are on the academic page. The ${year} notice says which classes are open.`, ["একাডেমিক তালিকা", "নোটিশে খোলা শ্রেণি"], ["The academic list", "Open classes in the notice"]),
        section("আসন", "Seats", "প্রতি শ্রেণির আসন অফিস ঠিক করে। পূর্ণ হলে নতুন আবেদন নেওয়া বন্ধ হতে পারে। সংখ্যা নোটিশ ও অফিসে।", "The office sets seats for each class. New applications can stop when a class is full. The number is in the notice and at the office.", ["অফিস ঠিক করে", "পূর্ণ হলে বন্ধ"], ["Set by the office", "Closed when full"]),
        section("বয়স", "Age", "বয়সসীমা শ্রেণি অনুযায়ী নোটিশে। জন্মনিবন্ধন কাগজের তালিকায়।", "The age range for each class is in the notice. A birth certificate is on the document list.", ["নোটিশে বয়স", "জন্মনিবন্ধন"], ["Age in the notice", "Birth certificate"]),
      ],
    },
    documents: {
      leadBn: "আবেদনের সময় যে কাগজ লাগে তার তালিকা এখানে। চূড়ান্ত তালিকা ভর্তি নোটিশ মেনে চলুন।",
      leadEn: "This is the usual set of papers. Follow the admission notice if the final list differs.",
      summaryBn: "জন্মনিবন্ধন, ছাড়পত্র, ছবি ও পরিচয়পত্র।",
      summaryEn: "Birth certificate, release letter, photos, and an identity card.",
      sections: [
        section("শিক্ষার্থীর কাগজ", "The student's papers", "জন্মনিবন্ধন বা তার সত্যায়িত কপি, পাসপোর্ট সাইজের ছবি, এবং আগের স্কুল থাকলে ছাড়পত্র।", "A birth certificate or a certified copy, passport-size photos, and a release letter if there was a previous school.", ["জন্মনিবন্ধন", "ছবি", "ছাড়পত্র"], ["Birth certificate", "Photos", "Release letter"]),
        section("অভিভাবকের কাগজ", "The guardian's papers", "জাতীয় পরিচয়পত্রের কপি। ফর্মে অভিভাবকের নাম ও ফোন থাকে। মূল কপি দেখতে চাইলে ভর্তি শাখা জানাবে।", "A copy of the national identity card. The form asks for the guardian's name and phone. The admission desk will say if they need an original.", ["পরিচয়পত্র", "নাম ও ফোন"], ["Identity card", "Name and phone"]),
        section("যেভাবে জমা", "How to hand them in", "কপি স্পষ্ট হতে হবে। অনলাইন ফর্মে কাগজ আপলোড হয় না — কাগজ অফিসে। আবেদন জমা ও কাগজ জমা আলাদা।", "Copies should be clear. The online form does not upload files. Papers are handed in at the office. The form and the papers are two steps.", ["স্পষ্ট কপি", "কাগজ অফিসে"], ["Clear copies", "Papers at the office"]),
      ],
    },
    "fees-info": {
      leadBn: "ভর্তি ফি, সেশন ফি ও মাসিক বেতন স্কুল অফিসে। এই ওয়েবসাইটে পেমেন্ট গেটওয়ে নেই। চলতি হার অফিস জানায়।",
      leadEn: "Admission, session, and monthly fees are paid at the school office. This website has no payment gateway. The office states the current rates.",
      summaryBn: "ফি অফিসে। অনলাইনে কাটা হয় না।",
      summaryEn: "Fees at the office. Not charged on this site.",
      sections: [
        section("কী কী ফি", "Which fees", "ভর্তির সময় একবার, সেশন শুরুতে, এবং মাসিক বেতন। অঙ্ক এই পাতায় বসানো হয় না, যতক্ষণ অফিস নিশ্চিত না করে।", "Once at admission, once at the start of the session, and a monthly fee. Amounts are not printed here until the office confirms them.", ["ভর্তি ফি", "সেশন ফি", "মাসিক বেতন"], ["Admission fee", "Session fee", "Monthly fee"]),
        section("যেভাবে জমা", "How to pay", "নগদ, বিকাশ, নগদ, রকেট, ব্যাংক বা চেক — যে মাধ্যম অফিস খোলা রাখে। প্রতিটি জমায় রসিদ নিন।", "Cash, bKash, Nagad, Rocket, bank, or cheque, whichever the office accepts. Take a receipt for every payment.", ["ছয়টি মাধ্যম", "রসিদ"], ["Six methods", "A receipt"]),
        section("রসিদ", "Receipt", "রসিদ ছাড়া জমা ধরা হয় না। হিসাব শাখা রসিদ দেয়। প্রশ্ন থাকলে অফিস সময়ে হিসাব শাখায় যান।", "A payment without a receipt is not recorded. The accounts desk issues the receipt. Questions go to accounts during office hours.", ["রসিদ বাধ্যতামূলক", "হিসাব শাখা"], ["A receipt is required", "Accounts desk"]),
      ],
    },
    "academic-info": {
      leadBn: `${year} শিক্ষাবর্ষের শ্রেণি ও বিষয় একাডেমিক তালিকা থেকে আসে। ছুটি, ক্লাসের সময় ও পরীক্ষার ধরন এখানে।`,
      leadEn: `Classes and subjects for ${year} come from the academic list. Holidays, class hours, and how exams work are written here.`,
      summaryBn: "শ্রেণি, সময়, ছুটি ও পরীক্ষা।",
      summaryEn: "Classes, hours, holidays, and exams.",
      sections: [
        section("শ্রেণি ও বিষয়", "Classes and subjects", "প্রাক-প্রাথমিক থেকে মাধ্যমিক পর্যন্ত শ্রেণি ক্লাস পাতায়, বিষয়সহ। নতুন বিষয় যোগ হলে সেই কার্ডে দেখা যাবে।", "Classes from early years through secondary are on the classes page, with subjects. A new subject shows on that card.", ["স্তর অনুযায়ী শ্রেণি", "বিষয় কার্ডে"], ["Classes by stage", "Subjects on the card"]),
        section("দিন ও সময়", "Days and hours", "সাপ্তাহিক ছুটি ও ক্লাসের সময় অফিস ঠিক করে। রুটিন দেখতে ক্লাস ও শাখা বেছে নিন।", "The office sets the weekly holiday and class hours. Pick a class and section to see the routine.", ["সাপ্তাহিক ছুটি", "ক্লাস ও শাখা"], ["Weekly holiday", "Class and section"]),
        section("মূল্যায়ন", "Assessment", "পরীক্ষার তারিখ নোটিশ ও ক্যালেন্ডারে। প্রকাশিত ফল শিক্ষার্থী আইডি দিয়ে। অপ্রকাশিত নম্বর এই সাইটে আসে না।", "Exam dates are on notices and the calendar. A published result needs a student ID. Unpublished marks do not appear here.", ["নোটিশে তারিখ", "প্রকাশিত ফল"], ["Dates by notice", "Published results"]),
      ],
    },
    calendar: {
      leadBn: `${year} শিক্ষাবর্ষের ছুটি, জাতীয় দিবস ও পরীক্ষার সম্ভাব্য সপ্তাহ। তারিখ বদলালে আগে নোটিশ।`,
      leadEn: `Holidays, national days, and likely exam weeks for ${year}. If a date changes, a notice comes first.`,
      summaryBn: "ছুটি, জাতীয় দিবস ও পরীক্ষার সপ্তাহ।",
      summaryEn: "Holidays, national days, and exam weeks.",
      sections: [
        section("জাতীয় দিবস", "National days", "স্বাধীনতা দিবস, বিজয় দিবস, শহীদ দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস স্কুল পালন করে। সমাবেশের সময় নোটিশে।", "The school marks Independence Day, Victory Day, Martyrs' Day, and International Mother Language Day. Assembly time is in a notice.", ["স্বাধীনতা দিবস", "বিজয় দিবস", "শহীদ দিবস", "মাতৃভাষা দিবস"], ["Independence Day", "Victory Day", "Martyrs' Day", "Mother Language Day"]),
        section("ছুটি", "Holidays", "সাপ্তাহিক ছুটি, ঈদ ও পূজার ছুটি সরকারি সিদ্ধান্ত ও স্কুলের নোটিশ মেনে চলে। এই পাতায় নির্দিষ্ট তারিখ বসানো হয় না, যতক্ষণ নোটিশ না আসে।", "The weekly holiday and Eid or puja breaks follow the government decision and the school notice. Exact dates are not printed here until a notice exists.", ["সাপ্তাহিক ছুটি", "ঈদ ও পূজা নোটিশে"], ["Weekly holiday", "Eid and puja by notice"]),
        section("পরীক্ষা", "Exams", "অর্ধবার্ষিক ও বার্ষিক পরীক্ষার সপ্তাহ ক্যালেন্ডারে রাখা হয়। দিন ও কক্ষ নোটিশে চূড়ান্ত।", "Half-yearly and annual exam weeks are kept on the calendar. The day and room are final in a notice.", ["অর্ধবার্ষিক", "বার্ষিক", "কক্ষ নোটিশে"], ["Half-yearly", "Annual", "Room in the notice"]),
      ],
    },
    cocurricular: {
      leadBn: "খেলা, বিতর্ক, স্কাউট ও সাংস্কৃতিক চর্চা ক্লাসের বাইরে। উপস্থিতির নিয়ম একই।",
      leadEn: "Sports, debate, scouts, and culture sit outside class, with the same attendance rules.",
      summaryBn: "খেলা, বিতর্ক, স্কাউট ও সংস্কৃতি।",
      summaryEn: "Sports, debate, scouts, and culture.",
      sections: [
        section("খেলা", "Sports", "দৌড়, দলগত খেলা ও বার্ষিক ক্রীড়া মাঠে। তারিখ অনুষ্ঠান সেকশনে প্রকাশিত হয়।", "Races, team games, and the annual sports day are on the field. Dates are published with the programmes.", ["মাঠ", "বার্ষিক ক্রীড়া"], ["The field", "Annual sports"]),
        section("বিতর্ক ও ক্লাব", "Debate and clubs", "বিতর্ক, বিজ্ঞান ও সাংস্কৃতিক ক্লাবে যোগ দিতে শ্রেণি শিক্ষকের অনুমতি লাগে। সময় রুটিনের বাইরে।", "Debate, science, and cultural clubs need the class teacher's permission. Meetings sit outside the routine.", ["অনুমতি লাগে", "রুটিনের বাইরে"], ["Permission is required", "Outside the routine"]),
        section("স্কাউট", "Scouts", "স্কাউট ও গার্লস গাইড সমাবেশ সকালের সমাবেশে হতে পারে। ইউনিফর্ম শ্রেণি শিক্ষক জানান।", "Scout and guide assemblies can sit with the morning gathering. Class teachers share the uniform.", ["সকালের সমাবেশ", "ইউনিফর্ম"], ["Morning assembly", "Uniform"]),
      ],
    },
    "student-life": {
      leadBn: "বর্তমান শিক্ষার্থী রুটিন, নোটিশ ও প্রকাশিত ফলাফল এই সাইটে দেখেন। ব্যক্তিগত তথ্য প্রকাশিত হয় না।",
      leadEn: "Current students read the routine, notices, and published results here. Personal details are not published.",
      summaryBn: "ইউনিফর্ম, রুটিন, ফলাফল ও গোপনীয়তা।",
      summaryEn: "Uniform, routine, results, and privacy.",
      sections: [
        section("দিনের ছন্দ", "The day", "ইউনিফর্ম ও ক্লাসের সময় রুটিন অনুসারে। দেরি হলে অফিসে কারণ জানাতে হয়। ক্লাসে মোবাইল বন্ধ।", "Uniform and class time follow the routine. A late arrival is explained at the office. Phones stay off in class.", ["ইউনিফর্ম", "সময়মতো আসা", "মোবাইল বন্ধ"], ["Uniform", "Arrival on time", "Phones off"]),
        section("ফলাফল", "Results", "প্রকাশিত পরীক্ষার ফল দেখতে শিক্ষার্থী আইডি লাগে। মার্কশিট সেই পাতা থেকে ছাপা যায়।", "A published result needs the student ID. The marksheet can be printed from that page.", ["আইডি", "মার্কশিট"], ["ID", "Marksheet"]),
        section("গোপনীয়তা", "Privacy", "ফোন, বাড়ির ঠিকানা, জন্মনিবন্ধন ও স্বাস্থ্য নোট এই সাইটে আসে না। ক্লাসের খবর নোটিশ বোর্ডে।", "Phone numbers, home addresses, birth registration numbers, and health notes do not appear here. Class news is on the notice board.", ["ফোন প্রকাশিত হয় না", "নোটিশে ক্লাসের খবর"], ["Phones stay private", "Class news by notice"]),
      ],
    },
    future: {
      leadBn: `নতুন শিক্ষার্থী ${year} ভর্তি তথ্য পড়ে এক পাতায় আবেদন করবেন। ক্যাম্পাস দেখতে যোগাযোগ পাতায় ফোন ও ম্যাপ।`,
      leadEn: `New students should read the ${year} admission notes and apply on one page. The contact page has the phone and map.`,
      summaryBn: "গ্যালারি, ভর্তি তথ্য, এক পাতার আবেদন।",
      summaryEn: "Gallery, admission notes, and a one-page form.",
      sections: [
        section("আগে দেখুন", "Look first", "গ্যালারিতে ক্যাম্পাস, সুবিধা পাতায় যা আছে, এবং শ্রেণির তালিকা। তারপর ভর্তি তথ্য।", "See the campus in the gallery, what the facilities page lists, and the class list. Then read the admission notes.", ["গ্যালারি", "সুবিধা", "শ্রেণি"], ["Gallery", "Facilities", "Classes"]),
        section("আবেদন", "Application", "এক পাতায় নাম, ক্লাস, অভিভাবক ও ঠিকানা। জমা মানে সিট নিশ্চিত নয়। কাগজ অফিসে।", "One page asks for the name, class, guardian, and address. Submitting does not confirm a seat. Papers go to the office.", ["এক পাতা", "সিট যাচাইয়ের পর"], ["One page", "A seat after checking"]),
        section("পরিদর্শন", "A visit", `ক্যাম্পাস ${place}। অফিস সময়ে আসুন। ফোন যোগাযোগ পাতায়।`, `The campus is at ${place}. Come during office hours. The phone is on the contact page.`, ["অফিস সময়", "ম্যাপ"], ["Office hours", "Map"]),
      ],
    },
    council: {
      leadBn: "স্টুডেন্ট কাউন্সিল শ্রেণির কথা শিক্ষক ও অফিসের কাছে তোলে। নাম বদলালে এই পাতা আপডেট হয়।",
      leadEn: "The student council takes class concerns to teachers and the office. This page is updated when the names change.",
      summaryBn: "প্রতিনিধি, বৈঠক ও দায়িত্ব।",
      summaryEn: "Representatives, meetings, and duties.",
      sections: [
        section("কাজ", "Work", "শ্রেণির সমস্যা, অনুষ্ঠানের সাহায্য ও সহপাঠীর কথা কাউন্সিল তোলে। সিদ্ধান্ত শিক্ষক ও অফিস নেয়।", "The council raises class problems, help for programmes, and what classmates ask. Teachers and the office decide.", ["শ্রেণির কথা", "অনুষ্ঠান", "শিক্ষকের সিদ্ধান্ত"], ["Class concerns", "Programmes", "Teachers decide"]),
        section("সদস্য", "Members", "প্রতিনিধি শ্রেণি থেকে আসে। নাম ও ছবি স্টাফ এই পাতা ও গ্যালারিতে রাখেন। ব্যক্তিগত ফোন থাকে না।", "Representatives come from classes. Staff keep names and photos here and in the gallery. Personal phone numbers are not shown.", ["শ্রেণি প্রতিনিধি", "ফোন নেই"], ["Class representatives", "No phone numbers"]),
        section("বৈঠক", "Meetings", "বৈঠক রুটিনের বাইরে। তারিখ নোটিশে। বছরে অন্তত একবার সদস্য বদলের কথা জানানো হয়।", "Meetings sit outside the routine. The date is a notice. A change of members is announced at least once a year.", ["রুটিনের বাইরে", "নোটিশে তারিখ"], ["Outside the routine", "Date by notice"]),
      ],
    },
    clubs: {
      leadBn: "বিজ্ঞান, বিতর্ক, খেলা ও সাংস্কৃতিক ক্লাব চালু থাকলে এখানে লেখা থাকে। যোগ দিতে শ্রেণি শিক্ষকের অনুমতি লাগে।",
      leadEn: "Science, debate, sports, and cultural clubs are listed here when they are open. Joining needs the class teacher's permission.",
      summaryBn: "বিজ্ঞান, বিতর্ক, খেলা ও সংস্কৃতি।",
      summaryEn: "Science, debate, sports, and culture.",
      sections: [
        section("যে ক্লাব", "Which clubs", "বিজ্ঞান, বিতর্ক, খেলা ও সংস্কৃতি। বন্ধ ক্লাবের নাম রাখা হয় না।", "Science, debate, sports, and culture. A closed club is not listed.", ["বিজ্ঞান", "বিতর্ক", "খেলা", "সংস্কৃতি"], ["Science", "Debate", "Sports", "Culture"]),
        section("যোগ দেওয়া", "Joining", "শ্রেণি শিক্ষকের অনুমতি লাগে। সময় রুটিনের বাইরে, যাতে পড়াশোনা বাধা না পায়।", "The class teacher must agree. The time sits outside the routine so lessons are not interrupted.", ["অনুমতি", "রুটিনের বাইরে"], ["Permission", "Outside the routine"]),
        section("আসর", "Meetings", "আসন্ন আসর অনুষ্ঠান সেকশনে। ছবি থাকলে গ্যালারিতে আলাদা অ্যালবাম।", "Coming meetings are published with the programmes. Photos, if any, go in a gallery album.", ["অনুষ্ঠান সেকশন", "গ্যালারি"], ["Programmes", "Gallery"]),
      ],
    },
    rules: {
      leadBn: "উপস্থিতি, ইউনিফর্ম ও ক্লাসে মোবাইল বন্ধ — এই তিনটি নিয়ম প্রতিদিন। দীর্ঘ নীতিমালা পিডিএফ থাকলে ডাউনলোডে।",
      leadEn: "Attendance, uniform, and phones off in class are the three daily rules. A longer policy PDF, when there is one, sits in downloads.",
      summaryBn: "উপস্থিতি, পোশাক, মোবাইল ও দেরি।",
      summaryEn: "Attendance, dress, phones, and lateness.",
      sections: [
        section("উপস্থিতি", "Attendance", "ক্লাস শুরুর আগে আসতে হয়। না এলে অভিভাবককে অফিস জানাতে পারে। দীর্ঘ অনুপস্থিতিতে ছুটির চিঠি লাগে।", "Students arrive before class starts. The office may tell the family about an absence. A long absence needs a leave note.", ["সময়মতো", "অনুপস্থিতি", "ছুটির চিঠি"], ["On time", "Absence", "A leave note"]),
        section("পোশাক ও মোবাইল", "Dress and phones", "ইউনিফর্ম রুটিনের দিনে। ক্লাসে মোবাইল বন্ধ ও ব্যাগে। পরীক্ষার হলে মোবাইল নিষেধ।", "Uniform on routine days. Phones stay off and in the bag during class. Phones are forbidden in an exam hall.", ["ইউনিফর্ম", "ক্লাসে বন্ধ", "পরীক্ষায় নিষেধ"], ["Uniform", "Off in class", "Forbidden in exams"]),
        section("আচরণ", "Conduct", "সহপাঠী ও শিক্ষকের সঙ্গে সম্মান। মারামারি বা খামখেয়ালি অফিসের বিষয়। অভিভাবককে ডাকা হতে পারে।", "Respect for classmates and teachers. A fight or serious misconduct is an office matter. A family may be called.", ["সম্মান", "অফিসের বিষয়"], ["Respect", "An office matter"]),
      ],
    },
  };
  return pages[slug] ?? null;
}

const FAMILY_NOTE: Record<string, { bn: string; en: string }> = {
  history: { bn: "প্রতিষ্ঠার কথা, ক্যাম্পাস ও শিক্ষাবর্ষের ধারা এই পাতায়। নতুন কক্ষ বা তারিখ এলে স্টাফ লেখা বদলান।", en: "Founding, campus, and the shape of the year are on this page. Staff rewrite it when a room or a date changes." },
  mission: { bn: "মিশন ও ভিশন দৈনন্দিন অভ্যাসে দেখা যায়: সময়মতো আসা, পড়া, এবং সহপাঠীর প্রতি সম্মান।", en: "The mission and vision show up as daily habits: arriving on time, reading, and respect for classmates." },
  principal: { bn: "প্রধান শিক্ষকের বাণী ও অফিস সময় এখানে। ব্যক্তিগত প্রশ্ন অফিস সময়ে, ফোন যোগাযোগ পাতায়।", en: "The principal's message and office hours are here. A private question waits for office hours. The phone is on the contact page." },
  facilities: { bn: "যে ঘর ও মাঠ চালু আছে তা এখানে ও গ্যালারিতে। যা নেই তা লেখা হয় না।", en: "Rooms and the field that are in use appear here and in the gallery. What the campus does not have is not listed." },
  achievements: { bn: "শুধু যাচাই করা নাম। সংখ্যা বা পুরস্কার অফিস না মিলিয়ে বসানো হয় না।", en: "Only checked names. A number or a prize is not added until the office confirms it." },
  "admission-info": { bn: "নোটিশ, এক পাতার আবেদন, তারপর স্কুলের অনুমোদন। জমা মানে ভর্তি নয়। ফি অফিসে।", en: "The notice, one form, then the school's approval. Submitting is not admission. The fee is paid at the office." },
  eligibility: { bn: "আসন ও বয়স সেই বছরের নোটিশে চূড়ান্ত। এই পাতায় উদ্ভাবিত সংখ্যা নেই।", en: "Seats and age are final in that year's notice. This page does not invent numbers." },
  documents: { bn: "কাগজের তালিকা পড়ে কপি অফিসে জমা দিন। অনলাইন ফর্মে ফাইল তোলা হয় না।", en: "Read the paper list and hand copies in at the office. The online form does not take file uploads." },
  "fees-info": { bn: "ভর্তি, সেশন ও মাসিক ফি অফিসে। রসিদ ছাড়া জমা ধরা হয় না। অঙ্ক অফিস জানায়।", en: "Admission, session, and monthly fees are paid at the office. A payment without a receipt is not recorded. The office states the amount." },
  "academic-info": { bn: "শ্রেণি, বিষয়, ছুটি ও পরীক্ষার ধরন এখানে। রুটিন ও সিলেবাস আলাদা পাতায়, ক্লাস বেছে।", en: "Classes, subjects, holidays, and how exams work are here. The routine and syllabus are separate pages, after a class is chosen." },
  calendar: { bn: "জাতীয় দিবস, ছুটি ও পরীক্ষার সপ্তাহ। নির্দিষ্ট তারিখ নোটিশ না আসা পর্যন্ত পাতায় বসে না।", en: "National days, holidays, and exam weeks. An exact date is not printed until a notice exists." },
  cocurricular: { bn: "খেলা, বিতর্ক, স্কাউট ও সংস্কৃতি ক্লাসের বাইরে। তারিখ অনুষ্ঠান বা নোটিশে।", en: "Sports, debate, scouts, and culture sit outside class. Dates are with the programmes or in a notice." },
  "student-life": { bn: "ইউনিফর্ম, রুটিন ও প্রকাশিত ফল। শিক্ষার্থীর ফোন, ঠিকানা বা জন্মনিবন্ধন এই সাইটে আসে না।", en: "Uniform, the routine, and published results. A student's phone, address, or birth registration number is not on this site." },
  future: { bn: "গ্যালারি ও ভর্তি তথ্য পড়ে এক পাতায় আবেদন। ক্যাম্পাস দেখতে অফিস সময়ে আসুন।", en: "Read the gallery and the admission notes, then apply on one page. Visit the campus during office hours." },
  council: { bn: "কাউন্সিল শ্রেণির কথা তোলে। সিদ্ধান্ত শিক্ষক ও অফিসের। সদস্যের ব্যক্তিগত ফোন থাকে না।", en: "The council raises class concerns. Teachers and the office decide. Members' personal phone numbers are not shown." },
  clubs: { bn: "যে ক্লাব চালু আছে তা এখানে। যোগ দিতে শ্রেণি শিক্ষকের অনুমতি লাগে। সময় রুটিনের বাইরে।", en: "Open clubs are listed here. Joining needs the class teacher's permission. Meetings sit outside the routine." },
  rules: { bn: "উপস্থিতি, ইউনিফর্ম ও ক্লাসে মোবাইল বন্ধ। দীর্ঘ নীতিমালা পিডিএফ থাকলে ডাউনলোডে।", en: "Attendance, uniform, and phones off in class. A longer policy PDF, when there is one, sits in downloads." },
};

export function extraSections(slug: string, school: SchoolBits): PageSection[] {
  const note = FAMILY_NOTE[slug];
  if (!note) return [];
  const place = school.address || "স্কুল অফিস";
  return [
    section(
      "অফিস যা করে",
      "What the office does",
      `${school.name}-এর অফিস ${place}-এ। ${school.year} শিক্ষাবর্ষের রুটিন, সিলেবাস ও নোটিশ স্টাফ এখান থেকে প্রকাশ করেন। ফির অঙ্ক, আসন সংখ্যা বা অপ্রকাশিত ফল অফিস না জানানো পর্যন্ত পাতায় বসে না।`,
      `The office of ${school.name} is at ${place}. Staff publish the ${school.year} routine, syllabus, and notices from here. Fee amounts, seat counts, and unpublished results stay off the page until the office states them.`,
      ["অফিস সময়ে যোগাযোগ", "নোটিশ আগে", "ফি অফিসে"],
      ["Contact in office hours", "A notice first", "Fees at the office"],
    ),
    section(
      "এই পাতায় আরও",
      "More on this page",
      note.bn,
      note.en,
      ["লেখা স্টাফ সম্পাদনা করেন", "প্রথম অনুচ্ছেদ স্কুলের নিজের"],
      ["Staff edit the text", "The opening paragraph belongs to the school"],
    ),
  ];
}
