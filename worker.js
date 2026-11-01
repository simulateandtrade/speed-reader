const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en" class="h-full bg-black text-white">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RSVP Speed Reader</title>
    <!-- Tailwind CSS for UI controls -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* Custom font declarations and layout styles */
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Fira+Code:wght@400;600&family=Lora:ital,wght@0,400;0,600;1,400&family=Roboto+Mono:ital,wght@0,400;0,700;1,400&display=swap');

        /* Dynamic Font Classes */
        .font-serif-classic { font-family: 'Lora', Georgia, serif; }
        .font-mono-code { font-family: 'Fira Code', 'Roboto Mono', monospace; }
        .font-sans-clean { font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; }

        /* Reticle Vertical Marker Line */
        .reticle-line {
            width: 2px;
            background-color: #333333;
        }

        /* Focus ORP character highlight */
        .orp-target {
            color: #ff3b30; /* Vibrant focal red */
            font-weight: 500;
        }

        /* Clean custom scrollbar for text input */
        textarea::-webkit-scrollbar {
            width: 8px;
        }
        textarea::-webkit-scrollbar-track {
            background: #111111;
        }
        textarea::-webkit-scrollbar-thumb {
            background: #333333;
            border-radius: 4px;
        }
        textarea::-webkit-scrollbar-thumb:hover {
            background: #555555;
        }

        /* Custom Slider Styling */
        input[type=range] {
            accent-color: #ff3b30;
        }

        /* Document Page Canvas Aesthetics */
        .doc-page {
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05);
        }
    </style>
