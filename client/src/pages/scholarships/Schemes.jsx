import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchScholarships, searchScholarships } from "../../services/scholarshipService";
import SchemeCard from "../../components/SchemeCard";
import Loader from "../../components/Loader";

const defaultCategoryOptions = [
  "All",
  "General",
  "SC",
  "ST",
  "OBC",
  "EWS",
  "Merit",
  "Need-based",
  "Scholarship",
];

const defaultStateOptions = [
  "All",
  "All India",
  "Andhra Pradesh",
  "Telangana",
  "Karnataka",
  "Tamil Nadu",
  "Maharashtra",
  "Delhi",
  "West Bengal",
  "Uttar Pradesh",
];

const defaultCourseOptions = [
  "All",
  "All Courses",
  "Engineering",
  "Medical",
  "Diploma",
  "Degree",
  "MBA",
  "Science",
  "Arts",
];

const defaultGenderOptions = ["All", "Any", "Male", "Female", "Other"];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "amount", label: "Amount" },
  { value: "deadline", label: "Deadline" },
  { value: "title", label: "Title" },
  { value: "provider", label: "Provider" },
  { value: "state", label: "State" },
];

function Schemes() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    category: "All",
    state: "All",
    course: "All",
    gender: "All",
    provider: "All",
  });
  const [sortBy, setSortBy] = useState("newest");
  const [order, setOrder] = useState("desc");
  const [viewMode, setViewMode] = useState("grid");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [scholarships, setScholarships] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const queryParams = useMemo(() => {
    const query = {
      page,
      limit,
      sortBy,
      order,
      isActive: true,
    };

    if (filters.category !== "All") query.category = filters.category;
    if (filters.state !== "All") query.state = filters.state;
    if (filters.course !== "All") query.course = filters.course;
    if (filters.gender !== "All") query.gender = filters.gender;
    if (filters.provider !== "All") query.provider = filters.provider;

    return query;
  }, [filters, page, limit, sortBy, order]);

  useEffect(() => {
    const loadScholarships = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = search.trim()
          ? await searchScholarships(search, queryParams)
          : await fetchScholarships(queryParams);

        setScholarships(response.scholarships || []);
        setTotal(response.total || 0);
        setPages(response.pages || 1);
        setPage(response.page || 1);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load scholarships.");
      } finally {
        setLoading(false);
      }
    };

    loadScholarships();
  }, [search, queryParams]);

  const filterOptions = useMemo(() => {
    const providers = ["All", ...new Set(scholarships.map((item) => item.provider).filter(Boolean))];
    const categories = ["All", ...new Set(scholarships.map((item) => item.category).filter(Boolean))];
    const states = ["All", ...new Set(scholarships.map((item) => item.state).filter(Boolean))];
    const courses = ["All", ...new Set(scholarships.map((item) => item.course).filter(Boolean))];

    return {
      categories: categories.length > 1 ? categories : defaultCategoryOptions,
      states: states.length > 1 ? states : defaultStateOptions,
      courses: courses.length > 1 ? courses : defaultCourseOptions,
      providers: providers.length > 1 ? providers : ["All"],
      genders: defaultGenderOptions,
    };
  }, [scholarships]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleViewToggle = (mode) => {
    setViewMode(mode);
  };

  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);

  return (
    <div className="schemes-page">
      <div className="schemes-header">
        <h1>Scholarships</h1>
        <p>Search, filter, and sort government scholarship opportunities with live backend data.</p>
      </div>

      <div className="schemes-controls">
        <div className="schemes-top-row">
          <div className="search-input-wrapper">
            <input
              type="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search scholarships by title, provider, category..."
              aria-label="Search scholarships"
            />
            {search && (
              <button type="button" className="clear-button" onClick={() => setSearch("")}>Clear</button>
            )}
          </div>

          <div className="view-toggle">
            <button
              type="button"
              className={viewMode === "grid" ? "active" : ""}
              onClick={() => handleViewToggle("grid")}
            >
              Grid
            </button>
            <button
              type="button"
              className={viewMode === "list" ? "active" : ""}
              onClick={() => handleViewToggle("list")}
            >
              List
            </button>
          </div>
        </div>

        <div className="filter-row">
          <select
            value={filters.category}
            onChange={(event) => handleFilterChange("category", event.target.value)}
          >
            {filterOptions.categories.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select
            value={filters.state}
            onChange={(event) => handleFilterChange("state", event.target.value)}
          >
            {filterOptions.states.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select
            value={filters.course}
            onChange={(event) => handleFilterChange("course", event.target.value)}
          >
            {filterOptions.courses.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select
            value={filters.gender}
            onChange={(event) => handleFilterChange("gender", event.target.value)}
          >
            {filterOptions.genders.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select
            value={filters.provider}
            onChange={(event) => handleFilterChange("provider", event.target.value)}
          >
            {filterOptions.providers.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="sort-row">
          <div className="sort-group">
            <label>Sort by</label>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="sort-group">
            <label>Order</label>
            <select value={order} onChange={(event) => setOrder(event.target.value)}>
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <div className="sort-group">
            <label>Show</label>
            <select value={limit} onChange={(event) => setLimit(Number(event.target.value))}>
              {[8, 12, 16, 24].map((value) => (
                <option key={value} value={value}>{value} per page</option>
              ))}
            </select>
          </div>

          <div className="result-summary">
            {loading ? (
              <span>Loading scholarships...</span>
            ) : scholarships.length > 0 ? (
              <span>{startIndex}-{endIndex} of {total} scholarships</span>
            ) : (
              <span>No scholarships available.</span>
            )}
          </div>
        </div>
      </div>

      <div className={`schemes-grid ${viewMode}`}>
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="empty-state-card error-state">
            <h3>Unable to load scholarships</h3>
            <p>{error}</p>
            <Link to="/">Return Home</Link>
          </div>
        ) : scholarships.length === 0 ? (
          <div className="empty-state-card">
            <h3>No scholarships match these filters.</h3>
            <p>Try updating the search or clearing the filters.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilters({ category: "All", state: "All", course: "All", gender: "All", provider: "All" });
                setSortBy("newest");
                setOrder("desc");
                setPage(1);
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          scholarships.map((scheme) => (
            <SchemeCard key={scheme._id || scheme.id} scheme={scheme} />
          ))
        )}
      </div>

      {pages > 1 && (
        <div className="pagination-row">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </button>

          {Array.from({ length: pages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              className={pageNumber === page ? "active" : ""}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            disabled={page >= pages}
            onClick={() => setPage((current) => Math.min(pages, current + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Schemes;
