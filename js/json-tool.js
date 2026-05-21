/* ==========================================================================
   DevCraft Suite - JSON Formatter & Validator Module (json-tool.js)
   ========================================================================== */

let rawFormattedOutput = ''; // Cache the raw text version for copying

export function initJsonTool() {
    const jsonInput = document.getElementById('json-input');
    const jsonOutputCode = document.querySelector('#json-output-display code');
    const errorBanner = document.getElementById('json-error-banner');
    const errorText = document.getElementById('json-error-text');

    const pasteBtn = document.getElementById('json-paste-btn');
    const clearBtn = document.getElementById('json-clear-btn');
    const minifyBtn = document.getElementById('json-minify-btn');
    const beautifyBtn = document.getElementById('json-beautify-btn');
    const copyBtn = document.getElementById('json-copy-btn');

    // Attach Event Listeners
    jsonInput.addEventListener('input', () => handleJsonUpdate(false));
    beautifyBtn.addEventListener('click', () => handleJsonUpdate(false, true));
    minifyBtn.addEventListener('click', () => handleJsonUpdate(true, true));
    
    pasteBtn.addEventListener('click', () => window.helperPaste(jsonInput));
    
    clearBtn.addEventListener('click', () => {
        jsonInput.value = '';
        jsonOutputCode.innerHTML = '';
        rawFormattedOutput = '';
        errorBanner.classList.add('hidden');
        window.showToast('JSON input cleared.', '🧹');
    });

    copyBtn.addEventListener('click', () => {
        window.copyToClipboard(rawFormattedOutput, 'Formatted JSON copied to clipboard!');
    });

    /**
     * Parses, validates, and renders JSON content
     * @param {boolean} minify - Compresses JSON if true, otherwise formats with 2 spaces
     * @param {boolean} showSuccessToast - Triggers success notification if true (used on buttons)
     */
    function handleJsonUpdate(minify = false, showSuccessToast = false) {
        const val = jsonInput.value.trim();
        
        if (!val) {
            jsonOutputCode.innerHTML = '';
            rawFormattedOutput = '';
            errorBanner.classList.add('hidden');
            return;
        }

        try {
            const parsed = JSON.parse(val);
            errorBanner.classList.add('hidden'); // Hide errors on success

            // Generate raw output based on formatting selection
            rawFormattedOutput = minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2);
            
            // Syntax Highlight the output JSON
            const highlightedHTML = syntaxHighlightJson(rawFormattedOutput);
            jsonOutputCode.innerHTML = highlightedHTML;

            if (showSuccessToast) {
                window.showToast(minify ? 'JSON minified successfully!' : 'JSON formatted successfully!', '✨');
            }
        } catch (err) {
            // Display JSON structure errors
            errorText.textContent = err.message;
            errorBanner.classList.remove('hidden');
            // Keep output showing the error highlight or current text
            if (showSuccessToast) {
                window.showToast('Failed to format. Check error details below.', '⚠️');
            }
        }
    }

    /**
     * Syntax Highlights JSON raw text via Regex patterns
     * @param {string} jsonStr - Raw JSON text
     * @returns {string} - Highlighted HTML output containing inline classes
     */
    function syntaxHighlightJson(jsonStr) {
        // Escape HTML entities to prevent execution of markup
        let safeStr = jsonStr
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Regular expression matching JSON structures (keys, strings, numbers, booleans, nulls)
        const regex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g;

        return safeStr.replace(regex, (match) => {
            let cls = 'json-number';
            
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-null';
            }
            
            return `<span class="${cls}">${match}</span>`;
        });
    }
}
