import { ClassStructure } from "../../../models/ClassStructure";
import { Routine } from "../../../models/Routine";
import { SchoolSettings } from "../../../models/SchoolSettings";
import { Subject } from "../../../models/Subject";
import { SyllabusOutline } from "../../../models/Syllabus";
import { Teacher } from "../../../models/Teacher";

type Lines = { bn: string[]; en: string[] };

function lines(pairs: Array<[string, string]>): Lines {
  return { bn: pairs.map((pair) => pair[0]), en: pairs.map((pair) => pair[1]) };
}

const EARLY: Record<string, Lines> = {
  bangla: lines([["ছড়া", "A rhyme"], ["বর্ণ চেনা", "Letter shapes"], ["ছোট শব্দ", "Short words"], ["ছবি দেখে বলা", "Talking about a picture"]]),
  english: lines([["Songs", "Songs"], ["A to Z", "A to Z"], ["Colours", "Colours"], ["My name", "My name"]]),
  math: lines([["গোনা", "Counting"], ["আকার", "Shapes"], ["বড় ও ছোট", "Big and small"], ["খেলার সংখ্যা", "Numbers in play"]]),
  general: lines([["খেলা", "Play"], ["রং", "Colours"], ["গল্প", "A story"], ["হাতের কাজ", "Handwork"]]),
};

const PRIMARY: Record<string, Lines> = {
  bangla: lines([["পঠন", "Reading"], ["শব্দভাণ্ডার", "Word stock"], ["ছোট রচনা", "A short composition"], ["ব্যাকরণের ভিত্তি", "Grammar basics"], ["পুনরালোচনা", "Review"]]),
  english: lines([["Letters and words", "Letters and words"], ["A short paragraph", "A short paragraph"], ["Questions and answers", "Questions and answers"], ["Simple grammar", "Simple grammar"], ["Reading aloud", "Reading aloud"]]),
  arabic: lines([["অক্ষর", "Letters"], ["শব্দ", "Words"], ["ছোট বাক্য", "Short sentences"], ["পাঠ", "Reading"], ["পুনরাবৃত্তি", "Repetition"]]),
  math: lines([["সংখ্যা", "Numbers"], ["যোগ ও বিয়োগ", "Addition and subtraction"], ["গুণ", "Multiplication"], ["আকার ও মাপ", "Shape and measure"], ["অনুশীলন", "Practice"]]),
  sci: lines([["আমাদের চারপাশ", "Around us"], ["গাছ ও প্রাণী", "Plants and animals"], ["পানি ও বাতাস", "Water and air"], ["স্বাস্থ্য", "Health"], ["পর্যবেক্ষণ", "Observation"]]),
  bgs: lines([["আমার পরিবার", "My family"], ["স্কুল ও এলাকা", "School and area"], ["বাংলাদেশ", "Bangladesh"], ["দিনপঞ্জি", "The calendar"], ["নাগরিক অভ্যাস", "Civic habits"]]),
  rel: lines([["পরিচিতি", "Introduction"], ["নৈতিক গল্প", "A moral story"], ["দৈনিক অভ্যাস", "Daily habits"], ["সম্মান", "Respect"], ["পুনরালোচনা", "Review"]]),
  pe: lines([["উষ্ণতা", "Warm-up"], ["দৌড়", "Running"], ["দলগত খেলা", "Team play"], ["নিয়ম", "Rules"], ["শীতলকরণ", "Cool-down"]]),
  ict: lines([["যন্ত্র চেনা", "Knowing a device"], ["টাইপ", "Typing"], ["নিরাপদ ব্যবহার", "Safe use"], ["একটি কাজ", "One task"], ["অনুশীলন", "Practice"]]),
  general: lines([["ভূমিকা", "Introduction"], ["মূল ধারণা", "The main idea"], ["উদাহরণ", "Examples"], ["অনুশীলন", "Practice"], ["পুনরালোচনা", "Review"]]),
};

