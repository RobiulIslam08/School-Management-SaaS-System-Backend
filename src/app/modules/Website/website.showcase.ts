import { Notice } from "../../../models/Notice";
import { SchoolSettings } from "../../../models/SchoolSettings";
import { Student } from "../../../models/Student";
import { Teacher } from "../../../models/Teacher";
import {
  WebsiteAlbum,
  WebsiteConfig,
  WebsiteFile,
  WebsiteMedia,
  WebsitePage,
  WebsitePerson,
  WebsitePost,
} from "../../../models/Website";
import { defaultAdmit, defaultDesks, defaultPages, defaultTasks } from "./website.defaults";
import { ensureAcademicShowcase } from "./website.academics";
import { extraSections, isStaleShowcase, showcaseCopy, type PageSection, type SchoolBits } from "./website.showcase-copy";
import { deepenedSection, priorParagraph } from "./website.showcase-depth";

const HERO_VIDEO = "https://www.youtube.com/watch?v=Unzc731iCUY";
const MAP = "https://maps.google.com/maps?q=Fatickchhari&z=13&output=embed";

/** Local files in public_website/public/media. Keep ids in sync with public_website/src/lib/media.ts. */
const MEDIA: Record<string, string> = {
  "photo-1580582932707-520aed937b7b": "/media/classroom.jpg",
  "photo-1521587760476-6c12a4b040da": "/media/library.jpg",
  "photo-1562774053-701939374585": "/media/campus.jpg",
  "photo-1427504494785-3a9ca7044f45": "/media/walk.jpg",
  "photo-1461896836934-ffe607ba6851": "/media/sports.jpg",
  "photo-1574629810360-7efbbe195018": "/media/sports.jpg",
  "photo-1514525253161-7a46d19cd819": "/media/culture.jpg",
  "photo-1532094349884-543bc11b234d": "/media/science.jpg",
  "photo-1507003211169-0a1dd7228f2d": "/media/portrait-0.jpg",
  "photo-1494790108377-be9c29b29330": "/media/portrait-1.jpg",
  "photo-1472099645785-5658abf4ff4e": "/media/portrait-2.jpg",
  "photo-1438761681033-6461ffad8d80": "/media/portrait-3.jpg",
  "photo-1500648767791-00dcc994a43e": "/media/portrait-4.jpg",
  "photo-1544005313-94ddf0286df2": "/media/portrait-5.jpg",
  "photo-1506794778202-cad84cf45f1d": "/media/portrait-6.jpg",
  "photo-1573496359142-b8d87734a5a2": "/media/portrait-7.jpg",
  "photo-1560250097-0b93528c311a": "/media/portrait-8.jpg",
  "photo-1580489944761-15a19d654956": "/media/portrait-9.jpg",
};

function shot(id: string): string {
  return MEDIA[id] ?? "";
}

const PHOTO = {
  classroom: shot("photo-1580582932707-520aed937b7b"),
  library: shot("photo-1521587760476-6c12a4b040da"),
  campus: shot("photo-1562774053-701939374585"),
  walk: shot("photo-1427504494785-3a9ca7044f45"),
  sports: shot("photo-1574629810360-7efbbe195018"),
  culture: shot("photo-1514525253161-7a46d19cd819"),
  science: shot("photo-1532094349884-543bc11b234d"),
};

const PORTRAITS = [
  shot("photo-1507003211169-0a1dd7228f2d"),
  shot("photo-1494790108377-be9c29b29330"),
  shot("photo-1472099645785-5658abf4ff4e"),
  shot("photo-1438761681033-6461ffad8d80"),
  shot("photo-1500648767791-00dcc994a43e"),
  shot("photo-1544005313-94ddf0286df2"),
  shot("photo-1506794778202-cad84cf45f1d"),
  shot("photo-1573496359142-b8d87734a5a2"),
  shot("photo-1560250097-0b93528c311a"),
  shot("photo-1580489944761-15a19d654956"),
];

const PAGE_IMAGE: Record<string, { url: string; alt: string }> = {
  history: { url: PHOTO.campus, alt: "স্কুল ক্যাম্পাসের বাইরের দৃশ্য" },
  mission: { url: PHOTO.walk, alt: "ক্যাম্পাসে হাঁটা শিক্ষার্থী" },
  principal: { url: PORTRAITS[8], alt: "প্রধান শিক্ষকের প্রতিকৃতি" },
  facilities: { url: PHOTO.library, alt: "পাঠাগারের ভেতরের দৃশ্য" },
  achievements: { url: PHOTO.sports, alt: "মাঠে খেলার মুহূর্ত" },
  "admission-info": { url: PHOTO.campus, alt: "ভর্তিপ্রার্থীদের জন্য ক্যাম্পাস" },
  eligibility: { url: PHOTO.classroom, alt: "ক্লাসরুমে পাঠদান" },
  documents: { url: PHOTO.library, alt: "কাগজপত্র দেখার জন্য পাঠাগার" },
  "fees-info": { url: PHOTO.walk, alt: "অফিসের দিকে যাওয়ার পথ" },
  "academic-info": { url: PHOTO.classroom, alt: "শ্রেণিকক্ষ" },
  calendar: { url: PHOTO.library, alt: "পড়ার টেবিল" },
  cocurricular: { url: PHOTO.culture, alt: "সাংস্কৃতিক অনুষ্ঠানের মঞ্চ" },
  "student-life": { url: PHOTO.walk, alt: "ক্যাম্পাসে শিক্ষার্থী" },
  future: { url: PHOTO.campus, alt: "নতুন শিক্ষার্থীর জন্য ক্যাম্পাস" },
  council: { url: PORTRAITS[2], alt: "শিক্ষার্থী প্রতিনিধি" },
  clubs: { url: PHOTO.science, alt: "বিজ্ঞান ক্লাবের কাজ" },
  rules: { url: PHOTO.classroom, alt: "শৃঙ্খলার মধ্যে ক্লাস" },
};

