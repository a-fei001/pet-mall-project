// 检查登录状态
function checkAuth() {
    const token = localStorage.getItem('token');
    const userProperty = localStorage.getItem('userProperty');
    
    if (!token || userProperty !== '1') {
        window.location.href = 'index.html';
    }
}

// 导航切换
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
        
        button.classList.add('active');
        const sectionId = button.getAttribute('data-section') + 'Section';
        document.getElementById(sectionId).classList.add('active');
    });
});

// 模态框控制
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        closeBtn.closest('.modal').style.display = 'none';
    });
});

// 加载状态控制
function showLoading(tableId) {
    const tbody = document.getElementById(tableId);
    tbody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align: center; padding: 20px;">
                加载中...
            </td>
        </tr>
    `;
}

// 加载宠物列表
async function loadPets() {
    showLoading('petsTableBody');
    try {
        const response = await fetch('http://localhost:8080/pet/all');
        const data = await response.json();
        
        if (data.success) {
            const tbody = document.getElementById('petsTableBody');
            const fragment = document.createDocumentFragment();
            
            data.data.forEach(pet => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${pet.id}</td>
                    <td>${pet.name}</td>
                    <td>
                        <div class="img-container">
                            <img src="${pet.image || 'images/default-pet.jpg'}" 
                                 alt="${pet.name}" 
                                 onerror="this.src='images/default-pet.jpg'; this.onerror=null;">
                        </div>
                    </td>
                    <td>${pet.age}</td>
                    <td>${pet.price}</td>
                    <td>${pet.description || '暂无描述'}</td>
                    <td>
                        <button class="action-btn edit-btn" onclick="editPet(${JSON.stringify(pet).replace(/"/g, '&quot;')})">编辑</button>
                        <button class="action-btn delete-btn" onclick="deletePet(${pet.id})">删除</button>
                    </td>
                `;
                fragment.appendChild(tr);
            });
            
            tbody.innerHTML = '';
            tbody.appendChild(fragment);
        }
    } catch (error) {
        console.error('加载宠物列表错误:', error);
        document.getElementById('petsTableBody').innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: red; padding: 20px;">
                    加载失败，请刷新页面重试
                </td>
            </tr>
        `;
    }
}

// 加载用户列表
async function loadUsers() {
    showLoading('usersTableBody');
    try {
        const response = await fetch('http://localhost:8080/user/all', {
            headers: {
                'token': localStorage.getItem('token')
            }
        });
        const data = await response.json();
        
        if (data.success) {
            const tbody = document.getElementById('usersTableBody');
            const fragment = document.createDocumentFragment();
            
            data.data.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.phone}</td>
                    <td>
                        <div class="img-container">
                            ${user.image ? 
                                `<img src="${user.image}" 
                                      alt="${user.name}" 
                                      onerror="this.src='images/default-avatar.jpg'; this.onerror=null;">` : 
                                `<img src="images/default-avatar.jpg" 
                                      alt="${user.name}">`
                            }
                        </div>
                    </td>
                    <td>${user.property === 0 ? '普通用户' : '管理员'}</td>
                    <td>
                        <button class="action-btn edit-btn" onclick="editUser(${JSON.stringify(user).replace(/"/g, '&quot;')})">编辑</button>
                        <button class="action-btn delete-btn" onclick="deleteUser(${user.id})">删除</button>
                    </td>
                `;
                fragment.appendChild(tr);
            });
            
            tbody.innerHTML = '';
            tbody.appendChild(fragment);
        }
    } catch (error) {
        console.error('加载用户列表错误:', error);
        document.getElementById('usersTableBody').innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: red; padding: 20px;">
                    加载失败，请刷新页面重试
                </td>
            </tr>
        `;
    }
}

// 宠物相关操作
document.getElementById('addPetBtn').addEventListener('click', () => {
    document.getElementById('petModalTitle').textContent = '添加宠物';
    document.getElementById('petForm').reset();
    document.getElementById('petId').value = '';
    showModal('petModal');
});

function editPet(pet) {
    document.getElementById('petModalTitle').textContent = '编辑宠物';
    document.getElementById('petId').value = pet.id;
    document.getElementById('petName').value = pet.name;
    document.getElementById('petImage').value = pet.image || '';
    document.getElementById('petAge').value = pet.age;
    document.getElementById('petPrice').value = pet.price;
    document.getElementById('petDescription').value = pet.description || '';
    showModal('petModal');
}

async function deletePet(id) {
    if (confirm('确定要删除这个宠物吗？')) {
        try {
            const response = await fetch(`http://localhost:8080/pet/${id}`, {
                method: 'DELETE',
                headers: {
                    'token': localStorage.getItem('token')
                }
            });
            const data = await response.json();
            
            if (data.success) {
                alert('删除成功');
                loadPets();
            } else {
                alert(data.message || '删除失败');
            }
        } catch (error) {
            console.error('删除宠物错误:', error);
            alert('删除失败');
        }
    }
}

