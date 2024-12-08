import { Role } from "./role";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  isActive: boolean;
  role: Role;
}

export interface LoggedUser extends Omit<User, "token"> {}

export interface UserDto {
  email: string;
  password: string;
}
