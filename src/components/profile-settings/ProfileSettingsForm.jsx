import React, { useState } from "react";
import "./ProfileSettingsForm.css";
import ProfileAvatar from "../profile-header/ProfileAvatar";
import ChangeButton from "./ChangeButton";
import RemoveButton from "./RemoveButton";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import SaveChangesButton from "./SaveChangesButton";
import EmailDisplay from "./EmailDisplay";

const ProfileSettingsForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studyCourse: "",
    bio: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="profile-settings-container">
      <h2>Profile</h2>
      <p className="section-description">
        Update your personal information and how it appears on your profile
      </p>
      <div className="profile-divider"></div>

      <div className="profile-header-section">
        <ProfileAvatar />
        <div className="button-group">
          <ChangeButton />
          <RemoveButton />
        </div>
      </div>

      <div className="profile-inputs">
        <div className="name-fields">
          <FormInput
            label="First name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <FormInput
            label="Last name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

      <EmailDisplay email="klob@itu.dk" />

        <FormSelect
          label="Study Course"
          name="studyCourse"
          value={formData.studyCourse}
          onChange={handleChange}
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

      <div className="save-section">
        <SaveChangesButton />
      </div>
    </div>
  );
};

export default ProfileSettingsForm;
