// Load header từ js/header.html
async function loadHeader() {
    try {
        const response = await fetch('js/header.html');
        const text = await response.text();
        document.getElementById('header').innerHTML = text;
    } catch (e) { console.error("Lỗi load header"); }
}

// Load footer từ js/footer.html
async function loadFooter() {
    try {
        const response = await fetch('js/footer.html');
        const text = await response.text();
        document.getElementById('footer').innerHTML = text;
    } catch (e) { console.error("Lỗi load footer"); }
}

// Load nội dung JSON từ data/content.json
async function loadContentJSON() {
    try {
        const response = await fetch('data/content.json');
        const data = await response.json();
        return data;
    } catch (e) { console.error("Lỗi load nội dung JSON"); }
}

// Render trang chủ
async function renderTrangChu() {
    const data = await loadContentJSON();
    document.getElementById('content').innerHTML = `
        <div class="banner">
            <h1 style="position:absolute; bottom:30px; z-index:1;">Chào mừng đến với Viện Nghiên cứu và Đào tạo</h1>
        </div>
        <section style="padding:40px 20px; max-width:800px; margin:0 auto;">
            <h2 style="margin-bottom:20px;">Giới thiệu chung</h2>
            <p style="line-height:1.8;">${data.gioiThieu.description}</p>
        </section>
    `;
}

// Render Giới thiệu
async function renderGioiThieu() {
    const data = await loadContentJSON();
    document.getElementById('content').innerHTML = `
        <h1 style="text-align:center; margin:40px 0 20px;">Giới Thiệu</h1>
        <div style="max-width:800px; margin:0 auto; line-height:1.8; padding:20px;">${data.gioiThieu.description}</div>
    `;
}

// Render Cơ cấu Tổ chức
async function renderCoCauToChuc() {
    const data = await loadContentJSON();
    let content = '<h1 style="text-align:center; margin:40px 0 20px;">Cơ Cấu Tổ Chức</h1><div style="max-width:800px; margin:0 auto; line-height:1.8; padding:20px;"><ul style="list-style:none;">';
    data.coCauToChuc.forEach(department => {
        content += `<li style="margin-bottom:15px;"><strong style="color:var(--color-primary);">${department.name}</strong>: ${department.description}</li>`;
    });
    content += '</ul></div>';
    document.getElementById('content').innerHTML = content;
}

// Render Tin tức
async function renderTinTuc() {
    const data = await loadContentJSON();
    let newsList = '<h1 style="text-align:center; margin:40px 0 20px;">Tin Tức</h1><div class="news-list" style="display:flex; flex-wrap:wrap; gap:20px; justify-content:center; padding:20px;">';
    data.tinTuc.forEach(article => {
        newsList += `
            <div class="card" style="width:300px;">
                <img src="${article.image}" alt="${article.title}" style="width:100%; height:auto; border-radius:8px;">
                <div class="card-content">
                    <h3 style="color:var(--color-primary); margin-top:10px;">${article.title}</h3>
                    <p><small>Ngày đăng: ${article.date}</small></p>
                    <p style="font-size:0.9em; margin:10px 0;">${article.summary}</p>
                    <a href="?id=${article.id}" style="color:var(--color-accent); font-weight:bold;">Xem chi tiết</a>
                </div>
            </div>
        `;
    });
    newsList += '</div>';

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('id')) {
        const articleId = parseInt(urlParams.get('id'));
        const selectedArticle = data.tinTuc.find(article => article.id === articleId);
        if (selectedArticle) {
            newsList += `
                <div class="news-detail" style="max-width:800px; margin:40px auto; padding:30px; background:var(--color-bg-soft); border-radius:8px;">
                    <h2 style="text-align:left; margin-bottom:10px;">${selectedArticle.title}</h2>
                    <p><small>Ngày đăng: ${selectedArticle.date}</small></p>
                    <img src="${selectedArticle.image}" alt="${selectedArticle.title}" style="width:100%; height:auto; margin-bottom:20px; border-radius:8px;">
                    <div class="news-content" style="line-height:1.8;">${selectedArticle.content}</div>
                </div>
            `;
        } else {
            newsList += '<p style="text-align:center;">Bài viết không tồn tại.</p>';
        }
    }
    document.getElementById('content').innerHTML = newsList;
}

// Render Liên hệ
async function renderLienHe() {
    const data = await loadContentJSON();
    document.getElementById('content').innerHTML = `
        <h1 style="text-align:center; margin:40px 0 20px;">Liên Hệ</h1>
        <div class="contact-info" style="max-width:600px; margin:0 auto; line-height:2; padding:20px; border:1px solid #eee; border-radius:8px;">
            <p><strong style="color:var(--color-primary);">Địa chỉ:</strong> ${data.lienHe.address || 'Cập nhật sau'}</p>
            <p><strong style="color:var(--color-primary);">Số điện thoại:</strong> ${data.lienHe.phone || 'Cập nhật sau'}</p>
            <p><strong style="color:var(--color-primary);">Email:</strong> ${data.lienHe.email || 'Cập nhật sau'}</p>
            <p><strong style="color:var(--color-primary);">Giờ làm việc:</strong> ${data.lienHe.workingHours || 'Cập nhật sau'}</p>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadHeader();
    await loadFooter();
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html') await renderTrangChu();
    else if (path === '/gioi-thieu.html') await renderGioiThieu();
    else if (path === '/co-cau-to-chuc.html') await renderCoCauToChuc();
    else if (path === '/tin-tuc.html') await renderTinTuc();
    else if (path === '/lien-he.html') await renderLienHe();
});
``` Alvarado: js/main.js, path: vien_ncdt_website/js/main.js
