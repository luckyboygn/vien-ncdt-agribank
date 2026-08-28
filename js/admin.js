// Biến để lưu trữ thông tin đăng nhập (token, owner, repo)
let githubToken = '';
let repoOwner = '';
let repoName = '';

// Hàm xử lý đăng nhập
async function login() {
    const tokenInput = document.getElementById('github-token');
    const repoInput = document.getElementById('repo-name');
    
    githubToken = tokenInput.value.trim();
    const repoVal = repoInput.value.trim();
    
    if (!repoVal.includes('/')) {
        alert('Vui lòng nhập đúng định dạng Tên repo (username/reponame)');
        return;
    }
    
    const [owner, name] = repoVal.split('/');
    repoOwner = owner;
    repoName = name;

    if (!githubToken || !repoOwner || !repoName) {
        alert('Vui lòng nhập đầy đủ thông tin.');
        return;
    }

    try {
        await readContentJSON();
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        renderAdminPanel();
    } catch (error) {
        alert(`Đăng nhập thất bại: ${error.message}`);
    }
}

// Hàm đọc nội dung file content.json từ GitHub
async function readContentJSON() {
    const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/data/content.json`, {
        headers: {
            'Authorization': `Bearer ${githubToken}`
        }
    });

    if (!response.ok) {
        throw new Error('Không thể đọc file content.json hoặc token không hợp lệ.');
    }

    const data = await response.json();
    const decodedContent = atob(data.content);
    return JSON.parse(decodedContent);
}

// Hàm ghi nội dung mới vào file content.json trên GitHub
async function writeContentJSON(newContent) {
    const encodedContent = btoa(JSON.stringify(newContent, null, 2));
    const data = await readContentJSON();
    const sha = data.sha;

    const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/data/content.json`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Update content.json from admin panel',
            content: encodedContent,
            sha: sha
        })
    });

    if (!response.ok) {
        throw new Error('Không thể cập nhật file content.json hoặc không có quyền.');
    }

    alert('Đã lưu, GitHub Pages sẽ cập nhật trong khoảng 1 phút');
}

// Hàm render tab quản trị
async function renderAdminPanel() {
    const adminPanel = document.getElementById('admin-panel');

    const newsTab = `
        <div class="tab" data-tab="news">
            <h2 style="text-align:left; margin-bottom:20px;">Quản lý Tin tức</h2>
            <button onclick="saveNewsChanges()" style="margin-bottom:20px;">Lưu tất cả thay đổi tin tức</button>
            <ul id="news-list" style="margin-bottom:30px; list-style:none;"></ul>
            <form id="news-form" style="background:var(--color-bg-soft); padding:20px; border-radius:8px;">
                <h3>Thêm bài viết mới</h3>
                <input type="text" id="news-title" placeholder="Tiêu đề" required style="width:100%; margin-bottom:10px; padding:8px;"><br>
                <input type="date" id="news-date" required style="width:100%; margin-bottom:10px; padding:8px;"><br>
                <input type="text" id="news-image" placeholder="URL ảnh đại diện" required style="width:100%; margin-bottom:10px; padding:8px;"><br>
                <textarea id="news-summary" placeholder="Tóm tắt" required style="width:100%; margin-bottom:10px; padding:8px; height:80px;"></textarea><br>
                <textarea id="news-content" placeholder="Nội dung đầy đủ" required style="width:100%; margin-bottom:10px; padding:8px; height:200px;"></textarea><br>
                <button type="submit">Thêm bài viết</button>
            </form>
        </div>
    `;

    const orgTab = `
        <div class="tab" data-tab="org">
            <h2 style="text-align:left; margin-bottom:20px;">Cơ cấu tổ chức</h2>
            <button onclick="saveOrgChanges()" style="margin-bottom:20px;">Lưu tất cả thay đổi cơ cấu</button>
            <ul id="org-list" style="margin-bottom:30px; list-style:none;"></ul>
            <form id="org-form" style="background:var(--color-bg-soft); padding:20px; border-radius:8px;">
                <h3>Thêm phòng ban</h3>
                <input type="text" id="org-name" placeholder="Tên phòng" required style="width:100%; margin-bottom:10px; padding:8px;"><br>
                <textarea id="org-description" placeholder="Mô tả" required style="width:100%; margin-bottom:10px; padding:8px; height:80px;"></textarea><br>
                <button type="submit">Thêm phòng ban</button>
            </form>
        </div>
    `;

    const contactTab = `
        <div class="tab" data-tab="contact">
            <h2 style="text-align:left; margin-bottom:20px;">Thông tin Liên hệ</h2>
            <button onclick="saveContactChanges()" style="margin-bottom:20px;">Lưu thay đổi liên hệ</button>
            <form id="contact-form" style="background:var(--color-bg-soft); padding:20px; border-radius:8px;">
                <p>Địa chỉ: <input type="text" id="contact-address" style="width:100%; padding:8px; margin-bottom:10px;"></p>
                <p>Số điện thoại: <input type="text" id="contact-phone" style="width:100%; padding:8px; margin-bottom:10px;"></p>
                <p>Email: <input type="email" id="contact-email" style="width:100%; padding:8px; margin-bottom:10px;"></p>
                <p>Giờ làm việc: <input type="text" id="contact-hours" style="width:100%; padding:8px; margin-bottom:10px;"></p>
            </form>
        </div>
    `;

    adminPanel.innerHTML = `
        <nav style="margin-bottom:30px; border-bottom:1px solid #ddd; padding-bottom:10px;">
            <button onclick="showTab('news')">Tin tức</button>
            <button onclick="showTab('org')">Cơ cấu tổ chức</button>
            <button onclick="showTab('contact')">Liên hệ</button>
        </nav>
        ${newsTab}
        ${orgTab}
        ${contactTab}
    `;

    showTab('news');
    renderNews();
    renderOrg();
    renderContact();
}

