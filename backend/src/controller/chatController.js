import Groq from 'groq-sdk';

const chatWithGroq = async (req, res) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const groqMessages = messages.map((m) => ({
      role: m.role === 'model' ? 'assistant' : m.role,
      content: m.content,
    }));

    const completion = await groq.chat.completions.create({
      messages: groqMessages,
      model: 'llama-3.3-70b-versatile',
    });

    const reply = completion.choices[0]?.message?.content || "Sorry, I didn't get that.";
    res.json({ reply });
  } catch (error) {
    console.error('Groq chat error:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
};

export default chatWithGroq;
