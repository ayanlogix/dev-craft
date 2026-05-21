/* ==========================================================================
   DevCraft Suite - Regular Expression Tester Module (regex-tool.js)
   ========================================================================== */

export function initRegexTool() {
    const expressionInput = document.getElementById('regex-expression');
    const flagsG = document.getElementById('regex-flag-g');
    const flagsI = document.getElementById('regex-flag-i');
    const flagsM = document.getElementById('regex-flag-m');
    const flagsS = document.getElementById('regex-flag-s');
    
    const testTextarea = document.getElementById('regex-test-text');
    const highlightOverlay = document.getElementById('regex-highlight-overlay');
    const matchCounter = document.getElementById('regex-match-counter');
    const groupsList = document.getElementById('regex-groups-list');
    
    const presetSelect = document.getElementById('regex-preset-select');

    // Preset regex maps
    const presets = {
        email: {
            expr: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
            flags: { g: true, i: true, m: false, s: false }
        },
        url: {
            expr: 'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)',
            flags: { g: true, i: true, m: false, s: false }
        },
        phone: {
            expr: '\\+?[0-9]{1,4}?[-.\\s]?\\(?[0-9]{1,3}?\\)?[-.\\s]?[0-9]{1,4}[-.\\s]?[0-9]{1,4}[-.\\s]?[0-9]{1,9}',
            flags: { g: true, i: false, m: false, s: false }
        },
        date: {
            expr: '\\d{4}-\\d{2}-\\d{2}',
            flags: { g: true, i: false, m: false, s: false }
        },
        number: {
            expr: '-?\\d+(?:\\.\\d+)?',
            flags: { g: true, i: false, m: false, s: false }
        }
    };

    // Attach Event Listeners
    [expressionInput, testTextarea, flagsG, flagsI, flagsM, flagsS].forEach(el => {
        el.addEventListener('input', runRegexTest);
    });

    presetSelect.addEventListener('change', () => {
        const val = presetSelect.value;
        if (presets[val]) {
            expressionInput.value = presets[val].expr;
            flagsG.checked = presets[val].flags.g;
            flagsI.checked = presets[val].flags.i;
            flagsM.checked = presets[val].flags.m;
            flagsS.checked = presets[val].flags.s;
            runRegexTest();
            window.showToast(`Loaded ${val.toUpperCase()} preset regex!`, '📂');
        }
    });

    // Run first evaluation
    runRegexTest();

    /**
     * Re-evaluates regular expression against the test text
     */
    function runRegexTest() {
        const expr = expressionInput.value;
        const testText = testTextarea.value;
        
        // Reset display if empty input
        if (!expr) {
            highlightOverlay.innerHTML = escapeHtml(testText);
            matchCounter.textContent = '0 Matches';
            groupsList.innerHTML = '<div class="empty-state">Enter an expression to begin.</div>';
            expressionInput.style.borderColor = '';
            return;
        }

        // Build flags string
        let flags = '';
        if (flagsG.checked) flags += 'g';
        if (flagsI.checked) flags += 'i';
        if (flagsM.checked) flags += 'm';
        if (flagsS.checked) flags += 's';

        try {
            const regex = new RegExp(expr, flags);
            expressionInput.style.borderColor = ''; // Clear error border

            // Calculate Matches
            const matches = [];
            let match;
            
            if (flags.includes('g')) {
                // Global match execution
                let safetyCounter = 0;
                while ((match = regex.exec(testText)) !== null) {
                    matches.push(match);
                    
                    // Safety check against infinite loops matching zero-width (e.g. ^ or \b or empty groups)
                    if (match[0].length === 0) {
                        regex.lastIndex++;
                    }

                    // Strict protection against browser lockups
                    if (++safetyCounter > 5000) {
                        console.warn('⚠️ Safety cap of 5000 matches hit. Halting search.');
                        break;
                    }
                }
            } else {
                // Single match execution
                match = regex.exec(testText);
                if (match) matches.push(match);
            }

            // 1. Render Highlights Overlay
            renderHighlights(testText, matches);

            // 2. Render Match Count Badge
            matchCounter.textContent = `${matches.length} Match${matches.length === 1 ? '' : 'es'}`;
            matchCounter.style.background = matches.length > 0 ? 'var(--primary-glow)' : '';
            matchCounter.style.color = matches.length > 0 ? 'var(--primary)' : '';

            // 3. Render Capture Groups Panel
            renderGroupsList(matches);

        } catch (error) {
            // Error handling for malformed/incomplete regular expressions
            expressionInput.style.borderColor = 'var(--error)';
            highlightOverlay.innerHTML = escapeHtml(testText);
            matchCounter.textContent = 'Regex Error';
            matchCounter.style.background = 'var(--error-glow)';
            matchCounter.style.color = 'var(--error)';
            groupsList.innerHTML = `<div class="empty-state" style="color: var(--error)">⚠️ Invalid Regular Expression: ${error.message}</div>`;
        }
    }

    /**
     * Safely escapes HTML structures
     */
    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    /**
     * Builds and inserts highlighted HTML sections
     */
    function renderHighlights(text, matches) {
        if (matches.length === 0) {
            highlightOverlay.innerHTML = escapeHtml(text);
            return;
        }

        let html = '';
        let lastIndex = 0;

        matches.forEach((match, index) => {
            const matchIndex = match.index;
            const matchText = match[0];

            // Append leading safe text
            html += escapeHtml(text.substring(lastIndex, matchIndex));

            // Wrap match in colored highlighted span
            const spanClass = index % 2 === 0 ? 'regex-match-span' : 'regex-match-span-alt';
            html += `<span class="${spanClass}">${escapeHtml(matchText)}</span>`;

            lastIndex = matchIndex + matchText.length;
        });

        // Append trailing safe text
        html += escapeHtml(text.substring(lastIndex));
        
        // Render to overlay block preserving formatting
        highlightOverlay.innerHTML = html;
    }

    /**
     * Generates a detail card for each match and its corresponding capture groups
     */
    function renderGroupsList(matches) {
        if (matches.length === 0) {
            groupsList.innerHTML = '<div class="empty-state">No matches found yet. Try modifying your expression or test text.</div>';
            return;
        }

        let html = '';

        matches.forEach((match, index) => {
            const fullMatchText = match[0];
            const startChar = match.index;
            const endChar = startChar + fullMatchText.length;
            
            // Build group rows if nested groups exist
            let groupsRows = '';
            if (match.length > 1) {
                groupsRows += '<div class="capture-groups-list">';
                for (let i = 1; i < match.length; i++) {
                    const groupVal = match[i] !== undefined ? match[i] : 'undefined';
                    groupsRows += `
                        <div class="group-row">
                            <span class="group-num">Group $${i}:</span>
                            <span class="group-val">${escapeHtml(groupVal)}</span>
                        </div>
                    `;
                }
                groupsRows += '</div>';
            }

            html += `
                <div class="match-item-card">
                    <div class="match-header-row">
                        <span class="match-index">Match #${index + 1}</span>
                        <span class="match-indices">Index: ${startChar} - ${endChar}</span>
                    </div>
                    <div class="match-text-content">${escapeHtml(fullMatchText)}</div>
                    ${groupsRows}
                </div>
            `;
        });

        groupsList.innerHTML = html;
    }
}