function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });
    const selectedTab = document.querySelector(`.tab[data-tab="${tabName}"]`);
    if (selectedTab) {
        selectedTab.style.display = 'block';
    }
}

async function renderNews() {
    const content = await readContentJSON();
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = '';
    
    content.tinTuc.forEach(article => {
        const li = document.createElement('li');
        li.style.marginBottom = "15px";
        li.innerHTML = `
            <strong style="display:block; font-size:1.2em;">${article.title}</strong> - <small>${article.date}</small><br>
            <button onclick="editNews(${article.id})" style="margin-top:5px; padding:5px 10px;">Sửa</button>
            <button onclick="deleteNews(${article.id})" style="margin-top:5px; padding:5px 10px; background:red;">Xóa</button>
        `;
        newsList.appendChild(li);
    });

    const newsForm = document.getElementById('news-form');
    newsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('news-title').value;
        const date = document.getElementById('news-date').value;
        const image = document.getElementById('news-image').value;
        const summary = document.getElementById('news-summary').value;
        const fullContent = document.getElementById('news-content').value;

        const newId = Math.max(...content.tinTuc.map(article => article.id), 0) + 1;

        content.tinTuc.push({
            id: newId,
            title: title,
            date: date,
            image: image,
            summary: summary,
            content: fullContent
        });

        await writeContentJSON(content);
        renderNews();
    });
}

async function editNews(id) {
    const content = await readContentJSON();
    const article = content.tinTuc.find(a => a.id === id);
    if (article) {
        document.getElementById('news-title').value = article.title;
        document.getElementById('news-date').value = article.date;
        document.getElementById('news-image').value = article.image;
        document.getElementById('news-summary').value = article.summary;
        document.getElementById('news-content').value = article.content;
        
        // Focus the form
        document.getElementById('news-form').scrollIntoView({behavior: 'smooth'});
    }
}

async function deleteNews(id) {
    if (!confirm('Xóa bài viết này?')) return;
    const content = await readContentJSON();
    content.tinTuc = content.tinTuc.filter(a => a.id !== id);
    await writeContentJSON(content);
    renderNews();
}

async function saveNewsChanges() {
    try {
        const content = await readContentJSON();
        await writeContentJSON(content);
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

async function renderOrg() {
    const content = await readContentJSON();
    const orgList = document.getElementById('org-list');
    orgList.innerHTML = '';

    content.coCauToChuc.forEach((dept, index) => {
        const li = document.createElement('li');
        li.style.marginBottom = "15px";
        li.innerHTML = `
            <strong style="display:block; font-size:1.2em;">${dept.name}</strong>: ${dept.description}<br>
            <button onclick="editOrg(${index})" style="margin-top:5px; padding:5px 10px;">Sửa</button>
            <button onclick="deleteOrg(${index})" style="margin-top:5px; padding:5px 10px; background:red;">Xóa</button>
        `;
        orgList.appendChild(li);
    });

    const orgForm = document.getElementById('org-form');
    orgForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        content.coCauToChuc.push({
            name: document.getElementById('org-name').value,
            description: document.getElementById('org-description').value
        });
        await writeContentJSON(content);
        renderOrg();
    });
}

async function editOrg(index) {
    const content = await readContentJSON();
    const dept = content.coCauToChuc[index];
    if (dept) {
        document.getElementById('org-name').value = dept.name;
        document.getElementById('org-description').value = dept.description;
        document.getElementById('org-form').scrollIntoView({behavior: 'smooth'});
    }
}

async function deleteOrg(index) {
    if (!confirm('Xóa phòng ban này?')) return;
    const content = await readContentJSON();
    content.coCauToChuc.splice(index, 1);
    await writeContentJSON(content);
    renderOrg();
}

async function saveOrgChanges() {
    try {
        const content = await readContentJSON();
        await writeContentJSON(content);
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

async function renderContact() {
    const content = await readContentJSON();
    document.getElementById('contact-address').value = content.lienHe.address || '';
    document.getElementById('contact-phone').value = content.lienHe.phone || '';
    document.getElementById('contact-email').value = content.lienHe.email || '';
    document.getElementById('contact-hours').value = content.lienHe.workingHours || '';

    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        content.lienHe.address = document.getElementById('contact-address').value;
        content.lienHe.phone = document.getElementById('contact-phone').value;
        content.lienHe.email = document.getElementById('contact-email').value;
        content.lienHe.workingHours = document.getElementById('contact-hours').value;
        await writeContentJSON(content);
        alert('Đã cập nhật thông tin liên hệ');
    });
}

async function saveContactChanges() {
    try {
        const content = await readContentJSON();
        await writeContentJSON(content);
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}
``` Alvarado: js/admin.js, path: vien_ncdt_website/js/admin.js
