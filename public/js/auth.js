// 认证相关：登录、登出、OAuth

// 不再使用 localStorage 存储 token，改用 HttpOnly Cookie
let isLoggedIn = false;
let oauthPort = null;

const CLIENT_ID = '1071006060591-tmhssin2h21lcre235vtolojh4g403ep.apps.googleusercontent.com';
const SCOPES = [
    'https://www.googleapis.com/auth/cloud-platform',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/cclog',
    'https://www.googleapis.com/auth/experimentsandconfigs'
].join(' ');

// 封装fetch，自动处理401，使用 credentials: 'include' 发送 Cookie
const authFetch = async (url, options = {}) => {
    const response = await fetch(url, {
        ...options,
        credentials: 'include'
    });
    if (response.status === 401) {
        silentLogout();
        showToast('Your session has expired. Please sign in again', 'warning');
        throw new Error('Unauthorized');
    }
    return response;
};

function showMainContent() {
    isLoggedIn = true;
    document.documentElement.classList.add('logged-in');
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
}

function silentLogout() {
    isLoggedIn = false;
    // 清除旧版本的 localStorage token（如果存在）
    localStorage.removeItem('authToken');
    document.documentElement.classList.remove('logged-in');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('mainContent').classList.add('hidden');
}

async function logout() {
    const confirmed = await showConfirm('Are you sure you want to sign out?', 'Sign Out Confirmation');
    if (!confirmed) return;

    try {
        // 调用后端登出接口清除 Cookie
        await fetch('/admin/logout', {
            method: 'POST',
            credentials: 'include'
        });
    } catch (e) {
        // 忽略错误
    }

    silentLogout();
    showToast('Signed out', 'info');
}

function getOAuthUrl() {
    if (!oauthPort) oauthPort = Math.floor(Math.random() * 10000) + 50000;
    const redirectUri = `http://localhost:${oauthPort}/oauth-callback`;
    return `https://accounts.google.com/o/oauth2/v2/auth?` +
        `access_type=offline&client_id=${CLIENT_ID}&prompt=consent&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&` +
        `scope=${encodeURIComponent(SCOPES)}&state=${Date.now()}`;
}

function openOAuthWindow() {
    window.open(getOAuthUrl(), '_blank');
}

function copyOAuthUrl() {
    const url = getOAuthUrl();
    navigator.clipboard.writeText(url).then(() => {
        showToast('Authorization link copied', 'success');
    }).catch(() => {
        showToast('Copy failed', 'error');
    });
}

function showOAuthModal() {
    showToast('Complete the authorization flow in a new window', 'info');
    const modal = document.createElement('div');
    modal.className = 'modal form-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-title">🔐 OAuth Sign-In</div>
            <div class="oauth-steps">
                <p><strong>📝 Authorization steps:</strong></p>
                <p>1️⃣ Click the button below to open the Google authorization page</p>
                <p>2️⃣ After authorizing, copy the full URL from the browser address bar</p>
                <p>3️⃣ Paste the URL into the input below and submit</p>
            </div>
            <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                <button type="button" onclick="openOAuthWindow()" class="btn btn-success" style="flex: 1;">🔐 Open Authorization Page</button>
                <button type="button" onclick="copyOAuthUrl()" class="btn btn-info" style="flex: 1;">📋 Copy Authorization Link</button>
            </div>
            <input type="text" id="modalCallbackUrl" placeholder="Paste the full callback URL (http://localhost:xxxxx/oauth-callback?code=...)">
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                <button class="btn btn-success" onclick="processOAuthCallbackModal()">✅ Submit</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}

async function processOAuthCallbackModal() {
    const modal = document.querySelector('.form-modal');
    const callbackUrl = document.getElementById('modalCallbackUrl').value.trim();
    if (!callbackUrl) {
        showToast('Please enter the callback URL', 'warning');
        return;
    }

    showLoading('Processing authorization...');

    try {
        const url = new URL(callbackUrl);
        const code = url.searchParams.get('code');
        const port = new URL(url.origin).port || (url.protocol === 'https:' ? 443 : 80);

        if (!code) {
            hideLoading();
            showToast('No authorization code was found in the URL', 'error');
            return;
        }

        const response = await authFetch('/admin/oauth/exchange', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code, port })
        });

        const result = await response.json();
        if (result.success) {
            const account = result.data;
            const addResponse = await authFetch('/admin/tokens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(account)
            });

            const addResult = await addResponse.json();
            hideLoading();
            if (addResult.success) {
                modal.remove();
                const message = result.fallbackMode
                    ? 'Token added successfully (this account is not eligible, so a random Project ID was used automatically)'
                    : 'Token added successfully';
                showToast(message, result.fallbackMode ? 'warning' : 'success');
                loadTokens();
            } else {
                showToast('Add failed: ' + addResult.message, 'error');
            }
        } else {
            hideLoading();
            showToast('Exchange failed: ' + result.message, 'error');
        }
    } catch (error) {
        hideLoading();
        showToast('Processing failed: ' + error.message, 'error');
    }
}

// 检查登录状态（通过尝试访问需要认证的接口）
async function checkLoginStatus() {
    try {
        const response = await fetch('/admin/tokens', {
            credentials: 'include'
        });
        return response.status === 200;
    } catch (e) {
        return false;
    }
}
