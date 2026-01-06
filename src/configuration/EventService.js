import Parse from "./Back4App";
import { isUserAdmin } from "../utils/roles";

/**
 * Parse class name
 */
const EVENT_CLASS = "Event";

/* =========================================================
   Helper functions (low-level, internal)
========================================================= */

/**
 * Get the currently logged-in user
 */
function getCurrentUser() {
  const user = Parse.User.current();
  if (!user) {
    throw new Error("You must be logged in.");
  }
  return user;
}

/**
 * Fetch a single event
 */
async function fetchEvent(eventId) {
  const Event = Parse.Object.extend(EVENT_CLASS);
  const query = new Parse.Query(Event);

  query.equalTo("objectId", eventId);
  const event = await query.first();

  if (!event) {
    throw new Error("Event not found.");
  }

  return event;
}

/* =========================================================
   Public API functions (used by UI)
========================================================= */

/**
 * Create a new event (ADMIN ONLY)
 */
export async function createEvent(data) {
  const currentUser = getCurrentUser();
  const admin = await isUserAdmin(currentUser);

  if (!admin) {
    throw new Error("Only admins can create events.");
  }

  const Event = Parse.Object.extend(EVENT_CLASS);
  const event = new Event();

  const acl = new Parse.ACL();
  acl.setPublicReadAccess(true);
  acl.setPublicWriteAccess(true);
  acl.setRoleReadAccess("Admin", true);
  acl.setRoleWriteAccess("Admin", true);

  event.setACL(acl);

  event.set("title", data.title || "");
  event.set("description", data.description || "");
  event.set("date", data.date || "");
  event.set("startTime", data.startTime || "");
  event.set("endTime", data.endTime || "");
  event.set("maxAttendees", Number(data.maxAttendees) || 0);
  event.set("participants", []); // ✅ userId strings
  event.set("createdBy", currentUser);

  if (data.imageFile) {
    const file = new Parse.File(data.imageFile.name, data.imageFile);
    await file.save();
    event.set("image", file);
  }

  await event.save();
  return event;
}

/**
 * Get all events
 */
export async function getEvents() {
  const Event = Parse.Object.extend(EVENT_CLASS);
  const query = new Parse.Query(Event);

  query.ascending("date");
  query.include("createdBy");
  query.limit(100);

  return await query.find();
}

/**
 * Get a single event by ID
 */
export async function getEventById(eventId) {
  return await fetchEvent(eventId);
}

/**
 * Join an event
 */
export async function joinEvent(eventId) {
  const currentUser = getCurrentUser();
  const event = await fetchEvent(eventId);

  const userId = currentUser.id;
  const participants = event.get("participants") || [];

  if (participants.includes(userId)) {
    return event;
  }

  const max = event.get("maxAttendees") || 0;
  if (max > 0 && participants.length >= max) {
    throw new Error("This event is full.");
  }

  event.set("participants", [...participants, userId]);
  await event.save();

  return event;
}

/**
 * Leave an event
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
 * Update event details (ADMIN ONLY)
 */
export async function updateEvent(eventId, data) {
  const currentUser = getCurrentUser();
  const admin = await isUserAdmin(currentUser);

  if (!admin) {
    throw new Error("Only admins can update events.");
  }

  const event = await fetchEvent(eventId);

  if (data.title !== undefined) event.set("title", data.title);
  if (data.description !== undefined) event.set("description", data.description);
  if (data.date !== undefined) event.set("date", data.date);
  if (data.startTime !== undefined) event.set("startTime", data.startTime);
  if (data.endTime !== undefined) event.set("endTime", data.endTime);
  if (data.maxAttendees !== undefined) {
    event.set("maxAttendees", Number(data.maxAttendees) || 0);
  }

  await event.save();
  return event;
}

/**
 * Upload / replace event image (ADMIN ONLY)
 */
export async function uploadEventImage(eventId, file) {
  const currentUser = getCurrentUser();
  const admin = await isUserAdmin(currentUser);

  if (!admin) {
    throw new Error("Only admins can upload event images.");
  }

  if (!file) {
    throw new Error("No image provided.");
  }

  const event = await fetchEvent(eventId);

  const parseFile = new Parse.File(file.name, file);
  await parseFile.save();

  event.set("image", parseFile);
  await event.save();

  return event;
}

/**
 * Delete event (ADMIN ONLY)
 */
export async function deleteEvent(eventId) {
  const currentUser = getCurrentUser();
  const admin = await isUserAdmin(currentUser);

  if (!admin) {
    throw new Error("Only admins can delete events.");
  }

  const event = await fetchEvent(eventId);
  await event.destroy();

  return true;
}