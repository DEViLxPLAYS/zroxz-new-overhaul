/* ========================================================================
   ZROXZ CHAT WIDGET — JAVASCRIPT
   Self-contained. No dependencies. Connects to Render backend.
   ======================================================================== */

(function () {
  'use strict';

  // ── Configuration ────────────────────────────────────────────────────────
  // Automatically select local or production API URL based on hostname
  const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001'
    : 'https://zroxz-backend.onrender.com';

  const FIRST_MESSAGE = "Hey! I'm the Zroxz assistant. I can tell you about our AI chatbots, voice agents, CRM automation, or web & video work — or point you to the right person. What are you working on?";

  // Unique session ID for this page load (for chat log grouping in Supabase)
  const SESSION_ID = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

  // Conversation history sent to the API
  let conversationMessages = [];
  let isOpen = false;
  let isWaiting = false;
  let coldStartTimer = null;

  // ── Build DOM ─────────────────────────────────────────────────────────────
  function buildWidget() {
    // Floating button
    const fab = document.createElement('button');
    fab.id = 'chat-fab';
    fab.className = 'chat-fab';
    fab.setAttribute('aria-label', 'Open chat');
    fab.setAttribute('aria-expanded', 'false');
    fab.innerHTML = `
      <!-- Open icon: message circle -->
      <svg class="icon-open" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <!-- Close icon: X -->
      <svg class="icon-close" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>`;

    // Chat panel
    const panel = document.createElement('div');
    panel.id = 'chat-panel';
    panel.className = 'chat-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Chat with Zroxz');
    panel.innerHTML = `
      <div class="chat-header">
        <span class="chat-header-logo">ZROXZ</span>
        <div class="chat-header-status">
          <div class="chat-status-dot"></div>
          AI Assistant
        </div>
        <button class="chat-close-btn" id="chat-close-btn" aria-label="Close chat">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="16" height="16" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="chat-messages" id="chat-messages"></div>
      <div class="chat-input-area">
        <input
          type="text"
          class="chat-input"
          id="chat-input"
          placeholder="Ask about our services..."
          autocomplete="off"
          maxlength="500"
        />
        <button class="chat-send-btn" id="chat-send-btn" aria-label="Send message">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="16" height="16" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>`;

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    // Wire events
    fab.addEventListener('click', toggleChat);
    document.getElementById('chat-close-btn').addEventListener('click', closeChat);

    const inputEl = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });

    sendBtn.addEventListener('click', handleSend);
  }

  // ── Open / Close ──────────────────────────────────────────────────────────
  function toggleChat() {
    isOpen ? closeChat() : openChat();
  }

  function openChat() {
    isOpen = true;
    const fab = document.getElementById('chat-fab');
    const panel = document.getElementById('chat-panel');

    fab.setAttribute('aria-expanded', 'true');
    panel.classList.add('chat-open');

    // Show first message if this is the first open
    if (conversationMessages.length === 0) {
      appendBubble('ai', FIRST_MESSAGE);
    }

    // Focus input
    setTimeout(() => document.getElementById('chat-input').focus(), 420);
  }

  function closeChat() {
    isOpen = false;
    const fab = document.getElementById('chat-fab');
    const panel = document.getElementById('chat-panel');

    fab.setAttribute('aria-expanded', 'false');
    panel.classList.remove('chat-open');
  }

  // ── Rendering ─────────────────────────────────────────────────────────────
  function appendBubble(role, text) {
    const messagesEl = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `chat-bubble chat-bubble-${role === 'ai' ? 'ai' : 'user'}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function showTyping() {
    const messagesEl = document.getElementById('chat-messages');
    const typing = document.createElement('div');
    typing.className = 'chat-typing';
    typing.id = 'chat-typing-indicator';
    typing.innerHTML = `
      <div class="chat-typing-dot"></div>
      <div class="chat-typing-dot"></div>
      <div class="chat-typing-dot"></div>`;
    messagesEl.appendChild(typing);
    scrollToBottom();

    // Show cold-start notice after 5 seconds
    coldStartTimer = setTimeout(() => {
      const notice = document.createElement('div');
      notice.className = 'chat-cold-msg';
      notice.id = 'chat-cold-notice';
      notice.textContent = 'Just a moment — waking up our systems...';
      messagesEl.appendChild(notice);
      scrollToBottom();
    }, 5000);
  }

  function hideTyping() {
    clearTimeout(coldStartTimer);
    const indicator = document.getElementById('chat-typing-indicator');
    const notice = document.getElementById('chat-cold-notice');
    if (indicator) indicator.remove();
    if (notice) notice.remove();
  }

  function scrollToBottom() {
    const el = document.getElementById('chat-messages');
    if (el) el.scrollTop = el.scrollHeight;
  }

  function setInputDisabled(disabled) {
    const input = document.getElementById('chat-input');
    const btn = document.getElementById('chat-send-btn');
    if (input) input.disabled = disabled;
    if (btn) btn.disabled = disabled;
  }

  // ── Send Message ──────────────────────────────────────────────────────────
  async function handleSend() {
    if (isWaiting) return;

    const inputEl = document.getElementById('chat-input');
    const text = (inputEl.value || '').trim();
    if (!text) return;

    // Append user bubble
    inputEl.value = '';
    appendBubble('user', text);

    // Add to conversation history
    conversationMessages.push({ role: 'user', content: text });

    // Show typing indicator
    isWaiting = true;
    setInputDisabled(true);
    showTyping();

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationMessages,
          sessionId: SESSION_ID,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Chat request failed');
      }

      const { reply } = await res.json();
      conversationMessages.push({ role: 'assistant', content: reply });
      hideTyping();
      appendBubble('ai', reply);
    } catch (err) {
      hideTyping();
      const msg = err.message.includes('Too many')
        ? err.message
        : 'Something went wrong. Try again or use the contact form above.';
      appendBubble('ai', msg);
    } finally {
      isWaiting = false;
      setInputDisabled(false);
      setTimeout(() => {
        const inputEl = document.getElementById('chat-input');
        if (inputEl && isOpen) inputEl.focus();
      }, 100);
    }
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }
})();
