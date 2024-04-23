import ProfanityService from "./services/profanity/profanity.service.js";
import mongoose from "mongoose";
import {BadRequestError, NotFoundError} from "./exceptions/errors.js";

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

export const handleValidationErrors = (e) => {
  if (e instanceof mongoose.Error.ValidationError) {
    let errors = [];
    Object.keys(e.errors).forEach((key) => {
      errors.push(e.errors[key].message);
    });
    throw new BadRequestError(`Validation error: ${errors.join(' ')}`);
  }
};

export const handleNotFoundError = (e) => {
  if (e instanceof mongoose.Error.DocumentNotFoundError || e instanceof mongoose.Error.CastError) {
    throw new NotFoundError('Document not found.');
  }
};

export const handleUniqueIndexError = (e, msg) => {
  if (e.code === 11000) {
    throw new BadRequestError(msg);
  }
};
