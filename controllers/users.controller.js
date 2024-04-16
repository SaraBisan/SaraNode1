import {
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  patchIsBiz,
} from "../model/dbAdapter.js";
import handleError from "../utils/handleError.js";
import { generateHash, cmpHash } from "../utils/bcrypt.js";
import { generateToken } from "../token/jwt.js";
import { getAllUsersMongo, getUserByIdMongo } from "../model/mongodb/users/userService.js";

const registerController = async (req, res) => {
  try {
    let userFromDB = await getUserByEmail(req.body.email);
    if (userFromDB) throw new Error("user already exists");
    let passwordHash = await generateHash(req.body.password);
    req.body.password = passwordHash;
    let newUser = await createUser(req.body);
    newUser.password = undefined;
    delete newUser.password;
    console.log(newUser);
    res.json(newUser);
  } catch (err) {
    console.log(err);
    handleError(res, 400, err.message);
  }
};

const loginController = async (req, res) => {
  try {
    let userFromDB = await getUserByEmail(req.body.email);
    if (!userFromDB) throw new Error("invalid email or password");
    let passwordMatch = await cmpHash(req.body.password, userFromDB.password);
    if (!passwordMatch) throw new Error("invalid email or password");
    let token = await generateToken({
      _id: userFromDB._id,
      isAdmin: userFromDB.isAdmin,
      isBusiness: userFromDB.isBusiness,
    });
    res.json(token);
  } catch (err) {
    console.log(err);
    handleError(res, 400, err.message);
  }
};

const updateUserController = async (req, res) => {
  try {
    let userFromDB = await updateUser(req.params.id, req.body);
    userFromDB.password = undefined;
    res.json(userFromDB);
  } catch (err) {
    console.log(err);
    handleError(res, 400, err.message);
  }
};


const updateMeController = async (req, res) => {
  try {
    let userFromDB = await updateUser(req.userData._id, req.body);
    userFromDB.password = undefined;
    res.json(userFromDB);
  } catch (err) {
    console.log(err);
    handleError(res, 400, err.message);
  }
};

const getAllUsersController = async (req, res) => {
  try {
    let usersFromDB = await getAllUsersMongo();
    res.json(usersFromDB);
  } catch (err) {
    console.log(err);
    handleError(res, 400, err.message);
  }
};

const getMe = async (req, res) => {
  try {
    let userFromDB = await getUserByIdMongo(req.userData._id);
    res.json(userFromDB);
  } catch (err) {
    console.log(err);
    handleError(res, 400, err.message);
  }
}
const getUserByIdController = async (req, res) => {
  try {
    let userFromDB = await getUserByIdMongo(req.params.id);
    res.json(userFromDB);
  } catch (err) {
    console.log(err);
    handleError(res, 400, err.message);
  }
};

const patchIsBizController = async (req, res) => {
  try {
    let userFromDB = await patchIsBiz(req.params.id, req.body.isBusiness);
    userFromDB.password = undefined;
    res.json(userFromDB);
  } catch (err) {
    console.log(err);
    handleError(res, 400, err.message);
  }
};

const deleteUserController = async (req, res) => {
  try {
    let userFromDB = await deleteUser(req.params.id);
    userFromDB.password = undefined;
    res.json(userFromDB);
  } catch (err) {
    console.log(err);
    handleError(res, 400, err.message);
  }
};

export {
  loginController,
  registerController,
  updateUserController,
  deleteUserController,
  patchIsBizController,
  getAllUsersController,
  getUserByIdController,
  getMe,
  updateMeController
};
