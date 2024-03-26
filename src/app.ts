import * as restify from "restify";
import * as fs from "fs";
import send from "send";
import chatCompletion from "./openai/chat";

//Create HTTP server.
const server = restify.createServer({
  key: process.env.SSL_KEY_FILE
    ? fs.readFileSync(process.env.SSL_KEY_FILE)
    : undefined,
  certificate: process.env.SSL_CRT_FILE
    ? fs.readFileSync(process.env.SSL_CRT_FILE)
    : undefined,
  formatters: {
    "text/html": (req, res, body) => {
      return body;
    },
  },
});

server.use(restify.plugins.bodyParser({
    requestBodyOnGet: true
}));

server.get(
  "/static/*",
  restify.plugins.serveStatic({
    directory: __dirname,
  })
);

server.get(
  "/assets/*",
  restify.plugins.serveStatic({
    directory: `${__dirname}/dist`,
  })
);

server.listen(process.env.port || process.env.PORT || 3333, function () {
  console.log(`\n${server.name} listening to ${server.url}`);
});

// Adding tabs to our app. This will setup routes to various views
// Setup home page
server.get("/", (req, res, next) => {
  send(req, __dirname + "/dist/index.html").pipe(res);
});

// Setup the static tab
server.get("/tab", (req, res, next) => {
  send(req, __dirname + "/dist/index.html").pipe(res);
});

server.post("/chat", async (req, res) => {
  const data = req.body;
  console.log(data);
  const stream = await chatCompletion(data?.prompt);

  for await (const part of stream) {
    res.write(part.choices[0]?.delta.content ?? "");
  }
  res.end();
});
