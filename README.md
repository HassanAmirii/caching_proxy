# caching-proxy

A lightweight CLI-based HTTP caching proxy server. Forward requests to any origin URL and cache responses in memory — repeat requests are served instantly without hitting the origin again.

## Features

- In-memory response caching with `x-cache` hit/miss headers
- Transparent forwarding of any GET request to a configurable origin
- Cache invalidation via a `--clear-cache` flag
- Port validation and clear startup error messages

## Installation

```bash
npm install
```

## Usage

```bash
node index.js --port <port> --origin <url>
```

### Options

| Flag            | Short | Type    | Description                                      |
| --------------- | ----- | ------- | ------------------------------------------------ |
| `--port`        | `-p`  | string  | Port to listen on (default: `3000`)              |
| `--origin`      | `-o`  | string  | Origin URL to forward requests to (**required**) |
| `--clear-cache` | —     | boolean | Clears the in-memory cache and exits             |

### Examples

```bash
# Start proxy on port 3000 forwarding to an API
node index.js --port 3000 --origin https://api.example.com

# Use short flags
node index.js -p 8080 -o https://jsonplaceholder.typicode.com

# Clear the cache
node index.js --clear-cache
```

## How It Works

1. A request comes in (e.g. `GET /users/1`)
2. The proxy constructs the full URL: `<origin>/users/1`
3. If the URL is cached, it responds immediately with `x-cache: HIT`
4. If not, it fetches from the origin, caches the response, and returns it with `x-cache: MISS`

## Response Headers

| Header    | Value  | Meaning                              |
| --------- | ------ | ------------------------------------ |
| `x-cache` | `HIT`  | Response served from in-memory cache |
| `x-cache` | `MISS` | Response fetched from origin         |

## Dependencies

- [express](https://expressjs.com/) — HTTP server
- [axios](https://axios-http.com/) — HTTP client for origin requests

## Notes

- Cache is **in-memory only** — it resets when the process restarts
- Only GET requests are proxied
- Port must be a valid number between 0–65535

- [project file:](https://roadmap.sh/projects/caching-server)
