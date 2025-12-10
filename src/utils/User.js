// Utility functions to get users full name (used for displaying user names)
export function getFullName(user) {
  if (!user) return "User";
  const firstName =
    typeof user.get === "function" ? user.get("firstName") : user.firstName;
  const lastName =
    typeof user.get === "function" ? user.get("lastName") : user.lastName;

  const fn = firstName || "";
  const ln = lastName || "";
  const email = typeof user.get === "function" ? user.get("email") : user.email;
  const id = typeof user.get === "function" ? user.id : user.id;

  if (fn || ln) return `${fn} ${ln}`.trim();
  if (email) return email.split("@")[0];
  if (id) return id;
  return "User";
}

// Utility function to get user display initials (used for profile avatar placeholders)
export function getDisplayInitials(user) {
  if (!user) return "U";
  const firstName =
    typeof user.get === "function" ? user.get("firstName") : user.firstName;
  const lastName =
    typeof user.get === "function" ? user.get("lastName") : user.lastName;
  const email = typeof user.get === "function" ? user.get("email") : user.email;
  const id = typeof user.get === "function" ? user.id : user.id;

  if (firstName || lastName)
    return `${(firstName || "").charAt(0)}${(lastName || "").charAt(
      0
    )}`.toUpperCase();

  if (email) return (email || "").charAt(0).toUpperCase();
  if (id) return (id || "").charAt(0).toUpperCase();
  return "U";
}
