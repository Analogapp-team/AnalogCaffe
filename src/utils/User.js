export function getFullName(user) {
	if (!user) return "User";
	const firstName = typeof user.get === "function" ? user.get("firstName") : user.firstName;
	const lastName = typeof user.get === "function" ? user.get("lastName") : user.lastName;
	const username = typeof user.get === "function" ? user.get("username") : user.username;

	const fn = firstName || "";
	const ln = lastName || "";
	const un = username || "";

	if (fn || ln) return `${fn} ${ln}`.trim();
	if (un) return un;
	return "User";
}

export function getDisplayInitials(user) {
	if (!user) return "U";
	const firstName = typeof user.get === "function" ? user.get("firstName") : user.firstName;
	const lastName = typeof user.get === "function" ? user.get("lastName") : user.lastName;
	const username = typeof user.get === "function" ? user.get("username") : user.username;

	if (firstName || lastName)
		return `${(firstName || "").charAt(0)}${(lastName || "").charAt(0)}`.toUpperCase();

	if (username) return username.charAt(0).toUpperCase();
	return "U";
}

