import ProfanityService from "./services/profanity/profanity.service.js";
import mongoose from "mongoose";
import {BadRequestError, NotFoundError} from "./exceptions/errors.js";
import bcrypt from "bcrypt";
import {randomUUID} from "crypto";

import {faker} from "@faker-js/faker/locale/pt_BR";

export const isProfane = (word) => {
  const profanity = new ProfanityService();
  return profanity.isProfane(word);
};

export const censorWord = (word) => {
  const profanity = new ProfanityService();
  if (profanity.isProfane(word)) {
    return {
      word: profanity.censor(word),
      censored: true
    };
  }
  return { word, censored: false };
};

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const generateCode = () => {
  return randomUUID();
}

export const generateFakeProduct = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.commerce.isbn(),
    price: parseFloat(faker.commerce.price({
      min: 10000,
      max: 100000
    }))/100,
    status: faker.datatype.boolean(),
    stock: faker.number.int(),
    category: faker.commerce.department(),
    thumbnails: [faker.image.url()],
    createdAt: faker.date.recent(),
    __v: 0
  };
}

export const isValidPassword = async (user, password) => {
  return bcrypt.compareSync(password, user.password);
}

export const handleProductQueries = (queries) => {
  let limit = +queries.limit;
  let page = +queries.page;
  let query = queries.query;
  let sort = queries.sort;
  if (!limit || limit < 0) {
    limit = 10;
  }
  if (!page || page < 0) {
    page = 1;
  }
  return { limit, page, query, sort };
}


export const throwErrorWhenMongooseNotFound = (item, message) => {
  if (!item) {
    throw new NotFoundError(message);
  }
}

export const handleValidationErrors = (e) => {
  if (e instanceof mongoose.Error.ValidationError) {
    let errors = [];
    Object.keys(e.errors).forEach((key) => {
      errors.push(e.errors[key].message);
    });
    throw new BadRequestError(`Validation error: ${errors.join(' ')}`);
  }
};

export const handleNotFoundError = (e, message) => {
  if (e instanceof NotFoundError) {
    throw e;
  }
  if (e instanceof mongoose.Error.DocumentNotFoundError || e instanceof mongoose.Error.CastError) {
    throw new NotFoundError(message);
  }
};

export const handleUniqueIndexError = (e, msg) => {
  if (e.code === 11000) {
    throw new BadRequestError(msg);
  }
};
