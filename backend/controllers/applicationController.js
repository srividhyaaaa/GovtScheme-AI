const applicationService = require("../services/applicationService");

// Create Application
const createApplication = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const application = await applicationService.createApplication(
      studentId,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Application tracked successfully",
      application,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Applications for logged-in student
const getApplications = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const applications = await applicationService.getStudentApplications(
      studentId
    );

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Application by ID
const getApplicationById = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const application = await applicationService.getApplicationById(
      studentId,
      req.params.id
    );

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Application (Status / Remarks)
const updateApplication = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const application = await applicationService.updateApplication(
      studentId,
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Application updated successfully",
      application,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Application
const deleteApplication = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    await applicationService.deleteApplication(studentId, req.params.id);

    return res.status(200).json({
      success: true,
      message: "Application tracker deleted successfully",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
};