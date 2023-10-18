export interface User {
  _id: string;
  password?: string;
  firstname: string;
  lastname: string;
  phone: string;
  email?: string;
  token?: string;
  admin?: boolean;
  trial?: boolean;
}
