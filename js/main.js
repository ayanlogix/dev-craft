/* ==========================================================================
   DevCraft Suite - Main Application Controller (main.js)
   ========================================================================= */

// Import tool modules
import { initJsonTool } from './json-tool.js';
import { initJwtTool } from './jwt-tool.js';
import { initRegexTool } from './regex-tool.js';
import { initGlassTool } from './glass-tool.js';
import { initColorTool } from './color-tool.js';
import { initBase64Tool } from './base64-tool.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Navigation Router
    setupNavigation();

    // 2. Initialize Theme Switcher
    setupTheme();

    // 3. Initialize Shared Utility Handlers (Toasts, Copy triggers)
    setupSharedUtilities();

    // 4. Initialize Tool Modules
    try {
        initJsonTool();
        initJwtTool();
        initRegexTool();
        initGlassTool();
        initColorTool();
        initBase64Tool();
        console.log('✨ All DevCraft utility modules initialized successfully.');
    } catch (error) {
        console.error('❌ Error initializing DevCraft utility modules:', error);
    }
});

/**
 * Single Page Application Routing
 */
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const toolSections = document.querySelectorAll('.tool-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            if (!targetId) return;

            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');

            // Switch active tool section with smooth transitions
            toolSections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });

            // If on mobile/tablet, smooth scroll to the tool header on transition
            if (window.innerWidth <= 1024) {
                const targetSection = document.getElementById(targetId);
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/**
 * Light / Dark Theme Manager
 */
function setupTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Check localStorage for saved theme, default to dark
    const savedTheme = localStorage.getItem('devcraft-theme') || 'dark';
    setTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        if (theme === 'dark') {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
        }
        localStorage.setItem('devcraft-theme', theme);
    }
}

/**
 * Shared Utilities
 */
function setupSharedUtilities() {
    // Global Paste Helper
    window.helperPaste = async function (textareaElement) {
        try {
            const text = await navigator.clipboard.readText();
            textareaElement.value = text;
            // Dispatch input event to trigger any reactive listeners
            textareaElement.dispatchEvent(new Event('input', { bubbles: true }));
            window.showToast('Content pasted from clipboard!');
        } catch (err) {
            console.error('Clipboard paste failed: ', err);
            window.showToast('Unable to read clipboard. Please paste manually.');
        }
    };
}

/**
 * Displays a non-intrusive notification toast
 * @param {string} message - Message text to display
 * @param {string} icon - Emoji icon prefix (optional)
 */
window.showToast = function (message, icon = '📋') {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;

    const toastIcon = toast.querySelector('.toast-icon');
    const toastMsg = toast.querySelector('.toast-message');

    toastIcon.textContent = icon;
    toastMsg.textContent = message;

    // Show toast
    toast.classList.remove('hidden');
    // Force browser reflow to enable CSS transition
    toast.offsetHeight;
    toast.classList.add('show');

    // Clear any existing timeouts to prevent overlapping hides
    if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
    }

    // Hide toast after duration
    window.toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 400); // Wait for transition out
    }, 2500);
};

/**
 * Copies a string to the system clipboard
 * @param {string} text - String content to copy
 * @param {string} successMessage - Toast message on success
 */
window.copyToClipboard = async function (text, successMessage = 'Copied to clipboard!') {
    if (!text || text.trim() === '') {
        window.showToast('Nothing to copy!', '⚠️');
        return;
    }
    try {
        await navigator.clipboard.writeText(text);
        window.showToast(successMessage, '✅');
    } catch (err) {
        console.error('Clipboard copy failed: ', err);
        window.showToast('Copy failed. Please copy manually.', '⚠️');
    }
};
