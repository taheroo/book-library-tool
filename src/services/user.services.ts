import UserModel, { User } from "../models/user";

export const createUser = async (user: User) => {
  const newUser = new UserModel(user);
  await newUser.save();
  return newUser;
};

export const getUsers = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  const users = await UserModel.find().skip(offset).limit(limit);
  const totalCount = await UserModel.countDocuments();

  return {
    users,
    pagination: {
      total: totalCount,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

export const getUserById = async (id: string) => {
  const user = await UserModel.findById(id);
  return user;
};
