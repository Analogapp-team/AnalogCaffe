import Parse from "../configuration/Back4App";

export async function isUserAdmin(user) {
  if (!user) return false;

  const query = new Parse.Query(Parse.Role);
  query.equalTo("name", "Admin");
  query.equalTo("users", user);

  const role = await query.first();
  return !!role;
}