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
            <select id="fontSelect"
