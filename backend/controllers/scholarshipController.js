const scholarshipService = require("../services/scholarshipService");

// @desc    Get all scholarships with optional filtering
// @route   GET /api/scholarships
// @access  Public
const getScholarships = async (req, res) => {
  try {
    const result = await scholarshipService.getAllScholarships(req.query);

    return res.status(200).json({
      success: true,
      count: result.scholarships.length,
      total: result.total,
      page: result.page,
      pages: result.pages,
      scholarships: result.scholarships,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Search scholarships by keyword and filters
// @route   GET /api/scholarships/search
// @access  Public
const searchScholarships = async (req, res) => {
  try {
    const { q, category, state } = req.query;
    const result = await scholarshipService.searchScholarships(q, {
      category,
      state,
    });

    return res.status(200).json({
      success: true,
      count: result.scholarships.length,
      total: result.total,
      scholarships: result.scholarships,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get scholarship by ID
// @route   GET /api/scholarships/:id
// @access  Public
const getScholarship = async (req, res) => {
  try {
    const scholarship = await scholarshipService.getScholarshipById(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      scholarship,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create scholarship
// @route   POST /api/scholarships
// @access  Private (or Admin)
const createScholarship = async (req, res) => {
  try {
    const scholarship = await scholarshipService.createScholarship(req.body);

    return res.status(201).json({
      success: true,
      message: "Scholarship created successfully",
      scholarship,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update scholarship
// @route   PUT /api/scholarships/:id
// @access  Private (or Admin)
const updateScholarship = async (req, res) => {
  try {
    const scholarship = await scholarshipService.updateScholarship(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Scholarship updated successfully",
      scholarship,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete scholarship
// @route   DELETE /api/scholarships/:id
// @access  Private (or Admin)
const deleteScholarship = async (req, res) => {
  try {
    await scholarshipService.deleteScholarship(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Scholarship deleted successfully",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getScholarships,
  searchScholarships,
  getScholarship,
  createScholarship,
  updateScholarship,
  deleteScholarship,
};