</head>
<body class="h-full flex flex-col justify-between bg-black text-gray-200 antialiased select-none font-sans-clean overflow-hidden">

    <!-- Top Navigation / Header -->
    <header class="w-full border-b border-zinc-800/80 px-6 py-3 flex items-center justify-between bg-zinc-950/60 backdrop-blur z-20">
        <div class="flex items-center gap-3">
            <div class="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <h1 class="text-lg font-semibold tracking-wider text-zinc-100 uppercase text-xs">RSVP Reader</h1>
        </div>
        
        <div class="flex items-center gap-3">
            <!-- Font Style Picker -->
            <select id="fontSelect" class="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-red-500 transition">
                <option value="font-serif-classic" selected>Serif (Lora / Georgia)</option>
                <option value="font-mono-code">Monospace (Fira Code)</option>
                <option value="font-sans-clean">Sans-Serif (System)</option>
            </select>

            <!-- Document Editor Switcher Button -->
            <button id="toggleInputBtn" class="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium bg-red-600 hover:bg-red-500 text-white rounded-lg transition shadow-md shadow-red-900/20">
                <i class="fa-solid fa-file-lines"></i>
                <span id="toggleInputBtnText">Open Document View</span>
            </button>
        </div>
    </header>

    <!-- Main Reader & Display Area -->
    <main id="readerStage" class="relative flex-1 flex flex-col justify-center items-center w-full">
        
        <!-- RSVP Reader Box replicating the original design -->
        <div id="rsvpContainer" class="w-full relative flex flex-col items-center justify-center py-20 border-y border-zinc-800 bg-black min-h-[320px]">
            
            <!-- Top Center Reticle Anchor Line -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 h-10 reticle-line"></div>
            
            <!-- Bottom Center Reticle Anchor Line -->
            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 h-10 reticle-line"></div>

            <!-- RSVP Text Display Box -->
            <div id="wordDisplay" class="font-serif-classic text-6xl md:text-7xl lg:text-8xl tracking-normal text-white flex items-center justify-center w-full my-auto">
                <span id="prefixSpan" class="text-right flex-1 select-text">Press</span>
                <span id="orpSpan" class="orp-target px-[1px]">S</span>
                <span id="suffixSpan" class="text-left flex-1 select-text">tart</span>
            </div>

            <!-- Visual Metric Overlay (Bottom Right 300 wpm) -->
            <div class="absolute bottom-4 right-8 md:right-16 flex items-baseline gap-2 font-serif-classic italic text-2xl md:text-3xl text-zinc-500 tracking-wide select-none">
                <input id="wpmDirectInput" type="number" min="50" max="3000" step="10" value="300" class="w-24 md:w-32 bg-transparent text-right text-zinc-300 border-b border-transparent hover:border-zinc-700 focus:border-red-500 focus:outline-none transition-colors font-serif-classic italic text-2xl md:text-3xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" title="Click to type custom WPM">
                <span>wpm</span>
            </div>
            
            <!-- Current Word Subtitle Context -->
            <div class="absolute bottom-4 left-8 md:left-16 text-xs md:text-sm text-zinc-500 font-mono tracking-wider max-w-[30%] truncate" id="contextPreview">
                Ready to read
            </div>
        </div>

        <!-- Progress Bar Line -->
        <div class="w-full bg-zinc-900 h-1.5 relative cursor-pointer group" id="progressBarContainer">
            <div id="progressBar" class="bg-red-600 h-full w-0 transition-all duration-100"></div>
        </div>

    </main>

    <!-- FULL PAGE DOCUMENT EDITOR VIEW -->
    <div id="documentEditorView" class="hidden absolute inset-0 top-[49px] bg-zinc-950 z-30 flex flex-col overflow-y-auto">
        <!-- Editor Header Toolbar -->
        <div class="sticky top-0 z-20 bg-zinc-900/90 backdrop-blur border-b border-zinc-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3">
                <button id="closeEditorBtn" class="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition shadow-lg shadow-red-900/20">
                    <i class="fa-solid fa-circle-play"></i>
                    <span>Start RSVP Reading</span>
                </button>
                <div class="h-4 w-px bg-zinc-700"></div>
                <button id="pasteClipboardBtn" class="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg transition">
                    <i class="fa-regular fa-clipboard"></i>
                    <span>Paste Clipboard</span>
                </button>
                <button id="loadSampleBtn" class="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg transition">
                    <i class="fa-solid fa-book-open"></i>
                    <span>Load Book Demo</span>
                </button>
                <button id="clearTextBtn" class="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-red-900/40 text-zinc-400 hover:text-red-300 text-xs font-medium rounded-lg transition">
                    <i class="fa-regular fa-trash-can"></i>
                    <span>Clear</span>
                </button>
            </div>

            <!-- Stats Bar -->
            <div class="flex items-center gap-4 text-xs font-mono text-zinc-400">
                <span id="docWordCount">0 words</span>
                <span>•</span>
                <span id="docCharCount">0 characters</span>
                <span>•</span>
                <span id="docReadingTime">~0 min read</span>
            </div>
        </div>

        <!-- Document Sheet Area -->
        <div class="flex-1 p-6 md:p-12 flex justify-center bg-zinc-950">
            <div class="doc-page w-full max-w-4xl bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-8 md:p-16 flex flex-col gap-4">
                <div class="flex items-center justify-between pb-4 border-b border-zinc-800 text-zinc-500 text-xs font-mono">
                    <span>DOCUMENT EDITOR</span>
                    <span>PASTE BOOKS / CHAPTERS BELOW</span>
                </div>
                <textarea id="textInput" class="w-full flex-1 bg-transparent text-zinc-100 placeholder-zinc-600 focus:outline-none font-serif-classic text-lg md:text-xl leading-relaxed resize-none min-h-[600px] border-none" placeholder="Paste your book, manuscript, or long article text here..."></textarea>
            </div>
        </div>
    </div>

    <!-- Bottom Controls Footer -->
    <footer class="w-full border-t border-zinc-800/80 px-6 py-4 bg-zinc-950/90 backdrop-blur z-20 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <!-- Controls: Playback buttons -->
        <div class="flex items-center gap-4">
            <button id="restartBtn" title="Restart (R)" class="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white flex items-center justify-center transition">
                <i class="fa-solid fa-rotate-right text-xs"></i>
            </button>
            
            <button id="stepBackBtn" title="Previous Word (Left Arrow)" class="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white flex items-center justify-center transition">
                <i class="fa-solid fa-backward-step text-xs"></i>
            </button>

            <button id="playPauseBtn" title="Play / Pause (Space)" class="w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition shadow-lg shadow-red-900/30">
                <i id="playIcon" class="fa-solid fa-play ml-0.5"></i>
                <i id="pauseIcon" class="fa-solid fa-pause hidden"></i>
            </button>

            <button id="stepForwardBtn" title="Next Word (Right Arrow)" class="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white flex items-center justify-center transition">
                <i class="fa-solid fa-forward-step text-xs"></i>
            </button>
        </div>

        <!-- WPM & Font Size Sliders -->
        <div class="flex flex-wrap items-center gap-6 w-full md:w-auto justify-center">
            
            <!-- Speed (WPM) Slider -->
            <div class="flex items-center gap-3">
                <i class="fa-solid fa-gauge-high text-xs text-zinc-500"></i>
                <div class="flex flex-col">
                    <div class="flex justify-between items-center text-[10px] text-zinc-400 mb-1">
                        <span>Speed</span>
                        <span id="sliderWpmVal" class="font-mono text-zinc-200">300 WPM</span>
                    </div>
                    <input type="range" id="wpmSlider" min="100" max="1000" step="25" value="300" class="w-32 md:w-44 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer">
                </div>
            </div>

            <!-- Font Size Adjuster -->
            <div class="flex items-center gap-3">
                <i class="fa-solid fa-text-height text-xs text-zinc-500"></i>
                <div class="flex flex-col">
                    <div class="flex justify-between items-center text-[10px] text-zinc-400 mb-1">
                        <span>Font Size</span>
                    </div>
                    <div class="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
                        <button id="decreaseFontBtn" class="w-6 h-6 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded flex items-center justify-center">-</button>
                        <button id="increaseFontBtn" class="w-6 h-6 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded flex items-center justify-center">+</button>
                    </div>
                </div>
            </div>
            
        </div>

        <!-- Shortcuts Quick Guide -->
        <div class="hidden xl:flex items-center gap-3 text-[11px] text-zinc-500">
            <span class="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded">Space</span> Play/Pause
            <span class="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded">←/→</span> Skip
            <span class="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded">↑/↓</span> Speed
        </div>
    </footer>

    <!-- Logic Script -->
    <script>
        const DEFAULT_TEXT = \`Rapid Serial Visual Presentation (RSVP) is a reading technique where words are displayed sequentially in a fixed position on the screen. By fixing the position of each word and highlighting the Optimal Recognition Point (ORP), your eyes don't need to move across the page. This eliminates eye saccades and allows you to read significantly faster with high comprehension. Press space to begin reading this text at your own pace!\`;

        let words = [];
        let currentIndex = 0;
        let isPlaying = false;
        let wpm = 300;
        let timerId = null;
        let fontSizes = ['text-4xl', 'text-5xl', 'text-6xl', 'text-7xl', 'text-8xl', 'text-9xl'];
        let currentFontSizeIndex = 3;

        const prefixSpan = document.getElementById('prefixSpan');
        const orpSpan = document.getElementById('orpSpan');
        const suffixSpan = document.getElementById('suffixSpan');
        const wordDisplay = document.getElementById('wordDisplay');
        const wpmDisplay = document.getElementById('wpmDisplay');
        const wpmDirectInput = document.getElementById('wpmDirectInput');
        const sliderWpmVal = document.getElementById('sliderWpmVal');
        const wpmSlider = document.getElementById('wpmSlider');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const playIcon = document.getElementById('playIcon');
        const pauseIcon = document.getElementById('pauseIcon');
        const stepBackBtn = document.getElementById('stepBackBtn');
        const stepForwardBtn = document.getElementById('stepForwardBtn');
        const restartBtn = document.getElementById('restartBtn');
        const progressBar = document.getElementById('progressBar');
        const progressBarContainer = document.getElementById('progressBarContainer');
        const textInput = document.getElementById('textInput');
        const documentEditorView = document.getElementById('documentEditorView');
        const toggleInputBtn = document.getElementById('toggleInputBtn');
        const toggleInputBtnText = document.getElementById('toggleInputBtnText');
        const closeEditorBtn = document.getElementById('closeEditorBtn');
        const pasteClipboardBtn = document.getElementById('pasteClipboardBtn');
        const loadSampleBtn = document.getElementById('loadSampleBtn');
        const clearTextBtn = document.getElementById('clearTextBtn');
        const docWordCount = document.getElementById('docWordCount');
        const docCharCount = document.getElementById('docCharCount');
        const docReadingTime = document.getElementById('docReadingTime');
        const fontSelect = document.getElementById('fontSelect');
        const decreaseFontBtn = document.getElementById('decreaseFontBtn');
        const increaseFontBtn = document.getElementById('increaseFontBtn');
        const contextPreview = document.getElementById('contextPreview');

        async function fetchParsedText(rawText) {
            try {
                const res = await fetch('/api/read', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: rawText })
                });
                const data = await res.json();
                return data.words || [];
            } catch (e) {
                return rawText.trim().split(/\\s+/);
            }
        }

        function updateDocStats() {
            const raw = textInput.value || '';
            const wCount = raw.trim() ? raw.trim().split(/\\s+/).length : 0;
            const cCount = raw.length;
            const estMin = Math.ceil(wCount / (wpm || 300));

            docWordCount.textContent = \`\${wCount.toLocaleString()} words\`;
            docCharCount.textContent = \`\${cCount.toLocaleString()} chars\`;
            docReadingTime.textContent = \`~\${estMin} min read\`;
        }

        function renderCurrentWord() {
            if (words.length === 0) {
                prefixSpan.textContent = '';
                orpSpan.textContent = '-';
                suffixSpan.textContent = '';
                contextPreview.textContent = '';
                updateProgressBar();
                return;
            }

            const currentObj = words[currentIndex];
            if (typeof currentObj === 'object') {
                prefixSpan.textContent = currentObj.prefix;
                orpSpan.textContent = currentObj.orp;
                suffixSpan.textContent = currentObj.suffix;
                contextPreview.textContent = currentObj.fullWord;
            } else {
                prefixSpan.textContent = currentObj || '';
                orpSpan.textContent = '';
                suffixSpan.textContent = '';
                contextPreview.textContent = currentObj || '';
            }
            updateProgressBar();
        }

        function updateProgressBar() {
            if (words.length === 0) {
                progressBar.style.width = '0%';
                return;
            }
            const percentage = ((currentIndex + 1) / words.length) * 100;
            progressBar.style.width = \`\${Math.min(100, Math.max(0, percentage))}'%\`;
        }

        function getDelayForWord(wordObj) {
            const baseDelayMs = (60 / wpm) * 1000;
            const wordStr = typeof wordObj === 'object' ? wordObj.fullWord : wordObj;
            if (!wordStr) return baseDelayMs;

            const lastChar = wordStr.slice(-1);
            if (['.', '!', '?'].includes(lastChar)) return baseDelayMs * 2.2;
            if ([',', ';', ':', '-'].includes(lastChar)) return baseDelayMs * 1.5;
            if (wordStr.length > 10) return baseDelayMs * 1.2;

            return baseDelayMs;
        }

        function scheduleNextWord() {
            if (!isPlaying) return;

            if (currentIndex >= words.length - 1) {
                pause();
                return;
            }

            const delay = getDelayForWord(words[currentIndex]);
            
            timerId = setTimeout(() => {
                currentIndex++;
                renderCurrentWord();
                scheduleNextWord();
            }, delay);
        }

        function play() {
            if (words.length === 0) return;
            if (currentIndex >= words.length - 1) {
                currentIndex = 0;
            }
            isPlaying = true;
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
            scheduleNextWord();
        }

        function pause() {
            isPlaying = false;
            if (timerId) clearTimeout(timerId);
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        }

        function togglePlayPause() {
            if (isPlaying) {
                pause();
            } else {
                play();
            }
        }

        function stepForward() {
            pause();
            if (currentIndex < words.length - 1) {
                currentIndex++;
                renderCurrentWord();
            }
        }

        function stepBackward() {
            pause();
            if (currentIndex > 0) {
                currentIndex--;
                renderCurrentWord();
            }
        }

        function restart() {
            pause();
            currentIndex = 0;
            renderCurrentWord();
        }

        function setWpm(newWpm) {
            let parsed = parseInt(newWpm, 10);
            if (isNaN(parsed) || parsed < 10) parsed = 10;
            if (parsed > 3000) parsed = 3000;
            wpm = parsed;
            
            if (wpmDisplay) wpmDisplay.textContent = wpm;
            if (wpmDirectInput && document.activeElement !== wpmDirectInput) {
                wpmDirectInput.value = wpm;
            }
            sliderWpmVal.textContent = \`\${wpm} WPM\`;
            wpmSlider.value = Math.min(1000, Math.max(100, wpm));
            updateDocStats();
        }

        function toggleDocumentEditor(show) {
            const isHidden = documentEditorView.classList.contains('hidden');
            const shouldShow = show !== undefined ? show : isHidden;

            if (shouldShow) {
                pause();
                documentEditorView.classList.remove('hidden');
                toggleInputBtnText.textContent = 'Return to Reader';
                updateDocStats();
                textInput.focus();
            } else {
                documentEditorView.classList.add('hidden');
                toggleInputBtnText.textContent = 'Open Document View';
                loadTextInputContent();
            }
        }

        async function loadTextInputContent() {
            const rawText = textInput.value;
            words = await fetchParsedText(rawText);
            currentIndex = 0;
            renderCurrentWord();
        }

        async function init() {
            textInput.value = DEFAULT_TEXT;
            await loadTextInputContent();
            setWpm(300);

            playPauseBtn.addEventListener('click', togglePlayPause);
            stepBackBtn.addEventListener('click', stepBackward);
            stepForwardBtn.addEventListener('click', stepForward);
            restartBtn.addEventListener('click', restart);

            wpmSlider.addEventListener('input', (e) => setWpm(e.target.value));
            wpmDirectInput.addEventListener('input', (e) => setWpm(e.target.value));
            wpmDirectInput.addEventListener('blur', () => { wpmDirectInput.value = wpm; });

            toggleInputBtn.addEventListener('click', () => toggleDocumentEditor());
            closeEditorBtn.addEventListener('click', () => {
                toggleDocumentEditor(false);
                play();
            });

            pasteClipboardBtn.addEventListener('click', async () => {
                try {
                    const text = await navigator.clipboard.readText();
                    if (text) {
                        textInput.value = text;
                        updateDocStats();
                    }
                } catch (err) {
                    textInput.focus();
                    document.execCommand('paste');
                    updateDocStats();
                }
            });

            loadSampleBtn.addEventListener('click', () => {
                textInput.value = DEFAULT_TEXT;
                updateDocStats();
            });

            clearTextBtn.addEventListener('click', () => {
                textInput.value = '';
                updateDocStats();
            });

            textInput.addEventListener('input', updateDocStats);

            progressBarContainer.addEventListener('click', (e) => {
                if (words.length === 0) return;
                const rect = progressBarContainer.getBoundingClientRect();
                const clickRatio = (e.clientX - rect.left) / rect.width;
                currentIndex = Math.min(words.length - 1, Math.max(0, Math.floor(clickRatio * words.length)));
                renderCurrentWord();
            });

            fontSelect.addEventListener('change', (e) => {
                wordDisplay.className = \`\${e.target.value} \${fontSizes[currentFontSizeIndex]} tracking-normal text-white flex items-center justify-center w-full my-auto\`;
            });

            decreaseFontBtn.addEventListener('click', () => {
                if (currentFontSizeIndex > 0) {
                    currentFontSizeIndex--;
                    applyFontSize();
                }
            });

            increaseFontBtn.addEventListener('click', () => {
                if (currentFontSizeIndex < fontSizes.length - 1) {
                    currentFontSizeIndex++;
                    applyFontSize();
                }
            });

            function applyFontSize() {
                const currentFontFamily = fontSelect.value;
                wordDisplay.className = \`\${currentFontFamily} \${fontSizes[currentFontSizeIndex]} tracking-normal text-white flex items-center justify-center w-full my-auto\`;
            }

            window.addEventListener('keydown', (e) => {
                if (document.activeElement === textInput || document.activeElement === wpmDirectInput) return;

                switch (e.code) {
                    case 'Space':
                        e.preventDefault();
                        togglePlayPause();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        stepBackward();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        stepForward();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        setWpm(Math.min(1000, wpm + 25));
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        setWpm(Math.max(100, wpm - 25));
                        break;
                    case 'KeyR':
                        e.preventDefault();
                        restart();
                        break;
                    case 'KeyE':
                        e.preventDefault();
                        toggleDocumentEditor();
                        break;
                }
            });
        }

        window.addEventListener('DOMContentLoaded', init);
    </script>
</body>
</html>`;

function getOrpIndex(word) {
  const cleanLength = word.length;
  if (cleanLength <= 1) return 0;
  if (cleanLength <= 5) return 1;
  if (cleanLength <= 9) return 2;
  if (cleanLength <= 13) return 3;
  return 4;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/read' && request.method === 'POST') {
      try {
        const body = await request.json();
        const rawText = body.text || '';
        const rawWords = rawText.trim().split(/\s+/);
        
        // Securely calculate ORP tokens on the server
        const processedWords = rawWords.map(word => {
          if (!word) return { prefix: '', orp: '', suffix: '', fullWord: '' };
          const idx = getOrpIndex(word);
          return {
            prefix: word.substring(0, idx),
            orp: word.charAt(idx),
            suffix: word.substring(idx + 1),
            fullWord: word
          };
        });

        return new Response(JSON.stringify({ success: true, words: processedWords }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: 'Bad Request' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(HTML_CONTENT, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' }
    });
  }
};
