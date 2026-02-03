console.log('Script loaded successfully.');

const button = document.querySelectorAll('.IDE-button');

button.transition = 'background-color 0.3s ease';

button.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.style.backgroundColor = '#24292e';
        for (let otherBtn of button) {
            if (otherBtn !== btn) {
                otherBtn.style.backgroundColor = '';
            }
        }
        code();
    });
});

// Typing + GitHub theme for the code area
(function code () {
    const codeSection = document.getElementById('IDE-code-section');
    if (!codeSection) return;

    // Inject minimal GitHub-like theme CSS
    const style = document.createElement('style');
    style.textContent = `
        .github-theme {
            background: #0d1117;
            color: #c9d1d9;
            font-family: SFMono-Regular, Menlo, Monaco, "Courier New", monospace;
            font-size: 13px;
            padding: 16px;
            border-radius: 6px;
            overflow: auto;
            line-height: 1.45;
            white-space: pre;
        }
        .github-theme .caret {
            display: inline-block;
            color: #c9d1d9;
            animation: blink 1s steps(2) infinite;
            width: 10px;
        }
        @keyframes blink { 50% { opacity: 0 } }
    `;
    document.head.appendChild(style);

    // Setup code container (pre > code) with caret
    codeSection.classList.add('github-theme');
    codeSection.innerHTML = '<pre><code class="github-code"></code><span class="caret">|</span></pre>';
    const codeElement = codeSection.querySelector('.github-code');
    const caretEl = codeSection.querySelector('.caret');

    // Typing control
    let typingSession = 0;
    function charDelayFromWpm(wpm) {
        // assume 5 chars per word
        const cpm = wpm * 5;
        return 600 / cpm;
    }

    async function typeText(text, wpm = 40) {
        typingSession++;
        const session = typingSession;
        codeElement.textContent = '';
        const delay = Math.max(5, Math.round(charDelayFromWpm(wpm))); // ms per char

        for (let i = 1; i <= text.length; i++) {
            if (session !== typingSession) return; // cancel if a new session started
            codeElement.textContent = text.slice(0, i);
            // keep caret visible at the end and auto-scroll
            codeElement.parentElement.scrollTop = codeElement.parentElement.scrollHeight;
            await new Promise(res => setTimeout(res, delay));
        }
    }

    // Build a simple CSS snippet based on button name (falls back to button text)
    function buildCodeSnippetFromButton(btn) {
        const label = (btn.dataset.name || btn.textContent || 'example').trim();
        const slug = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-\_]/g, '');
        return `#IDE-${slug} {\n  /* ${label} style (GitHub theme) */\n  background-color: #242424;\n  color: #c9d1d9;\n}\n\n#IDE-code-section {\n  height: 100%;\n  width: 100%;\n  background-color: #242424;\n}\n`;
    }

    // Attach click listeners to buttons to start typing snippet at 40 WPM
    const buttons = document.querySelectorAll('.IDE-button');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const snippet = btn.dataset.code || buildCodeSnippetFromButton(btn);
            typeText(snippet, 40);
        });
    });

    // Optionally set an initial sample (uncomment to auto-type on load)
    // typeText(buildCodeSnippetFromButton({ textContent: 'header', dataset: {} }), 40);
})();
