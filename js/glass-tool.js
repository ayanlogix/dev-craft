/* ==========================================================================
   DevCraft Suite - Glassmorphism Generator Module (glass-tool.js)
   ========================================================================== */

export function initGlassTool() {
    const opacityInput = document.getElementById('glass-opacity');
    const blurInput = document.getElementById('glass-blur');
    const colorInput = document.getElementById('glass-color');
    const colorTextInput = document.getElementById('glass-color-text');
    const borderOpacityInput = document.getElementById('glass-border-opacity');
    const saturationInput = document.getElementById('glass-saturation');

    const opacityVal = document.getElementById('glass-opacity-val');
    const blurVal = document.getElementById('glass-blur-val');
    const colorValText = document.getElementById('glass-color-val');
    const borderOpacityVal = document.getElementById('glass-border-opacity-val');
    const saturationVal = document.getElementById('glass-saturation-val');

    const previewCard = document.getElementById('glass-preview-card');
    const cssOutputCode = document.getElementById('glass-css-output');
    const copyCssBtn = document.getElementById('glass-copy-css');

    // Attach Event Listeners
    [opacityInput, blurInput, colorInput, borderOpacityInput, saturationInput].forEach(control => {
        control.addEventListener('input', updateGlassEffect);
    });

    colorTextInput.addEventListener('input', () => {
        let hex = colorTextInput.value.trim();
        if (/^#[0-9A-F]{6}$/i.test(hex)) {
            colorInput.value = hex;
            updateGlassEffect();
        }
    });

    copyCssBtn.addEventListener('click', () => {
        const cssRules = generateCssRulesString();
        window.copyToClipboard(cssRules, 'CSS Glassmorphism styles copied!');
    });

    // Run initial rendering
    updateGlassEffect();

    /**
     * Reads sliders and applies styles to preview canvas and updates code pane
     */
    function updateGlassEffect() {
        const opacity = opacityInput.value;
        const blur = blurInput.value;
        const hexColor = colorInput.value;
        const borderOpacity = borderOpacityInput.value;
        const saturation = saturationInput.value;

        // Sync text labels
        opacityVal.textContent = opacity;
        blurVal.textContent = `${blur}px`;
        colorValText.textContent = hexColor.toUpperCase();
        colorTextInput.value = hexColor.toUpperCase();
        borderOpacityVal.textContent = borderOpacity;
        saturationVal.textContent = `${saturation}%`;

        // Extract RGB
        const rgb = hexToRgb(hexColor);

        // Apply styles to floating preview element
        const bgVal = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
        const borderVal = `1px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${borderOpacity})`;
        const backdropFilterVal = `blur(${blur}px) saturate(${saturation}%)`;

        previewCard.style.background = bgVal;
        previewCard.style.border = borderVal;
        previewCard.style.backdropFilter = backdropFilterVal;
        previewCard.style.webkitBackdropFilter = backdropFilterVal;

        // Render code string
        cssOutputCode.innerHTML = syntaxHighlightCss(generateCssRulesString());
    }

    /**
     * Assembles clean CSS rule output
     * @returns {string} - Raw CSS text
     */
    function generateCssRulesString() {
        const opacity = opacityInput.value;
        const blur = blurInput.value;
        const hexColor = colorInput.value;
        const borderOpacity = borderOpacityInput.value;
        const saturation = saturationInput.value;
        const rgb = hexToRgb(hexColor);

        return `.glass-element {
    background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity});
    backdrop-filter: blur(${blur}px) saturate(${saturation}%);
    -webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
    border: 1px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${borderOpacity});
    border-radius: 20px;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}`;
    }

    /**
     * Converts Hex string values to standard RGB numbers
     */
    function hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
        
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
    }

    /**
     * Simple regex highlighters for CSS
     */
    function syntaxHighlightCss(cssText) {
        return cssText
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/(\.[a-z0-9_-]+)/g, '<span style="color: #6366f1;">$1</span>') // class selector
            .replace(/([a-z-]+)(?=\s*:)/g, '<span style="color: #f43f5e;">$1</span>') // properties
            .replace(/:\s*([^;]+);/g, ': <span style="color: #10b981;">$1</span>;') // values
            .replace(/(rgba\([^)]+\)|blur\([^)]+\)|saturate\([^)]+\))/g, '<span style="color: #f59e0b;">$1</span>'); // functions
    }
}
