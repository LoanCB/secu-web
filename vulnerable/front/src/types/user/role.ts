export enum RoleType {
  ADMINISTRATOR = "ADMINISTRATOR",
  MANAGER = "MANAGER",
  READ_ONLY = "READ_ONLY",
}

export interface Role {
  createdAt: string;
  updatedAt: string;
  id: number;
  title: string;
  name: RoleType;
  description: string;
}
