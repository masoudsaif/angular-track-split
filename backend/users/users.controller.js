import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import usersModel from "../users/users.model.js";

export const signup = async (req, res, next) => {
  try {
    const new_user = req.body;
    const { password: plain_password } = new_user;

    if (!plain_password) throw new Error(`Password not found`);
    const hashed_password = await bcrypt.hash(plain_password, 10);

    const results = await usersModel.create({
      ...new_user,
      password: hashed_password,
    });

    const user = {
      _id: results._id,
      fullname: results.fullname,
      email: results.email,
    };

    const token = jwt.sign(user, process.env.JWT_PRIVATE_KEY);

    res.json({ success: true, data: { user, token } });
  } catch (error) {
    next(error);
  }
};
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await usersModel.findOne({ email }).lean();
    if (!user) throw new ErrorResponse(`User not found`, 401);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new ErrorResponse(`Wrong password`, 401);

    if (!process.env.JWT_PRIVATE_KEY)
      throw new ErrorResponse("Could not sign token", 500);
    const JWT = jwt.sign(
      { _id: user._id, fullname: user.fullname, email: user.email },
      process.env.JWT_PRIVATE_KEY
    );

    res.json({ success: true, data: JWT });
  } catch (error) {
    next(error);
  }
};
