const scholarshipService = require("../services/scholarshipService");

// @desc    Get all scholarships with optional filtering
// @route   GET /api/scholarships
// @access  Public
const getScholarships = async (req, res, next) => {
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
    res.status(500);
    next(error);
  }
};

// @desc    Search scholarships
// @route   GET /api/scholarships/search
// @access  Public
const searchScholarships = async (req, res, next) => {
  try {
        const { q } = req.query;
    const result = await scholarshipService.searchScholarships(q, req.query);

    return res.status(200).json({
      success: true,
      count: result.scholarships.length,
      total: result.total,
      page: result.page,
      pages: result.pages,
      scholarships: result.scholarships,
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// @desc    Get scholarship by ID
// @route   GET /api/scholarships/:id
// @access  Public
const getScholarship = async (req, res, next) => {
  try {
    const scholarship = await scholarshipService.getScholarshipById(req.params.id);
    return res.status(200).json({
      success: true,
      scholarship,
    });
  } catch (error) {
    res.status(404);
    next(error);
  }
};

// @desc    Add Scholarship (Admin / Protected)
// @route   POST /api/scholarships
// @access  Private / Admin
const createScholarship = async (req, res, next) => {
  try {
    const scholarship = await scholarshipService.createScholarship(req.body);
    return res.status(201).json({
      success: true,
      message: "Scholarship created successfully",
      scholarship,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// @desc    Update Scholarship (Admin / Protected)
// @route   PUT /api/scholarships/:id
// @access  Private / Admin
const updateScholarship = async (req, res, next) => {
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
    res.status(400);
    next(error);
  }
};

// @desc    Delete Scholarship (Admin / Protected)
// @route   DELETE /api/scholarships/:id
// @access  Private / Admin
const deleteScholarship = async (req, res, next) => {
  try {
    await scholarshipService.deleteScholarship(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Scholarship deleted successfully",
    });
  } catch (error) {
    res.status(404);
    next(error);
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