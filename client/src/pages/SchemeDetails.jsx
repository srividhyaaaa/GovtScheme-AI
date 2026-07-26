import { Link, useParams } from "react-router-dom";
import schemes from "../data/schemes";


function SchemeDetails(){

    const {id} = useParams();


    const scheme = schemes.find(
        (item)=> item.id === Number(id)
    );


    if(!scheme){

        return(
            <div className="not-found">

                <h2>
                    Scheme Not Found
                </h2>

                <Link to="/schemes">
                    Go Back
                </Link>

            </div>
        )

    }


    return(

        <div className="scheme-details-page">


            <div className="details-card">


                <div className="details-header">

                    <div className="details-icon">
                        🏛️
                    </div>


                    <div>

                        <h1>
                            {scheme.name}
                        </h1>


                        <span>
                            {scheme.category}
                        </span>

                    </div>

                </div>



                <hr />



                <div className="details-section">


                    <h3>
                        🏢 Ministry
                    </h3>

                    <p>
                        {scheme.ministry}
                    </p>



                    <h3>
                        ✅ Eligibility
                    </h3>

                    <p>
                        {scheme.eligibility}
                    </p>



                    <h3>
                        🎁 Benefits
                    </h3>

                    <p>
                        {scheme.benefits}
                    </p>



                    <h3>
                        📄 Required Documents
                    </h3>


                    <ul>

                        <li>
                            Aadhaar Card
                        </li>

                        <li>
                            Income Certificate
                        </li>

                        <li>
                            Bank Account Details
                        </li>

                        <li>
                            Address Proof
                        </li>

                    </ul>



                </div>



                <div className="details-buttons">


                    <button className="apply-btn">

                        Apply Now

                    </button>


                    <Link 
                    to="/schemes"
                    className="back-btn"
                    >

                        Back to Schemes

                    </Link>


                </div>


            </div>


        </div>

    )

}


export default SchemeDetails;