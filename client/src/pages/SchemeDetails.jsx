import { Link, useParams } from "react-router-dom";
import schemes from "../data/schemes";

function SchemeDetails() {

    const { id } = useParams();

    const scheme = schemes.find(
        (item) => item.id === Number(id)
    );

    if (!scheme) {

        return (
            <div className="not-found">

                <h2>Scheme Not Found</h2>

                <Link to="/schemes">
                    Go Back
                </Link>

            </div>
        );

    }

    return (

        <div className="scheme-details-page">

            <div className="details-card">

                <div className="details-header">

                    <div className="details-icon">
                        🏛️
                    </div>

                    <div>

                        <h1>{scheme.name}</h1>

                        <span className="scheme-category">
                            {scheme.category}
                        </span>

                    </div>

                </div>

                <hr />

                <div className="details-section">

                    <h3>Overview</h3>
                    <p>{scheme.description}</p>

                    <h3>Ministry</h3>
                    <p>{scheme.ministry}</p>

                    <h3>Category</h3>
                    <p>{scheme.category}</p>

                    <h3>Eligibility</h3>
                    <p>{scheme.eligibility}</p>

                    <h3>Benefits</h3>
                    <p>{scheme.benefits}</p>

                    <h3>Application Mode</h3>
                    <p>{scheme.applicationMode}</p>

                    <h3>Application Deadline</h3>
                    <p>{scheme.deadline}</p>

                    <h3>Required Documents</h3>

                    <ul>
                        {scheme.documents.map((doc, index) => (
                            <li key={index}>{doc}</li>
                        ))}
                    </ul>

                </div>

                <div className="details-buttons">

                    <a
                        href={scheme.apply}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="apply-btn"
                    >
                        Apply Now
                    </a>

                    <Link
                        to="/schemes"
                        className="back-btn"
                    >
                        Back to Schemes
                    </Link>

                </div>

            </div>

        </div>

    );

}

export default SchemeDetails;