export const isProfileComplete = (user) => {
  if (!user || typeof user !== "object") return false;

  const requiredFields = [
    "name",
    "age",
    "gender",
    "state",
    "familyIncome",
    "category",
  ];

  return requiredFields.every((field) => {
    const value = user[field];
    return value !== undefined && value !== null && value !== "";
  });
};

export const getDefaultRedirect = (user) => {
  if (!user) return "/login";
  if (user.role === "Admin") return "/admin";
  return isProfileComplete(user) ? "/dashboard" : "/profile";
};
