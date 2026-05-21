/* ==========================================================================
   DevCraft Suite - Base64 Converter Module (base64-tool.js)
   ========================================================================== */

export function initBase64Tool() {
    // Mode Switcher Elements
    const tabText = document.getElementById('base64-tab-text');
    const tabFile = document.getElementById('base64-tab-file');
    const textActions = document.getElementById('base64-text-actions');
    const actionEncode = document.getElementById('base64-action-encode');
    const actionDecode = document.getElementById('base64-action-decode');
    
    // Panel Elements
    const textPanel = document.getElementById('base64-text-panel');
    const filePanel = document.getElementById('base64-file-panel');
    const dropzone = document.getElementById('base64-dropzone');
    const fileInput = document.getElementById('base64-file-input');
    
    // Input / Output Elements
    const inputText = document.getElementById('base64-input-text');
    const outputText = document.getElementById('base64-output-text');
    const clearBtn = document.getElementById('base64-clear-btn');
    
    // File Info Elements
    const fileInfo = document.getElementById('base64-file-info');
    const previewThumb = document.getElementById('base64-preview-thumb');
    const fileNameLabel = document.getElementById('base64-file-name');
    const fileSizeLabel = document.getElementById('base64-file-size');
    
    // Copy Action Buttons
    const copyActionsContainer = document.getElementById('base64-copy-actions-container');
    const copyRawBtn = document.getElementById('base64-copy-raw');
    const copyDataUrlBtn = document.getElementById('base64-copy-dataurl');
    const copyImgTagBtn = document.getElementById('base64-copy-imgtag');
    const copyCssBtn = document.getElementById('base64-copy-css');
    const copyBtnSimple = document.getElementById('base64-copy-btn-simple');

    // State Variables
    let currentMode = 'text'; // 'text' or 'file'
    let currentTextAction = 'encode'; // 'encode' or 'decode'
    let activeFileBase64 = '';
    let activeFileDataUrl = '';
    let activeFileName = '';
    let activeFileType = '';

    // MAX File size: 5MB
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    // --- 1. Mode/Tab Swapping ---
    tabText.addEventListener('click', () => {
        switchMode('text');
    });

    tabFile.addEventListener('click', () => {
        switchMode('file');
    });

    actionEncode.addEventListener('click', () => {
        switchTextAction('encode');
    });

    actionDecode.addEventListener('click', () => {
        switchTextAction('decode');
    });

    // --- 2. Real-time Text Conversion ---
    inputText.addEventListener('input', performTextConversion);

    // --- 3. Drag and Drop File Handlers ---
    dropzone.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    });

    // Prevent default behaviors for drag events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Toggle dropzone dragover highlighting style state
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => dropzone.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => dropzone.classList.remove('dragover'), false);
    });

    dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    });

    // --- 4. Global Action Controls ---
    clearBtn.addEventListener('click', clearAll);

    // Simple Copy Button
    copyBtnSimple.addEventListener('click', () => {
        window.copyToClipboard(outputText.value, 'Output copied to clipboard!');
    });

    // Advanced Copy Buttons
    copyRawBtn.addEventListener('click', () => {
        window.copyToClipboard(activeFileBase64, 'Raw Base64 copied!');
    });

    copyDataUrlBtn.addEventListener('click', () => {
        window.copyToClipboard(activeFileDataUrl, 'Data URL copied!');
    });

    copyImgTagBtn.addEventListener('click', () => {
        const tag = `<img src="${activeFileDataUrl}" alt="${activeFileName}">`;
        window.copyToClipboard(tag, 'HTML Image tag copied!');
    });

    copyCssBtn.addEventListener('click', () => {
        const css = `background-image: url("${activeFileDataUrl}");`;
        window.copyToClipboard(css, 'CSS Background Image URL copied!');
    });

    // Initialize layout status
    switchMode('text');

    // --- Helper Functions ---

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function switchMode(mode) {
        currentMode = mode;
        if (mode === 'text') {
            tabText.classList.add('active');
            tabFile.classList.remove('active');
            textActions.classList.remove('hidden');
            textPanel.classList.remove('hidden');
            filePanel.classList.add('hidden');
            fileInfo.classList.add('hidden');
            copyActionsContainer.classList.add('hidden');
            copyBtnSimple.classList.remove('hidden');
            performTextConversion();
        } else {
            tabText.classList.remove('active');
            tabFile.classList.add('active');
            textActions.classList.add('hidden');
            textPanel.classList.add('hidden');
            filePanel.classList.remove('hidden');
            
            // If file already loaded, restore outputs and action options
            if (activeFileBase64) {
                fileInfo.classList.remove('hidden');
                copyActionsContainer.classList.remove('hidden');
                copyBtnSimple.classList.add('hidden');
                outputText.value = activeFileBase64;
                toggleImageSpecificCopyButtons();
            } else {
                fileInfo.classList.add('hidden');
                copyActionsContainer.classList.add('hidden');
                copyBtnSimple.classList.remove('hidden');
                outputText.value = '';
            }
        }
    }

    function switchTextAction(action) {
        currentTextAction = action;
        if (action === 'encode') {
            actionEncode.classList.add('active');
            actionDecode.classList.remove('active');
            inputText.placeholder = "Enter text here to encode...";
        } else {
            actionEncode.classList.remove('active');
            actionDecode.classList.add('active');
            inputText.placeholder = "Enter Base64 string to decode...";
        }
        performTextConversion();
    }

    function performTextConversion() {
        const val = inputText.value;
        if (!val) {
            outputText.value = '';
            return;
        }

        if (currentTextAction === 'encode') {
            outputText.value = encodeText(val);
        } else {
            outputText.value = decodeText(val);
        }
    }

    function encodeText(str) {
        try {
            // Correctly handle UTF-8/Unicode encoding
            return btoa(unescape(encodeURIComponent(str)));
        } catch (e) {
            return "Error: Unable to encode string. Check for invalid characters.";
        }
    }

    function decodeText(str) {
        try {
            // Clean up whitespace & decode
            const cleanStr = str.trim().replace(/\s/g, '');
            return decodeURIComponent(escape(atob(cleanStr)));
        } catch (e) {
            return "Error: Invalid Base64 format. Unable to decode string.";
        }
    }

    function processFile(file) {
        if (!file) return;

        // Size check
        if (file.size > MAX_FILE_SIZE) {
            window.showToast('File exceeds 5MB size limit!', '⚠️');
            return;
        }

        activeFileName = file.name;
        activeFileType = file.type;
        const sizeKb = (file.size / 1024).toFixed(1);

        // Update Labels
        fileNameLabel.textContent = file.name;
        fileSizeLabel.textContent = `${sizeKb} KB`;

        const reader = new FileReader();
        
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            activeFileDataUrl = dataUrl;
            
            // Extract raw base64 part
            const base64Index = dataUrl.indexOf('base64,');
            if (base64Index !== -1) {
                activeFileBase64 = dataUrl.substring(base64Index + 7);
            } else {
                activeFileBase64 = dataUrl;
            }

            // Update output textarea
            outputText.value = activeFileBase64;

            // Generate thumbnail preview
            if (file.type.startsWith('image/')) {
                previewThumb.style.backgroundImage = `url("${dataUrl}")`;
                previewThumb.innerHTML = ''; // clear any placeholder SVG text
            } else {
                // Non-image generic file thumbnail helper icon
                previewThumb.style.backgroundImage = 'none';
                previewThumb.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 24px; height: 24px; color: var(--text-muted)">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                    </svg>
                `;
            }

            // Adjust interface elements visibility
            fileInfo.classList.remove('hidden');
            copyActionsContainer.classList.remove('hidden');
            copyBtnSimple.classList.add('hidden'); // Hide fallback simple copy

            toggleImageSpecificCopyButtons();
            window.showToast('File processed successfully!', '📄');
        };

        reader.onerror = () => {
            window.showToast('Failed to read file details.', '⚠️');
        };

        reader.readAsDataURL(file);
    }

    function toggleImageSpecificCopyButtons() {
        if (activeFileType.startsWith('image/')) {
            copyImgTagBtn.classList.remove('hidden');
            copyCssBtn.classList.remove('hidden');
        } else {
            copyImgTagBtn.classList.add('hidden');
            copyCssBtn.classList.add('hidden');
        }
    }

    function clearAll() {
        if (currentMode === 'text') {
            inputText.value = '';
            outputText.value = '';
        } else {
            // Reset active files cache
            activeFileBase64 = '';
            activeFileDataUrl = '';
            activeFileName = '';
            activeFileType = '';
            fileInput.value = '';
            
            // Hide panels & reset view
            fileInfo.classList.add('hidden');
            copyActionsContainer.classList.add('hidden');
            copyBtnSimple.classList.remove('hidden');
            outputText.value = '';
            previewThumb.style.backgroundImage = 'none';
            previewThumb.innerHTML = '';
        }
    }
}
