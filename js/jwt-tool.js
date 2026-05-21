/* ==========================================================================
   DevCraft Suite - JWT Decoder Module (jwt-tool.js)
   ========================================================================== */

let rawHeader = '';
let rawPayload = '';

export function initJwtTool() {
    const jwtInput = document.getElementById('jwt-input');
    const headerCode = document.getElementById('jwt-header-code');
    const payloadCode = document.getElementById('jwt-payload-code');
    
    const algoBadge = document.getElementById('jwt-algo-badge');
    const expiryBadge = document.getElementById('jwt-expiry-badge');

    const pasteBtn = document.getElementById('jwt-paste-btn');
    const clearBtn = document.getElementById('jwt-clear-btn');
    const copyHeaderBtn = document.getElementById('jwt-copy-header');
    const copyPayloadBtn = document.getElementById('jwt-copy-payload');

    // Attach Event Listeners
    jwtInput.addEventListener('input', decodeToken);
    pasteBtn.addEventListener('click', () => window.helperPaste(jwtInput));
    
    clearBtn.addEventListener('click', () => {
        jwtInput.value = '';
        headerCode.innerHTML = '';
        payloadCode.innerHTML = '';
        rawHeader = '';
        rawPayload = '';
        algoBadge.textContent = '-';
        expiryBadge.textContent = '-';
        expiryBadge.style.color = '';
        window.showToast('JWT Input cleared.', '🧹');
    });

    copyHeaderBtn.addEventListener('click', () => {
        window.copyToClipboard(rawHeader, 'JWT Header copied to clipboard!');
    });

    copyPayloadBtn.addEventListener('click', () => {
        window.copyToClipboard(rawPayload, 'JWT Payload copied to clipboard!');
    });

    /**
     * Splits and Decodes the JWT input string
     */
    function decodeToken() {
        const token = jwtInput.value.trim();

        if (!token) {
            headerCode.innerHTML = '';
            payloadCode.innerHTML = '';
            rawHeader = '';
            rawPayload = '';
            algoBadge.textContent = '-';
            expiryBadge.textContent = '-';
            expiryBadge.style.color = '';
            return;
        }

        const parts = token.split('.');

        if (parts.length !== 3) {
            headerCode.innerHTML = '<span class="json-null">Invalid JWT Format. Must consist of three segments separated by dots.</span>';
            payloadCode.innerHTML = '<span class="json-null">Please check your token input.</span>';
            algoBadge.textContent = 'INVALID';
            expiryBadge.textContent = 'N/A';
            expiryBadge.style.color = 'var(--error)';
            return;
        }

        try {
            // Decode segment parts
            const headerStr = base64UrlDecode(parts[0]);
            const payloadStr = base64UrlDecode(parts[1]);

            // Save raw strings for clipboard copying
            rawHeader = JSON.stringify(JSON.parse(headerStr), null, 2);
            rawPayload = JSON.stringify(JSON.parse(payloadStr), null, 2);

            // Display Highlighted JSON
            headerCode.innerHTML = syntaxHighlightJson(rawHeader);
            payloadCode.innerHTML = syntaxHighlightJson(rawPayload);

            // Parse objects for metadata
            const headerObj = JSON.parse(headerStr);
            const payloadObj = JSON.parse(payloadStr);

            // Update Header Algorithm Badge
            algoBadge.textContent = headerObj.alg || 'None';

            // Check Expiration Date Claims (exp)
            if (payloadObj.exp) {
                const expTimestampMs = payloadObj.exp * 1000;
                const expDate = new Date(expTimestampMs);
                const isExpired = Date.now() > expTimestampMs;

                expiryBadge.textContent = expDate.toLocaleString();
                
                if (isExpired) {
                    expiryBadge.textContent += ' (Expired ⚠️)';
                    expiryBadge.style.color = 'var(--error)';
                } else {
                    expiryBadge.textContent += ' (Active ✅)';
                    expiryBadge.style.color = 'var(--tertiary)';
                }
            } else {
                expiryBadge.textContent = 'No Expiration Claim (exp)';
                expiryBadge.style.color = 'var(--text-muted)';
            }

        } catch (error) {
            headerCode.innerHTML = `<span class="json-null">Decoding Error: ${error.message}</span>`;
            payloadCode.innerHTML = `<span class="json-null">Please verify that you have entered a valid base64-encoded JWT.</span>`;
            algoBadge.textContent = 'ERROR';
            expiryBadge.textContent = 'N/A';
            expiryBadge.style.color = 'var(--error)';
        }
    }

    /**
     * Decodes Base64Url string in browser
     */
    function base64UrlDecode(str) {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        // Pad Base64 string to match multiple of 4 characters length
        while (base64.length % 4) {
            base64 += '=';
        }
        
        // Decode correctly dealing with escape characters (UTF-8 representation)
        return decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
    }

    /**
     * local JSON highlighting helper (reused from json-tool)
     */
    function syntaxHighlightJson(jsonStr) {
        let safeStr = jsonStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
