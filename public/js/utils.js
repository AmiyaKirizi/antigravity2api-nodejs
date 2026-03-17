// HTML 转义函数 - 防止 XSS 注入
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// 转义用于 JavaScript 字符串的内容
function escapeJs(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r');
}

// 字体大小设置
function initFontSize() {
    const savedSize = localStorage.getItem('fontSize') || '18';
    document.documentElement.style.setProperty('--font-size-base', savedSize + 'px');
    updateFontSizeInputs(savedSize);
}

function changeFontSize(size) {
    size = Math.max(10, Math.min(24, parseInt(size) || 14));
    document.documentElement.style.setProperty('--font-size-base', size + 'px');
    localStorage.setItem('fontSize', size);
    updateFontSizeInputs(size);
}

function updateFontSizeInputs(size) {
    const rangeInput = document.getElementById('fontSizeRange');
    const numberInput = document.getElementById('fontSizeInput');
    if (rangeInput) rangeInput.value = size;
    if (numberInput) numberInput.value = size;
}

// 敏感信息隐藏功能
let sensitiveInfoHidden = localStorage.getItem('sensitiveInfoHidden') !== 'false';

function initSensitiveInfo() {
    updateSensitiveInfoDisplay();
    updateSensitiveBtn();
}

function toggleSensitiveInfo() {
    sensitiveInfoHidden = !sensitiveInfoHidden;
    localStorage.setItem('sensitiveInfoHidden', sensitiveInfoHidden);
    updateSensitiveInfoDisplay();
    updateSensitiveBtn();
}

function updateSensitiveBtn() {
    const btn = document.getElementById('toggleSensitiveBtn');
    if (btn) {
        if (sensitiveInfoHidden) {
            btn.innerHTML = '🙈 Hide';
            btn.title = 'Click to show sensitive info';
            btn.classList.remove('btn-info');
            btn.classList.add('btn-secondary');
        } else {
            btn.innerHTML = '👁️ Show';
            btn.title = 'Click to hide sensitive info';
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-info');
        }
    }
}

function updateSensitiveInfoDisplay() {
    // 隐藏/显示包含敏感信息的整行
    document.querySelectorAll('.sensitive-row').forEach(row => {
        if (sensitiveInfoHidden) {
            row.style.display = 'none';
        } else {
            row.style.display = '';
        }
    });
    // 同时隐藏/显示 token-info 容器
    document.querySelectorAll('.token-info').forEach(container => {
        if (sensitiveInfoHidden) {
            container.style.display = 'none';
        } else {
            container.style.display = '';
        }
    });
}
