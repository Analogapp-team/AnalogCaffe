import React, { useState } from "react";
import "./CreateEventForm.css";
import { createEvent } from "../../configuration/EventService";


/* CreateEventForm component,for creating new events with image upload, 
   validation, and real-time preview. Provides a user-friendly form interface 
   to create new events with: All necessary event fields, Image upload with preview
   Form validation, Submission to backend API, Visual feedback and state management*/ 

function CreateEventForm({ onEventCreated }) {  
  // Optional callback after successful creation.
  // Parent component can listen for successful event creation
  //Useful for refreshing event lists or navigating

  const [eventData, setEventData] = useState({ 
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    maxAttendees: "",
    imageFile: null,
  });

  const [saving, setSaving] = useState(false); // Loading state during submission
  const [error, setError] = useState("");  // Success message display
  const [success, setSuccess] = useState(""); // Client-side image preview

  /*
   * UI-only state for previewing selected image
   */
  const [imagePreview, setImagePreview] = useState(null);

  /*
   * Handle all input changes (text + file inputs)
   */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
     //Handle image file input separately
    if (files && files[0]) {
      const file = files[0];

      // Basic client-side validation
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        return;
      }

      // Update event data with file
      setEventData((prev) => ({
        ...prev,
        [name]: file,
      }));

      // Preview image in UI only (not saved to backend yet)
      setImagePreview(URL.createObjectURL(file));
      return;
    }

    // Handle normal text/number inputs
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
   * Submit form:
   * - Send data to backend
   * - Create event in Parse
   * - Update UI optimistically via callback
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      // API call to create event
      const createdEvent = await createEvent({
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        maxAttendees: eventData.maxAttendees,
        imageFile: eventData.imageFile,
      });

      /*
       * Notify parent (Events page) so UI updates immediately
       */
      onEventCreated?.(createdEvent);

      setSuccess("Event created successfully!");

      // Resetting the form to initial state after saving
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
      setSaving(false); // Re-enable form
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

              {/*Real-time image preview. Shows uploaded image immediately
                 Provides visual feedback*/}
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

