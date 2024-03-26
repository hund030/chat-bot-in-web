const config = {
  azureOpenaiApiKey: process.env.AZURE_OPENAI_API_KEY,
  azureOpenaiEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
  azureOpenaiModel: process.env.AZURE_OPENAI_MODEL || "20240118",
  openaiApiVersion: process.env.OPENAI_API_VERSION || "2023-06-01-preview",
};

export default config;
