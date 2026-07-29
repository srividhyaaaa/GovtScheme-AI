const Scholarship = require("../models/Scholarship");

const parseNumber = (value, fallback = null) => {
  const number = Number(value);
  return Number.isNaN(number) ? fallback : number;
};

const parseDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const parsePagination = (queryParams = {}) => {
  const pageNum = Math.max(1, parseNumber(queryParams.page, 1));
  const limitNum = Math.max(1, parseNumber(queryParams.limit, 20));
  const skip = (pageNum - 1) * limitNum;

  return { pageNum, limitNum, skip };
};

const buildFilter = (queryParams = {}) => {
  const filter = {};

  if (queryParams.category) {
    filter.category = { $regex: queryParams.category, $options: "i" };
  }

  if (queryParams.state) {
    filter.state = { $regex: queryParams.state, $options: "i" };
  }

  if (queryParams.course) {
    filter.course = { $regex: queryParams.course, $options: "i" };
  }

  if (queryParams.gender) {
    filter.gender = { $regex: queryParams.gender, $options: "i" };
  }

  if (queryParams.provider) {
    filter.provider = { $regex: queryParams.provider, $options: "i" };
  }

  if (queryParams.title) {
    filter.title = { $regex: queryParams.title, $options: "i" };
  }

  if (queryParams.minAmount || queryParams.maxAmount || queryParams.amount) {
    const amountFilter = {};

    if (queryParams.amount) {
      const amountValue = queryParams.amount.toString().trim();
      const range = amountValue.split("-").map((value) => value.trim()).filter(Boolean);
      if (range.length === 2) {
        const min = parseNumber(range[0]);
        const max = parseNumber(range[1]);
        if (min !== null) amountFilter.$gte = min;
        if (max !== null) amountFilter.$lte = max;
      } else {
        const exact = parseNumber(amountValue);
        if (exact !== null) {
          amountFilter.$gte = exact;
        }
      }
    }

    if (queryParams.minAmount) {
      const min = parseNumber(queryParams.minAmount);
      if (min !== null) amountFilter.$gte = min;
    }
    if (queryParams.maxAmount) {
      const max = parseNumber(queryParams.maxAmount);
      if (max !== null) amountFilter.$lte = max;
    }

    if (Object.keys(amountFilter).length) {
      filter.amount = amountFilter;
    }
  }

  if (queryParams.income) {
    const income = parseNumber(queryParams.income);
    if (income !== null) {
      filter.$or = [
        { incomeLimit: { $gte: income } },
        { incomeLimit: 0 },
      ];
    }
  }

  const deadlineQuery = {};
  if (queryParams.deadlineBefore) {
    const beforeDate = parseDate(queryParams.deadlineBefore);
    if (beforeDate) deadlineQuery.$lte = beforeDate;
  }
  if (queryParams.deadlineAfter) {
    const afterDate = parseDate(queryParams.deadlineAfter);
    if (afterDate) deadlineQuery.$gte = afterDate;
  }
  if (queryParams.deadline) {
    const exactDate = parseDate(queryParams.deadline);
    if (exactDate) deadlineQuery.$eq = exactDate;
  }
  if (Object.keys(deadlineQuery).length) {
    filter.deadline = deadlineQuery;
  }

  if (queryParams.isActive !== undefined) {
    filter.isActive =
      queryParams.isActive === "true" || queryParams.isActive === true;
  }

  return filter;
};

const buildSort = (queryParams = {}, useTextScore = false) => {
  const sortParam = (queryParams.sortBy || queryParams.sort || "").toString().trim().toLowerCase();
  const order = (queryParams.order || "desc").toString().trim().toLowerCase();
  const direction = order === "asc" ? 1 : -1;
  const sort = {};

  if (useTextScore && (!sortParam || sortParam === "relevance")) {
    sort.score = { $meta: "textScore" };
    sort.createdAt = -1;
    return sort;
  }

  switch (sortParam) {
    case "amount":
      sort.amount = direction;
      break;
    case "deadline":
      sort.deadline = direction;
      break;
    case "newest":
      sort.createdAt = -1;
      break;
    case "oldest":
      sort.createdAt = 1;
      break;
    case "income":
      sort.incomeLimit = direction;
      break;
    case "title":
      sort.title = direction;
      break;
    case "provider":
      sort.provider = direction;
      break;
    case "state":
      sort.state = direction;
      break;
    default:
      sort.createdAt = -1;
  }

  if (useTextScore && sortParam !== "relevance") {
    sort.score = { $meta: "textScore" };
  }

  return sort;
};

const getAllScholarships = async (queryParams = {}) => {
  const filter = buildFilter(queryParams);
  const { pageNum, limitNum, skip } = parsePagination(queryParams);
  const sort = buildSort(queryParams, false);

  const scholarships = await Scholarship.find(filter)
    .sort(sort)
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

const searchScholarships = async (searchTerm, queryParams = {}) => {
  if (!searchTerm || searchTerm.trim() === "") {
    return getAllScholarships(queryParams);
  }

  const filter = buildFilter(queryParams);
  const { pageNum, limitNum, skip } = parsePagination(queryParams);
  const sort = buildSort(queryParams, true);

  const query = {
    ...filter,
    $text: { $search: searchTerm.trim() },
  };

  const scholarships = await Scholarship.find(query, {
    score: { $meta: "textScore" },
  })
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  const total = await Scholarship.countDocuments(query);

  return {
    scholarships,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
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
