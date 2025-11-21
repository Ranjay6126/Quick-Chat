import jwt from "jsonwebtoken";

export const generateToken = (userID) => {
  const token = jwt.sign({ id: userID }, process.env.JWT_SECRET);
  return token;
};
