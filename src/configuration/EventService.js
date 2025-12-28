import Parse from "./Back4App";
import { isUserAdmin } from "../utils/roles";

// Name of the class in the database
const EVENT_CLASS = "Event";

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
 * Only admins should be able to create events.
 */
export async function createEvent(data) {
  const currentUser = getCurrentUser();
  const isAdmin = await isUserAdmin(currentUser);

  if (!isAdmin) {
    throw new Error("Only admins can create events.");
  }

  const Event = Parse.Object.extend(EVENT_CLASS);
  const event = new Event();

  /**
   * ACL SETUP
   *
   * - No public access
   * - Authenticated users can READ
   * - Admin role can READ + WRITE
   */

  const acl = new Parse.ACL();

  // No public access
  acl.setPublicReadAccess(false);
  acl.setPublicWriteAccess(false);

 // Everyone can READ (visibility controlled by your protected routes)
acl.setPublicReadAccess(true);

// No public writes
acl.setPublicWriteAccess(false);


  // Admin role: full access
  acl.setRoleReadAccess("Admin", true);
  acl.setRoleWriteAccess("Admin", true);

  event.setACL(acl);

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
 */
export async function getEvents() {
  const Event = Parse.Object.extend(EVENT_CLASS);
  const query = new Parse.Query(Event);

  query.ascending("date");
  query.include("createdBy");
  query.limit(100);

  const results = await query.find();

  results.forEach((event) => {
    event.set("participants", normalizeParticipants(event));
  });

  return results;
}

/**
 * Fetch a single event using its ID.
 */
export async function getEventById(eventId) {
  return await fetchEvent(eventId);
}

/**
 * Add the current user to an event.
 */
export async function joinEvent(eventId) {
  const currentUser = getCurrentUser();
  const event = await fetchEvent(eventId);

  const userId = currentUser.id;
  const participants = event.get("participants") || [];

  if (participants.includes(userId)) return event;

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

  event.set(
    "participants",
    participants.filter((id) => id !== userId)
  );

  await event.save();
  return event;
}

/**
 * Update any event info.
 * Only admins can update events.
 */
export async function updateEvent(eventId, data) {
  const currentUser = getCurrentUser();
  const isAdmin = await isUserAdmin(currentUser);

  if (!isAdmin) {
    throw new Error("Only admins can update events.");
  }

  const event = await fetchEvent(eventId);

  if (data.title !== undefined) event.set("title", data.title);
  if (data.description !== undefined)
    event.set("description", data.description);
  if (data.date !== undefined) event.set("date", data.date);
  if (data.startTime !== undefined) event.set("startTime", data.startTime);
  if (data.endTime !== undefined) event.set("endTime", data.endTime);
  if (data.maxAttendees !== undefined) {
    event.set("maxAttendees", Number(data.maxAttendees) || 0);
  }

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
 * Only admins can do this.
 */
export async function deleteEvent(eventId) {
  const currentUser = getCurrentUser();
  const isAdmin = await isUserAdmin(currentUser);

  if (!isAdmin) {
    throw new Error("Only admins can delete events.");
  }

  const event = await fetchEvent(eventId);
  await event.destroy();

  return true;
}