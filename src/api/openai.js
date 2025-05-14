import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { role, interests, strengths, weaknesses, values, goals } = req.body;

  if (!role || !interests || !strengths || !weaknesses || !values || !goals) {
    return res.status(400).json({ error: 'Missing user data' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: "You are Sierra, a warm and friendly career guide helping young professionals." },
        { role: 'user', content: `I am a ${userData.role} interested in ${userData.interests}. My strengths are ${userData.strengths.join(",")} and my weaknesses are ${userData.weaknesses.join(",")}. I value ${userData.values.join(",")} and my goal is ${userData.goals}. Can you help me with a 5-step pathway, with 5 achievable bullet point sub-tasks, to achieve my goal?` }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    const pathway = completion.data.choices[0].message.content;

    res.status(200).json({ pathway });
  } catch (error) {
    console.error('Error generating pathway:', error);
    res.status(500).json({ error: 'Failed to generate pathway' });
  }
}
