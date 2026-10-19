"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDemoSeeder = runDemoSeeder;
const connect_1 = require("../db/connect");
const ClassStructure_1 = require("../models/ClassStructure");
const Subject_1 = require("../models/Subject");
const Teacher_1 = require("../models/Teacher");
const Student_1 = require("../models/Student");
const Attendance_1 = require("../models/Attendance");
const ExamType_1 = require("../models/ExamType");
const Result_1 = require("../models/Result");
const Fee_1 = require("../models/Fee");
const Notice_1 = require("../models/Notice");
const Operations_1 = require("../models/Operations");
const Certificate_1 = require("../models/Certificate");
const index_1 = require("./index");
const student_utils_1 = require("../app/modules/Student/student.utils");
const logger_1 = require("../utils/logger");
function makeSvgAvatar(name, bg, textCol) {
    const initial = (name.trim().charAt(0) || "S").toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
    <rect width="120" height="120" rx="60" fill="${bg}"/>
    <circle cx="60" cy="48" r="24" fill="${textCol}" opacity="0.9"/>
    <path d="M26,104 C26,82 42,76 60,76 C78,76 94,82 94,104 Z" fill="${textCol}" opacity="0.9"/>
    <text x="60" y="55" font-family="sans-serif" font-size="20" font-weight="bold" fill="${bg}" text-anchor="middle" dominant-baseline="middle">${initial}</text>
  </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
const AVATAR_PALETTES = [
    { bg: "#1e3a8a", text: "#bfdbfe" },
    { bg: "#065f46", text: "#a7f3d0" },
    { bg: "#831843", text: "#fbcfe8" },
    { bg: "#701a75", text: "#f5d0fe" },
    { bg: "#7c2d12", text: "#fed7aa" },
    { bg: "#134e4a", text: "#99f6e4" },
    { bg: "#1e1b4b", text: "#c7d2fe" },
    { bg: "#365314", text: "#d9f99d" },
    { bg: "#713f12", text: "#fef08a" },
    { bg: "#0f172a", text: "#e2e8f0" },
];
const TEACHERS_DATA = [
    { name: "Mohammad Rafiqul Islam", designation: "Headmaster", phone: "01711100001", basic: 52000, house: 15000, medical: 3000 },
    { name: "Nasima Begum", designation: "Assistant Headmaster", phone: "01711100002", basic: 45000, house: 12000, medical: 2500 },
    { name: "Abdur Rahim", designation: "Senior Teacher (Bangla)", phone: "01811100003", basic: 38000, house: 10000, medical: 2000 },
    { name: "Farhana Yasmin", designation: "Senior Teacher (English)", phone: "01911100004", basic: 38000, house: 10000, medical: 2000 },
    { name: "Shahadat Hossain", designation: "Senior Teacher (Math)", phone: "01711100005", basic: 39000, house: 10000, medical: 2000 },
    { name: "Dr. Kazi Mahfuzur Rahman", designation: "Teacher (Physics)", phone: "01811100006", basic: 36000, house: 9000, medical: 2000 },
    { name: "Rehana Parveen", designation: "Teacher (Chemistry)", phone: "01911100007", basic: 36000, house: 9000, medical: 2000 },
    { name: "Tariqul Islam", designation: "Teacher (Biology)", phone: "01711100008", basic: 35000, house: 9000, medical: 2000 },
    { name: "Shamima Akhter", designation: "Teacher (Accounting)", phone: "01811100009", basic: 34000, house: 8500, medical: 2000 },
    { name: "Mahmudul Hasan", designation: "Teacher (ICT)", phone: "01911100010", basic: 35000, house: 9000, medical: 2000 },
    { name: "Moulana Abdul Barek", designation: "Teacher (Religion)", phone: "01711100011", basic: 32000, house: 8000, medical: 2000 },
    { name: "Subhash Chandra Roy", designation: "Teacher (Physical Ed)", phone: "01811100012", basic: 31000, house: 7500, medical: 2000 },
];
const STUDENT_NAMES = [
    { name: "Abrar Fahad", nameBn: "আবরার ফাহাদ", gender: "male", blood: "A+", rel: "Islam" },
    { name: "Tahmid Rahman", nameBn: "তাহমিদ রহমান", gender: "male", blood: "B+", rel: "Islam" },
    { name: "Sadia Islam", nameBn: "সাদিয়া ইসলাম", gender: "female", blood: "O+", rel: "Islam" },
    { name: "Nusrat Jahan", nameBn: "নুসরাত জাহান", gender: "female", blood: "AB+", rel: "Islam" },
    { name: "Kazi Anisur Rahman", nameBn: "কাজী আনিসুর রহমান", gender: "male", blood: "O+", rel: "Islam" },
    { name: "Rifat Ahmed", nameBn: "রিফাত আহমেদ", gender: "male", blood: "B+", rel: "Islam" },
    { name: "Tasnim Chowdhury", nameBn: "তাসনিম চৌধুরী", gender: "female", blood: "A+", rel: "Islam" },
    { name: "Farhan Tanvir", nameBn: "ফারহান তানভীর", gender: "male", blood: "O-", rel: "Islam" },
    { name: "Mehnaz Tabassum", nameBn: "মেহনাজ তাবাসসুম", gender: "female", blood: "B+", rel: "Islam" },
    { name: "Sajib Sen", nameBn: "সজীব সেন", gender: "male", blood: "A+", rel: "Hinduism" },
    { name: "Priyanka Roy", nameBn: "প্রিয়াঙ্কা রায়", gender: "female", blood: "AB+", rel: "Hinduism" },
    { name: "Arif Mahmud", nameBn: "আরিফ মাহমুদ", gender: "male", blood: "B+", rel: "Islam" },
    { name: "Sumaiya Akter", nameBn: "সুমাইয়া আক্তার", gender: "female", blood: "O+", rel: "Islam" },
    { name: "Junaid Hasan", nameBn: "জুনায়েদ হাসান", gender: "male", blood: "A-", rel: "Islam" },
    { name: "Fariha Noor", nameBn: "ফারিহা নূর", gender: "female", blood: "B+", rel: "Islam" },
    { name: "Tanvir Hossain", nameBn: "তানভীর হোসেন", gender: "male", blood: "O+", rel: "Islam" },
    { name: "Mahira Khan", nameBn: "মাহিরা খান", gender: "female", blood: "A+", rel: "Islam" },
    { name: "Zubair Al Mamun", nameBn: "জুবায়ের আল মামুন", gender: "male", blood: "B+", rel: "Islam" },
    { name: "Ayesha Siddiqua", nameBn: "আয়েশা সিদ্দিকা", gender: "female", blood: "O+", rel: "Islam" },
    { name: "Joy Kumar Das", nameBn: "জয় কুমার দাস", gender: "male", blood: "AB+", rel: "Hinduism" },
    { name: "Shahriar Shakil", nameBn: "শাহরিয়ার শাকিল", gender: "male", blood: "A+", rel: "Islam" },
    { name: "Nafisa Kamal", nameBn: "নাফিসা কামাল", gender: "female", blood: "B+", rel: "Islam" },
    { name: "Ashikur Rahman", nameBn: "আশিকুর রহমান", gender: "male", blood: "O+", rel: "Islam" },
    { name: "Lamia Sultana", nameBn: "লামিয়া সুলতানা", gender: "female", blood: "A+", rel: "Islam" },
    { name: "Emon Chowdhury", nameBn: "ইমন চৌধুরী", gender: "male", blood: "B+", rel: "Islam" },
    { name: "Humaira Tasneem", nameBn: "হুমায়রা তাসনীম", gender: "female", blood: "AB+", rel: "Islam" },
    { name: "Tanmoy Sarkar", nameBn: "তন্ময় সরকার", gender: "male", blood: "O+", rel: "Hinduism" },
    { name: "Shanjida Haque", nameBn: "সানজিদা হক", gender: "female", blood: "A+", rel: "Islam" },
    { name: "Mahir Faisal", nameBn: "মাহির ফয়সাল", gender: "male", blood: "B+", rel: "Islam" },
    { name: "Samiha Zaman", nameBn: "সামিহা জামান", gender: "female", blood: "O+", rel: "Islam" },
    { name: "Mushfiqur Rahim", nameBn: "মুশফিকুর রহিম", gender: "male", blood: "A+", rel: "Islam" },
    { name: "Anika Bushra", nameBn: "আনিকা বুশরা", gender: "female", blood: "B+", rel: "Islam" },
    { name: "Riad Hasan", nameBn: "রিয়াদ হাসান", gender: "male", blood: "O+", rel: "Islam" },
    { name: "Moumita Saha", nameBn: "মৌমিতা সাহা", gender: "female", blood: "AB+", rel: "Hinduism" },
    { name: "Habibul Bashar", nameBn: "হাবিবুল বাশার", gender: "male", blood: "A+", rel: "Islam" },
    { name: "Afia Ibnat", nameBn: "আফিয়া ইবনাত", gender: "female", blood: "B+", rel: "Islam" },
    { name: "Salman Farsi", nameBn: "সালমান ফারসী", gender: "male", blood: "O+", rel: "Islam" },
    { name: "Rawnak Jahan", nameBn: "রওনক জাহান", gender: "female", blood: "A+", rel: "Islam" },
    { name: "Nayeem Islam", nameBn: "নাঈম ইসলাম", gender: "male", blood: "B-", rel: "Islam" },
    { name: "Tamanna Yasmin", nameBn: "তামান্না ইয়াসমিন", gender: "female", blood: "AB+", rel: "Islam" },
    { name: "Shakib Al Hasan", nameBn: "সাকিব আল হাসান", gender: "male", blood: "O+", rel: "Islam" },
    { name: "Zarin Tasnim", nameBn: "জারিন তাসনিম", gender: "female", blood: "A+", rel: "Islam" },
    { name: "Muntaha Rahman", nameBn: "মুনতাহা রহমান", gender: "female", blood: "B+", rel: "Islam" },
    { name: "Rakibul Hasan", nameBn: "রাকিবুল হাসান", gender: "male", blood: "O+", rel: "Islam" },
    { name: "Israt Jahan", nameBn: "ইসরাত জাহান", gender: "female", blood: "A+", rel: "Islam" },
    { name: "Adnan Sami", nameBn: "আদনান সামী", gender: "male", blood: "B+", rel: "Islam" },
    { name: "Rufaida Ahmed", nameBn: "রুফাইদা আহমেদ", gender: "female", blood: "O+", rel: "Islam" },
    { name: "Sourav Ganguly Roy", nameBn: "সৌরভ গাঙ্গুলী রায়", gender: "male", blood: "AB+", rel: "Hinduism" },
    { name: "Fabiha Tarannum", nameBn: "ফাবিহা তারান্নুম", gender: "female", blood: "A+", rel: "Islam" },
    { name: "Imran Hossain", nameBn: "ইমরান হোসেন", gender: "male", blood: "B+", rel: "Islam" },
    { name: "Jannatul Ferdous", nameBn: "জান্নাতুল ফেরদৌস", gender: "female", blood: "O+", rel: "Islam" },
    { name: "Nahidul Islam", nameBn: "নাহিদুল ইসলাম", gender: "male", blood: "A+", rel: "Islam" },
    { name: "Rubina Akhter", nameBn: "রুবিনা আক্তার", gender: "female", blood: "B+", rel: "Islam" },
    { name: "Saadman Sakib", nameBn: "সাদমান সাকিব", gender: "male", blood: "O+", rel: "Islam" },
    { name: "Naznin Akter", nameBn: "নাজনীন আক্তার", gender: "female", blood: "A+", rel: "Islam" },
    { name: "Wasim Akram", nameBn: "ওয়াসিম আকরাম", gender: "male", blood: "B+", rel: "Islam" },
    { name: "Samia Afrin", nameBn: "সামিয়া আফরিন", gender: "female", blood: "O+", rel: "Islam" },
    { name: "Moinul Haque", nameBn: "মইনুল হক", gender: "male", blood: "A+", rel: "Islam" },
    { name: "Sabrina Karim", nameBn: "সাবেরিনা করিম", gender: "female", blood: "AB+", rel: "Islam" },
    { name: "Kamrul Hasan", nameBn: "কামরুল হাসান", gender: "male", blood: "B+", rel: "Islam" },
];
async function runDemoSeeder() {
    await (0, connect_1.connectDb)();
    await (0, index_1.seedIfNeeded)();
    logger_1.logger.info("Starting comprehensive demo data seeding...");
    // 1. Fetch existing classes and subjects
    const classes = await ClassStructure_1.ClassStructure.find().sort({ level: 1 });
    if (!classes.length) {
        throw new Error("No classes found. Please run basic seeds first.");
    }
    const subjects = await Subject_1.Subject.find();
    // 2. Seed Teachers
    await Teacher_1.Teacher.deleteMany({});
    const teacherDocs = TEACHERS_DATA.map((t, idx) => {
        const palette = AVATAR_PALETTES[idx % AVATAR_PALETTES.length];
        const photoUrl = makeSvgAvatar(t.name, palette.bg, palette.text);
        const matchedSubjects = subjects.filter((s) => {
            const des = t.designation.toLowerCase();
            const sub = s.name.toLowerCase();
            if (des.includes("bangla") && sub.includes("bangla"))
                return true;
            if (des.includes("english") && sub.includes("english"))
                return true;
            if (des.includes("math") && sub.includes("math"))
                return true;
            if (des.includes("physics") && sub.includes("physics"))
                return true;
            if (des.includes("chemistry") && sub.includes("chemistry"))
                return true;
            if (des.includes("biology") && sub.includes("biology"))
                return true;
            if (des.includes("ict") && sub.includes("ict"))
                return true;
            if (des.includes("religion") && sub.includes("islam"))
                return true;
            if (des.includes("accounting") && sub.includes("accounting"))
                return true;
            return false;
        });
        return {
            staffId: `TCH-${1001 + idx}`,
            name: t.name,
            email: `teacher${idx + 1}@school.edu.bd`,
            phone: t.phone,
            designation: t.designation,
            photoUrl,
            subjects: matchedSubjects.map((s) => s._id),
            salaryStructure: {
                basic: t.basic,
                house: 0,
                medical: t.medical,
                other: 1000,
            },
            joiningDate: new Date(2020, idx % 12, 1),
            retirementDate: new Date(2045, idx % 12, 1),
            isActive: true,
        };
    });
    const teachers = await Teacher_1.Teacher.insertMany(teacherDocs);
    logger_1.logger.info(`Seeded ${teachers.length} teachers with photos, subjects & joining/retirement dates`);
    // 3. Seed Students
    let students = await Student_1.Student.find();
    if (students.length < 40) {
        await Student_1.Student.deleteMany({});
        // Target classes: Class 6, 7, 8, 9, 10
        const activeClasses = classes.filter((c) => c.level >= 6 && c.level <= 10);
        const targetClasses = activeClasses.length ? activeClasses : classes;
        const classRefs = classes.map((row) => ({
            id: String(row._id),
            code: row.code,
            level: row.level,
        }));
        const assignedIds = [];
        const studentDocs = STUDENT_NAMES.map((person, idx) => {
            const cls = targetClasses[idx % targetClasses.length];
            const section = idx % 2 === 0 ? "A" : "B";
            const rollNo = String(Math.floor(idx / targetClasses.length) + 1);
            const studentId = (0, student_utils_1.nextStudentIdFromRoster)(classRefs, String(cls._id), "2026", assignedIds);
            assignedIds.push(studentId);
            const palette = AVATAR_PALETTES[idx % AVATAR_PALETTES.length];
            const photoUrl = makeSvgAvatar(person.name, palette.bg, palette.text);
            return {
                studentId,
                rollNo,
                name: person.name,
                nameBn: person.nameBn,
                photoUrl,
                gender: person.gender,
                dob: new Date(2010, idx % 12, (idx % 27) + 1),
                birthRegNo: `2010${String(1000000000000 + idx)}`,
                bloodGroup: person.blood,
                religion: person.rel,
                phone: `017${String(20000000 + idx)}`,
                email: `student${studentId}@school.edu.bd`,
                classId: cls._id,
                section,
                group: cls.group || "None",
                academicYear: "2026",
                status: (idx === 58 ? "pending" : idx === 59 ? "transferred" : "active"),
                address: {
                    division: "Dhaka",
                    district: "Dhaka",
                    upazila: idx % 2 === 0 ? "Mirpur" : "Uttara",
                    area: idx % 2 === 0 ? "Sector 4" : "Section 10",
                    holding: `House #${idx + 12}`,
                    block: `Block ${String.fromCharCode(65 + (idx % 4))}`,
                    road: `Road #${(idx % 15) + 1}`,
                    postOffice: "Dhaka GPO",
                },
                guardian: {
                    fatherName: `Mr. ${person.name.split(" ").slice(-1)[0]} Ali`,
                    fatherNameBn: `${person.nameBn} এর পিতা`,
                    motherName: `Mrs. Begum`,
                    motherNameBn: `${person.nameBn} এর মাতা`,
                    guardianName: `Mr. ${person.name.split(" ").slice(-1)[0]} Ali`,
                    guardianNameBn: `${person.nameBn} এর অভিভাবক`,
                    relation: "Father",
                    nid: `1980${String(1000000000 + idx)}`,
                    phone: `018${String(20000000 + idx)}`,
                    fatherPhone: `018${String(20000000 + idx)}`,
                    motherPhone: `019${String(20000000 + idx)}`,
                    email: `guardian${studentId}@mail.com`,
                    occupation: idx % 3 === 0 ? "Govt. Officer" : idx % 3 === 1 ? "Businessman" : "Private Service",
                },
                talentTags: idx % 3 === 0 ? ["Debating", "Science Club"] : idx % 3 === 1 ? ["Cricket", "Football"] : ["Math Olympiad"],
            };
        });
        students = await Student_1.Student.insertMany(studentDocs);
        logger_1.logger.info(`Seeded ${students.length} students`);
    }
    // 4. Seed Attendance (past 5 working dates)
    await Attendance_1.Attendance.deleteMany({});
    const dates = ["2026-09-15", "2026-09-16", "2026-09-17", "2026-09-18", "2026-09-20"];
    const attendanceDocs = [];
    for (const date of dates) {
        for (let i = 0; i < students.length; i++) {
            const student = students[i];
            // Randomize mostly present
            const rand = (i + date.length) % 10;
            const status = rand === 0 ? "absent" : rand === 1 ? "late" : "present";
            attendanceDocs.push({
                studentId: student._id,
                classId: student.classId,
                section: student.section,
                date,
                status,
                remark: status === "late" ? "10 min late" : status === "absent" ? "Informed guardian" : "",
            });
        }
    }
    await Attendance_1.Attendance.insertMany(attendanceDocs);
    logger_1.logger.info(`Seeded ${attendanceDocs.length} attendance records across 5 days`);
    // 5. Seed Exam Types & Results
    let exams = await ExamType_1.ExamType.find();
    if (exams.length < 3) {
        await ExamType_1.ExamType.deleteMany({});
        exams = await ExamType_1.ExamType.insertMany([
            { name: "First Term Examination 2026", code: "FIRST-TERM-26", weight: 30, academicYear: "2026", isPublished: true },
            { name: "Half Yearly Examination 2026", code: "HALF-YEARLY-26", weight: 30, academicYear: "2026", isPublished: true },
            { name: "Annual Examination 2026", code: "ANNUAL-26", weight: 40, academicYear: "2026", isPublished: false },
        ]);
        logger_1.logger.info(`Seeded ${exams.length} exam types`);
    }
    await Result_1.Result.deleteMany({});
    const resultDocs = [];
    const activeExam = exams[0];
    for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const classSubjects = subjects.filter((s) => String(s.classId) === String(student.classId));
        const targetSubs = classSubjects.length ? classSubjects.slice(0, 5) : subjects.slice(0, 5);
        let totalObtained = 0;
        let totalFull = 0;
        let sumGpa = 0;
        const subjectMarks = targetSubs.map((sub, sIdx) => {
            // realistic marks between 60 and 95
            const base = 65 + ((i * 7 + sIdx * 11) % 31);
            const full = 100;
            const obtained = Math.min(100, Math.max(40, base));
            let gpa = 3.0;
            let letter = "B";
            if (obtained >= 80) {
                gpa = 5.0;
                letter = "A+";
            }
            else if (obtained >= 70) {
                gpa = 4.0;
                letter = "A";
            }
            else if (obtained >= 60) {
                gpa = 3.5;
                letter = "A-";
            }
            else if (obtained >= 50) {
                gpa = 3.0;
                letter = "B";
            }
            totalObtained += obtained;
            totalFull += full;
            sumGpa += gpa;
            return {
                subjectId: sub._id,
                cq: Math.round(obtained * 0.6),
                mcq: Math.round(obtained * 0.4),
                practical: 0,
                attendance: 0,
                obtained,
                full,
                gpa,
                letter,
                percent: obtained,
            };
        });
        const studentGpa = targetSubs.length ? Number((sumGpa / targetSubs.length).toFixed(2)) : 5.0;
        const finalLetter = studentGpa >= 5.0 ? "A+" : studentGpa >= 4.0 ? "A" : studentGpa >= 3.5 ? "A-" : "B";
        resultDocs.push({
            studentId: student._id,
            examTypeId: activeExam._id,
            academicYear: "2026",
            subjectMarks,
            totalObtained,
            totalFull,
            gpa: studentGpa,
            letter: finalLetter,
            meritPosition: i + 1,
        });
    }
    await Result_1.Result.insertMany(resultDocs);
    logger_1.logger.info(`Seeded ${resultDocs.length} exam results with GPA & merit positions`);
    // 6. Seed Fee Structures & Ledgers
    await Fee_1.FeeStructure.deleteMany({});
    const feeStructures = await Fee_1.FeeStructure.insertMany([
        { name: "Monthly Tuition Fee - January", academicYear: "2026", amount: 1500, type: "monthly", month: "January" },
        { name: "Monthly Tuition Fee - February", academicYear: "2026", amount: 1500, type: "monthly", month: "February" },
        { name: "First Term Exam Fee 2026", academicYear: "2026", amount: 800, type: "one_time" },
        { name: "Annual Sports & Cultural Fee", academicYear: "2026", amount: 500, type: "one_time" },
    ]);
    await Fee_1.FeeLedger.deleteMany({});
    const feeLedgerDocs = [];
    for (let i = 0; i < Math.min(40, students.length); i++) {
        const student = students[i];
        const structure = feeStructures[i % feeStructures.length];
        const isPaid = i % 3 !== 0; // 2/3 paid, 1/3 due
        const paidAmount = isPaid ? structure.amount : 0;
        const dueAmount = isPaid ? 0 : structure.amount;
        const status = isPaid ? "paid" : "due";
        const payments = isPaid
            ? [
                {
                    amount: structure.amount,
                    method: (i % 2 === 0 ? "bKash" : "Cash"),
                    refNo: `TXN-${100000 + i}`,
                    date: new Date(),
                    note: "Office receipt issued",
                },
            ]
            : [];
        feeLedgerDocs.push({
            studentId: student._id,
            feeStructureId: structure._id,
            academicYear: "2026",
            title: `${structure.name} - ${student.name}`,
            dueAmount,
            paidAmount,
            discount: 0,
            status,
            payments,
        });
    }
    await Fee_1.FeeLedger.insertMany(feeLedgerDocs);
    logger_1.logger.info(`Seeded ${feeLedgerDocs.length} fee ledger records (dues and collections)`);
    // 7. Seed Notices & SMS Logs
    await Notice_1.Notice.deleteMany({});
    await Notice_1.Notice.insertMany([
        {
            title: "রমজান ও ঈদুল ফিতর উপলক্ষে বিদ্যালয় ছুটি সংক্রান্ত",
            body: "সকল শিক্ষক, কর্মচারী, অভিভাবক ও শিক্ষার্থীদের অবগতির জন্য জানানো যাচ্ছে যে, পবিত্র মাহে রমজান ও ঈদুল ফিতর উপলক্ষে আগামী ২৩ মার্চ থেকে বিদ্যালয় বন্ধ থাকবে।",
            audience: "all",
            isPublished: true,
        },
        {
            title: "১ম সাময়িক পরীক্ষা ২০২৬ এর চূড়ান্ত রুটিন প্রকাশ",
            body: "৬ষ্ঠ থেকে ১০ম শ্রেণির ১ম সাময়িক পরীক্ষা আগামী মাসের প্রথম সপ্তাহ থেকে শুরু হবে। বিস্তারিত বিষয়ভিত্তিক সময়সূচি নোটিশ বোর্ডে টানানো হয়েছে।",
            audience: "students",
            isPublished: true,
        },
        {
            title: "অভিভাবক সমাবেশ ও শিক্ষার্থী অগ্রগতি আলোচনা",
            body: "আগামী শনিবার সকাল ১০:০০ ঘটিকায় বিদ্যালয়ের অডিটোরিয়ামে অভিভাবক সমাবেশ অনুষ্ঠিত হবে। সকল অভিভাবকের উপস্থিতি একান্ত কাম্য।",
            audience: "guardians",
            isPublished: true,
        },
        {
            title: "বার্ষিক ক্রীড়া ও বিজ্ঞান মেলা ২০২৬ এ অংশগ্রহণের আহ্বান",
            body: "বিদ্যালয়ের বার্ষিক ক্রীড়া প্রতিযোগিতা ও বিজ্ঞান অলিম্পিয়াডের রেজিস্ট্রেশন শুরু হয়েছে। আগ্রহী শিক্ষার্থীদের শ্রেণি শিক্ষকের সাথে যোগাযোগের নির্দেশ দেওয়া হলো।",
            audience: "students",
            isPublished: true,
        },
        {
            title: "শিক্ষক ও কর্মকর্তা মাসিক সমন্বয় সভা",
            body: "চলতি মাসের সার্বিক একাডেমিক অগ্রগতি পর্যালোচনার লক্ষ্যে আগামী সোমবার বিকাল ৩:০০ ঘটিকায় শিক্ষক মিলনায়তনে এক জরুরি সভা অনুষ্ঠিত হবে।",
            audience: "teachers",
            isPublished: true,
        },
    ]);
    logger_1.logger.info("Seeded school notices");
    await Notice_1.SmsLog.deleteMany({});
    const smsDocs = [];
    for (let i = 0; i < 15; i++) {
        const student = students[i];
        smsDocs.push({
            to: student.guardian.phone || student.phone,
            template: i % 2 === 0 ? "attendance_alert" : "fee_due_reminder",
            body: i % 2 === 0
                ? `সম্মানিত অভিভাবক, আপনার সন্তান ${student.name} আজ বিদ্যালয়ে উপস্থিত হয়েছে। - ডেমো হাই স্কুল`
                : `সম্মানিত অভিভাবক, ${student.name} এর জানুয়ারি মাসের বকেয়া বেতন পরিশোধ করার অনুরোধ করা হচ্ছে।`,
            status: i === 14 ? "failed" : "sent",
            audience: "guardians",
        });
    }
    await Notice_1.SmsLog.insertMany(smsDocs);
    logger_1.logger.info(`Seeded ${smsDocs.length} SMS logs`);
    // 8. Seed Payroll
    await Operations_1.Payroll.deleteMany({});
    const payrollDocs = teachers.map((t, idx) => ({
        teacherId: t._id,
        month: "September 2026",
        basic: t.salaryStructure.basic,
        allowances: t.salaryStructure.house + t.salaryStructure.medical,
        advance: 0,
        deduction: 500,
        net: t.salaryStructure.basic + t.salaryStructure.house + t.salaryStructure.medical - 500,
        status: idx === 11 ? "draft" : "paid",
        paidAt: idx === 11 ? undefined : new Date(),
    }));
    await Operations_1.Payroll.insertMany(payrollDocs);
    logger_1.logger.info(`Seeded ${payrollDocs.length} staff payroll records`);
    // 9. Seed Library Books & Issues
    await Operations_1.Book.deleteMany({});
    const bookDocs = await Operations_1.Book.insertMany([
        { title: "পদ্মা নদীর মাঝি", author: "মানিক বন্দ্যোপাধ্যায়", isbn: "978-984-001", copies: 10, available: 8 },
        { title: "চাঁদের পাহাড়", author: "বিভূতিভূষণ বন্দ্যোপাধ্যায়", isbn: "978-984-002", copies: 8, available: 6 },
        { title: "একাত্তরের দিনগুলি", author: "জাহানারা ইমাম", isbn: "978-984-003", copies: 15, available: 12 },
        { title: "হিমু সমগ্র", author: "হুমায়ূন আহমেদ", isbn: "978-984-004", copies: 12, available: 9 },
        { title: "General Mathematics Guide Class 9-10", author: "NCTB", isbn: "978-984-005", copies: 25, available: 20 },
        { title: "Physics Practical Companion", author: "Prof. Anisuzzaman", isbn: "978-984-006", copies: 20, available: 18 },
        { title: "Oxford Advanced Learner's Dictionary", author: "Oxford University Press", isbn: "978-019-007", copies: 6, available: 4 },
        { title: "ছোটদের রাজনীতি ও অর্থনীতি", author: "সুকোমল সেন", isbn: "978-984-008", copies: 10, available: 10 },
    ]);
    await Operations_1.BookIssue.deleteMany({});
    const bookIssueDocs = [];
    for (let i = 0; i < 6; i++) {
        bookIssueDocs.push({
            bookId: bookDocs[i % bookDocs.length]._id,
            studentId: students[i]._id,
            issuedAt: new Date("2026-09-01"),
            dueAt: new Date("2026-09-25"),
            status: i % 2 === 0 ? "issued" : "returned",
            returnedAt: i % 2 === 0 ? undefined : new Date("2026-09-18"),
        });
    }
    await Operations_1.BookIssue.insertMany(bookIssueDocs);
    logger_1.logger.info("Seeded library books and issue records");
    // 10. Seed Transport Routes & Hostels
    await Operations_1.TransportRoute.deleteMany({});
    await Operations_1.TransportRoute.insertMany([
        {
            name: "Uttara - Airport - Mirpur Express",
            driverName: "Md. Rafique Mia",
            driverPhone: "01722233344",
            vehicleNo: "Dhaka Metro-Cha-11-2345",
            stops: ["Uttara House Building", "Airport", "Khilkhet", "Mirpur 10", "School Campus"],
            fee: 1800,
        },
        {
            name: "Dhanmondi - Farmgate - Mohakhali Route",
            driverName: "Kalam Sheikh",
            driverPhone: "01822233355",
            vehicleNo: "Dhaka Metro-Cha-14-5678",
            stops: ["Dhanmondi 32", "Farmgate", "Bijoy Sarani", "Mohakhali", "School Campus"],
            fee: 2000,
        },
        {
            name: "Badda - Rampura - Malibagh Bus",
            driverName: "Suruj Ali",
            driverPhone: "01922233366",
            vehicleNo: "Dhaka Metro-Cha-12-9876",
            stops: ["Badda Link Road", "Rampura Bridge", "Malibagh Railgate", "School Campus"],
            fee: 1500,
        },
    ]);
    logger_1.logger.info("Seeded transport routes");
    await Operations_1.Hostel.deleteMany({});
    await Operations_1.Hostel.insertMany([
        { name: "Shahidullah Student Hall (Boys)", type: "boys", capacity: 60, occupied: 45, warden: "Moulana Abdul Barek (Phone: 01711100011)" },
        { name: "Begum Rokeya Hall (Girls)", type: "girls", capacity: 50, occupied: 38, warden: "Rehana Parveen (Phone: 01911100007)" },
    ]);
    logger_1.logger.info("Seeded hostels");
    // 11. Seed sample issued certificates
    const template = await Certificate_1.CertificateTemplate.findOne();
    if (template) {
        await Certificate_1.IssuedCertificate.deleteMany({});
        const certDocs = [];
        for (let i = 0; i < 5; i++) {
            const student = students[i];
            certDocs.push({
                certNo: `CERT-2026-${1001 + i}`,
                templateId: template._id,
                kind: template.kind,
                studentId: student._id,
                issueDate: new Date(),
                purpose: "Higher Study Admission",
                conduct: "good",
                reason: "Completion of Course",
                language: "bn",
                issuedByName: "Headmaster",
                renderedTitle: template.titleBn,
                renderedBody: `এই মর্মে প্রত্যয়ন করা যাচ্ছে যে ${student.nameBn || student.name} অত্র বিদ্যালয়ের একজন নিয়মিত শিক্ষার্থী।`,
            });
        }
        await Certificate_1.IssuedCertificate.insertMany(certDocs);
        logger_1.logger.info(`Seeded ${certDocs.length} issued certificates`);
    }
    logger_1.logger.info("==========================================");
    logger_1.logger.info("🎉 DEMO SEEDING COMPLETED SUCCESSFULLY! 🎉");
    logger_1.logger.info("Total records seeded across all modules: > 350");
    logger_1.logger.info("==========================================");
}
if (require.main === module) {
    runDemoSeeder()
        .then(() => {
        console.log("Seeding done!");
        process.exit(0);
    })
        .catch((err) => {
        console.error("Seeding error:", err);
        process.exit(1);
    });
}
