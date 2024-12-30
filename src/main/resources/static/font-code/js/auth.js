// 切换表单显示
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        // 移除所有active类
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.form').forEach(form => form.classList.remove('active'));
        
        // 添加active类到当前按钮和对应表单
        button.classList.add('active');
        const formId = button.getAttribute('data-form') + 'Form';
        document.getElementById(formId).classList.add('active');
    });
});

// 登录表单提交
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const phone = document.getElementById('loginPhone').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:8080/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: phone,
                password: password
            })
        });

        const data = await response.json();
        
        if (data.success) {
            // 保存token到localStorage
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('userProperty', data.data.user.property);
            
            // 根据用户属性跳转到不同页面
            if (data.data.user.property === 0) {
                window.location.href = 'user.html'; // 普通用户页面
            } else {
                window.location.href = 'admin.html'; // 管理员页面
            }
        } else {
            alert(data.message || '登录失败');
        }
    } catch (error) {
        console.error('登录错误:', error);
        alert('登录失败，请稍后重试');
    }
});

// 注册表单提交
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch('http://localhost:8080/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                phone: phone,
                password: password,
                property: 0 // 默认注册为普通用户
            })
        });

        const data = await response.json();
        
        if (data.success) {
            alert('注册成功，请登录');
            // 切换到登录表单
            document.querySelector('[data-form="login"]').click();
        } else {
            alert(data.message || '注册失败');
        }
    } catch (error) {
        console.error('注册错误:', error);
        alert('注册失败，请稍后重试');
    }
}); 