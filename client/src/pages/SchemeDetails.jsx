import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import Loader from "../components/Loader";

function SchemeDetails() {

    const { id } = useParams();
    const [scheme, setScheme] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadScheme = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await api.get(`/scholarships/${id}`);
                setScheme(response.data.scholarship || null);
            } catch (err) {
                setError(err.response?.data?.message || "Unable to load this scheme right now.");
                setScheme(null);
            } finally {
                setLoading(false);
            }
        };

        loadScheme();
    }, [id]);

    if (loading) {
        return <Loader label="Loading scheme details..." />;
    }

    if (error || !scheme) {

        return (
            <div className="not-found">

                <h2>{error || "Scheme Not Found"}</h2>

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

                    <h3>Provider</h3>
                    <p>{scheme.provider}</p>

                    <h3>Category</h3>
                    <p>{scheme.category}</p>

                    <h3>Eligibility</h3>
                    <p>{scheme.eligibility}</p>

                    <h3>Benefits</h3>
                    <p>{scheme.amount ? `₹${scheme.amount.toLocaleString()}` : "Amount details available on the provider portal."}</p>

                    <h3>Application Mode</h3>
                    <p>{scheme.applicationMode}</p>

                    <h3>Application Deadline</h3>
                    <p>{scheme.deadline ? new Date(scheme.deadline).toLocaleDateString() : "Check the official notification"}</p>

                    <h3>Required Documents</h3>

                    <ul>
                        {(scheme.requiredDocuments || []).map((doc, index) => (
                            <li key={index}>{doc}</li>
                        ))}
                    </ul>

                </div>

                <div className="details-buttons">

                    <a
                        href={scheme.applyLink || scheme.apply}
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