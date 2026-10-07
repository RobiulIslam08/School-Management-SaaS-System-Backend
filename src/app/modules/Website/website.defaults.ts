export interface MenuChild {
  key: string;
  href: string;
  labelBn: string;
  labelEn: string;
  visible: boolean;
}

export interface MenuItem {
  key: string;
  href: string;
  labelBn: string;
  labelEn: string;
  visible: boolean;
  locked?: boolean;
  children: MenuChild[];
}

export function defaultMenus(): MenuItem[] {
  return [
    { key: "home", href: "/", labelBn: "হোম", labelEn: "Home", visible: true, locked: true, children: [] },
    {
      key: "about",
      href: "/about",
      labelBn: "আমাদের সম্পর্কে",
      labelEn: "About",
      visible: true,
      children: [
        { key: "history", href: "/about/history", labelBn: "ইতিহাস", labelEn: "History", visible: true },
        { key: "mission", href: "/about/mission", labelBn: "মিশন ও ভিশন", labelEn: "Mission and vision", visible: true },
        { key: "principal", href: "/about/principal", labelBn: "প্রধান শিক্ষকের বাণী", labelEn: "Principal's message", visible: true },
        { key: "facilities", href: "/about/facilities", labelBn: "সুবিধা", labelEn: "Facilities", visible: true },
        { key: "achievements", href: "/about/achievements", labelBn: "কৃতিত্ব", labelEn: "Achievements", visible: true },
        { key: "gallery", href: "/gallery", labelBn: "গ্যালারি", labelEn: "Gallery", visible: true },
      ],
    },
    {
      key: "admission",
      href: "/admission",
      labelBn: "ভর্তি",
      labelEn: "Admission",
      visible: true,
      children: [
        { key: "admission-info", href: "/admission/admission-info", labelBn: "ভর্তি তথ্য", labelEn: "Admission information", visible: true },
        { key: "eligibility", href: "/admission/eligibility", labelBn: "যোগ্যতা ও আসন", labelEn: "Eligibility and seats", visible: true },
        { key: "documents", href: "/admission/documents", labelBn: "প্রয়োজনীয় কাগজ", labelEn: "Required documents", visible: true },
        { key: "fees-info", href: "/admission/fees-info", labelBn: "ফি তথ্য", labelEn: "Fee information", visible: true },
        { key: "apply", href: "/admission/apply", labelBn: "অনলাইন আবেদন", labelEn: "Online application", visible: true },
      ],
    },
    {
      key: "academic",
      href: "/academic",
      labelBn: "একাডেমিক",
      labelEn: "Academic",
      visible: true,
      children: [
        { key: "academic-info", href: "/academic/academic-info", labelBn: "একাডেমিক তথ্য", labelEn: "Academic information", visible: true },
        { key: "classes", href: "/academic/classes", labelBn: "ক্লাস ও বিষয়", labelEn: "Classes and subjects", visible: true },
        { key: "teachers", href: "/academic/teachers", labelBn: "শিক্ষক", labelEn: "Teachers", visible: true },
        { key: "routine", href: "/academic/routine", labelBn: "রুটিন", labelEn: "Routine", visible: true },
        { key: "syllabus", href: "/academic/syllabus", labelBn: "সিলেবাস", labelEn: "Syllabus", visible: true },
        { key: "calendar", href: "/academic/calendar", labelBn: "একাডেমিক ক্যালেন্ডার", labelEn: "Academic calendar", visible: true },
        { key: "results", href: "/results", labelBn: "ফলাফল ও মার্কশিট", labelEn: "Results and marksheet", visible: true },
        { key: "cocurricular", href: "/academic/cocurricular", labelBn: "সহশিক্ষা", labelEn: "Co-curricular", visible: true },
      ],
    },
    {
      key: "authorities",
      href: "/authorities",
      labelBn: "কর্তৃপক্ষ",
      labelEn: "Authorities",
      visible: true,
      children: [
        { key: "governing", href: "/authorities/governing", labelBn: "পরিচালনা পর্ষদ", labelEn: "Governing body", visible: true },
        { key: "council", href: "/authorities/council", labelBn: "একাডেমিক কাউন্সিল", labelEn: "Academic council", visible: true },
        { key: "syndicate", href: "/authorities/syndicate", labelBn: "সিন্ডিকেট", labelEn: "Syndicate", visible: true },
        { key: "pta", href: "/authorities/pta", labelBn: "অভিভাবক কমিটি", labelEn: "Parent committee", visible: true },
      ],
    },
    {
      key: "office",
      href: "/office",
      labelBn: "অফিস",
      labelEn: "Office",
      visible: true,
      children: [
        { key: "principal", href: "/office/principal", labelBn: "অধ্যক্ষ", labelEn: "Principal", visible: true },
        { key: "vice", href: "/office/vice", labelBn: "সহকারী প্রধান শিক্ষক", labelEn: "Vice principal", visible: true },
        { key: "admission", href: "/office/admission", labelBn: "ভর্তি শাখা", labelEn: "Admission office", visible: true },
        { key: "accounts", href: "/office/accounts", labelBn: "হিসাব শাখা", labelEn: "Accounts", visible: true },
        { key: "librarian", href: "/office/librarian", labelBn: "গ্রন্থাগারিক", labelEn: "Librarian", visible: true },
        { key: "exam", href: "/office/exam", labelBn: "পরীক্ষা নিয়ন্ত্রক", labelEn: "Exam controller", visible: true },
        { key: "clerk", href: "/office/clerk", labelBn: "অফিস সহকারী", labelEn: "Office assistant", visible: true },
      ],
    },
    {
      key: "students",
      href: "/students",
      labelBn: "শিক্ষার্থী",
      labelEn: "Students",
      visible: true,
      children: [
        { key: "student-life", href: "/students/student-life", labelBn: "বর্তমান শিক্ষার্থী", labelEn: "Current students", visible: true },
        { key: "future", href: "/students/future", labelBn: "ভবিষ্যৎ শিক্ষার্থী", labelEn: "Future students", visible: true },
        { key: "council", href: "/students/council", labelBn: "স্টুডেন্ট কাউন্সিল", labelEn: "Student council", visible: true },
        { key: "clubs", href: "/students/clubs", labelBn: "ক্লাব", labelEn: "Clubs", visible: true },
        { key: "rules", href: "/students/rules", labelBn: "নিয়মাবলি", labelEn: "Code of conduct", visible: true },
      ],
    },
    { key: "contact", href: "/contact", labelBn: "যোগাযোগ", labelEn: "Contact", visible: true, locked: true, children: [] },
    { key: "login", href: "/login", labelBn: "লগইন", labelEn: "Login", visible: true, locked: true, children: [] },
  ];
}

