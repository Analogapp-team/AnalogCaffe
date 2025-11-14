import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileSettingsForm.css";
import ProfileAvatar from "../profile-header/ProfileAvatar";
import ChangeButton from "./ChangeButton";
import RemoveButton from "./RemoveButton";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import SaveChangesButton from "./SaveChangesButton";
import EmailDisplay from "./EmailDisplay";
import {
  getCurrentUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  removeProfilePicture,
} from "../../configuration/UserService";

const ProfileSettingsForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studyCourse: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getCurrentUserProfile();
        console.log("Loaded user data:", userData);
        setUser(userData);
        setFormData({
          firstName: userData.get("firstName") || "",
          lastName: userData.get("lastName") || "",
          email: userData.get("email") || "",
          studyCourse: userData.get("studyCourse") || "",
          bio: userData.get("bio") || "",
        });
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (e) => {
    setFormData({ ...formData, studyCourse: e.target.value });
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      await updateUserProfile(formData);
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    setUploading(true);
    try {
      console.log("Starting profile picture upload...");
      await uploadProfilePicture(file);
      console.log("Profile picture uploaded successfully");

      // Reload user data to show new picture
      const userData = await getCurrentUserProfile();
      console.log("👤 Updated user data:", userData);
      setUser(userData);

      alert("Profile picture updated successfully!");

      // Reset the file input
      event.target.value = "";
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Error uploading profile picture. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePicture = async () => {
    setUploading(true);
    try {
      await removeProfilePicture();

      // Reload user data
      const userData = await getCurrentUserProfile();
      setUser(userData);

      alert("Profile picture removed successfully!");
    } catch (error) {
      console.error("Error removing profile picture:", error);
      alert("Error removing profile picture. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-settings-container">
        <div className="loading-state">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-settings-container">
      <h2>Profile</h2>
      <p className="section-description">
        Update your personal information and how it appears on your profile
      </p>
      <div className="profile-divider"></div>

      {/* Profile Picture Section */}
      <div className="profile-header-section">
        <ProfileAvatar user={user} altText={formData.firstName} />
        <div className="button-group">
          <ChangeButton
            onClick={() =>
              document.getElementById("profile-picture-input").click()
            }
            disabled={uploading}
          />
          <input
            id="profile-picture-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleProfilePictureChange}
            disabled={uploading}
          />
          <RemoveButton onClick={handleRemovePicture} disabled={uploading} />
          {uploading && <span className="upload-text">Uploading...</span>}
        </div>
      </div>

      {/* Form Inputs */}
      <div className="profile-inputs">
        <div className="name-fields">
          <FormInput
            label="First name"
            name="firstName"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
          />
          <FormInput
            label="Last name"
            name="lastName"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <EmailDisplay email={formData.email} />

        <FormSelect
          label="Study Course"
          value={formData.studyCourse}
          onChange={handleSelectChange}
          options={[
            { value: "software", label: "MSc. Software Design" },
            { value: "data", label: "MSc. Data Science" },
            { value: "it-biz", label: "MSc. IT Business" },
          ]}
        />

        <FormInput
          label="Bio"
          name="bio"
          textarea
          placeholder="Brief description for your profile."
          value={formData.bio}
          onChange={handleChange}
        />
      </div>

      {/* Save Button */}
      <div className="save-section">
        <SaveChangesButton onClick={handleSaveChanges} disabled={saving} />
        {saving && <span>Saving...</span>}
      </div>
    </div>
  );
};

export default ProfileSettingsForm;
