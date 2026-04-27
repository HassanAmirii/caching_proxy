import { parseArgs } from "node:util";

const config = {
  Option: {
    port: { type: "string", short: "p" },
    origin: { type: "string", short: "o" },
  },
  allowPositionals: true,
};
const { values, positionals } = parseArgs(config);

const port = values.port ? parseInt(values.port, 10) : 3000;
const origin = values.origin;

const msg = "please provide args in the format below";
const example = "--port 3000 --origin <your-url>";

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
