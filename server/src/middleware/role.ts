import expressTypes = require("express");
import httpUtils = require("../utils/http");

const { HttpError } = httpUtils;

type AppRole = "student" | "lecturer" | "admin";

const requireRole =
  (...roles: AppRole[]): expressTypes.RequestHandler =>
  (req, _res, next) => {
    if (!req.auth) {
      return next(new HttpError(401, "Authentication is required."));
    }

    if (!roles.includes(req.auth.role)) {
      return next(new HttpError(403, "You do not have permission to perform this action."));
    }

    return next();
  };

export = { requireRole };
