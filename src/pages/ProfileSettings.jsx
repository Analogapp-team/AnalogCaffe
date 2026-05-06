import React, { useEffect, useState } from "react";
import ProfileSettingsForm from "../components/profile-settings/ProfileSettingsForm";
import {
  getCurrentUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  removeProfilePicture,
} from "../configuration/UserService";
import { useAuth } from "../configuration/AuthContext";

const ProfileSettings = () => {
  const { refreshCurrentUser } = useAuth();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  /**
   * LOAD USER (once)
   */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const u = await getCurrentUserProfile();
        setUser(u);
        setFormData({
          firstName: u.get("firstName") || "",
          lastName: u.get("lastName") || "",
          email: u.get("email") || "",
          studyCourse: u.get("studyCourse") || "",
          bio: u.get("bio") || "",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /**
   * FORM FIELD UPDATE
   */
  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * SAVE PROFILE
   * (force reload so sidebar avatar updates)
   */
  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserProfile(formData);
      await refreshCurrentUser();

      // TEMP FIX: full reload to refresh sidebar avatar
      window.location.reload();

    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaving(false);
    }
  };

  /**
   * PROFILE IMAGE UPLOAD
   */
  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      await uploadProfilePicture(file);
      await refreshCurrentUser();
      const updated = await getCurrentUserProfile();
      setUser(updated);
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  /**
   * PROFILE IMAGE REMOVE
   */
  const handleImageRemove = async () => {
    setUploading(true);
    try {
      await removeProfilePicture();
      await refreshCurrentUser();
      const updated = await getCurrentUserProfile();
      setUser(updated);
    } catch (err) {
      console.error("Image removal failed:", err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="profile-settings-page">Loading profile…</div>;
  }

  return (
    <div className="profile-settings-page">
      <ProfileSettingsForm
        user={user}
        formData={formData}
        saving={saving}
        uploading={uploading}
        onChange={handleFieldChange}
        onSave={handleSave}
        onImageUpload={handleImageUpload}
        onImageRemove={handleImageRemove}
      />
    </div>
  );
};

export default ProfileSettings;