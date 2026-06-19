# Frontend — Zroxz Static Site

Static HTML/CSS/JS. No build step. Deploy by uploading to Hostinger public_html.

## Structure
```
frontend/
├── src/
│   ├── index.html              ← Homepage
│   ├── contact.html            ← Contact + Calendly
│   ├── blog/                   ← Blog index + articles
│   ├── services/               ← 6 service pages
│   ├── locations/              ← 10 location hub pages
│   ├── css/
│   │   ├── design-system.css   ← All design tokens + components
│   │   └── chat-widget.css     ← Chat bubble + panel
│   ├── js/
│   │   ├── main.js             ← Nav, scroll, FAQ accordion
│   │   ├── chat.js             ← AI chat widget → Render API
│   │   └── contact.js          ← Contact form → Render API
│   └── public/
│       ├── favicon.svg
│       ├── robots.txt
│       └── llms.txt
```

## Deployment
1. Copy everything inside `frontend/src/` to Hostinger `public_html/`
2. Verify `robots.txt` is accessible at `https://zroxz.com/robots.txt`
3. Verify `llms.txt` is accessible at `https://zroxz.com/llms.txt`
