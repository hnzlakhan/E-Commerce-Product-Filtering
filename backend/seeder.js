import dotenv from "dotenv";
import colors from "colors";
import products from "./data/products.js";
import users from "./data/users.js";
import Product from "./models/product.js";
import User from "./models/user.js";
import { ConnectDB } from "./config/db.js";

dotenv.config();
ConnectDB();

const ImportData = async () => {
  try {
    await Product.deleteMany({});
    await User.deleteMany({});

    const createdUser = await User.insertMany(users);

    const adminUser = createdUser[0]._id;

    const newProducts = products.map((p) => {
      return {
        ...p,
        user: adminUser,
      };
    });
    await Product.insertMany(newProducts);
    console.log(`Data Imported!!!`.bgGreen.white);
    process.exit();
  } catch (error) {
    console.log(`Unable to import data: ${error.message}`.bgRed.white);
    process.exit(1);
  }
};

const DeleteData = async () => {
  try {
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log(`Data Deleted!!!`.bgGreen.white);
    process.exit();
  } catch (error) {
    console.log(`Unable to delete data: ${error.message}`.bgRed.white);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  DeleteData();
} else {
  ImportData();
}