const UPPER: Record<string, Lines> = {
  bangla: lines([["গদ্য পাঠ", "Prose reading"], ["কবিতা", "Poetry"], ["ব্যাকরণ", "Grammar"], ["রচনা ও চিঠি", "Composition and letters"], ["পুনরালোচনা", "Review"]]),
  english: lines([["Seen passage", "Seen passage"], ["Unseen passage", "Unseen passage"], ["Grammar in use", "Grammar in use"], ["Writing a paragraph", "Writing a paragraph"], ["Revision", "Revision"]]),
  arabic: lines([["পাঠ", "Reading"], ["অনুবাদ", "Translation"], ["ব্যাকরণ", "Grammar"], ["শব্দভাণ্ডার", "Vocabulary"], ["পুনরালোচনা", "Review"]]),
  math: lines([["সংখ্যা ও বীজগণিত", "Number and algebra"], ["জ্যামিতি", "Geometry"], ["সমীকরণ", "Equations"], ["পরিমাপ", "Measurement"], ["অনুশীলনী", "Exercises"]]),
  hmath: lines([["বীজগণিত", "Algebra"], ["জ্যামিতি", "Geometry"], ["ত্রিকোণমিতি", "Trigonometry"], ["সমস্যা সমাধান", "Problem solving"], ["পুনরালোচনা", "Review"]]),
  sci: lines([["পদার্থ", "Matter"], ["জীবজগৎ", "Living things"], ["শক্তি", "Energy"], ["পরিবেশ", "Environment"], ["পরীক্ষা", "A practical"]]),
  physics: lines([["পরিমাপ", "Measurement"], ["গতি", "Motion"], ["বল", "Force"], ["তাপ ও আলো", "Heat and light"], ["ব্যবহারিক", "Practical work"]]),
  chem: lines([["পদার্থের অবস্থা", "States of matter"], ["পরমাণু", "The atom"], ["রাসায়নিক বিক্রিয়া", "Chemical change"], ["অ্যাসিড ও ক্ষার", "Acids and bases"], ["ব্যবহারিক", "Practical work"]]),
  bio: lines([["কোষ", "The cell"], ["উদ্ভিদ", "Plants"], ["প্রাণী", "Animals"], ["মানবদেহ", "The human body"], ["ব্যবহারিক", "Practical work"]]),
  bgs: lines([["বাংলাদেশের ভূগোল", "Geography of Bangladesh"], ["ইতিহাসের ধারা", "A line of history"], ["সমাজ", "Society"], ["অর্থনীতি", "The economy"], ["নাগরিক দায়িত্ব", "Civic duty"]]),
  ict: lines([["তথ্য", "Information"], ["হার্ডওয়্যার ও সফটওয়্যার", "Hardware and software"], ["নেটওয়ার্ক", "Networks"], ["নিরাপত্তা", "Safety"], ["প্রজেক্ট", "A project"]]),
  acc: lines([["লেনদেন", "Transactions"], ["খতিয়ান", "The ledger"], ["আয় ও ব্যয়", "Income and expense"], ["আর্থিক বিবরণী", "Statements"], ["অনুশীলন", "Practice"]]),
  fin: lines([["অর্থ", "Money"], ["ব্যাংক", "Banks"], ["সঞ্চয়", "Saving"], ["ঝুঁকি", "Risk"], ["পুনরালোচনা", "Review"]]),
  biz: lines([["ব্যবসার ধারণা", "What a business is"], ["উদ্যোগ", "Enterprise"], ["বাজার", "The market"], ["হিসাবের ভূমিকা", "Why accounts matter"], ["কেস", "A case"]]),
  rel: lines([["বিশ্বাস ও চর্চা", "Belief and practice"], ["নৈতিকতা", "Ethics"], ["জীবনচরিত", "A life story"], ["সমাজে আচরণ", "Conduct in society"], ["পুনরালোচনা", "Review"]]),
  pe: lines([["ফিটনেস", "Fitness"], ["দলগত খেলা", "Team games"], ["নিয়ম ও নিরাপত্তা", "Rules and safety"], ["কৌশল", "Tactics"], ["মূল্যায়ন", "A check"]]),
  general: lines([["ভূমিকা", "Introduction"], ["মূল অধ্যায়", "The main chapter"], ["উদাহরণ", "Examples"], ["অনুশীলনী", "Exercises"], ["পুনরালোচনা", "Review"]]),
};

