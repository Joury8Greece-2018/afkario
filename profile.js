// ========== البروفايل الكامل — نسخة نظيفة نهائية ==========
(function() {

  const AVATARS = ['☕', '💡', '🤝', '❤️', '🧠', '🔥', '🌟', '😎', '🎯', '🚀', '💎', '🎨'];

  // ============ 1. دالة عرض البروفايل ============
  function renderProfileFull() {
    const content = document.getElementById('me-content') || document.getElementById('profile-content');
    if (!content) return;

    const myName = localStorage.getItem('afkario_my_name') || '';
    const myAvatar = localStorage.getItem('afkario_my_avatar') || '';
    const myWhatsapp = localStorage.getItem('afkario_my_whatsapp') || '';
    const myEmail = localStorage.getItem('afkario_my_email') || '';
    const showWhatsapp = localStorage.getItem('afkario_my_show_wa') !== 'false';
    const showEmail = localStorage.getItem('afkario_my_show_email') !== 'false';
    const myBio = localStorage.getItem('afkario_my_bio') || '';
    const notifEnabled = localStorage.getItem('afkario_notif_enabled') !== 'false';

    const allIdeas = getIdeas().filter(i => i.status === 'published');
    const myIdeas = myName ? allIdeas.filter(i => i.author === myName) : [];

    const savedIds = JSON.parse(localStorage.getItem('afkario_saved_v1') || '[]');
    const mySavedCount = savedIds.length;

    const repostsData = JSON.parse(localStorage.getItem('afkario_reposts_v1') || '{}');
    let repostCount = 0;
    Object.values(repostsData).forEach(arr => {
      if (Array.isArray(arr) && arr.includes(myName)) repostCount++;
    });

    if (!myName) {
      content.innerHTML = `
        <div style="text-align:center; padding:60px 20px;">
          <div style="font-size:3rem; margin-bottom:16px;">👤</div>
          <h2 style="color:var(--text); font-size:1.2rem; font-weight:900; margin:0 0 10px;">لسه ما ضفتش فكرة</h2>
          <p style="color:var(--text-mid); font-size:0.9rem; margin:0 0 20px;">أضف فكرة واكتب اسمك عشان يظهر بروفايلك هنا</p>
          <button onclick="if(typeof closeProfile==='function')closeProfile(); if(typeof closeMe==='function')closeMe(); if(typeof openAdd==='function')openAdd();" style="background:linear-gradient(135deg, var(--blue), #2b6fd9); color:white; padding:14px 24px; border-radius:14px; font-size:1rem; font-weight:800; border:none; cursor:pointer;">💡 اكتب فكرتك</button>
        </div>
      `;
      return;
    }

    const initial = myAvatar || myName.charAt(0);

    let waHTML = '';
    if (myWhatsapp && showWhatsapp) {
      waHTML = '<a href="https://wa.me/' + myWhatsapp.replace(/\D/g,'') + '" target="_blank" style="display:inline-block; background:#25D366; color:white; padding:10px 20px; border-radius:12px; font-size:0.85rem; font-weight:700; text-decoration:none; margin:4px;">📲 واتساب</a>';
    }

    let emailHTML = '';
    if (myEmail && showEmail) {
      emailHTML = '<a href="mailto:' + myEmail + '" style="display:inline-block; background:var(--blue); color:white; padding:10px 20px; border-radius:12px; font-size:0.85rem; font-weight:700; text-decoration:none; margin:4px;">📧 إيميل</a>';
    }

    const bioHTML = myBio ? '<p style="color:var(--text-mid); font-size:0.9rem; margin:8px 0; text-align:center; padding:0 20px;">' + myBio + '</p>' : '';

    content.innerHTML = `
      <div style="text-align:center; padding:10px 0 20px;">
        <div style="width:90px; height:90px; border-radius:50%; background:linear-gradient(135deg, var(--blue), #2b6fd9); color:white; display:flex; align-items:center; justify-content:center; font-size:2.4rem; font-weight:900; margin:0 auto 14px;">${initial}</div>
        <h2 style="margin:0 0 6px; font-size:1.4rem; font-weight:900; color:var(--text);">${myName}</h2>
        <button onclick="openEditProfile()" style="background:var(--white); border:1.5px solid var(--border); color:var(--text); padding:6px 16px; border-radius:20px; font-size:0.8rem; font-weight:700; cursor:pointer; margin-top:4px;">✏️ تعديل</button>
        ${bioHTML}
        <div style="margin-top:10px;">
          ${waHTML}
          ${emailHTML}
        </div>
      </div>
      
      <div style="display:flex; gap:8px; margin:20px 0; background:var(--white); border-radius:14px; padding:14px; border:1px solid var(--border);">
        <div style="flex:1; text-align:center;">
          <div style="font-size:1.3rem; font-weight:900; color:var(--blue);">${myIdeas.length}</div>
          <div style="font-size:0.72rem; color:var(--text-mid); font-weight:700;">أفكار</div>
        </div>
        <div style="flex:1; text-align:center; border-right:1px solid var(--border); border-left:1px solid var(--border);">
          <div style="font-size:1.3rem; font-weight:900; color:var(--blue);">${mySavedCount}</div>
          <div style="font-size:0.72rem; color:var(--text-mid); font-weight:700;">محفوظة</div>
        </div>
        <div style="flex:1; text-align:center;">
          <div style="font-size:1.3rem; font-weight:900; color:var(--blue);">${repostCount}</div>
          <div style="font-size:0.72rem; color:var(--text-mid); font-weight:700;">إعادة نشر</div>
        </div>
      </div>
      
      <div style="background:var(--white); border-radius:14px; padding:14px 16px; border:1px solid var(--border); margin-bottom:20px; display:flex; align-items:center; justify-content:space-between;">
        <div>
          <div style="font-weight:800; color:var(--text); font-size:0.95rem;">🔔 الإشعارات</div>
          <div style="font-size:0.75rem; color:var(--text-mid); margin-top:2px;">${notifEnabled ? 'مفعّلة' : 'معطّلة'}</div>
        </div>
        <button id="notif-toggle" style="background:${notifEnabled ? 'var(--green)' : 'var(--bg-soft)'}; color:${notifEnabled ? 'white' : 'var(--text-mid)'}; padding:8px 18px; border-radius:20px; font-size:0.85rem; font-weight:800; border:none; cursor:pointer;">${notifEnabled ? 'ON' : 'OFF'}</button>
      </div>
      
      <h3 style="font-size:1rem; font-weight:800; color:var(--text); margin:20px 0 12px;">📝 أفكاري (${myIdeas.length})</h3>
      
      ${myIdeas.length ? `
        <div class="ideas-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px;">
          ${myIdeas.map(idea => `
            <div class="idea-card" data-id="${idea.id}">
              <h3>${idea.title}</h3>
              <p class="desc">${idea.desc}</p>
              <div class="meta">
                <span class="tag tag-need">${idea.needLabel}</span>
                <span class="tag tag-loc">📍 ${idea.governorate}</span>
              </div>
            </div>
          `).join('')}
        </div>
      ` : '<div style="text-align:center; padding:20px; color:var(--text-mid); font-size:0.9rem;">مفيش أفكار بإسمك</div>'}
    `;

    const notifBtn = document.getElementById('notif-toggle');
    if (notifBtn) {
      notifBtn.onclick = function() {
        const current = localStorage.getItem('afkario_notif_enabled') !== 'false';
        const newValue = !current;
        localStorage.setItem('afkario_notif_enabled', newValue ? 'true' : 'false');
        renderProfileFull();
        if (typeof toast === 'function') toast(newValue ? '🔔 الإشعارات مفعّلة' : '🔕 الإشعارات معطّلة');
      };
    }

    // ⭐ التحسينات بعد الرسم مباشرة
    setTimeout(function() {
      if (typeof enhanceIdeaCards === 'function') enhanceIdeaCards();
      if (typeof enhanceWithActionBar === 'function') enhanceWithActionBar();
      if (typeof enhanceWithReposts === 'function') enhanceWithReposts();
    }, 80);
  }

  // ============ 2. صفحة تعديل البروفايل ============
  function openEditProfilePage() {
    let page = document.getElementById('edit-profile-page');
    if (!page) {
      page = document.createElement('div');
      page.id = 'edit-profile-page';
      page.style.cssText = 'display:none; position:fixed; inset:0; background:var(--bg); z-index:200; overflow-y:auto; padding:20px 16px 130px;';
      document.body.appendChild(page);
    }

    const currentAvatar = localStorage.getItem('afkario_my_avatar') || '';
    const currentName = localStorage.getItem('afkario_my_name') || '';
    const currentWA = localStorage.getItem('afkario_my_whatsapp') || '';
    const currentEmail = localStorage.getItem('afkario_my_email') || '';
    const currentShowWA = localStorage.getItem('afkario_my_show_wa') !== 'false';
    const currentShowEmail = localStorage.getItem('afkario_my_show_email') !== 'false';
    const currentBio = localStorage.getItem('afkario_my_bio') || '';

    page.innerHTML = `
      <button onclick="closeEditProfile()" style="background:var(--white); border:1px solid var(--border); width:40px; height:40px; border-radius:50%; font-size:1.2rem; margin-bottom:20px; cursor:pointer;">←</button>
      <h1 style="font-size:1.3rem; font-weight:900; color:var(--text); margin:0 0 20px;">✏️ تعديل البروفايل</h1>

      <div style="margin-bottom:20px;">
        <label style="display:block; font-weight:800; color:var(--text); font-size:0.9rem; margin-bottom:10px;">📷 الصورة الرمزية</label>
        <div style="display:grid; grid-template-columns:repeat(6, 1fr); gap:8px;">
          ${AVATARS.map(emoji => `
            <button class="avatar-choice" data-emoji="${emoji}" style="background:${currentAvatar === emoji ? 'var(--blue)' : 'var(--white)'}; border:2px solid ${currentAvatar === emoji ? 'var(--blue)' : 'var(--border)'}; font-size:1.4rem; padding:10px 0; border-radius:12px; cursor:pointer;">${emoji}</button>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom:16px;">
        <label style="display:block; font-weight:800; color:var(--text); font-size:0.9rem; margin-bottom:6px;">📝 الاسم</label>
        <input type="text" id="ep-name" value="${currentName}" placeholder="اكتب اسمك" maxlength="40" style="width:100%; padding:13px 14px; border-radius:12px; border:1.5px solid var(--border); background:var(--white); font-family:inherit; font-size:1rem; color:var(--text); box-sizing:border-box;">
      </div>

      <div style="margin-bottom:16px;">
        <label style="display:block; font-weight:800; color:var(--text); font-size:0.9rem; margin-bottom:6px;">📱 رقم واتساب</label>
        <input type="tel" id="ep-wa" value="${currentWA}" placeholder="201xxxxxxxxx" maxlength="20" dir="ltr" style="width:100%; padding:13px 14px; border-radius:12px; border:1.5px solid var(--border); background:var(--white); font-family:inherit; font-size:1rem; color:var(--text); box-sizing:border-box; direction:ltr; text-align:left;">
        <label style="display:flex; align-items:center; gap:8px; font-size:0.82rem; color:var(--text-mid); margin-top:8px; cursor:pointer;">
          <input type="checkbox" id="ep-show-wa" ${currentShowWA ? 'checked' : ''} style="width:auto; transform:scale(1.2);">
          عرض الرقم للعامة
        </label>
      </div>

      <div style="margin-bottom:16px;">
        <label style="display:block; font-weight:800; color:var(--text); font-size:0.9rem; margin-bottom:6px;">📧 الإيميل</label>
        <input type="email" id="ep-email" value="${currentEmail}" placeholder="your@email.com" maxlength="80" dir="ltr" style="width:100%; padding:13px 14px; border-radius:12px; border:1.5px solid var(--border); background:var(--white); font-family:inherit; font-size:1rem; color:var(--text); box-sizing:border-box; direction:ltr; text-align:left;">
        <label style="display:flex; align-items:center; gap:8px; font-size:0.82rem; color:var(--text-mid); margin-top:8px; cursor:pointer;">
          <input type="checkbox" id="ep-show-email" ${currentShowEmail ? 'checked' : ''} style="width:auto; transform:scale(1.2);">
          عرض الإيميل للعامة
        </label>
      </div>

      <div style="margin-bottom:20px;">
        <label style="display:block; font-weight:800; color:var(--text); font-size:0.9rem; margin-bottom:6px;">💬 نبذة عنك</label>
        <textarea id="ep-bio" placeholder="اكتب جملة قصيرة عنك..." maxlength="140" style="width:100%; padding:13px 14px; border-radius:12px; border:1.5px solid var(--border); background:var(--white); font-family:inherit; font-size:1rem; color:var(--text); box-sizing:border-box; min-height:80px; resize:vertical;">${currentBio}</textarea>
      </div>

      <button id="ep-save" style="width:100%; background:linear-gradient(135deg, var(--blue), #2b6fd9); color:white; padding:16px; border-radius:14px; font-size:1rem; font-weight:800; border:none; cursor:pointer;">✅ حفظ التعديلات</button>
    `;

    let selectedAvatar = currentAvatar;
    document.querySelectorAll('.avatar-choice').forEach(btn => {
      btn.onclick = function() {
        selectedAvatar = btn.dataset.emoji;
        document.querySelectorAll('.avatar-choice').forEach(b => {
          b.style.background = 'var(--white)';
          b.style.borderColor = 'var(--border)';
        });
        btn.style.background = 'var(--blue)';
        btn.style.borderColor = 'var(--blue)';
      };
    });

    document.getElementById('ep-save').onclick = function() {
      const name = document.getElementById('ep-name').value.trim();
      const wa = document.getElementById('ep-wa').value.trim();
      const email = document.getElementById('ep-email').value.trim();
      const showWA = document.getElementById('ep-show-wa').checked;
      const showEmail = document.getElementById('ep-show-email').checked;
      const bio = document.getElementById('ep-bio').value.trim();

      if (name.length < 2) {
        if (typeof toast === 'function') toast('اكتب اسمك');
        return;
      }

      localStorage.setItem('afkario_my_avatar', selectedAvatar);
      localStorage.setItem('afkario_my_name', name);
      localStorage.setItem('afkario_my_whatsapp', wa);
      localStorage.setItem('afkario_my_email', email);
      localStorage.setItem('afkario_my_show_wa', showWA ? 'true' : 'false');
      localStorage.setItem('afkario_my_show_email', showEmail ? 'true' : 'false');
      localStorage.setItem('afkario_my_bio', bio);

      if (typeof toast === 'function') toast('✅ اتحفظت التعديلات');
      closeEditProfilePage();
      
      setTimeout(() => {
        renderProfileFull();
        const profilePage = document.getElementById('profile-page') || document.getElementById('me-page');
        if (profilePage) profilePage.style.display = 'block';
      }, 300);
    };

    page.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function closeEditProfilePage() {
    const page = document.getElementById('edit-profile-page');
    if (page) page.style.display = 'none';
    document.body.style.overflow = '';
  }

  // ============ 3. ربط الدوال بالـ window ============
  window.openEditProfile = openEditProfilePage;
  window.closeEditProfile = closeEditProfilePage;
  window.renderProfileFull = renderProfileFull;

})();

