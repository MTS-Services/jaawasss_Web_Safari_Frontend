export type UserRole = "buyer" | "manufacturer" | "admin";

export function normalizeUserRole(role: string): UserRole {
  switch (role.toLowerCase()) {
    case "admin":
      return "admin";
    case "manufacturer":
      return "manufacturer";
    case "buyer":
    default:
      return "buyer";
  }
}

export function getDashboardPathByRole(role: string): string {
  switch (normalizeUserRole(role)) {
    case "admin":
      return "/admin";
    case "manufacturer":
      return "/dashboard/manufacturer";
    case "buyer":
    default:
      return "/dashboard/buyer";
  }
}
