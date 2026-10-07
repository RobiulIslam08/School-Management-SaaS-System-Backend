import type { PageSection, SchoolBits } from "./website.showcase-copy";

type Extra = { bn: string; en: string; itemsBn: string[]; itemsEn: string[]; priorBn?: string; priorEn?: string };

const EXTRA: Record<string, Extra> = {
  "history:প্রতিষ্ঠা": {
    bn: "ক্লাস সকালের রুটিনে বসে। পরীক্ষার তারিখ আগে নোটিশে আসে। সহশিক্ষা ক্লাসের পরে, একই উপস্থিতির নিয়মে। নতুন সালের খবর অফিস সময় জানা যায়।",
    en: "Classes sit on the morning routine. An exam date arrives first as a notice. Activities after class follow the same attendance rule. News for a new year is given in office hours.",
    itemsBn: ["সকালের রুটিন", "পরীক্ষার তারিখ নোটিশে"],
    itemsEn: ["The morning routine", "Exam dates by notice"],
  },
  "history:ক্যাম্পাস": {
    bn: "যে ঘর চালু নেই তা এই পাতায় বা গ্যালারিতে রাখা হয় না। ভিতরে দেখতে অফিস সময়ে আসুন। ফোন ও ম্যাপ যোগাযোগ পাতায়।",
    en: "A room that is not in use is not listed here or in the gallery. Come during office hours to look inside. The phone and map are on the contact page.",
    itemsBn: ["অফিস সময়ে পরিদর্শন", "ম্যাপ যোগাযোগ পাতায়"],
    itemsEn: ["A visit in office hours", "The map is on the contact page"],
  },
  "history:YEAR": {
    bn: "রুটিন ও সিলেবাস ক্লাস বেছে দেখা যায়। নোটিশ বোর্ডে ছুটি ও পরীক্ষা। প্রকাশিত ফল শিক্ষার্থী আইডি দিয়ে। তারিখ বদলালে পুরনো লেখা মুছে নোটিশ আগে বসে।",
    en: "The routine and syllabus open after a class is chosen. Holidays and exams are on the notice board. A published result needs a student ID. If a date changes, the old line is replaced and a notice comes first.",
    itemsBn: ["ক্লাস বেছে রুটিন", "প্রকাশিত ফল আইডি দিয়ে"],
    itemsEn: ["Routine after choosing a class", "A published result with an ID"],
  },
  "history:অভিভাবকের জন্য": {
    bn: "শিক্ষকের অফিস ফোন কার্ডে থাকতে পারে। শিক্ষার্থী বা অভিভাবকের ব্যক্তিগত নম্বর, বাড়ির ঠিকানা ও জন্মনিবন্ধন এই সাইটে আসে না। প্রশ্ন অফিস সময়ে।",
    en: "A teacher's office phone may sit on a card. A student's or guardian's personal number, home address, and birth registration number do not appear here. Questions wait for office hours.",
    itemsBn: ["শিক্ষার্থীর ফোন নেই", "প্রশ্ন অফিস সময়ে"],
    itemsEn: ["No student phone numbers", "Questions in office hours"],
  },
  "mission:মিশন": {
    bn: "প্রতিটি পিরিয়ডে একজন শিক্ষক দায়িত্বে থাকেন। খাতা দেখা হয় ক্লাসে। পিছিয়ে পড়া শিক্ষার্থীকে শ্রেণি শিক্ষক অফিস সময়ে ডাকেন।",
    en: "One teacher is responsible for each period. Exercise books are seen in class. A class teacher calls a student who is falling behind, during office hours.",
    itemsBn: ["পিরিয়ডে শিক্ষক", "খাতা ক্লাসে"],
    itemsEn: ["A teacher each period", "Books seen in class"],
  },
  "mission:ভিশন": {
    bn: "সময়মতো আসা, বই খোলা, এবং সহপাঠীকে সম্মান — এই তিনটি প্রতিদিন দেখা হয়। দেরি হলে কারণ অফিসে লেখা হয়। মোবাইল ক্লাসে বন্ধ।",
    en: "Arriving on time, opening a book, and respect for classmates are watched every day. A late arrival is written down at the office. Phones stay off in class.",
    itemsBn: ["তিনটি দৈনিক অভ্যাস", "মোবাইল ক্লাসে বন্ধ"],
    itemsEn: ["Three daily habits", "Phones off in class"],
  },
  "mission:অভিভাবক যা দেখেন": {
    bn: "নোটিশ, রুটিন, সিলেবাস ও প্রকাশিত ফল এই সাইটে। ফি নগদ, বিকাশ, নগদ, রকেট, ব্যাংক বা চেকে অফিসে। রসিদ না নিলে জমা ধরা হয় না। অঙ্ক অফিস জানায়।",
    en: "Notices, the routine, the syllabus, and published results are on this site. Fees are paid at the office by cash, bKash, Nagad, Rocket, bank, or cheque. A payment without a receipt is not recorded. The office states the amount.",
    itemsBn: ["সিলেবাস সাইটে", "রসিদ অফিস থেকে"],
    itemsEn: ["The syllabus is on the site", "The receipt comes from the office"],
  },
  "principal:বাণী": {
    bn: "ক্লাসে মন না দিলে শ্রেণি শিক্ষক অভিভাবককে অফিস সময়ে জানাতে পারেন। প্রশ্ন চিঠি বা ফোনেও যায়, জবাব অফিস সময়ের মধ্যে। ব্যক্তিগত বিষয় প্রকাশিত হয় না।",
    en: "If attention slips, the class teacher may tell the family during office hours. A question may also come by letter or phone, and the reply stays inside office hours. Private matters are not published.",
    itemsBn: ["অভিভাবককে জানানো", "জবাব অফিস সময়ে"],
    itemsEn: ["The family is told", "A reply in office hours"],
  },
  "principal:যা আমরা দেখি": {
    bn: "উপস্থিতি রেজিস্টারে, খাতা ক্লাসে, আচরণ সমাবেশে। প্রকাশিত ফল শিক্ষার্থী আইডি দিয়ে। অপ্রকাশিত নম্বর এই পাতায় আসে না।",
    en: "Attendance is in the register, books are in class, and conduct is seen at assembly. A published result needs a student ID. Unpublished marks do not appear on this page.",
    itemsBn: ["রেজিস্টার", "অপ্রকাশিত নম্বর নেই"],
    itemsEn: ["The register", "No unpublished marks"],
  },
  "principal:যোগাযোগ": {
    bn: "ফোন ও ম্যাপ যোগাযোগ পাতায়। সাক্ষাৎ অফিস সময়ে, আগে ফোন করলে ভালো। জরুরি খবর নোটিশ বোর্ডে।",
    en: "The phone and map are on the contact page. A meeting is in office hours, and a call ahead helps. Urgent news is on the notice board.",
    itemsBn: ["আগে ফোন", "জরুরি খবর নোটিশে"],
    itemsEn: ["Call ahead", "Urgent news by notice"],
  },
  "facilities:শ্রেণিকক্ষ": {
    bn: "কোন পিরিয়ডে কোন বিষয়, রুটিন পাতায়। বিষয়ের অধ্যায় সিলেবাসে। নতুন কক্ষ চালু হলে এই পাতা ও গ্যালারি একসঙ্গে বদলায়।",
    en: "Which subject sits in which period is on the routine page. Chapters are on the syllabus. A new room, once it is in use, is added here and in the gallery together.",
    itemsBn: ["রুটিনে পিরিয়ড", "সিলেবাসে অধ্যায়"],
    itemsEn: ["Periods on the routine", "Chapters on the syllabus"],
  },
  "facilities:পাঠাগার": {
    bn: "কার্ড গ্রন্থাগারিকের কাছে। বই বাড়ি নেওয়া গেলে ফেরতের দিন কার্ডে। পড়ার আসর হলে তারিখ নোটিশে, এই পাতায় উদ্ভাবিত সময় নেই।",
    en: "Cards stay with the librarian. If a book goes home, the return day is on the card. A reading hour, when held, is dated in a notice. This page does not invent a time.",
    itemsBn: ["কার্ড গ্রন্থাগারিকে", "আসরের তারিখ নোটিশে"],
    itemsEn: ["Cards with the librarian", "The hour is dated by notice"],
  },
  "facilities:মাঠ ও প্রবেশ": {
    bn: "খেলা মাঠে, রুটিনের বাইরে বা ক্রীড়ার দিনে। প্রবেশের সময় অফিস জানে। অভিভাবক অফিস সময়ে ঢুকবেন, গেটে নাম বলবেন।",
    en: "Games are on the field, outside the routine or on sports day. The office knows the entrance hours. A family enters during office hours and gives a name at the gate.",
    itemsBn: ["গেটে নাম", "ক্রীড়ার দিন নোটিশে"],
    itemsEn: ["A name at the gate", "Sports day by notice"],
  },
  "achievements:পরীক্ষা": {
    bn: "এখানে শুধু যাচাই করা নাম। নম্বর, জিপিএ বা মেধাস্থান ফলাফল পাতায়, প্রকাশের পর। অপ্রকাশিত ফল এই তালিকায় বসে না।",
    en: "Only checked names go here. Marks, GPA, or a merit place are on the results page after publication. An unpublished result is not added to this list.",
    itemsBn: ["যাচাই করা নাম", "নম্বর ফলাফল পাতায়"],
    itemsEn: ["Checked names", "Marks on the results page"],
  },
  "achievements:ক্রীড়া": {
    bn: "দৌড়, দলগত খেলা ও বার্ষিক ক্রীড়ার পুরস্কার আলাদা লাইনে। তারিখ ও বিজয়ী নোটিশ বা অনুষ্ঠান সেকশনে। মাঠের ছবি গ্যালারির খেলার অ্যালবামে।",
    en: "Prizes for races, team games, and the annual sports day sit on separate lines. The date and the winner are in a notice or with the programmes. Field photos are in the sports album.",
    itemsBn: ["বিজয়ী নোটিশে", "খেলার অ্যালবাম"],
    itemsEn: ["The winner in a notice", "The sports album"],
  },
  "achievements:সংস্কৃতি": {
    bn: "সংগীত, আবৃত্তি ও নাটকের পুরস্কার এই সেকশনে। ছবি সাংস্কৃতিক অ্যালবামে। নতুন নাম স্টাফ যোগ করেন, পুরনো নাম মুছে যায় যখন অফিস বলে।",
    en: "Prizes for music, recitation, and drama sit in this section. Photos are in the cultural album. Staff add a new name, and an old name is removed when the office says so.",
    itemsBn: ["সাংস্কৃতিক অ্যালবাম", "নাম অফিস ঠিক করে"],
    itemsEn: ["The cultural album", "The office decides the names"],
  },
  "admission-info:কখন আবেদন": {
    bn: "ফর্ম খোলার ও বন্ধের তারিখ ভর্তি নোটিশে। নোটিশের আগে জমা নিলেও আবেদন অপেক্ষমাণ থাকে। আসন পূর্ণ হলে অফিস নোটিশে জানায়। সংখ্যা এই পাতায় নেই।",
    en: "The opening and closing dates are in the admission notice. An application sent before the notice still stays pending. When seats are full, the office says so in a notice. The number is not on this page.",
    itemsBn: ["তারিখ নোটিশে", "আসন সংখ্যা অফিসে"],
    itemsEn: ["Dates in the notice", "The seat count is at the office"],
  },
  "admission-info:এক পাতার ফর্ম": {
    bn: "নাম, বাংলা নাম, জন্মতারিখ, জন্মনিবন্ধন, ক্লাস, ঠিকানা, বাবা-মা ও অভিভাবক এক ফর্মে। ধাপ নেই। জমা মানে অপেক্ষমাণ। স্কুল অনুমোদন না করা পর্যন্ত ভর্তি নয়।",
    en: "Name, Bangla name, date of birth, birth registration, class, address, parents, and guardian sit on one form. There are no steps. Submitting means pending. It is not admission until the school approves it.",
    itemsBn: ["এক ফর্ম", "অনুমোদনের পর ভর্তি"],
    itemsEn: ["One form", "Admission after approval"],
  },
  "admission-info:ফি": {
    bn: "অনলাইনে টাকা কাটা হয় না। ভর্তি ফি অফিসে। মাধ্যম নগদ, বিকাশ, নগদ, রকেট, ব্যাংক বা চেক। রসিদ হিসাব শাখা দেয়। চলতি অঙ্ক অফিস বলে, এই পাতায় বসে না।",
    en: "Nothing is charged online. The admission fee is paid at the office by cash, bKash, Nagad, Rocket, bank, or cheque. Accounts issues the receipt. The current amount is spoken at the office and is not printed here.",
    itemsBn: ["হিসাব শাখায় রসিদ", "অঙ্ক অফিসে"],
    itemsEn: ["The receipt is at accounts", "The amount is at the office"],
  },
  "eligibility:শ্রেণি": {
    bn: "প্রাক-প্রাথমিক থেকে মাধ্যমিক ক্লাস পাতায়, বিষয়সহ। কোন শ্রেণি এ বছর খোলা তা ভর্তি নোটিশে। ফর্মে সেই ক্লাস বেছে আবেদন করা হয়।",
    en: "Classes from early years through secondary are on the classes page, with subjects. Which class is open this year is in the admission notice. The form asks the family to choose that class.",
    itemsBn: ["ক্লাস পাতা", "ফর্মে ক্লাস বাছাই"],
    itemsEn: ["The classes page", "The form asks for a class"],
  },
  "eligibility:আসন": {
    bn: "আসন অফিস ঠিক করে। পূর্ণ হলে নতুন আবেদন বন্ধ হতে পারে, নোটিশে লেখা হয়। এই পাতায় সংখ্যা উদ্ভাবন করা হয় না। জানতে ভর্তি শাখায় যান।",
    en: "The office sets the seats. When a class is full, new applications can stop, and that is written in a notice. This page does not invent a number. Ask the admission desk.",
    itemsBn: ["পূর্ণ হলে নোটিশ", "ভর্তি শাখায় জিজ্ঞাসা"],
    itemsEn: ["A notice when full", "Ask the admission desk"],
  },
  "eligibility:বয়স": {
    bn: "বয়সসীমা শ্রেণি অনুযায়ী নোটিশে। জন্মনিবন্ধন বা সত্যায়িত কপি কাগজের তালিকায়। ফর্মে জন্মতারিখ দিলে অফিস কাগজের সঙ্গে মিলায়।",
    en: "The age range for each class is in the notice. A birth certificate or a certified copy is on the document list. The date of birth on the form is checked against that paper.",
    itemsBn: ["কাগজের সঙ্গে মিল", "সীমা নোটিশে"],
    itemsEn: ["Checked against the paper", "The range is in the notice"],
  },
  "documents:শিক্ষার্থীর কাগজ": {
    priorBn: "জন্মনিবন্ধন, পাসপোর্ট সাইজের ছবি, এবং আগের স্কুল থাকলে ছাড়পত্র। কপি স্পষ্ট হতে হবে। অনলাইন ফর্মে ফাইল তোলা হয় না। কাগজ ভর্তি শাখায়।",
    priorEn: "A birth certificate, passport-size photos, and a release letter if there was a previous school. Copies should be clear. The online form does not take a file. Papers go to the admission desk.",
    bn: "কপি স্পষ্ট হতে হবে। অনলাইন ফর্মে ফাইল তোলা হয় না। কাগজ ভর্তি শাখায়।",
    en: "Copies should be clear. The online form does not take a file. Papers go to the admission desk.",
    itemsBn: ["স্পষ্ট কপি", "ফাইল তোলা হয় না"],
    itemsEn: ["Clear copies", "No file upload"],
  },
  "documents:অভিভাবকের কাগজ": {
    priorBn: "জাতীয় পরিচয়পত্রের কপি। ফর্মে অভিভাবকের নাম ও ফোন বাধ্যতামূলক। মূল কপি দেখতে চাইলে ভর্তি শাখা জানাবে। অন্য কাগজ নোটিশে বাড়তি থাকলে সেটাই চূড়ান্ত।",
    priorEn: "A copy of the national identity card. The form requires the guardian's name and phone. The admission desk will say if an original is needed. An extra paper in the notice is the final list.",
    bn: "ফর্মে অভিভাবকের নাম ও ফোন বাধ্যতামূলক। অন্য কাগজ নোটিশে বাড়তি থাকলে সেটাই চূড়ান্ত।",
    en: "The form requires the guardian's name and phone. An extra paper in the notice is the final list.",
    itemsBn: ["নাম ও ফোন বাধ্যতামূলক", "বাড়তি কাগজ নোটিশে"],
    itemsEn: ["Name and phone are required", "Extra papers are in the notice"],
  },
  "documents:যেভাবে জমা": {
    bn: "আগে অনলাইনে ফর্ম, পরে কাগজ অফিসে। দুটো আলাদা। কাগজ না দিলে আবেদন অপেক্ষমাণই থাকে। অনুমোদন স্কুল করে, তারপর ভর্তি।",
    en: "The online form comes first, then the papers at the office. They are two steps. Without the papers the application stays pending. The school approves it, and only then is it an admission.",
    itemsBn: ["ফর্ম আগে", "কাগজ পরে", "অনুমোদন স্কুলের"],
    itemsEn: ["The form first", "Papers later", "The school approves"],
  },
  "fees-info:কী কী ফি": {
    bn: "ভর্তির সময় একবার, সেশন শুরুতে, এবং মাসিক বেতন। অঙ্ক এই পাতায় নেই। অফিস নিশ্চিত করলে নোটিশে লেখা হতে পারে। তার আগে কোনো সংখ্যা বসানো হয় না।",
    en: "Once at admission, once at the start of the session, and a monthly fee. Amounts are not on this page. They may be written in a notice after the office confirms them. No number is added before that.",
    itemsBn: ["অঙ্ক নোটিশে", "পাতায় সংখ্যা নেই"],
    itemsEn: ["Amounts in a notice", "No number on this page"],
  },
  "fees-info:যেভাবে জমা": {
    bn: "নগদ, বিকাশ, নগদ, রকেট, ব্যাংক বা চেক — যে মাধ্যম অফিস খোলা রাখে। প্রতিটি জমায় রসিদ। রেফারেন্স নম্বর থাকলে রসিদে লেখা হয়। এই সাইটে গেটওয়ে নেই।",
    en: "Cash, bKash, Nagad, Rocket, bank, or cheque, whichever the office accepts. Every payment gets a receipt. A reference number, when there is one, is written on it. This site has no gateway.",
    itemsBn: ["রেফারেন্স রসিদে", "গেটওয়ে নেই"],
    itemsEn: ["The reference is on the receipt", "No gateway"],
  },
  "fees-info:রসিদ": {
    bn: "রসিদ ছাড়া জমা ধরা হয় না। হিসাব শাখা রসিদ দেয়। হারানো রসিদের কথা অফিস সময়ে হিসাব শাখায়। কপি নোটিশে চাওয়া হতে পারে।",
    en: "A payment without a receipt is not recorded. The accounts desk issues the receipt. A lost receipt is raised with accounts during office hours. A copy may be asked for in a notice.",
    itemsBn: ["হারানো রসিদ হিসাবে", "কপি নোটিশে"],
    itemsEn: ["A lost receipt at accounts", "A copy by notice"],
  },
  "academic-info:শ্রেণি ও বিষয়": {
    bn: "প্রাক-প্রাথমিক, প্রাথমিক, নিম্ন মাধ্যমিক ও মাধ্যমিক আলাদা। কার্ডে শাখা ও বিষয়ের সংখ্যা। নতুন বিষয় যোগ হলে সেই কার্ডেই দেখা যাবে। খালি বিষয় মানে এখনো যোগ হয়নি।",
    en: "Early years, primary, junior, and secondary are separate. A card shows how many sections and subjects. A new subject appears on that card. An empty subject line means none have been added yet.",
    itemsBn: ["চারটি স্তর", "শাখা ও বিষয়ের সংখ্যা"],
    itemsEn: ["Four stages", "Section and subject counts"],
  },
  "academic-info:দিন ও সময়": {
    bn: "সপ্তাহ রবি থেকে বৃহস্পতি, ছয় পিরিয়ড, যদি অফিস না বদলায়। রুটিন পাতায় ক্লাস ও শাখা বেছে ছক দেখা যায়। ছুটির দিন বদলালে আগে নোটিশ।",
    en: "The week runs Sunday to Thursday, six periods, unless the office changes it. The routine page shows the grid after a class and section are chosen. A change of holiday is announced by notice first.",
    itemsBn: ["রবি–বৃহস্পতি", "ছয় পিরিয়ড", "বদল নোটিশে"],
    itemsEn: ["Sunday to Thursday", "Six periods", "A change by notice"],
  },
  "academic-info:মূল্যায়ন": {
    bn: "অর্ধবার্ষিক ও বার্ষিক পরীক্ষার সপ্তাহ ক্যালেন্ডারে। দিন ও কক্ষ নোটিশে চূড়ান্ত। প্রকাশিত ফল শিক্ষার্থী আইডি দিয়ে। মার্কশিট সেই পাতা থেকে। অপ্রকাশিত নম্বর আসে না।",
    en: "Half-yearly and annual weeks are on the calendar. The day and room are final in a notice. A published result needs a student ID. The marksheet is printed from that page. Unpublished marks do not appear.",
    itemsBn: ["কক্ষ নোটিশে", "মার্কশিট ফল পাতায়"],
    itemsEn: ["The room is in the notice", "The marksheet is on the results page"],
  },
  "calendar:জাতীয় দিবস": {
    bn: "স্বাধীনতা দিবস, বিজয় দিবস, শহীদ দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস স্কুল পালন করে। সমাবেশের সময় ও পোশাক নোটিশে। এই পাতায় ঘণ্টা উদ্ভাবন করা হয় না।",
    en: "The school marks Independence Day, Victory Day, Martyrs' Day, and International Mother Language Day. Assembly time and dress are in a notice. This page does not invent an hour.",
    itemsBn: ["সমাবেশের সময় নোটিশে", "পোশাক নোটিশে"],
    itemsEn: ["Assembly time by notice", "Dress by notice"],
  },
  "calendar:ছুটি": {
    bn: "সাপ্তাহিক ছুটি অফিস ঠিক করে। ঈদ ও পূজার ছুটি সরকারি সিদ্ধান্ত ও স্কুলের নোটিশ মেনে চলে। নির্দিষ্ট তারিখ নোটিশ না আসা পর্যন্ত এখানে বসে না।",
    en: "The office sets the weekly holiday. Eid and puja breaks follow the government decision and the school notice. An exact date is not printed here until a notice exists.",
    itemsBn: ["সাপ্তাহিক ছুটি অফিস ঠিক করে", "তারিখ নোটিশের পর"],
    itemsEn: ["The office sets the weekly holiday", "The date comes after a notice"],
  },
  "calendar:পরীক্ষা": {
    bn: "অর্ধবার্ষিক ও বার্ষিক পরীক্ষার সপ্তাহ এখানে। কোন দিন কোন কক্ষ, এবং কোন শিফট, নোটিশে চূড়ান্ত। প্রকাশের তারিখও নোটিশে। ফল পাতায় শুধু প্রকাশিত পরীক্ষা।",
    en: "Half-yearly and annual weeks are listed here. The day, the room, and the shift are final in a notice. The publication date is a notice too. The results page shows only a published exam.",
    itemsBn: ["শিফট নোটিশে", "প্রকাশের তারিখ নোটিশে"],
    itemsEn: ["The shift is in the notice", "Publication is dated by notice"],
  },
  "cocurricular:খেলা": {
    bn: "দৌড় ও দলগত খেলা মাঠে। বার্ষিক ক্রীড়ার তারিখ অনুষ্ঠান বা নোটিশে। ইউনিফর্ম শ্রেণি শিক্ষক জানান। অনুপস্থিতি ক্লাসের মতোই ধরা হয়।",
    en: "Races and team games are on the field. The annual sports date is with the programmes or in a notice. Class teachers share the uniform. An absence counts as it does for class.",
    itemsBn: ["ইউনিফর্ম শ্রেণি শিক্ষক জানান", "অনুপস্থিতি ধরা হয়"],
    itemsEn: ["Class teachers share the uniform", "An absence is recorded"],
  },
  "cocurricular:বিতর্ক ও ক্লাব": {
    bn: "বিতর্ক, বিজ্ঞান ও সাংস্কৃতিক ক্লাবে শ্রেণি শিক্ষকের অনুমতি লাগে। সময় রুটিনের বাইরে, যাতে পড়া বাধা না পায়। আসরের তারিখ নোটিশে।",
    en: "Debate, science, and cultural clubs need the class teacher's permission. The time sits outside the routine so lessons are not interrupted. The meeting date is a notice.",
    itemsBn: ["অনুমতি", "আসর নোটিশে"],
    itemsEn: ["Permission", "The meeting is a notice"],
  },
  "cocurricular:স্কাউট": {
    bn: "স্কাউট ও গার্লস গাইড সকালের সমাবেশে যোগ দিতে পারে। পোশাক ও দিন শ্রেণি শিক্ষক বা নোটিশে। ক্লাসের সময় স্কাউট বসানো হয় না।",
    en: "Scouts and guides may join the morning assembly. Dress and the day come from the class teacher or a notice. Scouts are not set during class time.",
    itemsBn: ["সকালের সমাবেশ", "ক্লাসের সময় নয়"],
    itemsEn: ["Morning assembly", "Not during class"],
  },
  "student-life:দিনের ছন্দ": {
    bn: "ইউনিফর্ম রুটিনের দিনে। ক্লাস শুরুর আগে আসা। দেরি হলে অফিসে কারণ। ক্লাসে মোবাইল বন্ধ ও ব্যাগে। খাতা প্রতিদিন আনা।",
    en: "Uniform on routine days. Arrive before class starts. A late arrival is explained at the office. Phones stay off and in the bag. The exercise book comes every day.",
    itemsBn: ["খাতা প্রতিদিন", "দেরির কারণ অফিসে"],
    itemsEn: ["The book every day", "A reason for lateness at the office"],
  },
  "student-life:ফলাফল": {
    bn: "প্রকাশিত পরীক্ষায় শিক্ষার্থী আইডি লাগে। মিল না হলে একই বার্তা, আইডি আছে কি না তা বলা হয় না। মার্কশিট সেই পাতা থেকে ছাপা যায়। মেধাতালিকা বন্ধ থাকলে ক্রম আসে না।",
    en: "A published exam needs the student ID. A miss uses one message, so it does not say whether that ID exists. The marksheet can be printed from that page. A rank does not appear while the merit list is closed.",
    itemsBn: ["একই বার্তা", "মেধাতালিকা আলাদা"],
    itemsEn: ["One message", "The merit list is separate"],
  },
  "student-life:গোপনীয়তা": {
    bn: "শিক্ষার্থীর ফোন, বাড়ির ঠিকানা, জন্মনিবন্ধন ও স্বাস্থ্য নোট এই সাইটে আসে না। ক্লাসের খবর নোটিশে। শিক্ষকের অফিস ফোন কার্ডে থাকতে পারে, অভিভাবকের নম্বর নয়।",
    en: "A student's phone, home address, birth registration number, and health notes do not appear here. Class news is a notice. A teacher's office phone may sit on a card. A guardian's number does not.",
    itemsBn: ["স্বাস্থ্য নোট নেই", "অভিভাবকের নম্বর নেই"],
    itemsEn: ["No health notes", "No guardian numbers"],
  },
  "future:আগে দেখুন": {
    bn: "গ্যালারিতে ক্যাম্পাস, সুবিধা পাতায় যা চালু আছে, ক্লাস পাতায় শ্রেণি ও বিষয়। তারপর ভর্তি তথ্য ও কাগজের তালিকা। যা নেই তা লেখা হয় না।",
    en: "See the campus in the gallery, what is actually in use on the facilities page, and classes with subjects. Then read the admission notes and the paper list. What the school does not have is not written.",
    itemsBn: ["কাগজের তালিকা", "যা নেই তা লেখা হয় না"],
    itemsEn: ["The paper list", "What is missing is not written"],
  },
  "future:আবেদন": {
    bn: "এক পাতায় সব ঘর। জমা দিলে আবেদন অপেক্ষমাণ। স্কুল অনুমোদন করলে ভর্তি। সিট নিশ্চিত নয়। ফি অফিসে, রসিদসহ।",
    en: "Every field is on one page. Submitting leaves the application pending. Admission starts when the school approves it. A seat is not confirmed. The fee is paid at the office, with a receipt.",
    itemsBn: ["অপেক্ষমাণ", "রসিদসহ ফি"],
    itemsEn: ["Pending", "The fee with a receipt"],
  },
  "future:পরিদর্শন": {
    bn: "অফিস সময়ে আসুন। গেটে নাম বলুন। ফোন ও ম্যাপ যোগাযোগ পাতায়। ক্লাস চলাকালীন শ্রেণিকক্ষে ঢোকা যায় না।",
    en: "Come during office hours. Give a name at the gate. The phone and map are on the contact page. Classrooms are not entered while a lesson is on.",
    itemsBn: ["গেটে নাম", "ক্লাস চলাকালীন নয়"],
    itemsEn: ["A name at the gate", "Not during a lesson"],
  },
  "council:কাজ": {
    bn: "শ্রেণির সমস্যা, অনুষ্ঠানের সাহায্য ও সহপাঠীর কথা কাউন্সিল তোলে। সিদ্ধান্ত শিক্ষক ও অফিস নেয়। কাউন্সিল শাস্তি দেয় না।",
    en: "The council raises class problems, help for programmes, and what classmates ask. Teachers and the office decide. The council does not set a punishment.",
    itemsBn: ["সিদ্ধান্ত অফিসের", "শাস্তি নয়"],
    itemsEn: ["The office decides", "Not a punishment"],
  },
  "council:সদস্য": {
    bn: "প্রতিনিধি শ্রেণি থেকে আসে। নাম বদলালে এই পাতা আপডেট হয়। ছবি থাকলে গ্যালারিতে। ব্যক্তিগত ফোন ও ঠিকানা থাকে না।",
    en: "Representatives come from classes. This page is updated when the names change. Photos, if any, go in the gallery. Personal phone numbers and addresses are not shown.",
    itemsBn: ["নাম বদলালে আপডেট", "ঠিকানা নেই"],
    itemsEn: ["Updated when names change", "No addresses"],
  },
  "council:বৈঠক": {
    bn: "বৈঠক রুটিনের বাইরে। তারিখ ও স্থান নোটিশে। বছরে অন্তত একবার সদস্য বদলের কথা জানানো হয়। সভার সিদ্ধান্ত অফিস লেখে।",
    en: "Meetings sit outside the routine. The date and place are a notice. A change of members is announced at least once a year. The office writes the decision.",
    itemsBn: ["স্থান নোটিশে", "সিদ্ধান্ত অফিস লেখে"],
    itemsEn: ["The place is in the notice", "The office writes the decision"],
  },
  "clubs:যে ক্লাব": {
    bn: "বিজ্ঞান, বিতর্ক, খেলা ও সংস্কৃতি। বন্ধ ক্লাবের নাম রাখা হয় না। নতুন ক্লাব চালু হলে এই পাতা ও নোটিশ একসঙ্গে বদলায়।",
    en: "Science, debate, sports, and culture. A closed club is not listed. A new club is added here and in a notice together, once it is open.",
    itemsBn: ["বন্ধ ক্লাব নেই", "নতুন ক্লাব নোটিশে"],
    itemsEn: ["No closed club", "A new club by notice"],
  },
  "clubs:যোগ দেওয়া": {
    bn: "শ্রেণি শিক্ষকের অনুমতি লাগে। নাম অফিসে লেখা হয়। সময় রুটিনের বাইরে। ক্লাসের পড়া বাধা পেলে সদস্যপদ থামানো হতে পারে।",
    en: "The class teacher must agree. The name is written at the office. The time sits outside the routine. Membership can pause if class work is interrupted.",
    itemsBn: ["নাম অফিসে", "পড়ার বাধা হলে থামে"],
    itemsEn: ["The name is at the office", "It pauses if lessons suffer"],
  },
  "clubs:আসর": {
    bn: "আসন্ন আসর অনুষ্ঠান সেকশন বা নোটিশে। ছবি থাকলে আলাদা অ্যালবাম। ক্লাসের দিনে আসর বসানো হয় না।",
    en: "A coming meeting is published with the programmes or as a notice. Photos, if any, go in their own album. A meeting is not set on a class day.",
    itemsBn: ["নোটিশে আসর", "ক্লাসের দিনে নয়"],
    itemsEn: ["The meeting is a notice", "Not on a class day"],
  },
  "rules:উপস্থিতি": {
    bn: "ক্লাস শুরুর আগে আসতে হয়। না এলে অফিস অভিভাবককে জানাতে পারে। দীর্ঘ অনুপস্থিতিতে ছুটির চিঠি। ছুটির দিন রুটিন ও নোটিশে।",
    en: "Students arrive before class starts. The office may tell the family about an absence. A long absence needs a leave note. A holiday is on the routine and in a notice.",
    itemsBn: ["অভিভাবককে জানানো", "ছুটির চিঠি"],
    itemsEn: ["The family is told", "A leave note"],
  },
  "rules:পোশাক ও মোবাইল": {
    bn: "ইউনিফর্ম রুটিনের দিনে। ক্লাসে মোবাইল বন্ধ ও ব্যাগে। পরীক্ষার হলে মোবাইল নিষেধ। পোশাকের বিস্তারিত নোটিশে বা পিডিএফে, থাকলে ডাউনলোডে।",
    en: "Uniform on routine days. Phones stay off and in the bag during class. Phones are forbidden in an exam hall. Dress details, when written, are in a notice or a downloadable PDF.",
    itemsBn: ["পরীক্ষায় নিষেধ", "বিস্তারিত পিডিএফে"],
    itemsEn: ["Forbidden in exams", "Details in a PDF"],
  },
  "rules:আচরণ": {
    bn: "সহপাঠী ও শিক্ষকের সঙ্গে সম্মান। মারামারি বা গুরুতর অসদাচরণ অফিসের বিষয়। অভিভাবককে ডাকা হতে পারে। শাস্তির বিস্তারিত অফিস জানায়, এই পাতায় উদ্ভাবিত শাস্তি নেই।",
    en: "Respect for classmates and teachers. A fight or serious misconduct is an office matter. A family may be called. The office states any consequence. This page does not invent one.",
    itemsBn: ["অভিভাবককে ডাকা", "শাস্তি অফিস জানায়"],
    itemsEn: ["A family may be called", "The office states the consequence"],
  },
};

function extraFor(slug: string, headingBn: string): Extra | undefined {
  return EXTRA[`${slug}:${headingBn}`] ?? (headingBn.endsWith("শিক্ষাবর্ষ") ? EXTRA[`${slug}:YEAR`] : undefined);
}

export function priorParagraph(slug: string, current: PageSection): string | null {
  const extra = extraFor(slug, current.headingBn);
  if (!extra?.priorBn) return null;
  return `${current.bn} ${extra.priorBn}`;
}

export function deepenedSection(slug: string, current: PageSection, _school: SchoolBits): PageSection {
  const extra = extraFor(slug, current.headingBn);
  if (!extra) return current;
  return {
    ...current,
    bn: `${current.bn} ${extra.bn}`,
    en: `${current.en} ${extra.en}`,
    itemsBn: [...current.itemsBn, ...extra.itemsBn],
    itemsEn: [...current.itemsEn, ...extra.itemsEn],
  };
}
