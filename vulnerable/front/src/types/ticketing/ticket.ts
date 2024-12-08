import { User } from "../user/user";
import { File } from "./file";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  user: User;
  files: File[];
}