document.getElementById('petForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const petId = document.getElementById('petId').value;
    const pet = {
        name: document.getElementById('petName').value,
        image: document.getElementById('petImage').value,
        age: parseInt(document.getElementById('petAge').value),
        price: parseFloat(document.getElementById('petPrice').value),
        description: document.getElementById('petDescription').value
    };

    try {
        const url = petId ? `http://localhost:8080/pet/${petId}` : 'http://localhost:8080/pet/add';
        const method = petId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token')
            },
            body: JSON.stringify(pet)
        });

        const data = await response.json();
        
        if (data.success) {
            alert(petId ? '更新成功' : '添加成功');
            hideModal('petModal');
            loadPets();
        } else {
            alert(data.message || (petId ? '更新失败' : '添加失败'));
        }
    } catch (error) {
        console.error('保存宠物错误:', error);
        alert('操作失败');
    }
});

// 用户相关操作
document.getElementById('addUserBtn').addEventListener('click', () => {
    // 重置表单
    const form = document.getElementById('userForm');
    form.reset();
    
    // 清空隐藏字段
    document.getElementById('userId').value = '';
    
    // 设置标题
    document.getElementById('userModalTitle').textContent = '添加用户';
    
    // 设置密码为必填
    const passwordInput = document.getElementById('userPassword');
    passwordInput.required = true;
    passwordInput.value = '';
    
    // 清空图片URL
    document.getElementById('userImage').value = '';
    
    // 重置用户类型为普通用户
    document.getElementById('userProperty').value = '0';
    
    // 显示模态框
    showModal('userModal');
});

function editUser(user) {
    console.log('Editing user:', user);
    
    // 重置表单
    const form = document.getElementById('userForm');
    form.reset();
    
    // 设置标题
    document.getElementById('userModalTitle').textContent = '编辑用户';
    
    // 填充表单数据
    document.getElementById('userId').value = user.id;
    document.getElementById('userFormName').value = user.name;
    document.getElementById('userPhone').value = user.phone;
    document.getElementById('userImage').value = user.image || '';
    document.getElementById('userProperty').value = user.property.toString();
    
    // 密码字段处理
    const passwordInput = document.getElementById('userPassword');
    passwordInput.value = '';
    passwordInput.required = false;
    
    // 显示模态框
    showModal('userModal');
}

async function deleteUser(id) {
    if (confirm('确定要删除这个用户吗？')) {
        try {
            const response = await fetch(`http://localhost:8080/user/${id}`, {
                method: 'DELETE',
                headers: {
                    'token': localStorage.getItem('token')
                }
            });
            const data = await response.json();
            
            if (data.success) {
                alert('删除成功');
                loadUsers();
            } else {
                alert(data.message || '删除失败');
            }
        } catch (error) {
            console.error('删除用户错误:', error);
            alert('删除失败');
        }
    }
}

document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userId = document.getElementById('userId').value;
    const user = {
        name: document.getElementById('userFormName').value.trim(),
        phone: document.getElementById('userPhone').value.trim(),
        property: parseInt(document.getElementById('userProperty').value)
    };

    // 只在有值时添加这些字段
    const password = document.getElementById('userPassword').value.trim();
    if (password) {
        user.password = password;
    }

    const image = document.getElementById('userImage').value.trim();
    if (image) {
        user.image = image;
    }

    try {
        const url = userId ? `http://localhost:8080/user/${userId}` : 'http://localhost:8080/user/register';
        const method = userId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token')
            },
            body: JSON.stringify(user)
        });

        const data = await response.json();
        
        if (data.success) {
            alert(userId ? '更新成功' : '添加成功');
            hideModal('userModal');
            loadUsers();
        } else {
            alert(data.message || (userId ? '更新失败' : '添加失败'));
        }
    } catch (error) {
        console.error('保存用户错误:', error);
        alert('操作失败，请稍后重试');
    }
});

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
    loadUsers();
}); 