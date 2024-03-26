import {
  app,
  HttpRequest,
  HttpResponse,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { OpenAI } from "openai";
import config from "../config";
import { ReadableStream } from "stream/web";

const client = new OpenAI({
  apiKey: config.azureOpenaiApiKey,
  baseURL: `${config.azureOpenaiEndpoint}/openai/deployments/${config.azureOpenaiModel}`,
  defaultQuery: { "api-version": config.openaiApiVersion },
  defaultHeaders: { "api-key": config.azureOpenaiApiKey },
});

async function chatCompletion(text: string) {
  return client.chat.completions.create({
    model: config.azureOpenaiModel,
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant. You will talk like a pirate.",
      },
      { role: "user", content: text },
    ],
    stream: true,
  });
}

function toReadableStream(asyncIterable) {
  return new ReadableStream({
    async start(controller) {
      for await (const chunk of asyncIterable) {
        controller.enqueue(chunk.choices[0]?.delta.content || "");
      }
      controller.close();
    },
  });
}

/*
 * @param {InvocationContext} context - The Azure Functions context object.
 * @param {HttpRequest} req - The HTTP request.
 */
export async function chat(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit | HttpResponse> {
  const text = await req.text();
  context.log("Received message:", text);
  if (!text) {
    return {
      status: 400,
      body: JSON.stringify({
        error: "No message was found in request body.",
      }),
    };
  }

  const stream = toReadableStream(await chatCompletion(text))
  return { status: 200, body: stream };
}

app.setup({ enableHttpStream: true });
app.http("chat", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: chat,
});
