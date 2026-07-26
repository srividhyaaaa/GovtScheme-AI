import { Link } from "react-router-dom";

function SchemeCard({ scheme }) {

  return (

    <div className="scheme-card">


      <div className="scheme-icon">
        🏛️
      </div>


      <h2>
        {scheme.name}
      </h2>


      <span className="scheme-category">
        {scheme.category}
      </span>



      <div className="scheme-info">

        <p>
          🏛️ <b>Ministry:</b>
        </p>

        <span>
          {scheme.ministry}
        </span>


        <p>
          ✅ <b>Eligibility:</b>
        </p>

        <span>
          {scheme.eligibility}
        </span>



        <p>
          🎁 <b>Benefits:</b>
        </p>

        <span>
          {scheme.benefits}
        </span>


      </div>



      <div className="scheme-actions">

        <Link 
          to={`/scheme/${scheme.id}`}
          className="details-btn"
        >
          View Details
        </Link>


        <button className="apply-btn">
          Apply Now
        </button>


      </div>


    </div>

  );

}


export default SchemeCard;