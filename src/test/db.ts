import mongoose from "mongoose";

export const connect = async () => {
  const uri = "mongodb://mongo-unit-test:27017";
  const mongooseOptions = {
    useNewUrlParser: true
  };
  await mongoose.connect(uri, mongooseOptions);
};

export const close = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

export const clear = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
