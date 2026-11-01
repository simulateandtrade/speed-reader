const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en" class="h-full bg-black text-white">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RSVP Speed Reader</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .orp-target { color: #ff3b30; font-weight: 500; }
        input[type=range] { accent-color: #ff3b30; }
    </style>
</head>
<body class="h-full flex flex-col justify-between bg-black text-gray-200 antialiased select-none font-sans overflow-hidden">
    <header class="w-full border-b border-zinc-800 px-6 py-3 flex items-center justify-between bg-zinc-950">
        <h1 class="text-xs uppercase font-semibold tracking-wider text-zinc-100">RSVP Reader (Secure Engine)</h1>
        <span id="wpmDisplay" class="text-xs font-mono text-zinc-400">300 WPM</span>
    </header>

    <main class="flex-1 flex flex-col justify-center items-center w-full px-4">
        <div class="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl p-8 flex flex-col gap-6 shadow-2xl">
            <div id="wordDisplay" class="text-5xl font-serif text-center py-6 tracking-wide text-white min-h-[120px] flex items-center justify-center">
                <span id="prefixSpan" class="text-right flex-1">Ready</span>
                <span id="orpSpan" class="orp-target px-[1px]">!</span>
                <span id="suffixSpan" class="text-left flex-1"></span>
            </div>
            
            <textarea id="userInput" rows="4" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-zinc-200 focus:outline-none focus:border-red-500 text-sm" placeholder="Paste your text here to read securely..."></textarea>
            
            <div class="flex justify-between items-center">
                <span id="statusMsg" class="text-xs text-zinc-500 font-mono">Engine secured on Cloudflare</span>
                <button id="startBtn" class="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition shadow-lg shadow-red-900/30">
                    Process Text
                </button>
            </div>
        </div>
    </main>

    <script>
        document.getElementById('startBtn').addEventListener('click', async () => {
            const text = document.getElementById('userInput').value;
            if (!text.trim()) return;
            
            document.getElementById('statusMsg').textContent = 'Processing securely...';
            
            const response = await fetch('/api/read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            
            const data = await response.json();
            if (data.success && data.words.length > 0) {
                document.getElementById('statusMsg').textContent = \`Loaded \${data.words.length} words successfully!\`;
                const first = data.words[0];
                document.getElementById('prefixSpan').textContent = first.slice(0, 1);
                document.getElementById('orpSpan').textContent = first.slice(1, 2);
                document.getElementById('suffixSpan').textContent = first.slice(2);
            } else {
                document.getElementById('statusMsg').textContent = 'Error processing text.';
            }
        });
    </script>
</body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/read' && request.method === 'POST') {
      try {
        const body = await request.json();
        const rawText = body.text || '';
        const words = rawText.trim().split(/\s+/);
        
        return new Response(JSON.stringify({ success: true, words }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: 'Bad Request' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Serve the secure frontend HTML directly from the worker memory
    return new Response(HTML_CONTENT, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' }
    });
  }
};
