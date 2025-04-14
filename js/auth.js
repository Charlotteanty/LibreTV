// 密码验证功能

// 常量定义
const PASSWORD_AUTH_KEY = 'libre_tv_auth';
const PASSWORD_VERIFIED_VALUE = 'verified';
const PASSWORD_COOKIE_DAYS = 30; // 验证cookie保存天数

// 检查是否需要密码验证
async function checkPasswordProtection() {
    // 如果已经验证过密码，则不再显示密码输入框
    if (isPasswordVerified()) {
        return true;
    }
    
    try {
        // 检查是否需要密码
        const response = await fetch('/api/check-password.js');
        const data = await response.json();
        
        if (data.passwordRequired) {
            // 显示密码模态窗口
            showPasswordModal();
            return false;
        } else {
            // 不需要密码，直接标记为已验证
            setPasswordVerified();
            return true;
        }
    } catch (error) {
        console.error('检查密码保护时出错:', error);
        // 发生错误时，默认不需要密码
        return true;
    }
}

// 显示密码模态窗口
function showPasswordModal() {
    const modal = document.getElementById('passwordModal');
    modal.classList.remove('hidden');
    
    // 焦点放在密码输入框
    setTimeout(() => {
        document.getElementById('passwordInput').focus();
    }, 100);
    
    // 设置表单提交事件
    document.getElementById('passwordForm').addEventListener('submit', handlePasswordSubmit);
}

// 处理密码提交
async function handlePasswordSubmit(event) {
    event.preventDefault();
    
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value.trim();
    
    if (!password) {
        showPasswordError();
        return;
    }
    
    try {
        // 验证密码
        const response = await fetch('/api/verify-password.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // 密码正确
            setPasswordVerified();
            hidePasswordModal();
        } else {
            // 密码错误
            showPasswordError();
        }
    } catch (error) {
        console.error('验证密码时出错:', error);
        showPasswordError();
    }
}

// 显示密码错误信息
function showPasswordError() {
    const errorEl = document.getElementById('passwordError');
    errorEl.classList.remove('hidden');
    
    // 清空密码输入框
    document.getElementById('passwordInput').value = '';
    document.getElementById('passwordInput').focus();
    
    // 3秒后隐藏错误信息
    setTimeout(() => {
        errorEl.classList.add('hidden');
    }, 3000);
}

// 隐藏密码模态窗口
function hidePasswordModal() {
    document.getElementById('passwordModal').classList.add('hidden');
    // 重新加载页面或执行初始化逻辑
    window.location.reload();
}

// 检查是否已经验证过密码
function isPasswordVerified() {
    return localStorage.getItem(PASSWORD_AUTH_KEY) === PASSWORD_VERIFIED_VALUE;
}

// 设置密码已验证标记
function setPasswordVerified() {
    localStorage.setItem(PASSWORD_AUTH_KEY, PASSWORD_VERIFIED_VALUE);
    
    // 同时设置cookie作为备份，避免localStorage被清除
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + PASSWORD_COOKIE_DAYS);
    document.cookie = `${PASSWORD_AUTH_KEY}=${PASSWORD_VERIFIED_VALUE}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
}

// 在页面加载完成后检查密码保护
document.addEventListener('DOMContentLoaded', checkPasswordProtection);
