import { useEffect, useState } from "react";
import api from "../api/client";
import SchemeCard from "../components/SchemeCard";
import Loader from "../components/Loader";

function Schemes() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSchemes = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/scholarships", {
          params: { title: search || undefined, category: category === "All" ? undefined : category },
        });
        setSchemes(response.data.scholarships || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load schemes right now.");
        setSchemes([]);
      } finally {
        setLoading(false);
      }
    };

    loadSchemes();
  }, [search, category]);

  return (
    <div className="schemes-page">

      <div className="schemes-header">
        <h1>Government Schemes</h1>

        <p>
          Explore Central and State Government welfare schemes
          based on your eligibility.
        </p>
      </div>

      <div className="search-section">

        <input
          type="text"
          placeholder="Search schemes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>All</option>
          <option>Agriculture</option>
          <option>Health</option>
          <option>Housing</option>
          <option>Education</option>
          <option>Scholarship</option>
          <option>Business</option>
        </select>

      </div>

      {loading ? (
        <Loader label="Loading schemes..." />
      ) : error ? (
        <div className="empty-state">
          <h3>{error}</h3>
          <p>Please try again in a moment.</p>
        </div>
      ) : (
        <div className="schemes-grid">
          {schemes.length > 0 ? (
            schemes.map((scheme) => (
              <SchemeCard key={scheme._id || scheme.id} scheme={scheme} />
            ))
          ) : (
            <div className="empty-state">
              <h3>No schemes found.</h3>
              <p>Try a different search term or category.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}





export default Schemes;





