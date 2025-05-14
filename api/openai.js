import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: req.body.prompt,
      max_tokens: 100,
    });
    res.status(200).json({ reply: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ reply: "Error connecting to OpenAI API" });
  }
}
