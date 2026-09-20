export const DEFAULT_CLASSES = [
  { name: "Play", code: "PLAY", level: 0, sections: ["A"] },
  { name: "Nursery", code: "NUR", level: 0, sections: ["A"] },
  { name: "KG", code: "KG", level: 0, sections: ["A"] },
  { name: "Class 1", code: "C1", level: 1, sections: ["A", "B"] },
  { name: "Class 2", code: "C2", level: 2, sections: ["A", "B"] },
  { name: "Class 3", code: "C3", level: 3, sections: ["A", "B"] },
  { name: "Class 4", code: "C4", level: 4, sections: ["A", "B"] },
  { name: "Class 5", code: "C5", level: 5, sections: ["A", "B"] },
  { name: "Class 6", code: "C6", level: 6, sections: ["A", "B"] },
  { name: "Class 7", code: "C7", level: 7, sections: ["A", "B"] },
  { name: "Class 8", code: "C8", level: 8, sections: ["A", "B"] },
  { name: "Class 9 Science", code: "C9-SCI", level: 9, group: "Science" as const, sections: ["A"] },
  { name: "Class 9 Business", code: "C9-BUS", level: 9, group: "Business" as const, sections: ["A"] },
  { name: "Class 9 Humanities", code: "C9-HUM", level: 9, group: "Humanities" as const, sections: ["A"] },
  { name: "Class 10 Science", code: "C10-SCI", level: 10, group: "Science" as const, sections: ["A"] },
  { name: "Class 10 Business", code: "C10-BUS", level: 10, group: "Business" as const, sections: ["A"] },
  { name: "Class 10 Humanities", code: "C10-HUM", level: 10, group: "Humanities" as const, sections: ["A"] },
];

export interface MasterSubjectItem {
  name: string;
  nameBn: string;
  code: string;
  group: "Common" | "Science" | "Business" | "Humanities";
  category: "Language" | "Science" | "Business" | "Humanities" | "Religion" | "Applied" | "Madrasah" | "General";
  markDistribution?: { cq: number; mcq: number; practical: number; attendance: number };
}