type Block = {
  type: "paragraph" | "list" | "image" | "heading";
  textBn: string;
  textEn: string;
  itemsBn: string[];
  itemsEn: string[];
  imageUrl: string;
  alt: string;
};

function emptyBlock(type: Block["type"]): Block {
  return { type, textBn: "", textEn: "", itemsBn: [], itemsEn: [], imageUrl: "", alt: "" };
}

function tinyPdf(): Buffer {
  const body = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 160]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 44>>stream
BT /F1 12 Tf 40 90 Td (School file) Tj ET
endstream
endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
trailer<</Root 1 0 R>>
%%EOF`;
  return Buffer.from(body, "utf8");
}

async function fillConfig(): Promise<void> {
  const config = await WebsiteConfig.findOne();
  if (!config) return;
  const settings = await SchoolSettings.findOne().select("establishedYear").lean();
  const [students, teachers] = await Promise.all([
    Student.countDocuments({ status: "active" }),
    Teacher.countDocuments({ isActive: true }),
  ]);
  const established = settings?.establishedYear;
  const years = established ? String(Math.max(1, new Date().getFullYear() - established)) : "25";
  const patch: Record<string, unknown> = {};
  if (!String(config.heroImageUrl ?? "").trim()) patch.heroImageUrl = PHOTO.campus;
  if (!String(config.heroVideoUrl ?? "").trim()) patch.heroVideoUrl = HERO_VIDEO;
  if (!String(config.principalPhotoUrl ?? "").trim()) patch.principalPhotoUrl = PORTRAITS[8];
  if (!String(config.mapEmbedUrl ?? "").trim()) patch.mapEmbedUrl = MAP;
  if (!String(config.phone ?? "").trim()) patch.phone = "01700-000000";
  if (!String(config.email ?? "").trim()) patch.email = "office@school.edu.bd";
  if (!String(config.youtube ?? "").trim()) patch.youtube = HERO_VIDEO;
  const stats = Array.isArray(config.stats) ? config.stats : [];
  const hasStat = stats.some((item) => String((item as { value?: string }).value ?? "").trim());
  if (!hasStat) {
    patch.stats = [
      { labelBn: "শিক্ষার্থী", labelEn: "Students", value: String(students || 450) },
      { labelBn: "শিক্ষক", labelEn: "Teachers", value: String(teachers || 28) },
      { labelBn: "বছর", labelEn: "Years", value: years },
    ];
  }
  const tasks = (Array.isArray(config.tasks) ? config.tasks : []).map((item) => ({
    titleBn: String((item as { titleBn?: string }).titleBn ?? ""),
    titleEn: String((item as { titleEn?: string }).titleEn ?? ""),
    bodyBn: String((item as { bodyBn?: string }).bodyBn ?? ""),
    bodyEn: String((item as { bodyEn?: string }).bodyEn ?? ""),
  }));
  if (!tasks.length) patch.tasks = defaultTasks();
  else if (
    tasks[0].bodyBn === "আইডি ও জন্মতারিখ দিয়ে প্রকাশিত ফল ও মার্কশিট।"
    || tasks[0].bodyEn === "A published result and marksheet with an ID and date of birth."
  ) {
    const fresh = defaultTasks()[0];
    tasks[0] = { ...tasks[0], bodyBn: fresh.bodyBn, bodyEn: fresh.bodyEn };
    patch.tasks = tasks;
  }
  const reasons = (Array.isArray(config.whyChooseUs) ? config.whyChooseUs : []).map((item) => ({
    titleBn: String((item as { titleBn?: string }).titleBn ?? ""),
    titleEn: String((item as { titleEn?: string }).titleEn ?? ""),
    bodyBn: String((item as { bodyBn?: string }).bodyBn ?? ""),
    bodyEn: String((item as { bodyEn?: string }).bodyEn ?? ""),
  }));
  const reason = reasons.find((item) => item.bodyBn === "পরীক্ষা প্রকাশের পর আইডি ও জন্মতারিখ দিয়ে দেখা যায়।" || item.bodyEn === "After an exam is published, families look it up with an ID and date of birth.");
  if (reason) {
    reason.bodyBn = "পরীক্ষা প্রকাশের পর শিক্ষার্থী আইডি দিয়ে দেখা যায়।";
    reason.bodyEn = "After an exam is published, families look it up with a student ID.";
    patch.whyChooseUs = reasons;
  }
  if (!String(config.admitTitleBn ?? "").trim() && !String(config.admitTitleEn ?? "").trim()) {
    Object.assign(patch, defaultAdmit());
  }
  if (!Array.isArray(config.desks) || config.desks.length === 0) patch.desks = defaultDesks();
  if (Object.keys(patch).length) await WebsiteConfig.updateOne({ _id: config._id }, { $set: patch });
}

async function fillPosts(): Promise<void> {
  const covers = [PHOTO.classroom, PHOTO.library, PHOTO.campus, PHOTO.walk, PHOTO.sports, PHOTO.culture, PHOTO.science];
  const alts = ["শ্রেণিকক্ষ", "পাঠাগার", "ক্যাম্পাস", "শিক্ষার্থী", "খেলা", "সাংস্কৃতিক অনুষ্ঠান", "বিজ্ঞানাগার"];
  const bare = await WebsitePost.find({ status: "published", coverUrl: { $in: ["", null] } });
  for (let index = 0; index < bare.length; index += 1) {
    const post = bare[index];
    post.coverUrl = covers[index % covers.length];
    if (!post.coverAlt?.trim()) post.coverAlt = alts[index % alts.length];
    await post.save();
  }
  const extras = [
    {
      kind: "news" as const,
      titleBn: "বিজ্ঞান মেলা ক্যাম্পাসে",
      titleEn: "Science fair on campus",
      bodyBn: "শিক্ষার্থীরা মডেল ও পোস্টার নিয়ে বিজ্ঞান মেলায় অংশ নিচ্ছে। অভিভাবক শেষ দিনে মাঠের পাশে প্রদর্শনী দেখতে পারবেন।",
      bodyEn: "Students are showing models and posters at the science fair. Families can visit the display beside the field on the last day.",
      coverUrl: PHOTO.science,
      coverAlt: "বিজ্ঞান মেলার প্রদর্শনী",
      seoDescriptionBn: "ক্যাম্পাসের বিজ্ঞান মেলায় শিক্ষার্থীদের মডেল, পোস্টার ও দেখার সময় জানুন।",
      seoDescriptionEn: "See student models and posters at the campus science fair, and when families may visit.",
    },
    {
      kind: "news" as const,
      titleBn: "পাঠাগার সপ্তাহ",
      titleEn: "Library week",
      bodyBn: "পাঠাগার সপ্তাহে প্রতিদিন পড়ার আসর বসবে। নতুন বইয়ের তালিকা নোটিশ বোর্ডে টাঙানো হবে।",
      bodyEn: "Library week has a reading hour each day. The list of new books will be pinned on the notice board.",
      coverUrl: PHOTO.library,
      coverAlt: "পাঠাগারে পড়ার আসর",
      seoDescriptionBn: "পাঠাগার সপ্তাহের পড়ার আসর এবং নতুন বইয়ের খবর এখানে প্রকাশিত হয়েছে।",
      seoDescriptionEn: "Reading hours and new books for library week are published on this page.",
    },
    {
      kind: "event" as const,
      titleBn: "বার্ষিক ক্রীড়া প্রতিযোগিতা",
      titleEn: "Annual sports day",
      bodyBn: "বার্ষিক ক্রীড়া প্রতিযোগিতা স্কুল মাঠে অনুষ্ঠিত হবে। দৌড়, লাফ ও দলগত খেলা শ্রেণি অনুযায়ী সাজানো হয়েছে।",
      bodyEn: "The annual sports day is on the school field. Races, jumps, and team games are grouped by class.",
      coverUrl: PHOTO.sports,
      coverAlt: "মাঠে ক্রীড়া প্রতিযোগিতা",
      eventDate: new Date("2026-12-18T04:00:00.000Z"),
      seoDescriptionBn: "বার্ষিক ক্রীড়া প্রতিযোগিতার দিন, মাঠ এবং শ্রেণি অনুযায়ী খেলার তালিকা দেখুন।",
      seoDescriptionEn: "Date, field, and class-wise games for the annual sports day at the school.",
    },
    {
      kind: "program" as const,
      titleBn: "স্কাউট ও গার্লস গাইড সমাবেশ",
      titleEn: "Scout and guide assembly",
      bodyBn: "স্কাউট ও গার্লস গাইড সমাবেশ সকালের সমাবেশে হবে। ইউনিফর্ম ও উপস্থিতির নিয়ম শ্রেণি শিক্ষক জানিয়ে দেবেন।",
      bodyEn: "The scout and guide assembly is at the morning gathering. Class teachers will share the uniform and attendance rules.",
      coverUrl: PHOTO.walk,
      coverAlt: "সকালের সমাবেশে শিক্ষার্থী",
      eventDate: new Date("2026-11-12T02:30:00.000Z"),
      seoDescriptionBn: "স্কাউট ও গার্লস গাইড সমাবেশের সময় এবং ইউনিফর্মের নিয়ম এখানে লেখা আছে।",
      seoDescriptionEn: "Time and uniform notes for the scout and guide assembly at the morning gathering.",
    },
  ];
  const published = await WebsitePost.countDocuments({ status: "published" });
  if (published >= 6) return;
  for (const extra of extras) {
    if (await WebsitePost.exists({ titleBn: extra.titleBn })) continue;
    const count = await WebsitePost.countDocuments({ status: "published" });
    if (count >= 6) return;
    await WebsitePost.create({ ...extra, pinned: false, status: "published" });
  }
}

async function fillAlbums(): Promise<void> {
  if (await WebsiteAlbum.exists({})) return;
  const albums = [
    {
      titleBn: "ক্যাম্পাস",
      titleEn: "Campus",
      kind: "campus" as const,
      coverUrl: PHOTO.campus,
      images: [
        { url: PHOTO.campus, alt: "ক্যাম্পাসের প্রধান ভবন" },
        { url: PHOTO.classroom, alt: "শ্রেণিকক্ষে পাঠ" },
        { url: PHOTO.library, alt: "পাঠাগার" },
      ],
    },
    {
      titleBn: "সাংস্কৃতিক অনুষ্ঠান",
      titleEn: "Cultural programme",
      kind: "cultural" as const,
      coverUrl: PHOTO.culture,
      images: [
        { url: PHOTO.culture, alt: "মঞ্চে সাংস্কৃতিক পরিবেশনা" },
        { url: PHOTO.walk, alt: "অনুষ্ঠানের দিন ক্যাম্পাস" },
      ],
      video: HERO_VIDEO,
    },
    {
      titleBn: "খেলাধুলা",
      titleEn: "Sports",
      kind: "sports" as const,
      coverUrl: PHOTO.sports,
      images: [
        { url: PHOTO.sports, alt: "খেলার মাঠ" },
        { url: PHOTO.campus, alt: "মাঠের পাশে ক্যাম্পাস" },
        { url: PHOTO.walk, alt: "দল নিয়ে হাঁটা" },
      ],
    },
  ];
  for (let index = 0; index < albums.length; index += 1) {
    const item = albums[index];
    const album = await WebsiteAlbum.create({
      titleBn: item.titleBn,
      titleEn: item.titleEn,
      kind: item.kind,
      coverUrl: item.coverUrl,
      status: "published",
      sortOrder: index,
    });
    for (const image of item.images) {
      await WebsiteMedia.create({
        albumId: album._id,
        kind: "image",
        url: image.url,
        alt: image.alt,
        captionBn: image.alt,
        captionEn: item.titleEn,
        status: "published",
      });
    }
    if ("video" in item && item.video) {
      await WebsiteMedia.create({
        albumId: album._id,
        kind: "video",
        videoUrl: item.video,
        alt: "ক্যাম্পাসের ভিডিও",
        captionBn: "ক্যাম্পাস ঘুরে দেখুন",
        captionEn: "A short look around campus",
        status: "published",
      });
    }
  }
}

async function fillPeople(): Promise<void> {
  const people = [
    { board: "principal", name: "নুরুল ইসলাম", designation: "প্রধান শিক্ষক", photoUrl: PORTRAITS[8], phone: "01711-100001", bioBn: "ক্যাম্পাসের দৈনন্দিন শিক্ষা ও শৃঙ্খলা দেখাশোনা করেন।", bioEn: "Looks after daily teaching and discipline on campus." },
    { board: "vice", name: "সালমা আক্তার", designation: "সহকারী প্রধান শিক্ষক", photoUrl: PORTRAITS[1], phone: "01711-100002", bioBn: "রুটিন, উপস্থিতি ও শ্রেণি শিক্ষকদের সঙ্গে সমন্বয় করেন।", bioEn: "Coordinates the routine, attendance, and class teachers." },
    { board: "librarian", name: "রেহানা খাতুন", designation: "গ্রন্থাগারিক", photoUrl: PORTRAITS[5], phone: "01711-100003", bioBn: "পাঠাগারের বই, কার্ড ও পড়ার আসর দেখেন।", bioEn: "Looks after books, cards, and the reading hour." },
    { board: "accounts", name: "কামরুল হাসান", designation: "হিসাবরক্ষক", photoUrl: PORTRAITS[4], phone: "01711-100004", bioBn: "ফি রসিদ ও মাসিক হিসাব অফিস থেকে দেন।", bioEn: "Issues fee receipts and monthly accounts from the office." },
    { board: "admission", name: "ফারহানা চৌধুরী", designation: "ভর্তি শাখা", photoUrl: PORTRAITS[7], phone: "01711-100005", bioBn: "আবেদনপত্র যাচাই ও ভর্তি নোটিশের দায়িত্বে আছেন।", bioEn: "Checks applications and the admission notice." },
    { board: "council", name: "ড. আনিসুর রহমান", designation: "একাডেমিক কাউন্সিলের সভাপতি", photoUrl: PORTRAITS[2], phone: "01711-100006", bioBn: "পাঠ্যক্রম ও পরীক্ষার নীতি নিয়ে কাউন্সিলে আলোচনা করেন।", bioEn: "Leads the council on curriculum and exam policy." },
    { board: "exam", name: "জাহাঙ্গীর আলম", designation: "পরীক্ষা নিয়ন্ত্রক", photoUrl: PORTRAITS[6], phone: "01711-100007", bioBn: "পরীক্ষার সময়সূচি, নম্বরপত্র ও প্রকাশিত ফল দেখেন।", bioEn: "Looks after the exam timetable, scripts, and published results." },
    { board: "clerk", name: "রুমানা আক্তার", designation: "অফিস সহকারী", photoUrl: PORTRAITS[3], phone: "01711-100008", bioBn: "চিঠি, নোটিশের খসড়া ও অফিসের কাগজ রাখেন।", bioEn: "Keeps letters, notice drafts, and office papers." },
    { board: "governing", name: "আবদুল মান্নান", designation: "পরিচালনা পর্ষদের সভাপতি", photoUrl: PORTRAITS[0], phone: "01711-100009", bioBn: "পর্ষদের সভা ও স্কুলের বড় সিদ্ধান্ত দেখেন।", bioEn: "Chairs the governing body and its main decisions." },
    { board: "governing", name: "ফরিদা ইয়াসমিন", designation: "পর্ষদ সদস্য", photoUrl: PORTRAITS[9], phone: "01711-100012", bioBn: "শিক্ষক নিয়োগ ও ক্যাম্পাসের নিরাপত্তা নিয়ে মত দেন।", bioEn: "Advises on teacher appointments and campus safety." },
    { board: "syndicate", name: "নাজমা বেগম", designation: "সিন্ডিকেট সদস্য", photoUrl: PORTRAITS[3], phone: "01711-100010", bioBn: "একাডেমিক নীতি ও বাজেট আলোচনায় থাকেন।", bioEn: "Joins discussions on academic policy and the budget." },
    { board: "syndicate", name: "ইকবাল হোসেন", designation: "সিন্ডিকেট সদস্য", photoUrl: PORTRAITS[6], phone: "01711-100013", bioBn: "পরীক্ষা ও ফল প্রকাশের সময়সূচি দেখেন।", bioEn: "Watches the exam and result calendar." },
    { board: "pta", name: "কামাল উদ্দিন", designation: "অভিভাবক কমিটির আহ্বায়ক", photoUrl: PORTRAITS[4], phone: "01711-100011", bioBn: "অভিভাবক সভার তারিখ ও আলোচ্য বিষয় জানান।", bioEn: "Sets parent meetings and what will be discussed." },
    { board: "pta", name: "শাহনাজ পারভীন", designation: "অভিভাবক প্রতিনিধি", photoUrl: PORTRAITS[5], phone: "01711-100014", bioBn: "অভিভাবকদের প্রশ্ন সভায় তোলেন।", bioEn: "Brings family questions to the meeting." },
  ];
  for (const person of people) {
    const rows = await WebsitePerson.find({ board: person.board, name: person.name }).sort({ createdAt: 1 });
    if (rows.length > 1) {
      await WebsitePerson.deleteMany({ _id: { $in: rows.slice(1).map((row) => row._id) } });
    }
  }
  const boards = [...new Set(people.map((person) => person.board))];
  const seedNames = new Set(people.map((person) => person.name));
  for (const board of boards) {
    const existing = await WebsitePerson.find({ board }).select("name");
    if (existing.some((person) => !seedNames.has(person.name))) continue;
    const have = new Set(existing.map((person) => person.name));
    const missing = people.filter((person) => person.board === board && !have.has(person.name));
    for (let index = 0; index < missing.length; index += 1) {
      await WebsitePerson.create({ ...missing[index], sortOrder: existing.length + index, status: "published" });
    }
  }
  const longer: Record<string, { bioBn: string; bioEn: string }> = {
    "নুরুল ইসলাম": { bioBn: "ক্যাম্পাসের দৈনন্দিন শিক্ষা ও শৃঙ্খলা দেখেন। ক্লাস চলাকালীন অফিসে থাকেন এবং অভিভাবকের প্রশ্ন অফিস সময়ে শোনেন।", bioEn: "Looks after daily teaching and discipline. Stays in the office during class and hears family questions in office hours." },
    "সালমা আক্তার": { bioBn: "রুটিন, উপস্থিতি ও শ্রেণি শিক্ষকদের সমন্বয় করেন। দেরিতে আসা শিক্ষার্থীর খাতা অফিসে রাখেন।", bioEn: "Coordinates the routine, attendance, and class teachers. Keeps the late-arrival note at the office." },
    "রেহানা খাতুন": { bioBn: "পাঠাগারের বই, কার্ড ও পড়ার আসর দেখেন। নতুন বই এলে নোটিশ বোর্ডে তালিকা দেন।", bioEn: "Looks after books, cards, and the reading hour. Pins a list when new books arrive." },
    "কামরুল হাসান": { bioBn: "ফি রসিদ ও মাসিক হিসাব অফিস থেকে দেন। অনলাইনে টাকা কাটা হয় না। রসিদ ছাড়া জমা লেখেন না।", bioEn: "Issues fee receipts and monthly accounts from the office. Nothing is charged online. A payment without a receipt is not entered." },
    "ফারহানা চৌধুরী": { bioBn: "আবেদনপত্র যাচাই ও ভর্তি নোটিশ দেখেন। কাগজ অফিসে জমা হয়। সিট নোটিশ ও আসন দেখে জানানো হয়।", bioEn: "Checks applications and the admission notice. Papers are handed in at the office. A seat is confirmed only after the notice and the seats are checked." },
    "ড. আনিসুর রহমান": { bioBn: "পাঠ্যক্রম ও পরীক্ষার নীতি নিয়ে কাউন্সিলে আলোচনা করেন। প্রকাশিত ফলের তারিখ নোটিশে থাকে।", bioEn: "Leads the council on curriculum and exam policy. The date of a published result is in a notice." },
    "জাহাঙ্গীর আলম": { bioBn: "পরীক্ষার সময়সূচি, নম্বরপত্র ও প্রকাশিত ফল দেখেন। কক্ষ ও দিন নোটিশে চূড়ান্ত হয়।", bioEn: "Looks after the exam timetable, scripts, and published results. The room and day are final in a notice." },
    "রুমানা আক্তার": { bioBn: "চিঠি, নোটিশের খসড়া ও অফিসের কাগজ রাখেন। অভিভাবক অফিস সময়ে এসে কপি নিতে পারেন।", bioEn: "Keeps letters, notice drafts, and office papers. Families can collect a copy during office hours." },
    "আবদুল মান্নান": { bioBn: "পর্ষদের সভা ডাকেন এবং স্কুলের বড় সিদ্ধান্তের খসড়া সভার আগে সদস্যদের দেন।", bioEn: "Calls governing-body meetings and shares draft decisions with members before the meeting." },
    "ফরিদা ইয়াসমিন": { bioBn: "শিক্ষক নিয়োগ ও ক্যাম্পাসের নিরাপত্তা নিয়ে মত দেন। সভার তারিখ নোটিশে থাকে।", bioEn: "Advises on teacher appointments and campus safety. The meeting date is in a notice." },
    "নাজমা বেগম": { bioBn: "একাডেমিক নীতি ও বাজেট আলোচনায় থাকেন। ফির হার অফিস ঘোষণা না করা পর্যন্ত সাইটে অঙ্ক বসে না।", bioEn: "Joins discussions on academic policy and the budget. Fee amounts are not published until the office announces them." },
    "ইকবাল হোসেন": { bioBn: "পরীক্ষা ও ফল প্রকাশের সময়সূচি দেখেন। অপ্রকাশিত নম্বর সাইটে আসে না।", bioEn: "Watches the exam and result calendar. Unpublished marks do not appear on the site." },
    "কামাল উদ্দিন": { bioBn: "অভিভাবক সভার তারিখ ও আলোচ্য বিষয় জানান। সভা অফিস সময়ে বা নোটিশে লেখা সময়ে বসে।", bioEn: "Sets parent meetings and the agenda. Meetings sit in office hours or at the time written in a notice." },
    "শাহনাজ পারভীন": { bioBn: "অভিভাবকদের প্রশ্ন সভায় তোলেন। ব্যক্তিগত ফোন বা ঠিকানা এই তালিকায় থাকে না।", bioEn: "Brings family questions to the meeting. Personal phone numbers and addresses are not on this list." },
  };
  for (const person of people) {
    const next = longer[person.name];
    if (!next) continue;
    const row = await WebsitePerson.findOne({ board: person.board, name: person.name });
    if (!row) continue;
    if (row.bioBn === person.bioBn || !String(row.bioBn ?? "").trim()) {
      row.bioBn = next.bioBn;
      row.bioEn = next.bioEn;
      await row.save();
    }
  }
}

async function fillFiles(): Promise<void> {
  const settings = await SchoolSettings.findOne().select("academicYear").lean();
  const year = settings?.academicYear || String(new Date().getFullYear());
  const files = [
    { kind: "syllabus" as const, titleBn: "বার্ষিক সিলেবাস", titleEn: "Annual syllabus", filename: "syllabus.pdf" },
    { kind: "routine" as const, titleBn: "সাধারণ ক্লাস রুটিন", titleEn: "General class routine", filename: "routine.pdf" },
    { kind: "prospectus" as const, titleBn: "প্রসপেক্টাস", titleEn: "Prospectus", filename: "prospectus.pdf" },
  ];
  for (const file of files) {
    if (await WebsiteFile.exists({ kind: file.kind })) continue;
    const data = tinyPdf();
    await WebsiteFile.create({
      ...file,
      academicYear: year,
      mime: "application/pdf",
      data,
      size: data.length,
      status: "published",
    });
  }
}

async function fillTeacherPhotos(): Promise<void> {
  const teachers = await Teacher.find({ isActive: true }).select("photoUrl");
  let cursor = 0;
  for (const teacher of teachers) {
    if (String(teacher.photoUrl ?? "").trim()) continue;
    teacher.photoUrl = PORTRAITS[cursor % PORTRAITS.length];
    cursor += 1;
    await teacher.save();
  }
}

function scrubResultDob(text: string): string {
  return text
    .replaceAll("শিক্ষার্থী আইডি ও জন্মতারিখ", "শিক্ষার্থী আইডি")
    .replaceAll("আইডি ও জন্মতারিখ", "শিক্ষার্থী আইডি")
    .replaceAll("the student ID and date of birth", "the student ID")
    .replaceAll("an ID and date of birth", "a student ID")
    .replaceAll("ID and date of birth", "a student ID");
}

function scrubStoredResultCopy(blocks: Block[]): boolean {
  let changed = false;
  for (const block of blocks) {
    const textBn = scrubResultDob(block.textBn ?? "");
    const textEn = scrubResultDob(block.textEn ?? "");
    if (textBn !== (block.textBn ?? "")) {
      block.textBn = textBn;
      changed = true;
    }
    if (textEn !== (block.textEn ?? "")) {
      block.textEn = textEn;
      changed = true;
    }
    if ((block.itemsBn ?? []).includes("মার্কশিট") && (block.itemsBn ?? []).includes("জন্মতারিখ")) {
      block.itemsBn = block.itemsBn.filter((item) => item !== "জন্মতারিখ");
      changed = true;
    }
    if ((block.itemsEn ?? []).includes("Marksheet") && (block.itemsEn ?? []).includes("Date of birth")) {
      block.itemsEn = block.itemsEn.filter((item) => item !== "Date of birth");
      changed = true;
    }
  }
  return changed;
}

function deepenStored(slug: string, school: SchoolBits, blocks: Block[], shorts: PageSection[]): boolean {
  let changed = false;
  for (let index = 0; index < blocks.length; index += 1) {
    if (blocks[index]?.type !== "heading") continue;
    const heading = (blocks[index]?.textBn ?? "").trim();
    const short = shorts.find((section) => section.headingBn === heading);
    const paragraph = blocks[index + 1];
    if (!short || paragraph?.type !== "paragraph") continue;
    const stored = (paragraph.textBn ?? "").trim();
    const prior = priorParagraph(slug, short);
    if (stored !== short.bn.trim() && stored !== prior) continue;
    const longer = deepenedSection(slug, short, school);
    if (longer.bn === short.bn) continue;
    paragraph.textBn = longer.bn;
    paragraph.textEn = longer.en;
    const list = blocks[index + 2];
    if (list?.type === "list" && list.itemsBn.join("|") === short.itemsBn.join("|")) {
      list.itemsBn = longer.itemsBn;
      list.itemsEn = longer.itemsEn;
    }
    changed = true;
  }
  return changed;
}

async function fillPages(): Promise<void> {
  const settings = await SchoolSettings.findOne().select("name address eiin academicYear establishedYear").lean();
  const school = {
    name: settings?.name || "স্কুল",
    address: settings?.address || "",
    eiin: settings?.eiin || "",
    year: settings?.academicYear || String(new Date().getFullYear()),
    established: settings?.establishedYear ? String(settings.establishedYear) : "",
  };
  const seeds = defaultPages();
  const pages = await WebsitePage.find();
  for (const page of pages) {
    const seed = seeds.find((item) => item.slug === page.slug);
    const image = PAGE_IMAGE[page.slug];
    const copy = showcaseCopy(page.slug, school);
    if (!seed || !image || !copy) continue;
    const blocks = (page.blocks ?? []) as Block[];
    const seedText = seed.blocks[0]?.textBn ?? "";
    const untouched = blocks.length === 1 && blocks[0]?.type === "paragraph" && (blocks[0].textBn ?? "").trim() === seedText.trim();
    const stale = blocks.some((block) => isStaleShowcase(block.textBn ?? "") || isStaleShowcase((block.itemsBn ?? []).join(" ")));
    const hasHeading = blocks.some((block) => block.type === "heading");
    const summaryStale = (page.summaryBn ?? "").includes(school.name);
    const extras = extraSections(page.slug, school);
    const pushSection = (written: Block[], section: { headingBn: string; headingEn: string; bn: string; en: string; itemsBn: string[]; itemsEn: string[] }) => {
      const heading = emptyBlock("heading");
      heading.textBn = section.headingBn;
      heading.textEn = section.headingEn;
      written.push(heading);
      const paragraph = emptyBlock("paragraph");
      paragraph.textBn = section.bn;
      paragraph.textEn = section.en;
      written.push(paragraph);
      if (section.itemsBn.length) {
        const list = emptyBlock("list");
        list.itemsBn = section.itemsBn;
        list.itemsEn = section.itemsEn;
        written.push(list);
      }
    };
    if (!hasHeading && (untouched || stale || summaryStale)) {
      const written: Block[] = [];
      const lead = emptyBlock("paragraph");
      lead.textBn = copy.leadBn;
      lead.textEn = copy.leadEn;
      written.push(lead);
      for (const section of [...copy.sections, ...extras]) pushSection(written, deepenedSection(page.slug, section, school));
      const picture = emptyBlock("image");
      picture.imageUrl = image.url;
      picture.alt = image.alt;
      written.push(picture);
      await WebsitePage.updateOne({ _id: page._id }, { $set: {
        blocks: written,
        summaryBn: copy.summaryBn.slice(0, 180),
        summaryEn: copy.summaryEn.slice(0, 180),
      } });
      continue;
    }
    const plain = blocks.map((block) => ({
      type: block.type,
      textBn: block.textBn ?? "",
      textEn: block.textEn ?? "",
      itemsBn: block.itemsBn ?? [],
      itemsEn: block.itemsEn ?? [],
      imageUrl: block.imageUrl ?? "",
      alt: block.alt ?? "",
    }));
    const headingSet = new Set(plain.filter((block) => block.type === "heading").map((block) => block.textBn.trim()));
    const missing = extras.filter((section) => !headingSet.has(section.headingBn));
    const added: Block[] = [];
    for (const section of missing) pushSection(added, section);
    let next = plain;
    if (added.length) {
      const imageAt = next.findIndex((block) => block.type === "image");
      next = imageAt < 0 ? [...next, ...added] : [...next.slice(0, imageAt), ...added, ...next.slice(imageAt)];
    }
    const hasImage = next.some((block) => block.type === "image" && String(block.imageUrl ?? "").trim());
    if (!hasImage) {
      const picture = emptyBlock("image");
      picture.imageUrl = image.url;
      picture.alt = image.alt;
      next = [...next, picture];
    }
    const deepened = deepenStored(page.slug, school, next, [...copy.sections, ...extras]);
    const scrubbed = scrubStoredResultCopy(next);
    const summaryBn = scrubResultDob(String(page.summaryBn ?? ""));
    const summaryEn = scrubResultDob(String(page.summaryEn ?? ""));
    const summaryChanged = summaryBn !== String(page.summaryBn ?? "") || summaryEn !== String(page.summaryEn ?? "");
    if (added.length || !hasImage || deepened || scrubbed || summaryChanged) {
      await WebsitePage.updateOne({ _id: page._id }, { $set: {
        blocks: next,
        ...(summaryChanged ? { summaryBn, summaryEn } : {}),
      } });
    }
  }
}

const CLIPS: Array<{ kind: "campus" | "cultural" | "sports"; url: string; alt: string; captionBn: string; captionEn: string }> = [
  { kind: "campus", url: HERO_VIDEO, alt: "ক্যাম্পাস ভিডিও", captionBn: "ক্যাম্পাস ঘুরে দেখুন", captionEn: "A short look around campus" },
  { kind: "cultural", url: "https://www.youtube.com/watch?v=LXb3EKWsInQ", alt: "অনুষ্ঠানের ভিডিও", captionBn: "সাংস্কৃতিক অনুষ্ঠানের ক্লিপ", captionEn: "A clip from a cultural programme" },
  { kind: "sports", url: "https://www.youtube.com/watch?v=7PIji8OubXU", alt: "খেলার ভিডিও", captionBn: "খেলার মাঠের ক্লিপ", captionEn: "A clip from the sports field" },
];

async function fillVideos(): Promise<void> {
  await WebsiteMedia.deleteMany({ videoUrl: { $regex: "aqz-KE-bpKQ|eRsGyueVLvQ" } });
  const clips = await WebsiteMedia.find({ kind: "video" }).select("_id videoUrl").sort({ createdAt: 1 }).lean();
  const seen = new Set<string>();
  const extra: string[] = [];
  for (const clip of clips) {
    const url = String(clip.videoUrl ?? "");
    if (!url || seen.has(url)) extra.push(String(clip._id));
    else seen.add(url);
  }
  if (extra.length) await WebsiteMedia.deleteMany({ _id: { $in: extra } });
  const albums = await WebsiteAlbum.find({ status: "published" }).select("kind").lean();
  if (!albums.length) return;
  for (const clip of CLIPS) {
    if (await WebsiteMedia.exists({ videoUrl: clip.url })) continue;
    const album = albums.find((item) => item.kind === clip.kind) ?? albums[0];
    await WebsiteMedia.create({
      albumId: album._id,
      kind: "video",
      videoUrl: clip.url,
      alt: clip.alt,
      captionBn: clip.captionBn,
      captionEn: clip.captionEn,
      status: "published",
    });
  }
}

export async function ensureWebsiteShowcase(): Promise<void> {
  await Notice.updateMany(
    { body: "প্রকাশিত পরীক্ষার ফল এই সাইটে শিক্ষার্থী আইডি ও জন্মতারিখ দিয়ে দেখা যায়। মিল না হলে একই বার্তা আসে। অপ্রকাশিত ফল এখানে নেই।" },
    { $set: { body: "প্রকাশিত পরীক্ষার ফল এই সাইটে শিক্ষার্থী আইডি দিয়ে দেখা যায়। মিল না হলে একই বার্তা আসে। অপ্রকাশিত ফল এখানে নেই।" } },
  );
  await fillConfig();
  await fillPosts();
  await fillAlbums();
  await fillVideos();
  await fillPeople();
  await fillFiles();
  await fillTeacherPhotos();
  await fillPages();
  await ensureAcademicShowcase();
}
