"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeatPlan = getSeatPlan;
exports.generateSeatPlan = generateSeatPlan;
exports.saveSeatPlan = saveSeatPlan;
exports.deleteSeatPlan = deleteSeatPlan;
const SeatPlan_1 = require("../../../models/SeatPlan");
const Student_1 = require("../../../models/Student");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
async function getSeatPlan(examId, classId, section) {
    if (!examId)
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Seat Plan", "Exam ID is required."));
    const query = { examId };
    if (classId)
        query.classId = classId;
    if (section)
        query.section = section;
    return SeatPlan_1.SeatPlan.findOne(query).populate("examId", "name code academicYear");
}
async function generateSeatPlan(params) {
    if (!params.examId)
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Seat Plan", "Exam ID is required."));
    if (!params.halls || params.halls.length === 0) {
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Seat Plan", "At least one exam hall is required."));
    }
    // Fetch students for the class/section
    const studentQuery = { status: "active", deletedAt: null };
    if (params.classId)
        studentQuery.classId = params.classId;
    if (params.section)
        studentQuery.section = params.section;
    const students = await Student_1.Student.find(studentQuery)
        .sort({ rollNo: 1, studentId: 1 })
        .select("_id name rollNo studentId");
    let studentIdx = 0;
    const builtHalls = [];
    for (const hall of params.halls) {
        const seats = [];
        let seatCounter = 1;
        for (let r = 1; r <= hall.rows; r++) {
            for (let c = 1; c <= hall.cols; c++) {
                const student = studentIdx < students.length ? students[studentIdx] : undefined;
                seats.push({
                    seatNo: `H-${hall.name.charAt(0).toUpperCase()}${seatCounter}`,
                    row: r,
                    col: c,
                    studentId: student?._id,
                    studentName: student?.name ?? "",
                    studentSysId: student?.studentId ?? "",
                    rollNo: student?.rollNo ?? "",
                });
                seatCounter++;
                if (student)
                    studentIdx++;
            }
        }
        builtHalls.push({
            name: hall.name,
            rows: hall.rows,
            cols: hall.cols,
            seats,
        });
    }
    const updated = await SeatPlan_1.SeatPlan.findOneAndUpdate({
        examId: params.examId,
        ...(params.classId ? { classId: params.classId } : {}),
        ...(params.section ? { section: params.section } : {}),
    }, {
        examId: params.examId,
        classId: params.classId,
        section: params.section,
        halls: builtHalls,
    }, { upsert: true, new: true, setDefaultsOnInsert: true });
    return updated;
}
async function saveSeatPlan(id, body) {
    if (!id)
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Seat Plan", "ID is required."));
    const plan = await SeatPlan_1.SeatPlan.findById(id);
    if (!plan)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Seat Plan"));
    Object.assign(plan, body);
    await plan.save();
    return plan;
}
async function deleteSeatPlan(id) {
    if (!id)
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Seat Plan", "ID is required."));
    const plan = await SeatPlan_1.SeatPlan.findByIdAndDelete(id);
    if (!plan)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Seat Plan"));
    return { deleted: true };
}
