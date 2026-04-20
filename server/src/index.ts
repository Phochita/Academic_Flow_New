import dotenv = require("dotenv");
import path = require("node:path");
import process = require("node:process");
import app = require("./app");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const defaultPort = 4000;
const parsedPort = Number(process.env.PORT);
const port = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : defaultPort;

app.listen(port, () => {
  console.log(`AcaFlow API listening on port ${port}`);
});
