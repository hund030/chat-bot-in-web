import React, { useState, useEffect } from "react";

async function chat(
  setAnswer: (answer: (_: string) => string) => void,
  prompt: string
) {
  const response = await fetch("http://localhost:7071/api/chat", {
    method: "post",
    headers: {
      Accept: "application/json, text/plain, */*", // indicates which files we are able to understand
      "Content-Type": "application/json", // indicates what the server actually sent
    },
    body: JSON.stringify({ userPrompt: prompt }), // server is expecting JSON
  });
  if (!response.ok || !response.body) {
    throw response.statusText;
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    const decodedChunk = decoder.decode(value, { stream: true });
    setAnswer((answer) => answer + decodedChunk);
  }
}

function isEmptyPrompt(prompt?: string): boolean {
  return prompt == null || prompt.trim() === "";
}

function App() {
  const [prompt, updatePrompt] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>("");

  useEffect(() => {
    if (isEmptyPrompt(prompt)) {
      setAnswer("");
    }
  }, [prompt]);

  const sendPrompt = async (event: React.KeyboardEvent) => {
    if (event.key !== "Enter" || isEmptyPrompt(prompt)) {
      return;
    }

    setLoading(true);
    setAnswer("");
    try {
      chat(setAnswer, prompt!);
    } catch (err) {
      console.error(err, "err");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <div>
          <input
            type="text"
            placeholder="Ask me anything..."
            disabled={loading}
            onChange={(e) => updatePrompt(e.target.value)}
            onKeyDown={(e) => sendPrompt(e)}
          />
          <div>{answer && <p>{answer}</p>}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
