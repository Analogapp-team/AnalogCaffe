import React, { useState } from "react";
import "./CreateEventForm.css";

const CreateEventForm = ({ onCreate }) => {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    maxAttendees: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setEventData({
      ...eventData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // limit attendees to 100 max
    if (parseInt(eventData.maxAttendees) > 100) {
      alert("Maximum attendees cannot exceed 100.");
      return;
    }

    console.log("New Event Created:", eventData);
    if (onCreate) onCreate(eventData);

    // reset
    setEventData({
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      maxAttendees: "",
      image: null,
    });
  };

  return (
    <div className="create-event">
      <h2 className="create-event__title">Create a New Event</h2>

      <form className="create-event__form" onSubmit={handleSubmit}>
        <div className="create-event__row">
          <div className="form-group">
            <label>Event Title</label>
            <input
              type="text"
              name="title"
              placeholder="Morning Coffee Tasting"
              value={eventData.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Event Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Tell us more about the event..."
            value={eventData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="create-event__row">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Maximum Attendees</label>
            <input
              type="number"
              name="maxAttendees"
              placeholder="max 100"
              value={eventData.maxAttendees}
              onChange={handleChange}
              min="1"
              max="100"
            />
          </div>
        </div>

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

        <button type="submit" className="create-event__submit">
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEventForm;
