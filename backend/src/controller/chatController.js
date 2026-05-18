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

    const systemMsg = { role: 'system', content: 'You are Billy, a concise Indian financial assistant. Always use ₹ for Indian Rupees. Keep responses short and practical. No greetings, no fluff.' };
    const completion = await groq.chat.completions.create({
      messages: [systemMsg, ...groqMessages],
      model: 'llama-3.3-70b-versatile',
    });

    let reply = completion.choices[0]?.message?.content || "Sorry, I didn't get that.";
    reply = reply.replaceAll('$', '₹');
    res.json({ reply });
  } catch (error) {
    console.error('Groq chat error:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
};

export default chatWithGroq;
