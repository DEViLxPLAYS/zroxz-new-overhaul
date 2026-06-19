import { getChatResponse } from '../services/openai.service.js';
import { supabase } from '../config/supabase.js';
import { MAX_CHAT_MESSAGES } from '../config/constants.js';

export async function handleChat(req, res, next) {
  try {
    const { messages, sessionId } = req.body;

    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    // Hard cap — prevents runaway context costs from a single session
    if (messages.length > MAX_CHAT_MESSAGES) {
      return res.status(400).json({
        error: 'This conversation has reached its limit. Book a call to continue — our team would love to chat.',
      });
    }

    // Validate message shape
    const validRoles = new Set(['user', 'assistant']);
    const hasInvalidMessage = messages.some(
      (m) => !m.role || !validRoles.has(m.role) || typeof m.content !== 'string'
    );
    if (hasInvalidMessage) {
      return res.status(400).json({ error: 'Invalid message format' });
    }

    const reply = await getChatResponse(messages);

    // Fire-and-forget: log to Supabase without blocking the response
    const sid = sessionId || 'anonymous';
    supabase
      .from('chat_logs')
      .insert({
        session_id: sid,
        messages: [...messages, { role: 'assistant', content: reply }],
      })
      .then(({ error }) => {
        if (error) console.error('[chat log]', error.message);
      });

    res.json({ reply });
  } catch (err) {
    next(err);
  }
}
