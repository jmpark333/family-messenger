import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import type { Plugin } from 'vite';

// 인메모리 저장소
const families = new Map<string, any>();
const messages = new Map<string, any[]>(); // familyId -> messages

// 개발용 API 플러그인
function devApiPlugin(): Plugin {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use('/api', (req, res, next) => {
        // CORS 헤더
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.writeHead(200);
          res.end();
          return;
        }

        const url = new URL(req.url || '', `http://localhost:3000`);

        // Family Create
        if (url.pathname === '/family/create' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const familyId = crypto.randomUUID();
              const memberId = crypto.randomUUID();
              const inviteUrl = `http://localhost:3000/invite?family=${familyId}`;

              // 가족 저장
              families.set(familyId, {
                id: familyId,
                authCode: data.authCode,
                members: [{ id: memberId, name: data.name, publicKey: data.publicKey }],
                createdAt: Date.now(),
              });
              // 메시지 배열 초기화
              messages.set(familyId, []);

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ familyId, memberId, inviteUrl }));
            } catch (e) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid request' }));
            }
          });
          return;
        }

        // Family Join
        if (url.pathname === '/family/join' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const family = families.get(data.familyId);

              if (!family) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Family not found' }));
                return;
              }

              if (family.authCode !== data.authCode) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid auth code' }));
                return;
              }

              const memberId = crypto.randomUUID();
              family.members.push({ id: memberId, name: data.name, publicKey: data.publicKey });
              families.set(data.familyId, family);

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                familyId: data.familyId,
                memberId,
                members: family.members,
              }));
            } catch (e) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid request' }));
            }
          });
          return;
        }

        // Messages Send
        if (url.pathname === '/messages/send' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const messageId = crypto.randomUUID();

              const message = {
                id: messageId,
                familyId: data.familyId,
                senderId: data.senderId,
                senderName: data.senderName,
                content: data.content,
                timestamp: Date.now(),
                encrypted: data.encrypted || false,
              };

              // 메시지 저장
              const familyMessages = messages.get(data.familyId) || [];
              familyMessages.push(message);
              messages.set(data.familyId, familyMessages);

              console.log(`[API] Message saved for family ${data.familyId}:`, message);

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, messageId }));
            } catch (e) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid request' }));
            }
          });
          return;
        }

        // Messages Poll
        if (url.pathname === '/messages/poll' && req.method === 'GET') {
          const familyId = url.searchParams.get('familyId');
          const since = url.searchParams.get('since');

          if (!familyId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing familyId' }));
            return;
          }

          const familyMessages = messages.get(familyId) || [];
          let result = familyMessages;

          if (since) {
            const sinceTime = parseInt(since, 10);
            result = familyMessages.filter(m => m.timestamp > sinceTime);
          }

          console.log(`[API] Polling for family ${familyId}, since ${since}:`, result.length, 'messages');

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ messages: result }));
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
});
