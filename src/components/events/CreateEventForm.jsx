import React, { useState } from "react";
import "./CreateEventForm.css";
import { createEvent } from "../../configuration/EventService";

function CreateEventForm() {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    maxAttendees: "",
    imageFile: null,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // UI-only state (preview image)
  const [imagePreview, setImagePreview] = useState(null);

  // Handling all inputs in one place (works for text + file inputs)
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Handle image input
    if (files && files[0]) {
      const file = files[0];

      // Basic validation
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        return;
      }

      setEventData((prev) => ({
        ...prev,
        [name]: file,
      }));

      // UI preview only
      setImagePreview(URL.createObjectURL(file));
      return;
    }

    // Handle normal inputs
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit the form and send the data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await createEvent({
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        maxAttendees: eventData.maxAttendees,
        imageFile: eventData.imageFile,
      });

      setSuccess("Event created successfully!");

      // Resetting the form after saving
      setEventData({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        maxAttendees: "",
        imageFile: null,
      });

      setImagePreview(null);
      e.target.reset();
    } catch (err) {
      setError(err.message || "Failed to create event.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="create-event">
      <h2 className="create-event__title">Create a New Event</h2>

      {/* Feedback messages */}
      {error && <div className="event-error">{error}</div>}
      {success && <div className="event-success">{success}</div>}

      <form className="create-event__form" onSubmit={handleSubmit}>
        {/* Row 1: Title + Image upload */}
        <div className="create-event__row">
          <div className="form-group">
            <label>Event Title</label>
            <input
              type="text"
              name="title"
              placeholder="Morning Coffee Tasting"
              value={eventData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Event Image</label>

            {/* ✅ NEW STRUCTURAL WRAPPER */}
            <div className="event-image-row">
              <label className="ui-button ui-button--primary">
                Choose file
                <input
                  type="file"
                  name="imageFile"
                  accept="image/*"
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
              </label>

              <div className="event-image-preview">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="event-image-preview__img"
                  />
                ) : (
                  <div className="event-image-placeholder">
                    No image selected
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description field */}
        <div className="form-group full-width">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Tell us more about the event..."
            value={eventData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Row 2: Date + Max attendees */}
        <div className="create-event__row">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Maximum Attendees</label>
            <input
              type="number"
              name="maxAttendees"
              placeholder="0 = unlimited"
              value={eventData.maxAttendees}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        {/* Row 3: Times */}
        <div className="create-event__row">
          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              name="startTime"
              value={eventData.startTime}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              name="endTime"
              value={eventData.endTime}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="ui-button ui-button--primary"
          disabled={saving}
        >
          {saving ? "Creating…" : "Create Event"}
        </button>
      </form>
    </div>
  );
}

export default CreateEventForm;