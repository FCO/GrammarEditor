import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { WebSocketServer } from 'ws';

const PORT = parseInt(process.env.PORT || '3002', 10);
const ROOT = path.resolve(process.cwd());

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
};

const DEFAULT_GRAMMAR = `unit grammar MyGrammar;

token TOP       { <letter>+ }
token letter    { <vowel> || <consonant> }
token vowel     { <[aeiou]> }
token consonant { <[bcdfghjklmnpqrstvwxyz]> }`;

const DEFAULT_STRING = `hello`;

const TRACE_RESPONSE = {
  trace: {
    rule: "TOP", match: true, pos_start: 0, pos_end: 5,
    children: [
      { rule: "letter", match: true, pos_start: 0, pos_end: 1,
        children: [
          { rule: "consonant", match: true, pos_start: 0, pos_end: 1 }
        ]
      },
      { rule: "letter", match: true, pos_start: 1, pos_end: 2,
        children: [
          { rule: "vowel", match: true, pos_start: 1, pos_end: 2 }
        ]
      },
      { rule: "letter", match: true, pos_start: 2, pos_end: 3,
        children: [
          { rule: "consonant", match: true, pos_start: 2, pos_end: 3 }
        ]
      },
      { rule: "letter", match: true, pos_start: 3, pos_end: 4,
        children: [
          { rule: "consonant", match: true, pos_start: 3, pos_end: 4 },
          { rule: "consonant", match: true, pos_start: 3, pos_end: 4 }
        ]
      },
      { rule: "letter", match: true, pos_start: 4, pos_end: 5,
        children: [
          { rule: "vowel", match: true, pos_start: 4, pos_end: 5 }
        ]
      },
    ]
  },
  match: {
    rule: "TOP", data: "hello", pos_start: 0, pos_end: 5,
    children: [
      { rule: "letter", data: "h", pos_start: 0, pos_end: 1, children: [{ rule: "consonant", data: "h", pos_start: 0, pos_end: 1 }] },
      { rule: "letter", data: "e", pos_start: 1, pos_end: 2, children: [{ rule: "vowel", data: "e", pos_start: 1, pos_end: 2 }] },
      { rule: "letter", data: "l", pos_start: 2, pos_end: 3, children: [{ rule: "consonant", data: "l", pos_start: 2, pos_end: 3 }] },
      { rule: "letter", data: "l", pos_start: 3, pos_end: 4, children: [{ rule: "consonant", data: "l", pos_start: 3, pos_end: 4 }] },
      { rule: "letter", data: "o", pos_start: 4, pos_end: 5, children: [{ rule: "vowel", data: "o", pos_start: 4, pos_end: 5 }] },
    ]
  },
  made: '["hello", "hello"]'
};

const PARTIAL_MATCH_RESPONSE = {
  trace: {
    rule: "TOP", match: false, pos_start: 0, pos_end: 6,
    children: [
      { rule: "digit", match: true, pos_start: 0, pos_end: 1, children: [] },
      { rule: "digit", match: true, pos_start: 1, pos_end: 2, children: [] },
      { rule: "digit", match: true, pos_start: 2, pos_end: 3, children: [] },
    ]
  },
  match: null
};

function grammarResponse(grammar, string, actions) {
  if (grammar.includes('syntax error') || grammar.trim() === '') {
    return {
      error: 'Unable to parse grammar',
      error_source: 'grammar',
      error_line: 1,
      error_col: 1
    };
  }
  if (grammar.includes('action error') || (actions && actions.includes('error'))) {
    return {
      error: 'Unable to compile actions class',
      error_source: 'actions',
      error_line: 1,
      error_col: 1
    };
  }
  if (string === '123abc') {
    return PARTIAL_MATCH_RESPONSE;
  }
  if (grammar.includes('<unknown>')) {
    return {
      trace: {
        rule: "TOP", match: false, pos_start: 0, pos_end: 5,
        children: [
          { rule: "unknown", match: false, pos_start: 0, pos_end: 0, children: [] }
        ]
      },
      match: null
    };
  }
  if (actions && actions.includes('class')) {
    const madeMatch = actions.match(/make\((.+?)\)/);
    return { ...TRACE_RESPONSE, made: madeMatch ? madeMatch[1] : 'custom-made-value' };
  }
  return TRACE_RESPONSE;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let filePath = url.pathname === '/' ? '/index.html' : url.pathname;
  const fullPath = path.join(ROOT, filePath);

  if (url.pathname === '/admin/close-ws') {
    wss.clients.forEach(client => client.close());
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
    return;
  }

  if (req.method === 'POST' && url.pathname === '/_store') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const id = 'a'.repeat(40);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ id }));
    });
    return;
  }

  if (url.pathname.startsWith('/_store/')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      grammar_code: DEFAULT_GRAMMAR,
      string_input: DEFAULT_STRING,
      actions_code: 'class TestActions { ... }'
    }));
    return;
  }

  const shaMatch = url.pathname.match(/^\/([0-9a-f]{40})$/);
  if (shaMatch) {
    filePath = '/index.html';
  }

  try {
    const content = fs.readFileSync(path.join(ROOT, filePath));
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
  ws.on('message', data => {
    try {
      const msg = JSON.parse(data.toString());
      const resp = grammarResponse(msg.grammar || '', msg.string || '', msg.actions || '');
      ws.send(JSON.stringify(resp));
    } catch {
      ws.send(JSON.stringify({ error: 'Invalid request' }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}`);
});

export { server, PORT };
