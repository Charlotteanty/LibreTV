(function() {
    // 当窗口内未设置密码或为空，不需要验证
    var correctPassword = window.PASSWORD || '';
    if (!correctPassword) return;
    
    // 如果已经在当前 session 中通过验证，直接返回
    if (sessionStorage.getItem('authenticated')) return;

    document.addEventListener('DOMContentLoaded', function() {
        // 显示密码 modal
        var modal = document.getElementById('passwordModal');
        if (modal) {
            modal.style.display = 'flex';
        }
        
        var form = document.getElementById('passwordForm');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var inputVal = document.getElementById('passwordInput').value;
            var errorEl = document.getElementById('passwordError');
            if (inputVal === correctPassword) {
                sessionStorage.setItem('authenticated', 'true');
                modal.style.display = 'none';
            } else {
                errorEl.classList.remove('hidden');
            }
        });
    });
})();