function family(name: string): string {
  const value = name.toLowerCase();
  if (value.includes("bangla") || value.includes("বাংলা")) return "bangla";
  if (value.includes("english") || value.includes("ইংরেজি")) return "english";
  if (value.includes("arabic") || value.includes("আরবি")) return "arabic";
  if (value.includes("higher math") || value.includes("উচ্চতর")) return "hmath";
  if (value.includes("math") || value.includes("গণিত")) return "math";
  if (value.includes("physics") || value.includes("পদার্থ")) return "physics";
  if (value.includes("chem") || value.includes("রসায়ন")) return "chem";
  if (value.includes("bio") || value.includes("জীব")) return "bio";
  if (value.includes("ict") || value.includes("তথ্য")) return "ict";
  if (value.includes("account") || value.includes("হিসাব")) return "acc";
  if (value.includes("finance") || value.includes("ফিন্যান্স")) return "fin";
  if (value.includes("business") || value.includes("ব্যবসা") || value.includes("entrepreneur")) return "biz";
  if (value.includes("islam") || value.includes("religion") || value.includes("ধর্ম") || value.includes("hindu") || value.includes("moral")) return "rel";
  if (value.includes("physical") || value.includes("শারীর")) return "pe";
  if (value.includes("science") || value.includes("বিজ্ঞান")) return "sci";
  if (value.includes("bangladesh") || value.includes("global") || value.includes("বিশ্ব") || value.includes("history") || value.includes("ইতিহাস") || value.includes("civics") || value.includes("পৌর")) return "bgs";
  return "general";
}

function outlineFor(name: string, level: number): Lines {
  const key = family(name);
  if (level <= 0) return EARLY[key] ?? EARLY.general;
  if (level <= 5) return PRIMARY[key] ?? PRIMARY.general;
  return UPPER[key] ?? UPPER.general;
}

function sectionNames(sections: unknown): string[] {
  if (!Array.isArray(sections)) return ["A"];
  const names = sections
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object" && "name" in item) return String((item as { name?: unknown }).name ?? "").trim();
      return "";
    })
    .filter(Boolean);
  return names.length ? names : ["A"];
}

async function fillRoutines(): Promise<void> {
  const [classes, teachers] = await Promise.all([
    ClassStructure.find({ isActive: true }).select("sections").lean(),
    Teacher.find({ isActive: true }).select("_id").lean(),
  ]);
  if (!teachers.length) return;
  for (const item of classes) {
    const subjects = await Subject.find({ classId: item._id, isActive: true }).select("_id").lean();
    if (!subjects.length) continue;
    for (const section of sectionNames(item.sections)) {
      if (await Routine.exists({ classId: item._id, section })) continue;
      const slots = [];
      for (let day = 0; day <= 4; day += 1) {
        for (let period = 1; period <= 6; period += 1) {
          const index = day * 6 + (period - 1);
          slots.push({
            classId: item._id,
            section,
            day,
            period,
            subjectId: subjects[index % subjects.length]._id,
            teacherId: teachers[index % teachers.length]._id,
          });
        }
      }
      await Routine.insertMany(slots);
    }
  }
}

async function fillSyllabus(): Promise<void> {
  const settings = await SchoolSettings.findOne().select("academicYear").lean();
  const year = settings?.academicYear || String(new Date().getFullYear());
  const classes = await ClassStructure.find({ isActive: true }).select("level").lean();
  for (const item of classes) {
    const subjects = await Subject.find({ classId: item._id, isActive: true }).select("name nameBn").lean();
    for (const subject of subjects) {
      if (await SyllabusOutline.exists({ classId: item._id, subjectId: subject._id, academicYear: year })) continue;
      const linesFor = outlineFor(`${subject.name} ${subject.nameBn ?? ""}`, item.level);
      await SyllabusOutline.create({
        classId: item._id,
        subjectId: subject._id,
        academicYear: year,
        chaptersBn: linesFor.bn,
        chaptersEn: linesFor.en,
      });
    }
  }
}

export async function ensureAcademicShowcase(): Promise<void> {
  await fillRoutines();
  await fillSyllabus();
}
