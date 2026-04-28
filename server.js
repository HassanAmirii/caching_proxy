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
const { values, positionals } = parseArgs(config);

let cache = new Map();
const port = values.port ? parseInt(values.port, 10) : 3000;
const origin = values.origin;
const clearCache = values["clear-cache"] || false;
const msg = "please provide args in the format below";
const example = "--port 3000 --origin <your-url>";

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

async function fetchData(url) {
  if (cache.has(url)) {
    const cachedData = cache.get(url);
    return {
      ...cachedData,
      headers: {
        ...cachedData.headers,
        "x-cache": "HIT",
      },
    };
  }

  try {
    const response = axios.fetch(origin);
    const responseData = {
      data: response.data,
      headers: response.headers,
    };
    const cacheData = cache.set(origin, responseData);
    return {
      ...responseData,
      headers: { ...responseData.headers, "x-cache": "miss" },
    };
  } catch (error) {
    console.error("fetch error", error.message);
    throw error;
  }
}
fetchData();
