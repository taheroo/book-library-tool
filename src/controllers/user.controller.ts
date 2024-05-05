import { Request, Response } from "express";
import * as UserServices from "../services/user.services";
import { MongoDBError } from "../types/mongodb-error.types";
import { MONGO_ERROR_CODES } from "../constants/mongodb-error-codes";
import { createUserSchema } from "../validations/user.validations";
import logger from "../services/logger";
import UserModel from "../models/user";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { error, data } = createUserSchema.safeParse(req.body);
    if (error) {
      return res.status(400).send(error.format());
    }
    const isUserExists = await UserModel.exists({ email: req.body.email });
    if (isUserExists) {
      return res.status(409).send("A user with the same email already exists.");
    }
    logger.info("Creating user", { body: req.body });
    const result = await UserServices.createUser(data);
    res.status(201).send(result);
  } catch (error) {
    const e = error as MongoDBError;
    if (e.code === MONGO_ERROR_CODES.DUPLICATE_KEY) {
      res.status(409).send("A user with the same email already exists.");
    } else {
      res.status(400).send(e);
    }
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await UserServices.getUsers(page, limit);
    res.send(result);
  } catch (error) {
    console.log("Error fetching users", error);
    res.status(500).send(error);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.getUserById(req.params.id);
    if (!result) {
      return res.status(404).send("User not found");
    }
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};