export const MASTER_SUBJECT_CATALOG: MasterSubjectItem[] = [
  // 1. ভাষা ও সাহিত্য (Languages)
  { name: "Bangla", nameBn: "বাংলা", code: "BAN", group: "Common", category: "Language" },
  { name: "Bangla 1st Paper", nameBn: "বাংলা ১ম পত্র", code: "BAN1", group: "Common", category: "Language" },
  { name: "Bangla 2nd Paper", nameBn: "বাংলা ২য় পত্র", code: "BAN2", group: "Common", category: "Language" },
  { name: "English", nameBn: "ইংরেজি", code: "ENG", group: "Common", category: "Language" },
  { name: "English 1st Paper", nameBn: "ইংরেজি ১ম পত্র", code: "ENG1", group: "Common", category: "Language" },
  { name: "English 2nd Paper", nameBn: "ইংরেজি ২য় পত্র", code: "ENG2", group: "Common", category: "Language" },
  { name: "Arabic", nameBn: "আরবি", code: "ARB", group: "Common", category: "Language" },
  { name: "Arabic 1st Paper", nameBn: "আরবি ১ম পত্র", code: "ARB1", group: "Common", category: "Language" },
  { name: "Arabic 2nd Paper", nameBn: "আরবি ২য় পত্র", code: "ARB2", group: "Common", category: "Language" },

  // 2. গণিত ও বিজ্ঞান (Mathematics & Sciences)
  { name: "Mathematics", nameBn: "গণিত", code: "MATH", group: "Common", category: "Science" },
  { name: "General Science", nameBn: "সাধারণ বিজ্ঞান", code: "GSCI", group: "Common", category: "Science" },
  { name: "Science", nameBn: "বিজ্ঞান", code: "SCI", group: "Common", category: "Science" },
  { name: "Physics", nameBn: "পদার্থবিজ্ঞান", code: "PHY", group: "Science", category: "Science", markDistribution: { cq: 50, mcq: 25, practical: 25, attendance: 0 } },
  { name: "Chemistry", nameBn: "রসায়ন", code: "CHEM", group: "Science", category: "Science", markDistribution: { cq: 50, mcq: 25, practical: 25, attendance: 0 } },
  { name: "Biology", nameBn: "জীববিজ্ঞান", code: "BIO", group: "Science", category: "Science", markDistribution: { cq: 50, mcq: 25, practical: 25, attendance: 0 } },
  { name: "Higher Math", nameBn: "উচ্চতর গণিত", code: "HMATH", group: "Science", category: "Science", markDistribution: { cq: 50, mcq: 25, practical: 25, attendance: 0 } },

  // 3. সামাজিক ও ব্যবসায় শিক্ষা (Social Studies & Business)
  { name: "Bangladesh & Global Studies", nameBn: "বাংলাদেশ ও বিশ্বপরিচয়", code: "BGS", group: "Common", category: "Humanities" },
  { name: "ICT", nameBn: "তথ্য ও যোগাযোগ প্রযুক্তি (আইসিটি)", code: "ICT", group: "Common", category: "Science", markDistribution: { cq: 0, mcq: 25, practical: 25, attendance: 0 } },
  { name: "Accounting", nameBn: "হিসাববিজ্ঞান", code: "ACC", group: "Business", category: "Business" },
  { name: "Finance & Banking", nameBn: "ফিন্যান্স ও ব্যাংকিং", code: "FIN", group: "Business", category: "Business" },
  { name: "Business Entrepreneurship", nameBn: "ব্যবসায় উদ্যোগ", code: "BENT", group: "Business", category: "Business" },
  { name: "Economics", nameBn: "অর্থনীতি", code: "ECON", group: "Humanities", category: "Humanities" },
  { name: "Civics & Citizenship", nameBn: "পৌরনীতি ও নাগরিকতা", code: "CIV", group: "Humanities", category: "Humanities" },
  { name: "Civics", nameBn: "পৌরনীতি", code: "CIV2", group: "Humanities", category: "Humanities" },
  { name: "History", nameBn: "বাংলাদেশের ইতিহাস ও বিশ্বসভ্যতা", code: "HIST", group: "Humanities", category: "Humanities" },
  { name: "Geography & Environment", nameBn: "ভূগোল ও পরিবেশ", code: "GEO", group: "Humanities", category: "Humanities", markDistribution: { cq: 50, mcq: 30, practical: 20, attendance: 0 } },
  { name: "Geography", nameBn: "ভূগোল", code: "GEO2", group: "Humanities", category: "Humanities" },

  // 4. ধর্ম ও নৈতিক শিক্ষা (Religious & Moral Education)
  { name: "Islam & Moral Education", nameBn: "ইসলাম ও নৈতিক শিক্ষা", code: "ISL", group: "Common", category: "Religion" },
  { name: "Hinduism & Moral Education", nameBn: "হিন্দুধর্ম ও নৈতিক শিক্ষা", code: "HIN", group: "Common", category: "Religion" },
  { name: "Buddhism & Moral Education", nameBn: "বৌদ্ধধর্ম ও নৈতিক শিক্ষা", code: "BUD", group: "Common", category: "Religion" },
  { name: "Christianity & Moral Education", nameBn: "খ্রিস্টধর্ম ও নৈতিক শিক্ষা", code: "CHR", group: "Common", category: "Religion" },
  { name: "Religion", nameBn: "ধর্ম ও নৈতিক শিক্ষা", code: "REL", group: "Common", category: "Religion" },
  { name: "Quran Majid & Tajweed", nameBn: "কুরআন মাজিদ ও তাজভিদ", code: "QUR", group: "Common", category: "Madrasah" },
  { name: "Hadith Sharif", nameBn: "হাদিস শরিফ", code: "HAD", group: "Common", category: "Madrasah" },
  { name: "Aqaid & Fiqh", nameBn: "আকাইদ ও ফিকহ", code: "FIQ", group: "Common", category: "Madrasah" },

  // 5. ব্যবহারিক ও অন্যান্য বিষয় (Applied, Vocational & Electives)
  { name: "Agriculture Studies", nameBn: "কৃষিশিক্ষা", code: "AGRI", group: "Common", category: "Applied", markDistribution: { cq: 50, mcq: 25, practical: 25, attendance: 0 } },
  { name: "Home Science", nameBn: "গার্হস্থ্য বিজ্ঞান", code: "HSCI", group: "Common", category: "Applied", markDistribution: { cq: 50, mcq: 25, practical: 25, attendance: 0 } },
  { name: "Physical Education & Health", nameBn: "শারীরিক শিক্ষা, স্বাস্থ্য ও খেলাধুলা", code: "PED", group: "Common", category: "Applied" },
  { name: "Physical Education", nameBn: "শারীরিক শিক্ষা", code: "PED2", group: "Common", category: "Applied" },
  { name: "Arts & Crafts", nameBn: "চারু ও কারুকলা", code: "ART", group: "Common", category: "Applied", markDistribution: { cq: 50, mcq: 25, practical: 25, attendance: 0 } },
  { name: "Work & Life Oriented Education", nameBn: "কর্ম ও জীবনমুখী শিক্ষা", code: "WLE", group: "Common", category: "Applied" },
  { name: "Career Education", nameBn: "ক্যারিয়ার শিক্ষা", code: "CAREER", group: "Common", category: "Applied" },
  { name: "Drawing", nameBn: "অঙ্কন / চিত্রাঙ্কন", code: "DRAW", group: "Common", category: "Applied" },
  { name: "Music", nameBn: "সঙ্গীত", code: "MUS", group: "Common", category: "Applied" },

  // 6. উচ্চ মাধ্যমিক ও কলেজ পর্যায় (Higher Secondary / Electives)
  { name: "Sociology", nameBn: "সমাজবিজ্ঞান", code: "SOC", group: "Humanities", category: "Humanities" },
  { name: "Social Work", nameBn: "সমাজকর্ম", code: "SOCW", group: "Humanities", category: "Humanities" },
  { name: "Logic", nameBn: "যুক্তিবিদ্যা", code: "LOG", group: "Humanities", category: "Humanities" },
  { name: "Statistics", nameBn: "পরিসংখ্যান", code: "STAT", group: "Science", category: "Science", markDistribution: { cq: 50, mcq: 25, practical: 25, attendance: 0 } },
  { name: "Psychology", nameBn: "মনোবিজ্ঞান", code: "PSY", group: "Humanities", category: "Humanities", markDistribution: { cq: 50, mcq: 25, practical: 25, attendance: 0 } },
  { name: "Production Management & Marketing", nameBn: "উৎপাদন ব্যবস্থাপনা ও বিপণন", code: "PMM", group: "Business", category: "Business" },
  { name: "Business Organization & Management", nameBn: "ব্যবসায় সংগঠন ও ব্যবস্থাপনা", code: "BOM", group: "Business", category: "Business" },
  { name: "General Knowledge", nameBn: "সাধারণ জ্ঞান", code: "GK", group: "Common", category: "General" },
];

export const COMMON_SUBJECTS = [
  "Bangla",
  "English",
  "Mathematics",
  "Religion",
  "Islam & Moral Education",
  "Physical Education",
  "Arts & Crafts",
];

export const JUNIOR_EXTRA = [
  "Bangladesh & Global Studies",
  "Science",
  "ICT",
  "Agriculture Studies",
  "Home Science",
  "Work & Life Oriented Education",
];

export const SCIENCE = [
  "Physics",
  "Chemistry",
  "Biology",
  "Higher Math",
  "General Science",
  "Agriculture Studies",
];

export const BUSINESS = [
  "Accounting",
  "Finance & Banking",
  "Business Entrepreneurship",
  "General Science",
  "Agriculture Studies",
];

export const HUMANITIES = [
  "History",
  "Civics",
  "Civics & Citizenship",
  "Geography",
  "Economics",
  "General Science",
  "Agriculture Studies",
  "Home Science",
];