interface SeedPage {
  slug: string;
  menuKey: string;
  titleBn: string;
  titleEn: string;
  summaryBn: string;
  summaryEn: string;
  textBn: string;
  textEn: string;
  seoDescriptionBn: string;
  seoDescriptionEn: string;
  sortOrder: number;
}

const PAGES: SeedPage[] = [
  {
    slug: "history",
    menuKey: "about",
    titleBn: "ইতিহাস",
    titleEn: "History",
    summaryBn: "স্কুলের পথচলা ও প্রতিষ্ঠার গল্প।",
    summaryEn: "How the school began and grew.",
    textBn: "এই স্কুল স্থানীয় অভিভাবক ও শিক্ষকদের উদ্যোগে গড়ে উঠেছে। প্রতিষ্ঠার পর থেকে নিয়মিত ক্লাস, পরীক্ষা ও সহশিক্ষা কার্যক্রম চলে আসছে। বিস্তারিত ইতিহাস ড্যাশবোর্ডের ওয়েবসাইট পাতা থেকে সম্পাদনা করুন।",
    textEn: "This school grew from the work of local parents and teachers. Classes, exams, and co-curricular life have continued since it opened. Edit this history from the dashboard Website workspace.",
    seoDescriptionBn: "স্কুলের প্রতিষ্ঠা, পথচলা এবং ক্যাম্পাস গড়ে ওঠার সংক্ষিপ্ত ইতিহাস এখানে পড়ুন।",
    seoDescriptionEn: "Read how the school was founded, who built it, and the years that shaped the campus.",
    sortOrder: 1,
  },
  {
    slug: "mission",
    menuKey: "about",
    titleBn: "মিশন ও ভিশন",
    titleEn: "Mission and vision",
    summaryBn: "আমরা কী প্রতিজ্ঞা করি এবং কোথায় যেতে চাই।",
    summaryEn: "What the school promises and where it is going.",
    textBn: "আমাদের মিশন প্রতিটি শিক্ষার্থীকে নিরাপদ পরিবেশে শেখানো। ভিশন একটি শৃঙ্খলাবদ্ধ, কৌতূহলী ও দায়িত্বশীল প্রজন্ম গড়া। এই লেখা স্কুল নিজের ভাষায় বদলাতে পারবে।",
    textEn: "Our mission is to teach every student in a safe school. Our vision is a disciplined, curious, and responsible generation. Replace this text with the school's own words.",
    seoDescriptionBn: "স্কুলের মিশন, ভিশন এবং শিক্ষার্থীদের জন্য যে প্রতিজ্ঞা রাখা হয়েছে তা এখানে দেখুন।",
    seoDescriptionEn: "See the school's mission, vision, and the promise it makes to every student and family.",
    sortOrder: 2,
  },
  {
    slug: "principal",
    menuKey: "about",
    titleBn: "প্রধান শিক্ষকের বাণী",
    titleEn: "Principal's message",
    summaryBn: "প্রধান শিক্ষকের পূর্ণ বাণী।",
    summaryEn: "A note from the head of the school.",
    textBn: "প্রিয় অভিভাবক ও শিক্ষার্থী, আমাদের ক্যাম্পাসে আপনাদের স্বাগত। পড়াশোনা, চরিত্র ও সহশিক্ষা — তিনটিই আমাদের দৈনন্দিন কাজ। পূর্ণ বাণী ড্যাশবোর্ড থেকে যোগ করুন।",
    textEn: "Dear families and students, welcome to our campus. Study, character, and activities beyond the classroom are our daily work. Add the full message from the dashboard.",
    seoDescriptionBn: "প্রধান শিক্ষকের বাণী পড়ুন। স্কুলের লক্ষ্য, শৃঙ্খলা এবং অভিভাবকদের প্রতি আহ্বান এখানে আছে।",
    seoDescriptionEn: "Read the principal's message about learning, discipline, and what families can expect from the school.",
    sortOrder: 3,
  },
  {
    slug: "facilities",
    menuKey: "about",
    titleBn: "সুবিধা",
    titleEn: "Facilities",
    summaryBn: "ক্লাসরুম, ল্যাব, খেলার মাঠ ও লাইব্রেরি।",
    summaryEn: "Classrooms, labs, field, and library.",
    textBn: "ক্লাসরুম, বিজ্ঞানাগার, পাঠাগার, খেলার মাঠ ও নিরাপদ প্রবেশপথ — যে সুবিধা আছে তা এখানে লিখুন। ছবি গ্যালারিতে দিন, যাতে অভিভাবক ক্যাম্পাস দেখতে পান।",
    textEn: "Describe classrooms, science rooms, the library, the field, and a safe entrance. Add photos in the gallery so families can see the campus.",
    seoDescriptionBn: "ক্লাসরুম, ল্যাব, লাইব্রেরি ও খেলার মাঠসহ স্কুলের সুবিধাসমূহের পরিচিতি দেখুন।",
    seoDescriptionEn: "See the classrooms, labs, library, playground, and other facilities families should know about.",
    sortOrder: 4,
  },
  {
    slug: "achievements",
    menuKey: "about",
    titleBn: "কৃতিত্ব",
    titleEn: "Achievements",
    summaryBn: "পরীক্ষা, খেলা ও সাংস্কৃতিক সাফল্য।",
    summaryEn: "Exam, sports, and cultural success.",
    textBn: "পাবলিক পরীক্ষা, খেলাধুলা ও সাংস্কৃতিক প্রতিযোগিতার সাফল্য এখানে তালিকাভুক্ত করুন। ভুয়া সংখ্যা দেবেন না — যা ঘটেছে শুধু তা লিখুন।",
    textEn: "List public exam results, sports, and cultural prizes that actually happened. Do not invent numbers.",
    seoDescriptionBn: "স্কুলের পরীক্ষা, ক্রীড়া ও সাংস্কৃতিক সাফল্যের তালিকা এখানে প্রকাশ করা হয়।",
    seoDescriptionEn: "A record of the school's exam results, sports prizes, and cultural achievements.",
    sortOrder: 5,
  },
  {
    slug: "admission-info",
    menuKey: "admission",
    titleBn: "ভর্তি তথ্য",
    titleEn: "Admission information",
    summaryBn: "কখন আবেদন খুলবে এবং কীভাবে জমা দেবেন।",
    summaryEn: "When applications open and how to submit them.",
    textBn: "ভর্তি বিজ্ঞপ্তি প্রকাশের পর অনলাইন আবেদন খোলা হয়। শ্রেণি, বয়স ও কাগজপত্র নোটিশ বোর্ডে দেখুন। আবেদন জমা মানে ভর্তি নিশ্চিত নয়। স্কুল যাচাই করে জানাবে।",
    textEn: "Online application opens after the admission notice. Check class, age, and papers on the notice board. Submitting a form does not confirm a seat. The school will verify and reply.",
    seoDescriptionBn: "ভর্তির সময়, আবেদনের নিয়ম এবং সিট নিশ্চিত হওয়ার আগে যা জানা দরকার তা পড়ুন।",
    seoDescriptionEn: "Read when admission opens, how to apply, and what happens before a seat is confirmed.",
    sortOrder: 1,
  },
  {
    slug: "eligibility",
    menuKey: "admission",
    titleBn: "যোগ্যতা ও আসন",
    titleEn: "Eligibility and seats",
    summaryBn: "কোন শ্রেণিতে কত আসন এবং কারা আবেদন করতে পারবেন।",
    summaryEn: "Who may apply, and how many seats each class has.",
    textBn: "প্রতি শ্রেণির আসন সংখ্যা ও বয়সসীমা এখানে লিখুন। আসন পূর্ণ হলে আবেদন বন্ধ থাকতে পারে। বিস্তারিত প্রতিবছরের ভর্তি নোটিশে প্রকাশিত হয়।",
    textEn: "Write the seat count and age range for each class. Applications can close when seats are full. Details are published in that year's admission notice.",
    seoDescriptionBn: "কোন শ্রেণিতে কত আসন আছে এবং আবেদনের যোগ্যতা কী, তা এখানে দেখা যাবে।",
    seoDescriptionEn: "See which classes have open seats and who is eligible to apply this academic year.",
    sortOrder: 2,
  },
  {
    slug: "documents",
    menuKey: "admission",
    titleBn: "প্রয়োজনীয় কাগজ",
    titleEn: "Required documents",
    summaryBn: "আবেদনের সময় যা সাথে রাখতে হবে।",
    summaryEn: "Papers to keep ready with the application.",
    textBn: "জন্মনিবন্ধন, পূর্ববর্তী স্কুলের ছাড়পত্র, ছবি ও অভিভাবকের জাতীয় পরিচয়পত্রের কপি সাধারণত লাগে। চূড়ান্ত তালিকা ভর্তি নোটিশ অনুসরণ করুন।",
    textEn: "Families usually need a birth certificate, a release letter from the previous school, photos, and a copy of the guardian's national ID. Follow the admission notice for the final list.",
    seoDescriptionBn: "ভর্তি আবেদনের জন্য যে কাগজপত্র লাগে তার তালিকা ও সংক্ষিপ্ত নির্দেশনা পড়ুন।",
    seoDescriptionEn: "The papers families should prepare before submitting an admission application.",
    sortOrder: 3,
  },
  {
    slug: "fees-info",
    menuKey: "admission",
    titleBn: "ফি তথ্য",
    titleEn: "Fee information",
    summaryBn: "ভর্তি ও মাসিক ফি সম্পর্কে তথ্য। অনলাইনে টাকা কাটা হয় না।",
    summaryEn: "Admission and monthly fees. The site does not take payment.",
    textBn: "ভর্তি ফি, সেশন ফি ও মাসিক বেতন এখানে স্পষ্ট লিখুন। এই ওয়েবসাইটে পেমেন্ট গেটওয়ে নেই। ফি জমা হয় স্কুল অফিসে — নগদ, বিকাশ, নগদ, রকেট, ব্যাংক বা চেক।",
    textEn: "State admission, session, and monthly fees clearly. This website does not collect payment. Fees are paid at the school office by cash, bKash, Nagad, Rocket, bank, or cheque.",
    seoDescriptionBn: "ভর্তি ফি ও মাসিক বেতনের তথ্য। টাকা এই সাইটে কাটা হয় না, অফিসে জমা হয়।",
    seoDescriptionEn: "Admission and monthly fee information. Payment is made at the school office, not on this site.",
    sortOrder: 4,
  },
  {
    slug: "academic-info",
    menuKey: "academic",
    titleBn: "একাডেমিক তথ্য",
    titleEn: "Academic information",
    summaryBn: "শ্রেণি, শাখা ও শিক্ষাবর্ষ।",
    summaryEn: "Classes, sections, and the academic year.",
    textBn: "শ্রেণি ও বিষয় ড্যাশবোর্ডের একাডেমিক মডিউল থেকে আসে। এখানে সপ্তাহের ছুটি, ক্লাসের সময় ও মূল্যায়নের ধরন লিখুন।",
    textEn: "Classes and subjects come from the academic module. Use this page for the weekly holiday, class hours, and how students are assessed.",
    seoDescriptionBn: "শিক্ষাবর্ষ, ক্লাসের সময় এবং মূল্যায়ন পদ্ধতিসহ একাডেমিক তথ্য দেখুন।",
    seoDescriptionEn: "Academic year, class hours, and how the school assesses students through the year.",
    sortOrder: 1,
  },
  {
    slug: "calendar",
    menuKey: "academic",
    titleBn: "একাডেমিক ক্যালেন্ডার",
    titleEn: "Academic calendar",
    summaryBn: "ছুটি, পরীক্ষা ও বিশেষ দিন।",
    summaryEn: "Holidays, exams, and special days.",
    textBn: "বার্ষিক ছুটি, পরীক্ষার সম্ভাব্য সপ্তাহ ও জাতীয় দিবস এখানে লিখুন। পিডিএফ থাকলে সিলেবাস ও ডাউনলোড সেকশনে আপলোড করুন।",
    textEn: "List yearly holidays, likely exam weeks, and national days. Upload a PDF from the downloads tab when you have one.",
    seoDescriptionBn: "বার্ষিক ছুটি, পরীক্ষার সপ্তাহ ও বিশেষ দিবসসহ একাডেমিক ক্যালেন্ডার দেখুন।",
    seoDescriptionEn: "Yearly holidays, exam weeks, and special days on the school academic calendar.",
    sortOrder: 2,
  },
  {
    slug: "cocurricular",
    menuKey: "academic",
    titleBn: "সহশিক্ষা",
    titleEn: "Co-curricular",
    summaryBn: "খেলা, বিতর্ক, সাংস্কৃতিক চর্চা।",
    summaryEn: "Sports, debate, and cultural practice.",
    textBn: "স্কাউট, বিতর্ক, খেলা ও সাংস্কৃতিক অনুষ্ঠান এখানে পরিচয় করিয়ে দিন। আসন্ন অনুষ্ঠান নিউজ ও ইভেন্ট থেকে প্রকাশিত হবে।",
    textEn: "Introduce scouts, debate, sports, and cultural programmes here. Upcoming events are published as news and events.",
    seoDescriptionBn: "খেলা, বিতর্ক, সাংস্কৃতিক চর্চা ও অন্যান্য সহশিক্ষা কার্যক্রমের পরিচিতি পড়ুন।",
    seoDescriptionEn: "Sports, debate, cultural practice, and other activities beyond the regular classroom.",
    sortOrder: 3,
  },
  {
    slug: "student-life",
    menuKey: "students",
    titleBn: "বর্তমান শিক্ষার্থী",
    titleEn: "Current students",
    summaryBn: "ক্যাম্পাস জীবন। ব্যক্তিগত ফোন বা ঠিকানা প্রকাশিত হয় না।",
    summaryEn: "Campus life. Personal phone numbers and addresses are not published.",
    textBn: "বর্তমান শিক্ষার্থীদের দৈনন্দিন জীবন, ইউনিফর্ম ও ক্লাসের ছন্দ এখানে লিখুন। শিক্ষার্থীর ফোন, ঠিকানা বা জন্মনিবন্ধন এই সাইটে দেখানো হয় না। ফলাফল দেখতে শিক্ষার্থী আইডি লাগে।",
    textEn: "Describe daily life, uniform, and the rhythm of class. Student phone numbers, addresses, and birth registration numbers are never shown. Result lookup needs a student ID.",
    seoDescriptionBn: "বর্তমান শিক্ষার্থীদের ক্যাম্পাস জীবন। ব্যক্তিগত ফোন বা ঠিকানা এখানে প্রকাশিত হয় না।",
    seoDescriptionEn: "Campus life for current students. Personal phone numbers and addresses are not published here.",
    sortOrder: 1,
  },
  {
    slug: "future",
    menuKey: "students",
    titleBn: "ভবিষ্যৎ শিক্ষার্থী",
    titleEn: "Future students",
    summaryBn: "যাঁরা ভর্তি হতে চান তাঁদের জন্য।",
    summaryEn: "For families who want to apply.",
    textBn: "নতুন শিক্ষার্থী ভর্তি তথ্য ও অনলাইন আবেদন পাতায় যাবেন। ক্যাম্পাস দেখতে গ্যালারি ও যোগাযোগ পাতা ব্যবহার করুন।",
    textEn: "New students should read the admission pages and submit the online application. Use the gallery and contact page to plan a visit.",
    seoDescriptionBn: "নতুন শিক্ষার্থী ও অভিভাবকদের জন্য ভর্তি, ক্যাম্পাস দেখা ও আবেদনের পথ।",
    seoDescriptionEn: "A starting point for future students and families who want to visit and apply.",
    sortOrder: 2,
  },
  {
    slug: "council",
    menuKey: "students",
    titleBn: "স্টুডেন্ট কাউন্সিল",
    titleEn: "Student council",
    summaryBn: "শিক্ষার্থী প্রতিনিধিদের কাজ।",
    summaryEn: "What student representatives do.",
    textBn: "কাউন্সিলের দায়িত্ব, নির্বাচন ও চলতি সদস্যদের নাম এখানে লিখুন। ছবি দিতে চাইলে গ্যালারিতে আলাদা অ্যালবাম খুলুন এবং প্রকাশযোগ্য হিসেবে চিহ্ন দিন।",
    textEn: "Describe the council's duties, how members are chosen, and the current names. If you add photos, publish them in a gallery album marked for the website.",
    seoDescriptionBn: "স্টুডেন্ট কাউন্সিলের দায়িত্ব, নির্বাচন এবং চলতি প্রতিনিধিদের পরিচিতি।",
    seoDescriptionEn: "The student council's duties, how members are chosen, and who represents students now.",
    sortOrder: 3,
  },
  {
    slug: "clubs",
    menuKey: "students",
    titleBn: "ক্লাব",
    titleEn: "Clubs",
    summaryBn: "যে ক্লাবে যোগ দেওয়া যায়।",
    summaryEn: "Clubs students can join.",
    textBn: "বিজ্ঞান, বিতর্ক, খেলা ও সাংস্কৃতিক ক্লাবের নাম ও যোগ দেওয়ার নিয়ম লিখুন।",
    textEn: "Name the science, debate, sports, and cultural clubs, and how a student joins.",
    seoDescriptionBn: "স্কুলের ক্লাবসমূহ এবং শিক্ষার্থীরা কীভাবে যোগ দিতে পারে তার তথ্য।",
    seoDescriptionEn: "School clubs and how a current student can join science, debate, sports, or culture.",
    sortOrder: 4,
  },
  {
    slug: "rules",
    menuKey: "students",
    titleBn: "নিয়মাবলি",
    titleEn: "Code of conduct",
    summaryBn: "উপস্থিতি, পোশাক ও আচরণ।",
    summaryEn: "Attendance, dress, and conduct.",
    textBn: "উপস্থিতির নিয়ম, ইউনিফর্ম, মোবাইল ফোন ও শৃঙ্খলার সংক্ষিপ্ত নিয়ম এখানে দিন। দীর্ঘ নীতিমালা পিডিএফ হিসেবে ডাউনলোড সেকশনে আপলোড করতে পারেন।",
    textEn: "Add short rules for attendance, uniform, mobile phones, and conduct. Upload a longer policy PDF from the downloads tab.",
    seoDescriptionBn: "উপস্থিতি, পোশাক ও আচরণ নিয়ে স্কুলের সংক্ষিপ্ত নিয়মাবলি পড়ুন।",
    seoDescriptionEn: "Short school rules for attendance, uniform, mobile phones, and everyday conduct.",
    sortOrder: 5,
  },
];

