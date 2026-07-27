const Scholarship = require("../models/Scholarship");

const getAllScholarships = async (queryParams = {}) => {
  const {
    category,
    state,
    minAmount,
    maxAmount,
    provider,
    isActive,
    page = 1,
    limit = 20,
  } = queryParams;

  const filter = {};

  if (category) {
    filter.category = { $regex: category, $options: "i" };
  }

  if (state) {
    filter.state = { $regex: state, $options: "i" };
  }

  if (provider) {
    filter.provider = { $regex: provider, $options: "i" };
  }

  if (minAmount || maxAmount) {
    filter.amount = {};
    if (minAmount) filter.amount.$gte = Number(minAmount);
    if (maxAmount) filter.amount.$lte = Number(maxAmount);
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === "true" || isActive === true;
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const scholarships = await Scholarship.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Scholarship.countDocuments(filter);

  return {
    scholarships,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
  };
};

const getScholarshipById = async (id) => {
  const scholarship = await Scholarship.findById(id);
  if (!scholarship) {
    throw new Error("Scholarship not found");
  }
  return scholarship;
};

const searchScholarships = async (searchTerm, additionalFilters = {}) => {
  if (!searchTerm || searchTerm.trim() === "") {
    return getAllScholarships(additionalFilters);
  }

  const regexQuery = new RegExp(searchTerm.trim(), "i");
  const query = {
    $or: [
      { title: regexQuery },
      { provider: regexQuery },
      { description: regexQuery },
      { category: regexQuery },
      { state: regexQuery },
    ],
  };

  if (additionalFilters.category) {
    query.category = { $regex: additionalFilters.category, $options: "i" };
  }
  if (additionalFilters.state) {
    query.state = { $regex: additionalFilters.state, $options: "i" };
  }

  const scholarships = await Scholarship.find(query).sort({ createdAt: -1 });
  return {
    scholarships,
    total: scholarships.length,
  };
};

const createScholarship = async (scholarshipData) => {
  const scholarship = await Scholarship.create(scholarshipData);
  return scholarship;
};

const updateScholarship = async (id, updateData) => {
  const scholarship = await Scholarship.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!scholarship) {
    throw new Error("Scholarship not found");
  }
  return scholarship;
};

const deleteScholarship = async (id) => {
  const scholarship = await Scholarship.findById(id);
  if (!scholarship) {
    throw new Error("Scholarship not found");
  }
  await scholarship.deleteOne();
  return true;
};

module.exports = {
  getAllScholarships,
  getScholarshipById,
  searchScholarships,
  createScholarship,
  updateScholarship,
  deleteScholarship,
};
