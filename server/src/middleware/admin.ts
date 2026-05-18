import expressTypes = require("express");
import roleMiddleware = require("./role");

const { requireRole } = roleMiddleware;

const requireAdmin: expressTypes.RequestHandler = requireRole("admin");

export = { requireAdmin };