export function defaultPages() {
  return PAGES.map((page) => ({
    slug: page.slug,
    menuKey: page.menuKey,
    titleBn: page.titleBn,
    titleEn: page.titleEn,
    summaryBn: page.summaryBn,
    summaryEn: page.summaryEn,
    blocks: [{ type: "paragraph" as const, textBn: page.textBn, textEn: page.textEn, itemsBn: [], itemsEn: [], imageUrl: "", alt: "" }],
    seoDescriptionBn: page.seoDescriptionBn,
    seoDescriptionEn: page.seoDescriptionEn,
    status: "published" as const,
    sortOrder: page.sortOrder,
  }));
}

export interface DeskCopy {
  key: string;
  noteBn: string;
  noteEn: string;
  dutiesBn: string[];
  dutiesEn: string[];
  visitBn: string[];
  visitEn: string[];
}

export interface TaskCopy {
  titleBn: string;
  titleEn: string;
  bodyBn: string;
  bodyEn: string;
}

export function defaultTasks(): TaskCopy[] {
  return [
    {
      titleBn: "প্রকাশিত ফল",
      titleEn: "Published results",
      bodyBn: "শিক্ষার্থী আইডি দিয়ে প্রকাশিত ফল ও মার্কশিট।",
      bodyEn: "A published result and marksheet with a student ID.",
    },
    {
      titleBn: "এক পাতায় আবেদন",
      titleEn: "One-page application",
      bodyBn: "ফি অফিসে, সিট যাচাইয়ের পর। এই সাইটে টাকা কাটা হয় না।",
      bodyEn: "The fee is at the office, and a seat comes after checking. This site does not take payment.",
    },
    {
      titleBn: "অফিসের ঘোষণা",
      titleEn: "Office announcements",
      bodyBn: "ছুটি, পরীক্ষা ও ভর্তির তারিখ আগে এখানে।",
      bodyEn: "Holidays, exams, and admission dates are announced here first.",
    },
  ];
}

