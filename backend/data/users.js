import bcrypt from "bcryptjs";
const users = [
  {
    name: "Ahmad",
    email: "ahmad@yopmail.com",
    password: bcrypt.hashSync("Qwe123@", 10),
    isAdmin: true,
  },
  {
    name: "Ali",
    email: "ali@yopmail.com",
    password: bcrypt.hashSync("Qwe123@", 10),
  },
];

export default users;
