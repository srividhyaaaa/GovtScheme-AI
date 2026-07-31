import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import SchemeCard from "../../components/SchemeCard";
import { fetchSavedScholarships, removeSavedScholarship } from "../../services/savedService";

function SavedSchemes() {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all");
  const [actionMessage, setActionMessage] = useState("");

  const loadSavedScholarships = async () => {
    setLoading(true);
    setError(null);
    setActionMessage("");

    try {
      const response = await fetchSavedScholarships();
      const records = response.savedRecords || [];
      const scholarships = records.map((record) => record.scholarship).filter(Boolean);
      setSavedItems(scholarships);
    } catch (loadError) {
      setError(loadError.response?.data?.message || "Unable to load your saved scholarships right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedScholarships();
  }, []);

  const visibleItems = useMemo(() => {
    const filtered = savedItems.filter((scheme) => {
      const searchableText = `${scheme.title || ""} ${scheme.provider || ""} ${scheme.category || ""}`.toLowerCase();
      const matchesSearch = searchableText.includes(search.toLowerCase());
      const matchesFilter = filterBy === "all" || (scheme.category || "General").toLowerCase() === filterBy.toLowerCase();
      return matchesSearch && matchesFilter;
    });

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.deadline || a.createdAt || 0).getTime();
      const dateB = new Date(b.deadline || b.createdAt || 0).getTime();
      if (sortBy === "oldest") return dateA - dateB;
      if (sortBy === "amount") return (b.amount || 0) - (a.amount || 0);
      return dateB - dateA;
    });
  }, [savedItems, search, sortBy, filterBy]);

  const handleRemove = async (id) => {
    try {
      await removeSavedScholarship(id);
      setSavedItems((current) => current.filter((scheme) => (scheme._id || scheme.id) !== id));
      setActionMessage("Scholarship removed from your saved list.");
    } catch (removeError) {
      setActionMessage(removeError.response?.data?.message || "Unable to remove this scholarship.");
    }
  };

  if (loading) {
    return (
      <div className="saved-page">
        <Loader />
      </div>
    );
  }

  return (
    <div className="saved-page">
      <div className="saved-header">
        <h1>Saved Schemes</h1>
        <p>Keep track of scholarships you want to review, apply for, or compare later.</p>
      </div>

      {error ? <div className="dashboard-error">{error}</div> : null}
      {actionMessage ? <div className="status-banner">{actionMessage}</div> : null}

      <section className="saved-toolbar">
        <input
          type="text"
          placeholder="Search saved schemes"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option value="recent">Most recent</option>
          <option value="oldest">Oldest first</option>
          <option value="amount">Highest amount</option>
        </select>
        <select value={filterBy} onChange={(event) => setFilterBy(event.target.value)}>
          <option value="all">All categories</option>
          <option value="general">General</option>
          <option value="sc/st">SC/ST</option>
          <option value="obc">OBC</option>
          <option value="minority">Minority</option>
        </select>
      </section>

      {visibleItems.length === 0 ? (
        <div className="empty-state-card">
          <p>No saved schemes match your current search and filters.</p>
          <Link to="/schemes">Browse scholarships</Link>
        </div>
      ) : (
        <div className="saved-grid">
          {visibleItems.map((scheme) => {
            const id = scheme._id || scheme.id;
            return (
              <article className="saved-card" key={id}>
                <SchemeCard scheme={scheme} />
                <div className="saved-card-actions">
                  <button type="button" className="primary-button" onClick={() => window.open(scheme.applyLink || scheme.apply || "#", "_blank", "noopener,noreferrer")}>
                    Apply
                  </button>
                  <button type="button" className="secondary-button" onClick={() => {
                    const queued = JSON.parse(sessionStorage.getItem("compareScholarships") || "[]");
                    const nextQueue = queued.includes(id) ? queued : [...queued, id];
                    sessionStorage.setItem("compareScholarships", JSON.stringify(nextQueue));
                    setActionMessage(`Added ${scheme.title || scheme.name} to comparison queue.`);
                  }}>
                    Compare
                  </button>
                  <button type="button" className="secondary-button" onClick={() => handleRemove(id)}>
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SavedSchemes;
