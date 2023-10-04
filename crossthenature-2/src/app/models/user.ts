export class User {
  constructor(
    _id: string,
    password: string,
    firstname: string,
    lastname: string,
    phone: string,
    email: string,
    token: string,
    admin: boolean,
  ) {
    this._id = _id;
    this.password = password;
    this.firstname = firstname;
    this.lastname = lastname;
    this.phone = phone;
    this.email = email;
    this.token = token;
    this.admin = admin;
  }

  _id: string;
  password: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  token: string;
  admin: boolean;
}
