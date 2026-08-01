import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { fetchStudentProfile, saveStudentProfile } from "../../services/studentService";
import ProgressBar from "../../components/ProgressBar";

const initialProfile = {
  name: "",
  age: "",
  gender: "",
  state: "",
  category: "",
  familyIncome: "",
  college: "",
  degree: "",
  branch: "",
  cgpa: "",
  disability: false,
  minority: false,
  sportsQuota: false,
  parentOccupation: "",
  uploadedDocuments: [],
};

function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const saveExtras = (payload) => {
    const extras = {
      sportsQuota: payload.sportsQuota,
      parentOccupation: payload.parentOccupation,
      uploadedDocuments: payload.uploadedDocuments,
    };
    localStorage.setItem("studentProfileExtras", JSON.stringify(extras));
  };

  const loadExtras = () => {
    try {
      const raw = localStorage.getItem("studentProfileExtras");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const calculateCompletion = useMemo(() => {
    const fields = [
      profile.name,
      profile.age,
      profile.gender,
      profile.state,
      profile.category,
      profile.familyIncome,
      profile.college,
      profile.degree,
      profile.branch,
      profile.cgpa,
      profile.parentOccupation,
      profile.uploadedDocuments.length > 0 ? "yes" : "",
    ];
    const filled = fields.filter((value) => value !== "" && value !== false && value != null).length;
    return Math.round((filled / fields.length) * 100);
  }, [profile]);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const extras = loadExtras();
      try {
        const response = await fetchStudentProfile();
        const student = response.student || response;
        setProfile({
          ...initialProfile,
          name: student.name || "",
          age: student.age || "",
          gender: student.gender || "",
          state: student.state || "",
          category: student.category || "",
          familyIncome: student.familyIncome || "",
          college: student.college || "",
          degree: student.degree || "",
          branch: student.branch || "",
          cgpa: student.cgpa || "",
          disability: student.specialCategories?.disability || false,
          minority: student.specialCategories?.minority || false,
          ...extras,
        });
      } catch (loadError) {
        console.error("Failed to load profile", loadError);
        setError("Unable to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const nextValue = type === "checkbox" ? checked : value;
    setProfile((current) => ({
      ...current,
      [name]: nextValue,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setProfile((current) => ({
      ...current,
      uploadedDocuments: files.map((file) => file.name),
    }));
  };

  const validateProfile = () => {
    if (!profile.name.trim()) return "Name is required.";
    if (!profile.age || Number(profile.age) <= 0) return "Valid age is required.";
    if (!profile.gender) return "Gender is required.";
    if (!profile.state.trim()) return "State is required.";
    if (!profile.category) return "Category is required.";
    if (profile.familyIncome === "" || Number(profile.familyIncome) < 0) return "Annual income is required.";
    if (!profile.college.trim()) return "College is required.";
    if (!profile.degree.trim()) return "Course is required.";
    if (!profile.branch.trim()) return "Branch is required.";
    if (profile.cgpa === "" || Number(profile.cgpa) < 0 || Number(profile.cgpa) > 10) return "CGPA must be between 0 and 10.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const validationError = validateProfile();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: profile.name,
        age: Number(profile.age),
        gender: profile.gender,
        state: profile.state,
        category: profile.category,
        familyIncome: Number(profile.familyIncome),
        college: profile.college,
        degree: profile.degree,
        branch: profile.branch,
        cgpa: Number(profile.cgpa),
        specialCategories: {
          disability: profile.disability,
          minority: profile.minority,
        },
        sportsQuota: profile.sportsQuota,
        parentOccupation: profile.parentOccupation,
        uploadedDocuments: profile.uploadedDocuments,
      };

      const response = await saveStudentProfile(payload);
      const updatedStudent = response.student || response;
      const updatedProfile = {
        ...profile,
        ...updatedStudent,
        disability: updatedStudent.specialCategories?.disability ?? profile.disability,
        minority: updatedStudent.specialCategories?.minority ?? profile.minority,
        sportsQuota: updatedStudent.sportsQuota ?? profile.sportsQuota,
        parentOccupation: updatedStudent.parentOccupation ?? profile.parentOccupation,
        uploadedDocuments: updatedStudent.uploadedDocuments ?? profile.uploadedDocuments,
      };
      setProfile(updatedProfile);
      saveExtras(updatedProfile);
      updateUser(updatedProfile);
      setMessage("Profile updated successfully.");
    } catch (saveError) {
      console.error("Profile save failed", saveError);
      setError(saveError.response?.data?.message || "Unable to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-card">Loading profile…</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <h1>👤 Your Profile</h1>
          <p>Update your details to improve recommendations and keep your application history accurate.</p>
        </div>

        <ProgressBar value={calculateCompletion} />

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            name="name"
            placeholder="Full Name"
            value={profile.name}
            onChange={handleChange}
            required
          />

          <label>Age</label>
          <input
            name="age"
            type="number"
            placeholder="Age"
            value={profile.age}
            onChange={handleChange}
            required
          />

          <label>Gender</label>
          <select name="gender" value={profile.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label>State</label>
          <input
            name="state"
            placeholder="State"
            value={profile.state}
            onChange={handleChange}
            required
          />

          <label>Category</label>
          <select name="category" value={profile.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="General">General</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="EWS">EWS</option>
          </select>

          <label>Annual Income</label>
          <input
            name="familyIncome"
            type="number"
            placeholder="Annual Income"
            value={profile.familyIncome}
            onChange={handleChange}
            required
          />

          <label>College</label>
          <input
            name="college"
            placeholder="College"
            value={profile.college}
            onChange={handleChange}
            required
          />

          <label>Course</label>
          <input
            name="degree"
            placeholder="Course"
            value={profile.degree}
            onChange={handleChange}
            required
          />

          <label>Branch</label>
          <input
            name="branch"
            placeholder="Branch"
            value={profile.branch}
            onChange={handleChange}
            required
          />

          <label>CGPA</label>
          <input
            name="cgpa"
            type="number"
            step="0.01"
            placeholder="CGPA"
            value={profile.cgpa}
            onChange={handleChange}
            required
          />

          <div className="checkbox-group">
            <label>
              <input
                name="disability"
                type="checkbox"
                checked={profile.disability}
                onChange={handleChange}
              />
              Disability
            </label>
            <label>
              <input
                name="minority"
                type="checkbox"
                checked={profile.minority}
                onChange={handleChange}
              />
              Minority
            </label>
            <label>
              <input
                name="sportsQuota"
                type="checkbox"
                checked={profile.sportsQuota}
                onChange={handleChange}
              />
              Sports Quota
            </label>
          </div>

          <label>Parent Occupation</label>
          <input
            name="parentOccupation"
            placeholder="Parent Occupation"
            value={profile.parentOccupation}
            onChange={handleChange}
          />

          <label>Uploaded Documents</label>
          <input type="file" multiple onChange={handleFileChange} />
          {profile.uploadedDocuments.length > 0 && (
            <ul className="uploaded-documents-list">
              {profile.uploadedDocuments.map((fileName, index) => (
                <li key={index}>{fileName}</li>
              ))}
            </ul>
          )}

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
