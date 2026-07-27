const Application = require("../models/Application");
const Scholarship = require("../models/Scholarship");

const createApplication = async (studentId, applicationData) => {
  const { scholarship, status, remarks, applicationDate } = applicationData;

  if (!scholarship) {
    throw new Error("Scholarship ID is required.");
  }

  // Check if scholarship exists
  const existingScholarship = await Scholarship.findById(scholarship);
  if (!existingScholarship) {
    throw new Error("Scholarship not found.");
  }

  // Check if application already exists
  let application = await Application.findOne({
    student: studentId,
    scholarship,
  });

  if (application) {
    if (status) application.status = status;
    if (remarks !== undefined) application.remarks = remarks;
    if (applicationDate) application.applicationDate = applicationDate;
    await application.save();
  } else {
    application = await Application.create({
      student: studentId,
      scholarship,
      status: status || "Applied",
      remarks: remarks || "",
      applicationDate: applicationDate || Date.now(),
    });
  }

  return await application.populate("scholarship");
};

const getStudentApplications = async (studentId) => {
  const applications = await Application.find({ student: studentId })
    .populate("scholarship")
    .sort({ createdAt: -1 });

  return applications;
};

const getApplicationById = async (studentId, applicationId) => {
  const application = await Application.findOne({
    _id: applicationId,
    student: studentId,
  }).populate("scholarship");

  if (!application) {
    throw new Error("Application tracker record not found.");
  }

  return application;
};

const updateApplication = async (studentId, applicationId, updateData) => {
  const application = await Application.findOne({
    _id: applicationId,
    student: studentId,
  });

  if (!application) {
    throw new Error("Application tracker record not found.");
  }

  if (updateData.status) application.status = updateData.status;
  if (updateData.remarks !== undefined) application.remarks = updateData.remarks;
  if (updateData.applicationDate) application.applicationDate = updateData.applicationDate;

  await application.save();
  return await application.populate("scholarship");
};

const deleteApplication = async (studentId, applicationId) => {
  const application = await Application.findOneAndDelete({
    _id: applicationId,
    student: studentId,
  });

  if (!application) {
    throw new Error("Application tracker record not found.");
  }

  return true;
};

module.exports = {
  createApplication,
  getStudentApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
};
