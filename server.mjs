import http from "node:http"
import { readFile } from "node:fs/promises"
import { extname, join, normalize } from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL(".", import.meta.url))
const port = Number(process.env.PORT || 3000)
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json" }

http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname)
    const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "")
    const file = join(root, normalize(relative))
    if (!file.startsWith(root)) throw new Error("Forbidden")
    const body = await readFile(file)
    res.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream", "Cache-Control": "no-cache" })
    res.end(body)
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" })
    res.end("Not found")
  }
}).listen(port, "0.0.0.0", () => console.log(`Preview server listening on ${port}`))
