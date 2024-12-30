// 检查登录状态
function checkAuth() {
    const token = localStorage.getItem('token');
    const userProperty = localStorage.getItem('userProperty');
    
    if (!token || userProperty !== '0') {
        window.location.href = 'index.html';
    }
}

// 加载宠物列表
async function loadPets() {
    try {
        const response = await fetch('http://localhost:8080/pet/all');
        const data = await response.json();
        
        if (data.success) {
            const petsContainer = document.querySelector('.pets-container');
            petsContainer.innerHTML = ''; // 清空现有内容
            
            data.data.forEach(pet => {
                const petCard = document.createElement('div');
                petCard.className = 'pet-card';
                petCard.innerHTML = `
                    <img src="${pet.image || 'images/default-pet.jpg'}" alt="${pet.name}" class="pet-image">
                    <div class="pet-info">
                        <h3 class="pet-name">${pet.name}</h3>
                        <p class="pet-price">￥${pet.price}</p>
                        <p>年龄: ${pet.age}个月</p>
                        <p class="pet-description">${pet.description || '暂无描述'}</p>
                    </div>
                `;
                petsContainer.appendChild(petCard);
            });
        } else {
            alert('获取宠物列表失败');
        }
    } catch (error) {
        console.error('加载宠物列表错误:', error);
        alert('加载宠物列表失败，请稍后重试');
    }
}

// 退出登录
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userProperty');
    window.location.href = 'index.html';
});

// 页面加载时执行
window.addEventListener('load', () => {
    checkAuth();
    loadPets();
}); 