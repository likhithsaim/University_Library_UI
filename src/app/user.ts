import { Book } from "./book";

export class User {
  public name: string;
  public password: string;
  public id: number;
  public admin: boolean;

  constructor(
    id: number,
    password: string,
    name: string,
    admin: boolean,
  ) {
    this.name = name;
    this.password = password;
    this.id = id;
    this.admin = admin;
  }

}