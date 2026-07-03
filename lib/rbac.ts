export const userRoles = ["USER", "OWNER", "ADMIN", "MARKETING", "SALES", "SUPPORT"] as const;
export const accountTypes = ["FREE", "PAID", "MEMBER", "ADMIN"] as const;

export type UserRole = (typeof userRoles)[number];
export type AccountType = (typeof accountTypes)[number];

export const roleLabels: Record<UserRole, string> = {
  USER: "User",
  OWNER: "Owner",
  ADMIN: "Admin",
  MARKETING: "Marketing",
  SALES: "Sales",
  SUPPORT: "Support",
};
