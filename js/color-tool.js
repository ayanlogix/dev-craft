/* ==========================================================================
   DevCraft Suite - Color Palette Designer Module (color-tool.js)
   ========================================================================= */

let currentPalette = []; // Holds current generated hex colors

export function initColorTool() {
    const baseColorInput = document.getElementById('palette-base-color');
    const baseColorTextInput = document.getElementById('palette-base-color-text');
    const harmonySelect = document.getElementById('palette-harmony');
    
    const swatchesContainer = document.getElementById('palette-swatches-container');
    
    const contrastLightCard = document.getElementById('contrast-preview-light');
    const contrastLightRatio = document.getElementById('contrast-light-ratio');
    const contrastLightStatus = document.getElementById('contrast-light-status');
    
    const contrastDarkCard = document.getElementById('contrast-preview-dark');
    const contrastDarkRatio = document.getElementById('contrast-dark-ratio');
    const contrastDarkStatus = document.getElementById('contrast-dark-status');

    const exportCssBtn = document.getElementById('palette-export-css');
    const exportTailwindBtn = document.getElementById('palette-export-tailwind');

    // Attach Event Listeners
    [baseColorInput, harmonySelect].forEach(el => {
        el.addEventListener('input', generatePalette);
    });

    baseColorTextInput.addEventListener('input', () => {
        const val = baseColorTextInput.value.trim();
        if (/^#[0-9A-F]{6}$/i.test(val)) {
            baseColorInput.value = val;
            generatePalette();
        }
    });

    exportCssBtn.addEventListener('click', () => {
        if (currentPalette.length === 0) return;
        const cssProps = `:root {
  --color-primary-50: ${currentPalette[0]};
  --color-primary-100: ${currentPalette[1]};
  --color-primary-200: ${currentPalette[2]};
  --color-primary-300: ${currentPalette[3]};
  --color-primary-400: ${currentPalette[4]};
}`;
        window.copyToClipboard(cssProps, 'CSS Custom Properties copied to clipboard!');
    });

    exportTailwindBtn.addEventListener('click', () => {
        if (currentPalette.length === 0) return;
        const twProps = `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        custom: {
          50: '${currentPalette[0]}',
          100: '${currentPalette[1]}',
          200: '${currentPalette[2]}',
          300: '${currentPalette[3]}',
          400: '${currentPalette[4]}',
        }
      }
    }
  }
}`;
        window.copyToClipboard(twProps, 'Tailwind Custom Config copied to clipboard!');
    });

    // Run first generation
    generatePalette();

    /**
     * Main coordinator for generating swatches and accessibility reviews
     */
    function generatePalette() {
        const hex = baseColorInput.value;
        const harmony = harmonySelect.value;
        
        baseColorTextInput.value = hex.toUpperCase();

        // 1. Generate Harmonies list
        currentPalette = calculateHarmonies(hex, harmony);

        // 2. Render Swatches
        renderSwatchesGrid(currentPalette);

        // 3. Compute Accessibility Checks for the seed color
        checkAccessibility(hex);
    }

    /**
     * Computes color options based HSL rotations
     */
    function calculateHarmonies(hex, mode) {
        const hsl = hexToHsl(hex);
        const palette = [];

        switch (mode) {
            case 'monochromatic':
                // Hue stays constant, lightness varies
                palette.push(hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 30)));
                palette.push(hslToHex(hsl.h, hsl.s, Math.max(20, hsl.l - 15)));
                palette.push(hex);
                palette.push(hslToHex(hsl.h, hsl.s, Math.min(90, hsl.l + 15)));
                palette.push(hslToHex(hsl.h, hsl.s, Math.min(95, hsl.l + 30)));
                break;
                
            case 'complementary':
                // Opposites on color wheel (+180 degrees)
                palette.push(hslToHex(hsl.h, hsl.s, Math.max(20, hsl.l - 15)));
                palette.push(hex);
                palette.push(hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
                palette.push(hslToHex((hsl.h + 180) % 360, hsl.s, Math.min(85, hsl.l + 15)));
                palette.push(hslToHex((hsl.h + 180) % 360, Math.max(10, hsl.s - 20), Math.min(95, hsl.l + 25)));
                break;
                
            case 'analogous':
                // Adjacent colors (+/- 30 and 60 degrees)
                palette.push(hslToHex((hsl.h + 300) % 360, hsl.s, hsl.l));
                palette.push(hslToHex((hsl.h + 330) % 360, hsl.s, hsl.l));
                palette.push(hex);
                palette.push(hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l));
                palette.push(hslToHex((hsl.h + 60) % 360, hsl.s, hsl.l));
                break;
                
            case 'triadic':
                // Evenly spaced at 120 degree separations
                palette.push(hslToHex((hsl.h + 120) % 360, hsl.s, Math.max(20, hsl.l - 10)));
                palette.push(hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l));
                palette.push(hex);
                palette.push(hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l));
                palette.push(hslToHex((hsl.h + 240) % 360, hsl.s, Math.min(85, hsl.l + 10)));
                break;
                
            case 'split-complementary':
                // Seed, plus two adjacent to its complement (+/- 150 degrees)
                palette.push(hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l));
                palette.push(hslToHex((hsl.h + 150) % 360, hsl.s, Math.min(85, hsl.l + 15)));
                palette.push(hex);
                palette.push(hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l));
                palette.push(hslToHex((hsl.h + 210) % 360, hsl.s, Math.max(20, hsl.l - 10)));
                break;
        }

        return palette;
    }

    /**
     * Builds swatches and click handlers dynamically
     */
    function renderSwatchesGrid(colors) {
        swatchesContainer.innerHTML = '';
        const labels = ['Dark Accent', 'Primary Light', 'Seed Base', 'Bright Accent', 'Tint Accent'];

        colors.forEach((color, index) => {
            const card = document.createElement('div');
            card.className = 'swatch-card';
            
            card.innerHTML = `
                <div class="swatch-color" style="background-color: ${color}"></div>
                <div class="swatch-info">
                    <span class="swatch-hex">${color.toUpperCase()}</span>
                    <span class="swatch-label">${labels[index]}</span>
                </div>
            `;

            card.addEventListener('click', () => {
                window.copyToClipboard(color, `Color ${color.toUpperCase()} copied to clipboard!`);
            });

            swatchesContainer.appendChild(card);
        });
    }

    /**
     * Measures WCAG contrast scores
     */
    function checkAccessibility(hex) {
        const rgb = hexToRgb(hex);
        const colorLuminance = getLuminance(rgb.r, rgb.g, rgb.b);

        // White Text (luminance 1.0)
        const lightRatio = calculateContrast(colorLuminance, 1.0);
        updateContrastDisplay(
            contrastLightCard, 
            contrastLightRatio, 
            contrastLightStatus, 
            lightRatio, 
            hex, 
            '#ffffff'
        );

        // Dark Text (#0f172a / rgb 15, 23, 42 -> luminance 0.0076)
        const darkLuminance = getLuminance(15, 23, 42);
        const darkRatio = calculateContrast(colorLuminance, darkLuminance);
        updateContrastDisplay(
            contrastDarkCard, 
            contrastDarkRatio, 
            contrastDarkStatus, 
            darkRatio, 
            hex, 
            '#0f172a'
        );
    }

    function updateContrastDisplay(card, ratioEl, statusEl, ratio, bgHex, textHex) {
        card.style.backgroundColor = bgHex;
        card.style.color = textHex;
        ratioEl.textContent = `${ratio.toFixed(2)}:1`;

        if (ratio >= 7.0) {
            statusEl.textContent = 'PASS AAA';
            statusEl.className = 'compliance-badge pass-aaa';
        } else if (ratio >= 4.5) {
            statusEl.textContent = 'PASS AA';
            statusEl.className = 'compliance-badge pass-aa';
        } else {
            statusEl.textContent = 'FAIL';
            statusEl.className = 'compliance-badge fail';
        }
    }

    /**
     * Formulas for WCAG color compliance checks
     */
    function calculateContrast(lum1, lum2) {
        const lighter = Math.max(lum1, lum2);
        const darker = Math.min(lum1, lum2);
        return (lighter + 0.05) / (darker + 0.05);
    }

    function getLuminance(r, g, b) {
        const a = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    /**
     * Color Converters
     */
    function hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    function hexToHsl(hex) {
        let { r, g, b } = hexToRgb(hex);
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    function hslToHex(h, s, l) {
        h /= 360; s /= 100; l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
}
