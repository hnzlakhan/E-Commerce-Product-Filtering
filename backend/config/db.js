import mongoose from "mongoose";

// export const ConnectDB = () => {
//   mongoose
//     .connect(process.env.MONGO_URI)
//     .then((res) => {
//       console.log(res.connection.host);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

export const ConnectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `✅✅✅ Database is connected with host ${db.connection.host}.`.bgCyan
        .black
    );
  } catch (error) {
    console.log(
      `❌❌❌ Unable to connect database. ${error.message}`.bgRed.white
    );
  }
};
