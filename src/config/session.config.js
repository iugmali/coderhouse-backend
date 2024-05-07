import MongoStore from "connect-mongo";

export const sessionConfig = {
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_CONNECTION,
    dbName: 'ecommerce',
    ttl: 15,
  }),
  secret: process.env.AUTH_SECRET,
  resave: false,
  saveUninitialized: false,
}
