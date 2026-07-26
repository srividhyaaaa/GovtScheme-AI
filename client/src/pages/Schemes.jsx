import { useState } from "react";
import schemes from "../data/schemes";
import SchemeCard from "../components/SchemeCard";

function Schemes() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch =
      scheme.name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || scheme.category === category;

    return matchesSearch && matchesCategory;
  });

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

      <div className="schemes-grid">
        {filteredSchemes.length > 0 ? (
          filteredSchemes.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
            />
          ))
        ) : (
          <h3>No schemes found.</h3>
        )}
      </div>

    </div>
  );
}





export default Schemes;





