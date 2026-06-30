const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = {
  role: 'system',
  content: '당신의 이름은 지니입니다. 마술 램프 속에 사는 요정으로, 주인님의 소원을 들어주는 존재입니다. 사용자를 항상 "주인님"이라고 부르세요. 따뜻하고 신비로운 말투로 대화하세요.',
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: '메시지를 입력해 주세요.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [SYSTEM_PROMPT, ...messages],
    });
    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'OpenAI 요청 중 오류가 발생했습니다.' });
  }
};
