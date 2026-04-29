import express from "express";
import { parseArgs } from "node:util";
import axios from "axios";
const config = {
  options: {
    port: { type: "string", short: "p" },
    origin: { type: "string", short: "o" },
    "clear-cache": { type: "boolean" },
  },
  allowPositionals: true,
};
const { values } = parseArgs(config);

const port = values.port ? parseInt(values.port, 10) : 3000;
const origin = values.origin;
const clearCache = values["clear-cache"] || false;
const app = express();

const msg = "please provide args in the format below";
const example = "--port 3000 --origin <your-url>";

let cache = new Map();

if (clearCache) {
  cache.clear();
  const msg = "all cached data are now cleared";
  console.log(msg);
  process.exit(0);
}

if (isNaN(port) || port < 0 || port > 65535) {
  console.log("Invalid port number");
  console.log("....................");
  console.log(msg, example);
  process.exit(1);
}

if (origin == null) {
  console.log("no origin was provided ");
  console.log("....................");
  console.log(msg, example);
  process.exit(1);
}

//start server
app.use(async (req, res) => {
  const url = `${origin}${req.url}`;
  if (cache.has(url)) {
    res.set("x-cache", "HIT");
    return res.send(cache.get(url));
  }

  try {
    const response = await axios.get(url);
    const contentType = response.headers["content-type"];
    res.set("content-type", contentType);
    res.set("x-cache", "MISS");

    cache.set(url, response.data);
    res.send(response.data);
  } catch (error) {
    console.error("err:", error);
    return res.status(500).send("error forwarding request");
  }
});

app.listen(port, () => {
  console.log(
    `caching proxy listening on port:${port}, forwarding to ${origin}`,
  );
});
