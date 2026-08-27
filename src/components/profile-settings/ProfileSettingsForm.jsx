import React from "react";
import "./ProfileSettingsForm.css";
import ProfileAvatar from "../profile-header/ProfileAvatar";
import ChangeButton from "./ChangeButton";
import RemoveButton from "./RemoveButton";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import SaveChangesButton from "./SaveChangesButton";
import EmailDisplay from "./EmailDisplay";

const ProfileSettingsForm = ({
  user,
  formData,
  saving,
  uploading,
  onChange,
  onSave,
  onImageUpload,
  onImageRemove,
}) => {
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) onImageUpload(file);
  };

  return (
    <div className="profile-settings-container">
      <h2>Profile</h2>
      <p className="section-description">
        Update your personal information and how it appears on your profile
      </p>

      <div className="profile-header-section">
        <ProfileAvatar user={user} />
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
            hidden
            onChange={handleFileSelect}
          />
          <RemoveButton onClick={onImageRemove} disabled={uploading} />
          {uploading && <span>Uploading…</span>}
        </div>
      </div>

      <div className="profile-inputs">
        <div className="name-fields">
          <FormInput
            label="First name"
            value={formData.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
          />
          <FormInput
            label="Last name"
            value={formData.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
          />
        </div>

        <EmailDisplay email={formData.email} />

        <FormSelect
          label="Study Course"
          value={formData.studyCourse}
          onChange={(e) => onChange("studyCourse", e.target.value)}
          options={[
            { value: "MSc. Software Design", label: "MSc. Software Design" },
            { value: "MSc. Data Science", label: "MSc. Data Science" },
            { value: "MSc. IT Business", label: "MSc. IT Business" },
          ]}
        />

        <FormInput
          label="Bio"
          textarea
          value={formData.bio}
          onChange={(e) => onChange("bio", e.target.value)}
        />
      </div>

      <div className="save-section">
        <SaveChangesButton onClick={onSave} disabled={saving} />
        {saving && <span>Saving…</span>}
      </div>
    </div>
  );
};

export default ProfileSettingsForm;
