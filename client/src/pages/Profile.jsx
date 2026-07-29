import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Profile(){

    const navigate = useNavigate();


    const [profile,setProfile] = useState({

        name:"",
        age:"",
        gender:"",
        state:"",
        income:"",
        occupation:"",
        category:""

    });



    const handleChange=(e)=>{

        setProfile({

            ...profile,

            [e.target.name]: e.target.value

        });

    };



    const handleSubmit=(e)=>{

        e.preventDefault();


        localStorage.setItem(
            "userProfile",
            JSON.stringify(profile)
        );


        alert("Profile Saved Successfully");


        // Redirect to Dashboard
        navigate("/dashboard");

    };



    return(

        <div className="profile-page">


            <div className="profile-card">


                <h1>
                    👤 Complete Your Profile
                </h1>


                <p>
                    Help AI find schemes suitable for you
                </p>



                <form onSubmit={handleSubmit}>


                    <input
                    name="name"
                    placeholder="Full Name"
                    onChange={handleChange}
                    required
                    />


                    <input
                    name="age"
                    placeholder="Age"
                    type="number"
                    onChange={handleChange}
                    required
                    />



                    <select
                    name="gender"
                    onChange={handleChange}
                    required
                    >

                        <option value="">
                            Select Gender
                        </option>

                        <option>
                            Male
                        </option>

                        <option>
                            Female
                        </option>

                        <option>
                            Other
                        </option>

                    </select>



                    <input
                    name="state"
                    placeholder="State"
                    onChange={handleChange}
                    required
                    />



                    <input
                    name="income"
                    placeholder="Annual Income"
                    onChange={handleChange}
                    required
                    />



                    <input
                    name="occupation"
                    placeholder="Occupation"
                    onChange={handleChange}
                    required
                    />



                    <select
                    name="category"
                    onChange={handleChange}
                    required
                    >

                        <option value="">
                            Select Category
                        </option>

                        <option>
                            General
                        </option>

                        <option>
                            OBC
                        </option>

                        <option>
                            SC
                        </option>

                        <option>
                            ST
                        </option>


                    </select>



                    <button type="submit">
                        Save Profile
                    </button>



                </form>


            </div>


        </div>

    );

}


export default Profile;