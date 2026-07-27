const Student = require("../models/Student");
const Scholarship = require("../models/Scholarship");
const SavedScholarship = require("../models/SavedScholarship");

const saveScholarship = async (studentId, scholarshipId, notes = "") => {
  const student = await Student.findById(studentId);
  if (!student) {
    throw new Error("Student not found.");
  }

  const scholarship = await Scholarship.findById(scholarshipId);
  if (!scholarship) {
    throw new Error("Scholarship not found.");
  }

  // Check if already saved in Student model array
  const idStr = scholarshipId.toString();
  const alreadySaved = student.savedScholarships.some(
    (id) => id.toString() === idStr
  );

  if (!alreadySaved) {
    student.savedScholarships.push(scholarshipId);
    await student.save();
  }

  // Upsert or create entry in SavedScholarship collection
  await SavedScholarship.findOneAndUpdate(
    { student: studentId, scholarship: scholarshipId },
    { notes },
    { upsert: true, new: true }
  );

  return { message: "Scholarship saved successfully" };
};

const removeSavedScholarship = async (studentId, scholarshipId) => {
  const student = await Student.findById(studentId);
  if (!student) {
    throw new Error("Student not found.");
  }

  student.savedScholarships = student.savedScholarships.filter(
    (id) => id.toString() !== scholarshipId.toString()
  );
  await student.save();

  await SavedScholarship.findOneAndDelete({
    student: studentId,
    scholarship: scholarshipId,
  });

  return { message: "Scholarship removed successfully" };
};

const getSavedScholarships = async (studentId) => {
  const student = await Student.findById(studentId).populate(
    "savedScholarships"
  );
  if (!student) {
    throw new Error("Student not found.");
  }

  // Also fetch detailed saved scholarship records
  const savedRecords = await SavedScholarship.find({ student: studentId })
    .populate("scholarship");

  return {
    savedScholarships: student.savedScholarships,
    savedRecords,
  };
};

module.exports = {
  saveScholarship,
  removeSavedScholarship,
  getSavedScholarships,
};
