// Utility functions to get users full name
export function getFullName(user) {
  if (!user) return "User";

  // These still need the check because data might be hidden behind .get()
  const firstName = typeof user.get === "function" ? user.get("firstName") : user.firstName;
  const lastName = typeof user.get === "function" ? user.get("lastName") : user.lastName;
  const email = typeof user.get === "function" ? user.get("email") : user.email;
  
  // FIXED: No ternary needed here. 'id' is usually a top-level property on both standard objects and Models (like Parse/Backbone).
  const id = user.id;

  const fn = firstName || "";
  const ln = lastName || "";

  if (fn || ln) return `${fn} ${ln}`.trim();
  if (email) return email.split("@")[0];
  if (id) return id;
  return "User";
}

