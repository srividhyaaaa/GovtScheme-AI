const savedService = require("../services/savedService");

// Save Scholarship
const saveScholarship = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const scholarshipId = req.params.id;
    const notes = req.body.notes || "";

    const result = await savedService.saveScholarship(
      studentId,
      scholarshipId,
      notes
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Saved Scholarship
const removeSavedScholarship = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const scholarshipId = req.params.id;

    const result = await savedService.removeSavedScholarship(
      studentId,
      scholarshipId
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Saved Scholarships
const getSavedScholarships = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const data = await savedService.getSavedScholarships(studentId);

    return res.status(200).json({
      success: true,
      count: data.savedScholarships.length,
      savedScholarships: data.savedScholarships,
      savedRecords: data.savedRecords,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  saveScholarship,
  removeSavedScholarship,
  getSavedScholarships,
};