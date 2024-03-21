import config from "./config";
import { OpenAI } from "openai";

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

export default chatCompletion;