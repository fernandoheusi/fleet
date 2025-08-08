import mongoose from "mongoose";

const conn = async () => {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(
      `mongodb+srv://desafio:123@cluster0.qyl338x.mongodb.net/`
    );

    console.log("connectado ao banco");
  } catch (error) {
    console.log(error);
  }
};

export { conn };
