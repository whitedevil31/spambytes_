import * as mongodb from "mongodb";
import { getClient } from "../db/db.connect";
import { userDB } from "../user/user.schema";
import { requestType, requestSchema } from "./request.schema";

export const sendRequest = async (data: requestType, user: userDB) => {
  console.log(data);
  console.log(user);
  await requestSchema.validate(data).catch((err: any) => {
    throw { success: false, message: err.errors };
  });
  const client: mongodb.MongoClient = await getClient();
  const insertData = { clientId: new mongodb.ObjectId(user._id), ...data };
  console.log(insertData);
  const response = await client
    .db()
    .collection("request")
    .insertOne(insertData);
  if (response.insertedCount <= 0) {
    throw { process: false, message: "MongoDB Error" };
  }
  return { success: true, _id: response.insertedId };
};