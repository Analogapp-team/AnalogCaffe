import Parse from "./Back4App";

// Name of the class in the database
const EVENT_CLASS = "Event";

// Simple admin setup for now (not the best long-term)
const ADMIN_ID = "PXrsjCliSR";
const ADMIN_EMAIL = "klobucnikadrian123@gmail.com";

/**
 * Helper functions
 * (low-level logic)
 */

/**
 * Get the currently logged-in user.
 * Throws an error if no user is logged in.
 */
function getCurrentUser() {
  const user = Parse.User.current();
  if (!user) {
    throw new Error("You must be logged in.");
  }
  return user;
}

/**
 * Check if the user is the admin.
 * We just compare ID or email.
 */
function isAdmin(user) {
  if (!user) return false;
  if (user.id === ADMIN_ID) return true;

  const email = user.get("email");
  return email && email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

/**
 * Parse can return participants either as user objects or as plain IDs.
 * This function makes sure we always work with an array of user IDs.
 */
function normalizeParticipants(event) {
  const raw = event.get("participants");
  if (!raw || raw.length === 0) return [];

  // Already IDs
  if (typeof raw[0] === "string") return raw;

  // Convert Parse.User objects to IDs
  return raw.map((p) => p.id);
}

/**
 * Fetch a single event object from the database.
 * Internal helper used by multiple public functions.
 */
async function fetchEvent(eventId) {
  const Event = Parse.Object.extend(EVENT_CLASS);
  const query = new Parse.Query(Event);

  query.include("createdBy");

  const event = await query.get(eventId);
  event.set("participants", normalizeParticipants(event));

  return event;
}

/**
 * Public API functions
 * (used by UI components)
 */

/**
 * Create a new event.
 * Only the admin should be able to create events.
 */
export async function createEvent(data) {
  const currentUser = getCurrentUser();

  if (!isAdmin(currentUser)) {
    throw new Error("Only the admin can create events.");
  }

  const Event = Parse.Object.extend(EVENT_CLASS);
  const event = new Event();

  // Basic event fields
  event.set("title", data.title || "");
  event.set("description", data.description || "");
  event.set("date", data.date || "");
  event.set("startTime", data.startTime || "");
  event.set("endTime", data.endTime || "");
  event.set("maxAttendees", Number(data.maxAttendees) || 0);

  // Start with an empty participants list
  event.set("participants", []);

  event.set("createdBy", currentUser);

  // If user uploads an image, save it and attach to the event
  if (data.imageFile) {
    const file = new Parse.File(data.imageFile.name, data.imageFile);
    await file.save();
    event.set("image", file);
  }

  await event.save();
  return event;
}

/**
 * Get all events from the database.
 * Sorting by date so the earliest events show first.
 */
export async function getEvents() {
  const Event = Parse.Object.extend(EVENT_CLASS);
  const query = new Parse.Query(Event);

  query.ascending("date");
  query.include("createdBy");
  query.limit(100);

  const results = await query.find();

  // Normalize participant data for each event
  results.forEach((event) => {
    event.set("participants", normalizeParticipants(event));
  });

  return results;
}

/**
 * Fetch a single event using its ID.
 * This function is used by the UI.
 */
export async function getEventById(eventId) {
  return await fetchEvent(eventId);
}

/**
 * Add the current user to an event.
 * Also checks if the event is full before joining.
 */
export async function joinEvent(eventId) {
  const currentUser = getCurrentUser();
  const event = await fetchEvent(eventId);

  const userId = currentUser.id;
  const participants = event.get("participants") || [];

  // If user is already part of the event, nothing changes
  if (participants.includes(userId)) return event;

  // Check if the event reached its capacity
  const max = event.get("maxAttendees") || 0;
  if (max > 0 && participants.length >= max) {
    throw new Error("This event is full.");
  }

  event.set("participants", [...participants, userId]);
  await event.save();

  return event;
}

/**
 * Remove the user from the event.
 */
export async function leaveEvent(eventId) {
  const currentUser = getCurrentUser();
  const event = await fetchEvent(eventId);

  const userId = currentUser.id;
  const participants = event.get("participants") || [];

  const updatedParticipants = participants.filter((id) => id !== userId);

  event.set("participants", updatedParticipants);
  await event.save();

  return event;
}

/**
 * Update any event info.
 * Only the admin can update an event.
 */
export async function updateEvent(eventId, data) {
  const currentUser = getCurrentUser();

  if (!isAdmin(currentUser)) {
    throw new Error("Only admin can update events.");
  }

  const event = await fetchEvent(eventId);

  // Update only the fields that were provided
  if (data.title !== undefined) event.set("title", data.title);
  if (data.description !== undefined)
    event.set("description", data.description);
  if (data.date !== undefined) event.set("date", data.date);
  if (data.startTime !== undefined) event.set("startTime", data.startTime);
  if (data.endTime !== undefined) event.set("endTime", data.endTime);
  if (data.maxAttendees !== undefined) {
    event.set("maxAttendees", Number(data.maxAttendees) || 0);
  }

  // If admin uploads a new image, replace the old one
  if (data.imageFile) {
    const file = new Parse.File(data.imageFile.name, data.imageFile);
    await file.save();
    event.set("image", file);
  }

  await event.save();
  return event;
}

/**
 * Delete an event completely.
 * Only admin can do this.
 */
export async function deleteEvent(eventId) {
  const currentUser = getCurrentUser();

  if (!isAdmin(currentUser)) {
    throw new Error("Only admin can delete events.");
  }

  const event = await fetchEvent(eventId);
  await event.destroy();

  return true;
}