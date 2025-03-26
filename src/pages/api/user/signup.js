import conn_to_mon from "@/features/mongoose";
import ShopUser from "@/models/ShopUser";
import bcrypt, { hash } from "bcryptjs";

export default async function signUp(req, res) {
  try {
    await conn_to_mon();
    const { username, email, phoneNumber, shopType, password } = req.body;

    const useExit = await ShopUser.findOne({ email: email });
    if (useExit) {
      res.status(200).json({ success: false, message: "User Exist" });
    }

    const hashPassword = await bcrypt.hash(password, 5);

    try {
      const newUser = new ShopUser({
        username,
        email,
        phoneNumber,
        shopType,
        password: hashPassword,
      });
      await newUser.save();
      res
        .status(200)
        .json({ success: true, message: "User sign up successfully" });
    } catch (error) {
      res.status(500).json({ message: "User Already Exist", error });
    }
  } catch (error) {
    res.status(500).json({ message: "Error signing up user", error });
  }
}