export function defaultAdmit() {
  return {
    admitTitleBn: "ভর্তি খোলা আছে কি?",
    admitTitleEn: "Ready to apply?",
    admitBodyBn: "যোগ্যতা দেখে অনলাইনে আবেদন করুন। টাকা এই সাইটে কাটা হয় না।",
    admitBodyEn: "Read the rules, then apply online. This site does not take payment.",
  };
}

export function defaultDesks(): DeskCopy[] {
  return [
    {
      key: "principal",
      noteBn: "অধ্যক্ষের ডেস্ক ক্লাস চলাকালীন খোলা থাকে। শৃঙ্খলা, দৈনন্দিন শিক্ষা ও অভিভাবকের প্রশ্ন এখানে। ব্যক্তিগত বিষয় প্রকাশিত হয় না।",
      noteEn: "The principal's desk stays open during class. Discipline, daily teaching, and family questions come here. Private matters are not published.",
      dutiesBn: ["ক্লাস চলাকালীন অফিসে থাকেন", "অভিভাবকের প্রশ্ন অফিস সময়ে", "শৃঙ্খলা ও দৈনন্দিন শিক্ষা"],
      dutiesEn: ["In the office during class", "Family questions in office hours", "Discipline and daily teaching"],
      visitBn: ["অফিস সময়ে", "আগে ফোন করলে সাক্ষাৎ সহজ", "জরুরি খবর নোটিশে"],
      visitEn: ["During office hours", "A call ahead makes a meeting easier", "Urgent news is a notice"],
    },
    {
      key: "vice",
      noteBn: "সহকারী প্রধান শিক্ষক রুটিন, উপস্থিতি ও শ্রেণি শিক্ষকদের সমন্বয় দেখেন। দেরির খাতা এই ডেস্কে।",
      noteEn: "The vice principal watches the routine, attendance, and class teachers. The late-arrival note stays at this desk.",
      dutiesBn: ["রুটিন ও উপস্থিতি", "শ্রেণি শিক্ষকদের সমন্বয়", "দেরির খাতা"],
      dutiesEn: ["Routine and attendance", "Coordinates class teachers", "The late-arrival note"],
      visitBn: ["সকালে, ক্লাস শুরুর আগে", "দেরির কারণ এখানে", "রুটিন বদল নোটিশে"],
      visitEn: ["In the morning, before class", "A reason for lateness is written here", "A routine change is a notice"],
    },
    {
      key: "admission",
      noteBn: "ভর্তি শাখা আবেদন যাচাই করে এবং কাগজ নেয়। অনলাইন ফর্ম জমা মানে অপেক্ষমাণ। অনুমোদনের পর ভর্তি। আসন সংখ্যা এই পাতায় নেই।",
      noteEn: "The admission desk checks applications and takes papers. Submitting the online form means pending. Admission starts after approval. Seat counts are not on this page.",
      dutiesBn: ["আবেদনপত্র যাচাই", "কাগজ অফিসে জমা", "সিট নোটিশের পর"],
      dutiesEn: ["Checks applications", "Papers handed in here", "A seat after the notice"],
      visitBn: ["ভর্তি নোটিশের তারিখে", "কাগজ সঙ্গে আনুন", "আসন সংখ্যা এখানে জিজ্ঞাসা"],
      visitEn: ["On the date in the admission notice", "Bring the papers", "Ask the seat count here"],
    },
    {
      key: "accounts",
      noteBn: "হিসাব শাখা ফির রসিদ দেয়। মাধ্যম নগদ, বিকাশ, নগদ, রকেট, ব্যাংক বা চেক। অনলাইনে টাকা কাটা হয় না। অঙ্ক অফিস বলে।",
      noteEn: "Accounts issues the fee receipt. Payment is by cash, bKash, Nagad, Rocket, bank, or cheque. Nothing is charged online. The office states the amount.",
      dutiesBn: ["ফি রসিদ", "নগদ, বিকাশ, নগদ, রকেট, ব্যাংক বা চেক", "অনলাইনে কাটা হয় না"],
      dutiesEn: ["Fee receipts", "Cash, bKash, Nagad, Rocket, bank, or cheque", "Not charged online"],
      visitBn: ["অফিস সময়ে", "রসিদ নিয়ে যান", "হারানো রসিদের কথা এখানে"],
      visitEn: ["During office hours", "Take the receipt with you", "A lost receipt is raised here"],
    },
    {
      key: "librarian",
      noteBn: "গ্রন্থাগারিক বই ও কার্ড দেখেন। পড়ার আসর হলে তারিখ নোটিশে। নতুন বইয়ের তালিকাও নোটিশে।",
      noteEn: "The librarian keeps books and cards. A reading hour, when held, is dated in a notice. New titles are a notice too.",
      dutiesBn: ["বই ও কার্ড", "পড়ার আসর", "নতুন বইয়ের তালিকা নোটিশে"],
      dutiesEn: ["Books and cards", "Reading hour", "New books by notice"],
      visitBn: ["ক্লাসের বাইরে", "কার্ড সঙ্গে", "ফেরতের দিন কার্ডে"],
      visitEn: ["Outside class time", "Bring the card", "The return day is on the card"],
    },
    {
      key: "exam",
      noteBn: "পরীক্ষা নিয়ন্ত্রক সময়সূচি, কক্ষ ও নম্বরপত্র দেখেন। প্রকাশিত ফল সাইটে। অপ্রকাশিত নম্বর এই ডেস্ক না বলা পর্যন্ত পাতায় আসে না।",
      noteEn: "The exam controller sets the timetable, rooms, and scripts. A published result is on the site. Unpublished marks stay off the page until this desk says otherwise.",
      dutiesBn: ["সময়সূচি ও কক্ষ নোটিশে", "নম্বরপত্র", "প্রকাশিত ফল"],
      dutiesEn: ["Timetable and room by notice", "Scripts", "Published results"],
      visitBn: ["রুটিন নোটিশের পর", "প্রকাশের তারিখ নোটিশে", "মার্কশিট ফল পাতায়"],
      visitEn: ["After the routine notice", "The publication date is a notice", "The marksheet is on the results page"],
    },
    {
      key: "clerk",
      noteBn: "অফিস সহকারী চিঠি, নোটিশের খসড়া ও কাগজ রাখেন। কপি অফিস সময়ে। দরজা খোলা থাকলে প্রথম জিজ্ঞাসা এখানে।",
      noteEn: "The office assistant keeps letters, notice drafts, and papers. Copies are given in office hours. When the door is open, the first question starts here.",
      dutiesBn: ["চিঠি ও নোটিশের খসড়া", "অফিসের কাগজ", "কপি অফিস সময়ে"],
      dutiesEn: ["Letters and notice drafts", "Office papers", "Copies during office hours"],
      visitBn: ["অফিস সময়ে", "কপির জন্য আইডি", "চিঠির জবাব এখানে"],
      visitEn: ["During office hours", "An ID for a copy", "A letter is answered here"],
    },
    {
      key: "governing",
      noteBn: "পরিচালনা পর্ষদ বড় সিদ্ধান্ত সভায় নেয়। সভার তারিখ নোটিশে। সদস্যদের নাম এই পাতায়। ব্যক্তিগত ফোন ও ঠিকানা নেই।",
      noteEn: "The governing body takes major decisions in a meeting. The date is a notice. Member names are on this page. Personal phones and addresses are not.",
      dutiesBn: ["বড় সিদ্ধান্ত সভায়", "সভার তারিখ নোটিশে", "সদস্যদের নাম এখানে"],
      dutiesEn: ["Major decisions in a meeting", "The date is a notice", "Member names are listed here"],
      visitBn: ["সভার তারিখ নোটিশে", "অফিস সময়ে যোগাযোগ", "সিদ্ধান্ত নোটিশে"],
      visitEn: ["The meeting date is a notice", "Contact during office hours", "The decision is a notice"],
    },
    {
      key: "council",
      noteBn: "একাডেমিক কাউন্সিল পাঠ্যক্রম ও পরীক্ষার নীতি দেখে। প্রকাশিত ফলের তারিখ নোটিশে চূড়ান্ত। সিলেবাস এই সাইটে।",
      noteEn: "The academic council watches the curriculum and exam policy. A published result is dated by notice. The syllabus is on this site.",
      dutiesBn: ["পাঠ্যক্রম", "পরীক্ষার নীতি", "প্রকাশিত ফলের তারিখ নোটিশে"],
      dutiesEn: ["Curriculum", "Exam policy", "A published result is dated by notice"],
      visitBn: ["সভার আগে নোটিশ", "সিলেবাস এই সাইটে", "ফল প্রকাশের পর"],
      visitEn: ["A notice before the meeting", "The syllabus is on this site", "After the result is published"],
    },
    {
      key: "syndicate",
      noteBn: "সিন্ডিকেট একাডেমিক নীতি ও বাজেট আলোচনা করে। ফির অঙ্ক অফিস ঘোষণা করে। এই পাতায় কোনো সংখ্যা নেই।",
      noteEn: "The syndicate discusses academic policy and the budget. The office announces fee amounts. This page has no figures.",
      dutiesBn: ["একাডেমিক নীতি", "বাজেট আলোচনা", "ফির অঙ্ক অফিস ঘোষণা করে"],
      dutiesEn: ["Academic policy", "Budget discussion", "The office announces fee amounts"],
      visitBn: ["সভার তারিখ নোটিশে", "ফির অঙ্ক অফিসে", "নীতি নোটিশে"],
      visitEn: ["The meeting date is a notice", "Fee amounts are at the office", "Policy is a notice"],
    },
    {
      key: "pta",
      noteBn: "অভিভাবক কমিটি সভার তারিখ ও আলোচ্য বিষয় জানায়। ব্যক্তিগত ফোন ও বাড়ির ঠিকানা এই তালিকায় নেই।",
      noteEn: "The parent committee publishes the meeting date and the agenda. Personal phones and home addresses are not on this list.",
      dutiesBn: ["অভিভাবক সভার তারিখ", "আলোচ্য বিষয়", "ব্যক্তিগত ফোন এই তালিকায় নেই"],
      dutiesEn: ["Parent meeting dates", "The agenda", "Personal phones are not listed"],
      visitBn: ["সভার তারিখ নোটিশে", "অফিস সময়ে নাম লেখান", "আলোচ্য বিষয় আগে"],
      visitEn: ["The meeting date is a notice", "Give a name during office hours", "Read the agenda first"],
    },
  ];
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

function textOf(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function listOf(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => textOf(item)).filter(Boolean).slice(0, 8);
}

export function publicTasks(value: unknown): TaskCopy[] {
  const defaults = defaultTasks();
  if (!Array.isArray(value) || !value.length) return defaults;
  return defaults.map((item, index) => {
    const row = asRecord(value[index]);
    if (!row) return item;
    return {
      titleBn: textOf(row.titleBn) || item.titleBn,
      titleEn: textOf(row.titleEn) || item.titleEn,
      bodyBn: textOf(row.bodyBn) || item.bodyBn,
      bodyEn: textOf(row.bodyEn) || item.bodyEn,
    };
  });
}

export function publicDesks(value: unknown): DeskCopy[] {
  const stored = new Map<string, Record<string, unknown>>();
  if (Array.isArray(value)) {
    for (const item of value) {
      const row = asRecord(item);
      const key = textOf(row?.key);
      if (row && key) stored.set(key, row);
    }
  }
  return defaultDesks().map((desk) => {
    const row = stored.get(desk.key);
    if (!row) return desk;
    const dutiesBn = listOf(row.dutiesBn);
    const dutiesEn = listOf(row.dutiesEn);
    const visitBn = listOf(row.visitBn);
    const visitEn = listOf(row.visitEn);
    return {
      key: desk.key,
      noteBn: textOf(row.noteBn) || desk.noteBn,
      noteEn: textOf(row.noteEn) || desk.noteEn,
      dutiesBn: dutiesBn.length ? dutiesBn : desk.dutiesBn,
      dutiesEn: dutiesEn.length ? dutiesEn : desk.dutiesEn,
      visitBn: visitBn.length ? visitBn : desk.visitBn,
      visitEn: visitEn.length ? visitEn : desk.visitEn,
    };
  });
}

export function defaultConfig() {
  return {
    phone: "",
    email: "",
    officeHours: "রবি–বৃহস্পতি, সকাল ৯টা–বিকেল ৪টা",
    mapEmbedUrl: "",
    facebook: "",
    youtube: "",
    themePreset: "heritage",
    themePrimary: "#14532d",
    heroTitleBn: "শেখা, শৃঙ্খলা ও নিরাপদ ক্যাম্পাস",
    heroTitleEn: "Learning, discipline, and a safe campus",
    heroSubtitleBn: "ফলাফল, নোটিশ ও ভর্তি — এক জায়গায়।",
    heroSubtitleEn: "Results, notices, and admission in one place.",
    heroImageUrl: "",
    heroVideoUrl: "",
    whyChooseUs: [
      {
        titleBn: "নিয়মিত ক্লাস",
        titleEn: "Steady classes",
        bodyBn: "রুটিন অনুযায়ী ক্লাস ও বিষয়ভিত্তিক শিক্ষক।",
        bodyEn: "Classes follow the routine, with a teacher for each subject.",
      },
      {
        titleBn: "প্রকাশিত ফলাফল",
        titleEn: "Published results",
        bodyBn: "পরীক্ষা প্রকাশের পর শিক্ষার্থী আইডি দিয়ে দেখা যায়।",
        bodyEn: "After an exam is published, families look it up with a student ID.",
      },
      {
        titleBn: "স্পষ্ট ভর্তি",
        titleEn: "Clear admission",
        bodyBn: "যোগ্যতা, কাগজ ও ফি আগে থেকে লেখা থাকে।",
        bodyEn: "Eligibility, papers, and fees are written down before you apply.",
      },
      {
        titleBn: "সহশিক্ষা",
        titleEn: "Life beyond class",
        bodyBn: "খেলা, সংস্কৃতি ও ক্লাব ক্যাম্পাসের অংশ।",
        bodyEn: "Sports, culture, and clubs are part of campus life.",
      },
      {
        titleBn: "অফিস থেকে ফি",
        titleEn: "Fees at the office",
        bodyBn: "টাকা অনলাইনে কাটা হয় না। রসিদ অফিস থেকে।",
        bodyEn: "The website does not charge fees. Receipts come from the office.",
      },
      {
        titleBn: "মাতৃভাষায় তথ্য",
        titleEn: "Information in Bangla",
        bodyBn: "নোটিশ ও পাতা বাংলায় পড়া যায়।",
        bodyEn: "Notices and pages can be read in Bangla.",
      },
    ],
    stats: [] as Array<{ labelBn: string; labelEn: string; value: string }>,
    principalName: "",
    principalDesignation: "প্রধান শিক্ষক",
    principalPhotoUrl: "",
    principalQuoteBn: "আমাদের কাজ শিক্ষার্থীকে নিরাপদে শেখানো।",
    principalQuoteEn: "Our work is to teach students in a safe school.",
    homeIntroBn: "",
    homeIntroEn: "",
    tasks: defaultTasks(),
    ...defaultAdmit(),
    desks: defaultDesks(),
    resultLookupEnabled: true,
    meritListEnabled: false,
    seoDescriptionBn: "স্কুলের নোটিশ, ভর্তি, শিক্ষক, রুটিন ও প্রকাশিত ফলাফল দেখুন।",
    seoDescriptionEn: "Notices, admission, teachers, routines, and published results for this school.",
    menus: defaultMenus(),
  };
}

export function defaultPosts() {
  return [
    {
      kind: "news" as const,
      titleBn: "নতুন শিক্ষাবর্ষের প্রস্তুতি",
      titleEn: "Preparing the new academic year",
      bodyBn: "ক্লাস শুরুর আগে রুটিন, সিলেবাস ও ভর্তি তথ্য এই সাইটে প্রকাশ করা হবে।",
      bodyEn: "Routine, syllabus, and admission notes will be published here before classes begin.",
      coverUrl: "",
      coverAlt: "",
      pinned: true,
      status: "published" as const,
      seoDescriptionBn: "নতুন শিক্ষাবর্ষের রুটিন, সিলেবাস ও ভর্তি প্রস্তুতির খবর পড়ুন।",
      seoDescriptionEn: "News on routine, syllabus, and admission preparation for the new academic year.",
    },
    {
      kind: "event" as const,
      titleBn: "বার্ষিক সাংস্কৃতিক অনুষ্ঠান",
      titleEn: "Annual cultural programme",
      bodyBn: "তারিখ নিশ্চিত হলে এখানে সময় ও স্থান লেখা হবে। অভিভাবকদের আমন্ত্রণ নোটিশে দেওয়া হবে।",
      bodyEn: "Date, time, and place will be added when confirmed. Families will be invited by notice.",
      coverUrl: "",
      coverAlt: "",
      pinned: false,
      status: "published" as const,
      seoDescriptionBn: "বার্ষিক সাংস্কৃতিক অনুষ্ঠানের সময় ও স্থান নিশ্চিত হলে এখানে প্রকাশিত হবে।",
      seoDescriptionEn: "The annual cultural programme date and place will be published here once confirmed.",
    },
  ];
}
