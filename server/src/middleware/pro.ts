import expressTypes = require("express");
import httpUtils = require("../utils/http");

const { HttpError } = httpUtils;

const requireStudentPro: expressTypes.RequestHandler = (req, _res, next) => {
  if (!req.auth) {
    return next(new HttpError(401, "Authentication is required."));
  }

  if (req.auth.role !== "student") {
    return next();
  }

  if (!req.auth.isPro) {
    return next(new HttpError(403, "An active Student Pro subscription is required to use this feature."));
  }

  return next();
};

export = { requireStudentPro };
