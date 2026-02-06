export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, voiceId } = req.body;
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!text || !voiceId || !apiKey) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.5 }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: 'ElevenLabs Error', details: errorData });
    }

    const arrayBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    return res.send(Buffer.from(arrayBuffer));

  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
