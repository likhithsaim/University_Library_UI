export class User {
  public readerId: number;
  public adminId: number;
  public email: string;
  public address: string;
  public firstName: string;
  public lastName: string;
  public gender: string;
  public password: string;
  
  public admin: boolean;

  constructor(
    readerId: number,
   adminId: number,
   email: string,
   address: string,
   firstName: string,
   lastName: string,
   gender: string,
   password: string
  ) {
    this.readerId = readerId;
    this.adminId = adminId;
    this.email = email;
    this.address = address;
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.password =password;
    this.admin =!!adminId;
  }

}