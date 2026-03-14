/* ========================================================
   E.S.T — Main Application & Admin CMS  v4
   All content fully editable via admin panel.
   Tag-driven statistics, configurable logos.
   ======================================================== */
(function () {
    'use strict';

    let data = getSiteData();
    let isAdmin = false;
    let platformChart = null;
    let engagementChart = null;

    // ---- Utility ----
    function uid() { return 'id_' + Math.random().toString(36).slice(2, 10); }

    function toast(msg, type = 'success') {
        const t = document.createElement('div');
        t.className = 'toast ' + type;
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 3000);
    }

    function escHtml(str) {
        if (!str) return '';
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    // ---- Backwards-compat: ensure settings have logo fields ----
    function ensureSettings() {
        if (!data.settings) data.settings = {};
        if (!data.settings.topBarLogo) data.settings.topBarLogo = 'EST.png';
        if (!data.settings.heroLogo) data.settings.heroLogo = 'EST.png';
        if (!data.settings.topBarRightLogo) data.settings.topBarRightLogo = 'O3.png';
    }

    // ---- Backwards-compat: ensure previousProjects have tags ----
    function ensurePrevProjectTags() {
        (data.previousProjects || []).forEach(p => {
            if (!p.tags) p.tags = [];
        });
    }

    // ---- Compute tag frequency from all projects (current + previous) ----
    function computeTagStats() {
        const tagCounts = {};
        const allProjects = (data.projects || []).concat(data.previousProjects || []);
        allProjects.forEach(p => {
            (p.tags || []).forEach(tag => {
                const t = tag.trim();
                if (t) tagCounts[t] = (tagCounts[t] || 0) + 1;
            });
        });
        // Sort by count descending
        const sorted = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
        const result = {};
        sorted.forEach(([tag, count]) => { result[tag] = count; });
        return result;
    }

    // ================================================================
    //  MATRIX RAIN
    // ================================================================
    function initMatrixRain() {
        const canvas = document.getElementById('matrix-rain');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        resize();
        window.addEventListener('resize', resize);
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = Array.from({ length: columns }, () => Math.random() * -100);
        const chars = '01\u30A2\u30A4\u30A6\u30A8\u30AA\u30AB\u30AD\u30AF\u30B1\u30B3\u30B5\u30B7\u30B9\u30BB\u30BD\u30BF\u30C1\u30C4\u30C6\u30C8\u30CA\u30CB\u30CC\u30CD\u30CE\u30CF\u30D2\u30D5\u30D8\u30DB\u30DE\u30DF\u30E0\u30E1\u30E2\u30E4\u30E6\u30E8\u30E9\u30EA\u30EB\u30EC\u30ED\u30EF\u30F2\u30F3';
        function draw() {
            ctx.fillStyle = 'rgba(6, 10, 16, 0.06)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = fontSize + 'px monospace';
            for (let i = 0; i < drops.length; i++) {
                if (i % 7 !== 0) continue;
                const char = chars[Math.floor(Math.random() * chars.length)];
                const x = i * fontSize, y = drops[i] * fontSize;
                ctx.fillStyle = `rgba(0, 255, 102, ${0.15 + Math.random() * 0.1})`;
                ctx.fillText(char, x, y);
                if (Math.random() > 0.95) { ctx.fillStyle = 'rgba(0, 255, 102, 0.5)'; ctx.fillText(char, x, y); }
                if (y > canvas.height && Math.random() > 0.98) drops[i] = 0;
                drops[i] += 0.4 + Math.random() * 0.3;
            }
            requestAnimationFrame(draw);
        }
        draw();
    }

    // ================================================================
    //  FLOATING PARTICLES
    // ================================================================
    function initParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        resize();
        window.addEventListener('resize', resize);
        const particles = Array.from({ length: 40 }, () => ({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 2 + 0.5, alpha: Math.random() * 0.3 + 0.05
        }));
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 229, 255, ${p.alpha})`; ctx.fill();
            });
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 229, 255, ${0.06 * (1 - dist / 150)})`; ctx.lineWidth = 0.5; ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(draw);
        }
        draw();
    }

    // ================================================================
    //  CURSOR GLOW + TYPEWRITER + SCROLL EFFECTS + COUNTERS
    // ================================================================
    function initCursorGlow() {
        const glow = document.getElementById('cursor-glow');
        if (!glow) return;
        let mx = 0, my = 0, cx = 0, cy = 0;
        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
        (function animate() { cx += (mx - cx) * 0.08; cy += (my - cy) * 0.08; glow.style.left = cx + 'px'; glow.style.top = cy + 'px'; requestAnimationFrame(animate); })();
    }

    function initTypewriter() {
        const el = document.getElementById('typewriter-text');
        if (!el) return;
        const phrases = ['initialising vulnerability scanner...','loading exploit frameworks...','connecting to target environment...','reverse engineering binary...','analysing attack surface...','scanning for zero-days...','decompiling APK payload...','mapping network topology...'];
        let pi = 0, ci = 0, del = false;
        (function type() {
            const cur = phrases[pi];
            if (del) { el.textContent = cur.substring(0, ci - 1); ci--; if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(type, 500); return; } setTimeout(type, 30); }
            else { el.textContent = cur.substring(0, ci + 1); ci++; if (ci === cur.length) { del = true; setTimeout(type, 2500); return; } setTimeout(type, 60 + Math.random() * 40); }
        })();
    }

    function initScrollEffects() {
        const sections = document.querySelectorAll('.section');
        sections.forEach(s => { s.style.opacity = '0'; s.style.transform = 'translateY(40px)'; s.style.transition = 'opacity 0.7s ease, transform 0.7s ease'; });
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; e.target.classList.add('revealed'); obs.unobserve(e.target); } });
        }, { threshold: 0.08 });
        sections.forEach(s => obs.observe(s));
        const nav = document.querySelector('.top-bar');
        window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 80); }, { passive: true });
    }

    function animateCounters() {
        const counters = document.querySelectorAll('.stat-value');
        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target, text = el.textContent, m = text.match(/(\d+)/);
                if (!m) return;
                const target = parseInt(m[1]), suffix = text.replace(/\d+/, '');
                let cur = 0; const inc = Math.ceil(target / 60);
                const timer = setInterval(() => { cur += inc; if (cur >= target) { cur = target; clearInterval(timer); } el.textContent = cur + suffix; }, 25);
                obs.unobserve(el);
            });
        }, { threshold: 0.5 });
        counters.forEach(c => obs.observe(c));
    }

    // ================================================================
    //  RENDER FUNCTIONS
    // ================================================================
    function renderSectionTitles() {
        document.querySelectorAll('[data-title-key]').forEach(el => {
            const key = el.dataset.titleKey;
            if (data.sectionTitles && data.sectionTitles[key]) el.textContent = data.sectionTitles[key];
        });
    }

    function getLogoSrc(key) {
        // Check for uploaded base64 logo first, then fall back to filename
        const uploaded = localStorage.getItem('esector_logo_' + key);
        if (uploaded) return uploaded;
        ensureSettings();
        return data.settings[key] || 'EST.png';
    }

    function renderHero() {
        ensureSettings();
        const h = data.hero || {};
        const subEl = document.getElementById('hero-subtitle');
        const tagsEl = document.getElementById('hero-tags');
        document.title = data.settings.pageTitle || 'E.S.T — Engineering Support Troop';
        if (subEl) subEl.textContent = h.subtitle || '';
        if (tagsEl) tagsEl.innerHTML = (h.tags || []).map((t, i) => `<span class="tag" style="--delay:${i}">${escHtml(t)}</span>`).join('');
        // Update logo sources from settings (supports uploaded base64 logos)
        const topLogo = document.getElementById('top-bar-logo');
        if (topLogo) topLogo.src = getLogoSrc('topBarLogo');
        const heroLogo = document.getElementById('hero-logo-img');
        if (heroLogo) heroLogo.src = getLogoSrc('heroLogo');
        const rightLogo = document.getElementById('top-bar-right-logo');
        if (rightLogo) rightLogo.src = getLogoSrc('topBarRightLogo');
        const favicon = document.getElementById('favicon-link');
        if (favicon) favicon.href = getLogoSrc('topBarLogo');
    }

    function renderWhoWeAre() {
        const el = document.getElementById('who-we-are-text');
        if (el && data.whoWeAre) el.textContent = data.whoWeAre.paragraph || '';
    }

    function renderServices() {
        const grid = document.getElementById('services-grid');
        if (!grid || !data.services) return;
        grid.innerHTML = data.services.map(s => `<div class="about-card"><div class="about-icon">${s.icon}</div><h3>${escHtml(s.title)}</h3><p>${escHtml(s.description)}</p></div>`).join('');
    }

    function leaderCardHtml(l) {
        return `<div class="leader-card-wrapper"><div class="leader-card">
            <div class="leader-avatar" style="background:${l.color}">${escHtml(l.initials)}</div>
            <h4>${escHtml(l.name)}</h4><div class="role">${escHtml(l.role)}</div>
            <div class="leader-contact">
                <div class="leader-contact-item"><span class="leader-contact-icon">&#128222;</span><span>${escHtml(l.phone || '')}</span></div>
                <div class="leader-contact-item"><span class="leader-contact-icon">&#9993;</span><span>${escHtml(l.email || '')}</span></div>
            </div></div></div>`;
    }

    // Assign default tier/order to leaders migrated from older data
    function ensureLeaderTiers() {
        data.leadership.forEach((l, i) => {
            if (!l.tier) {
                const r = (l.role || '').toLowerCase();
                if (r.includes('tech lead')) l.tier = 'bottom';
                else if (r.includes('project manager') || r.includes('pm')) l.tier = 'middle';
                else l.tier = 'top';
            }
            if (l.order === undefined || l.order === null) l.order = i;
        });
    }

    function renderLeadership() { /* Leadership section removed — org chart shows all leaders */ }

    function leaderOrgNodeHtml(l, nodeClass) {
        let details = '';
        if (l.phone) details += `<div class="org-detail">&#128222; ${escHtml(l.phone)}</div>`;
        if (l.email) details += `<div class="org-detail">&#9993; ${escHtml(l.email)}</div>`;
        if (l.workId) details += `<div class="org-detail">&#128196; ${escHtml(l.workId)}</div>`;
        return `<div class="org-node leadership ${nodeClass}" style="border-color:${l.color || 'rgba(0,229,255,0.5)'}"><div class="org-name">${escHtml(l.name)}</div><div class="org-role" style="color:${l.color || 'var(--accent)'}">${escHtml(l.role)}</div>${details ? '<div class="org-details">' + details + '</div>' : ''}</div>`;
    }

    function renderOrgChart() {
        ensureLeaderTiers();
        const chart = document.getElementById('org-chart');
        let html = '';
        const sortByOrder = (a, b) => (a.order ?? 99) - (b.order ?? 99);
        const topTier = data.leadership.filter(l => l.tier === 'top').sort(sortByOrder);
        const midTier = data.leadership.filter(l => l.tier === 'middle').sort(sortByOrder);
        const tls = data.leadership.filter(l => l.tier === 'bottom').sort(sortByOrder);
        if (topTier.length) {
            html += '<div class="org-label">Sector Leads</div><div class="org-level org-top-level">';
            topTier.forEach(l => { html += leaderOrgNodeHtml(l, 'org-node-lead'); });
            html += '</div><div class="org-branch-line"></div>';
        }
        if (midTier.length) {
            html += '<div class="org-label">Project Management</div><div class="org-level">';
            midTier.forEach(l => { html += leaderOrgNodeHtml(l, 'org-node-lead'); });
            html += '</div><div class="org-branch-line"></div>';
        }
        if (tls.length) {
            html += '<div class="org-label">Tech Leads</div><div class="org-level">';
            tls.forEach(l => { html += leaderOrgNodeHtml(l, 'org-node-tech'); });
            html += '</div><div class="org-branch-line"></div>';
        }
        if (data.orgGroups && data.orgGroups.length) {
            html += '<div class="org-label">Team Resources</div><div class="org-level org-groups-level">';
            data.orgGroups.forEach(g => {
                const tc = g.type === 'staff' ? '' : g.type === 'military' ? 'military' : g.type === 'contractor' ? 'contractor' : 'partner';
                html += `<div class="org-node org-group-card ${tc}">`;
                if (g.image) html += `<img src="${escHtml(g.image)}" alt="${escHtml(g.label)}" class="org-group-img">`;
                else html += `<div class="org-group-icon">${g.icon}</div>`;
                html += `<div class="org-group-count">${g.count}</div><div class="org-name">${escHtml(g.label)}</div></div>`;
            });
            html += '</div>';
        }
        chart.innerHTML = html;
    }

    function renderFrontDoor() {
        const fd = data.frontDoor || {};
        const t = document.getElementById('front-door-title');
        const d = document.getElementById('front-door-desc');
        const s = document.getElementById('front-door-steps');
        if (t) t.textContent = fd.title || '';
        if (d) d.textContent = fd.description || '';
        if (s) s.innerHTML = (fd.steps || []).map((st, i) => `<div class="step"><div class="step-num">${i + 1}</div><p>${escHtml(st)}</p></div>`).join('');
        const emailBtn = document.getElementById('front-door-email-btn');
        const portalBtn = document.getElementById('front-door-portal-btn');
        const email = data.settings.frontDoorEmail;
        const emailSubject = encodeURIComponent(data.settings.frontDoorEmailSubject || 'VRED Service Request - [Project Name]');
        const emailBody = encodeURIComponent(data.settings.frontDoorEmailBody || 'Hi E Sector Team,\n\nI would like to request your services.');
        emailBtn.href = `mailto:${email}?subject=${emailSubject}&body=${emailBody}`;
        const portalUrl = data.settings.frontDoorPortalUrl || '#';
        portalBtn.href = portalUrl;
        portalBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const icon = document.querySelector('.front-door-icon');
            if (icon) {
                icon.classList.remove('opening');
                void icon.offsetWidth;
                icon.classList.add('opening');
                icon.addEventListener('animationend', function handler() {
                    icon.removeEventListener('animationend', handler);
                    if (portalUrl && portalUrl !== '#') window.open(portalUrl, '_blank');
                    setTimeout(() => icon.classList.remove('opening'), 300);
                });
            } else if (portalUrl && portalUrl !== '#') {
                window.open(portalUrl, '_blank');
            }
        });
    }

    function renderWhereWeSit() {
        const chain = document.getElementById('where-we-sit-chain');
        if (!chain) return;
        const items = data.whereWeSit || [];
        let html = '';
        items.forEach((item, i) => {
            const isLast = i === items.length - 1;
            const cls = i === 0 ? 'org-chain-node org-chain-node-top' : isLast ? 'org-chain-node org-chain-node-current' : 'org-chain-node';
            html += `<div class="${cls}">`;
            if (item.image) html += `<img src="${escHtml(item.image)}" alt="${escHtml(item.label)}" class="org-chain-img" onerror="this.style.display='none'">`;
            html += `<span class="org-chain-label">${escHtml(item.label)}</span>`;
            if (isLast) html += `<span class="org-chain-badge">${escHtml(data.settings.youAreHereBadge || 'You are here')}</span>`;
            html += '</div>';
            if (!isLast) html += '<div class="org-chain-connector"><div class="org-chain-line"></div><div class="org-chain-arrow">&#9654;</div></div>';
        });
        chain.innerHTML = html;
    }

    function renderProjects() {
        document.getElementById('projects-grid').innerHTML = data.projects.map(p => {
            const sc = p.status === 'active' ? 'status-active' : p.status === 'planning' ? 'status-planning' : 'status-review';
            return `<div class="project-card"><span class="project-status ${sc}">${escHtml(p.status)}</span><h4>${escHtml(p.name)}</h4><p>${escHtml(p.description)}</p><div class="project-tags">${(p.tags || []).map(t => `<span class="project-tag">${escHtml(t)}</span>`).join('')}</div></div>`;
        }).join('');
    }

    function renderSuccesses() {
        const grid = document.getElementById('successes-grid');
        grid.innerHTML = data.successes.map((s, i) => `<div class="success-card" data-index="${i}"><div class="success-date">${escHtml(s.date)}</div><h4>${escHtml(s.title)}</h4><p>${escHtml(s.summary)}</p></div>`).join('');
        grid.querySelectorAll('.success-card').forEach(card => {
            card.addEventListener('click', function () {
                const s = data.successes[parseInt(this.dataset.index)];
                if (!s) return;
                document.getElementById('modal-title').textContent = s.title;
                document.getElementById('modal-meta').textContent = s.date;
                document.getElementById('modal-body').innerHTML = s.fullArticle;
                document.getElementById('success-modal').classList.add('visible');
            });
        });
    }

    function renderPrevProjects() {
        ensurePrevProjectTags();
        document.getElementById('prev-projects-list').innerHTML = data.previousProjects.map(p => {
            const tagsHtml = (p.tags || []).length ? `<div class="project-tags" style="margin-top:6px">${p.tags.map(t => `<span class="project-tag">${escHtml(t)}</span>`).join('')}</div>` : '';
            return `<a class="prev-project-item" href="${escHtml(p.link)}" target="_blank" rel="noopener"><div class="prev-project-info"><h4>${escHtml(p.name)}</h4><p>${escHtml(p.description)}</p>${tagsHtml}</div><span class="prev-project-arrow">&#8594;</span></a>`;
        }).join('');
    }

    function renderStats() {
        document.getElementById('stats-counters').innerHTML = data.stats.counters.map(c => `<div class="stat-counter"><div class="stat-value">${escHtml(c.value)}</div><div class="stat-label">${escHtml(c.label)}</div></div>`).join('');
        renderCharts();
        setTimeout(animateCounters, 100);
    }

    function renderCharts() {
        const cols = ['#00e5ff','#7c4dff','#00e676','#ffab00','#ff5252','#448aff','#69f0ae','#ff6e40','#40c4ff','#b388ff','#ea80fc','#84ffff','#ccff90','#ffd180'];
        const tagStats = computeTagStats();
        const tagLabels = Object.keys(tagStats);
        const tagValues = Object.values(tagStats);

        // Doughnut chart — tag distribution
        if (platformChart) platformChart.destroy();
        const p = document.getElementById('platform-chart');
        if (p && tagLabels.length) {
            platformChart = new Chart(p.getContext('2d'), {
                type: 'doughnut',
                data: { labels: tagLabels, datasets: [{ data: tagValues, backgroundColor: cols.slice(0, tagLabels.length), borderColor: '#0e1420', borderWidth: 3 }] },
                options: { responsive: true, animation: { animateScale: true, duration: 1200 }, plugins: { legend: { position: 'bottom', labels: { color: '#8892a4', padding: 16, font: { size: 12 }, usePointStyle: true, pointStyle: 'circle' } } } }
            });
        }

        // Bar chart — same tag data as horizontal bar
        if (engagementChart) engagementChart.destroy();
        const e = document.getElementById('engagement-chart');
        if (e && tagLabels.length) {
            engagementChart = new Chart(e.getContext('2d'), {
                type: 'bar',
                data: { labels: tagLabels, datasets: [{ data: tagValues, backgroundColor: cols.slice(0, tagLabels.length), borderRadius: 8, borderSkipped: false }] },
                options: { responsive: true, indexAxis: 'y', animation: { duration: 1200 }, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#5a6478' }, grid: { color: 'rgba(30,42,62,0.5)' } }, y: { ticks: { color: '#8892a4', font: { size: 11 } }, grid: { display: false } } } }
            });
        }
    }

    function renderLinks() {
        document.getElementById('links-grid').innerHTML = data.links.map(l => `<a class="link-card" href="${escHtml(l.url)}" target="_blank" rel="noopener"><div class="link-icon">${l.icon}</div><h4>${escHtml(l.name)}</h4><p>${escHtml(l.description)}</p></a>`).join('');
    }

    function renderFooter() {
        document.getElementById('footer-year').textContent = new Date().getFullYear();
        const ft = document.getElementById('footer-text');
        if (ft && data.footer) ft.textContent = data.footer.text || '';
    }

    function renderAll() {
        data = getSiteData();
        ensureSettings();
        ensurePrevProjectTags();
        renderSectionTitles(); renderHero(); renderWhoWeAre(); renderServices();
        renderLeadership(); renderOrgChart(); renderFrontDoor(); renderWhereWeSit();
        renderProjects(); renderSuccesses(); renderPrevProjects();
        renderStats(); renderLinks(); renderFooter();
    }

    // ================ MODAL ================
    document.getElementById('modal-close').addEventListener('click', () => document.getElementById('success-modal').classList.remove('visible'));
    document.getElementById('success-modal').addEventListener('click', function (e) { if (e.target === this) this.classList.remove('visible'); });

    // ================ MOBILE MENU ================
    document.getElementById('mobile-menu-btn').addEventListener('click', () => document.querySelector('.nav-links').classList.toggle('open'));

    // ================ ADMIN LOGIN ================
    const loginModal = document.getElementById('admin-login-modal');
    document.getElementById('admin-login-btn').addEventListener('click', e => { e.preventDefault(); isAdmin ? showAdminPanel() : loginModal.classList.add('visible'); });
    document.getElementById('admin-login-close').addEventListener('click', () => { loginModal.classList.remove('visible'); document.getElementById('login-error').textContent = ''; });
    document.getElementById('admin-login-form').addEventListener('submit', function (e) {
        e.preventDefault();
        if (document.getElementById('admin-user').value === data.settings.adminUser && document.getElementById('admin-pass').value === data.settings.adminPass) {
            isAdmin = true; loginModal.classList.remove('visible'); document.getElementById('login-error').textContent = ''; this.reset(); showAdminPanel();
        } else { document.getElementById('login-error').textContent = 'Invalid credentials.'; }
    });

    // ================ ADMIN PANEL ================
    function showAdminPanel() {
        document.getElementById('admin-panel').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        renderAdminSiteContent(); renderAdminServices(); renderAdminLeadership();
        renderAdminProjects(); renderAdminSuccesses(); renderAdminPrevProjects();
        renderAdminOrgGroups(); renderAdminWhereWeSit(); renderAdminStats(); renderAdminLinks(); renderAdminSettings();
    }
    function hideAdminPanel() { document.getElementById('admin-panel').classList.add('hidden'); document.body.style.overflow = ''; renderAll(); }
    document.getElementById('admin-logout-btn').addEventListener('click', () => { isAdmin = false; hideAdminPanel(); toast('Logged out'); });
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(this.dataset.tab).classList.add('active');
        });
    });

    // ================================================================
    //  ADMIN: SITE CONTENT
    // ================================================================
    function renderAdminSiteContent() {
        const c = document.getElementById('admin-site-content-form');
        const h = data.hero || {}, w = data.whoWeAre || {}, fd = data.frontDoor || {}, st = data.sectionTitles || {}, ft = data.footer || {};
        let html = '<h4 style="margin-bottom:12px;color:var(--accent)">Hero Banner</h4>';
        html += `<div class="form-group"><label>Hero Title</label><input class="admin-input" id="sc-hero-title" value="${escHtml(h.title || '')}"></div>`;
        html += `<div class="form-group"><label>Hero Subtitle</label><input class="admin-input" id="sc-hero-subtitle" value="${escHtml(h.subtitle || '')}"></div>`;
        html += `<div class="form-group"><label>Hero Tags (comma separated)</label><input class="admin-input" id="sc-hero-tags" value="${escHtml((h.tags || []).join(', '))}"></div>`;
        html += '<h4 style="margin:24px 0 12px;color:var(--accent)">Who We Are</h4>';
        html += `<div class="form-group"><label>Paragraph</label><textarea class="admin-input admin-textarea" style="min-height:120px" id="sc-whoweare">${escHtml(w.paragraph || '')}</textarea></div>`;
        html += '<h4 style="margin:24px 0 12px;color:var(--accent)">Front Door Portal</h4>';
        html += `<div class="form-group"><label>Card Title</label><input class="admin-input" id="sc-fd-title" value="${escHtml(fd.title || '')}"></div>`;
        html += `<div class="form-group"><label>Card Description</label><textarea class="admin-input admin-textarea" id="sc-fd-desc">${escHtml(fd.description || '')}</textarea></div>`;
        (fd.steps || []).forEach((s, i) => { html += `<div class="form-group"><label>Step ${i + 1}</label><input class="admin-input" id="sc-fd-step-${i}" value="${escHtml(s)}"></div>`; });
        html += '<h4 style="margin:24px 0 12px;color:var(--accent)">Section Titles</h4>';
        Object.keys(st).forEach(key => { html += `<div class="form-group" style="display:flex;gap:12px;align-items:center"><label style="min-width:120px;margin:0">${escHtml(key)}</label><input class="admin-input" data-title-admin="${key}" value="${escHtml(st[key])}"></div>`; });
        html += '<h4 style="margin:24px 0 12px;color:var(--accent)">Footer</h4>';
        html += `<div class="form-group"><label>Footer Text</label><input class="admin-input" id="sc-footer" value="${escHtml(ft.text || '')}"></div>`;
        html += '<br><button class="btn btn-primary" id="save-site-content-btn">Save All Site Content</button>';
        c.innerHTML = html;

        document.getElementById('save-site-content-btn').addEventListener('click', () => {
            if (!data.hero) data.hero = {};
            data.hero.title = document.getElementById('sc-hero-title').value;
            data.hero.subtitle = document.getElementById('sc-hero-subtitle').value;
            data.hero.tags = document.getElementById('sc-hero-tags').value.split(',').map(t => t.trim()).filter(Boolean);
            if (!data.whoWeAre) data.whoWeAre = {};
            data.whoWeAre.paragraph = document.getElementById('sc-whoweare').value;
            if (!data.frontDoor) data.frontDoor = {};
            data.frontDoor.title = document.getElementById('sc-fd-title').value;
            data.frontDoor.description = document.getElementById('sc-fd-desc').value;
            data.frontDoor.steps = [];
            let si = 0; while (document.getElementById('sc-fd-step-' + si)) { data.frontDoor.steps.push(document.getElementById('sc-fd-step-' + si).value); si++; }
            if (!data.sectionTitles) data.sectionTitles = {};
            c.querySelectorAll('[data-title-admin]').forEach(input => { data.sectionTitles[input.dataset.titleAdmin] = input.value; });
            if (!data.footer) data.footer = {};
            data.footer.text = document.getElementById('sc-footer').value;
            saveSiteData(data); toast('Site content saved');
        });
    }

    // ================================================================
    //  ADMIN: SERVICES
    // ================================================================
    function renderAdminServices() {
        const list = document.getElementById('admin-services-list');
        if (!data.services) data.services = [];
        list.innerHTML = data.services.map((s, i) => `<div class="admin-item-card"><div class="admin-item-header"><h4>${s.icon} ${escHtml(s.title)}</h4><div class="admin-item-actions"><button class="btn btn-sm btn-secondary admin-edit-svc" data-index="${i}">Edit</button><button class="btn btn-sm btn-danger admin-del-svc" data-index="${i}">Delete</button></div></div><div class="admin-edit-form" id="edit-svc-${i}" style="display:none"><div class="form-group"><label>Title</label><input class="admin-input" value="${escHtml(s.title)}" data-field="title"></div><div class="form-group"><label>Description</label><textarea class="admin-input admin-textarea" style="min-height:120px" data-field="description">${escHtml(s.description)}</textarea></div><div class="form-group"><label>Icon (HTML entity)</label><input class="admin-input" value="${escHtml(s.icon)}" data-field="icon"></div><button class="btn btn-sm btn-primary admin-save-svc" data-index="${i}">Save</button></div></div>`).join('');
        list.querySelectorAll('.admin-edit-svc').forEach(b => b.addEventListener('click', () => { const f = document.getElementById('edit-svc-' + b.dataset.index); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }));
        list.querySelectorAll('.admin-save-svc').forEach(b => b.addEventListener('click', () => { const i = parseInt(b.dataset.index), f = document.getElementById('edit-svc-' + i); f.querySelectorAll('[data-field]').forEach(inp => { data.services[i][inp.dataset.field] = inp.value; }); saveSiteData(data); renderAdminServices(); toast('Service updated'); }));
        list.querySelectorAll('.admin-del-svc').forEach(b => b.addEventListener('click', () => { if (!confirm('Delete?')) return; data.services.splice(parseInt(b.dataset.index), 1); saveSiteData(data); renderAdminServices(); toast('Service deleted'); }));
    }
    document.getElementById('add-service-btn').addEventListener('click', () => { if (!data.services) data.services = []; data.services.push({ id: uid(), icon: '&#128736;', title: 'New Service', description: 'Description...' }); saveSiteData(data); renderAdminServices(); toast('Service added'); });

    // ================================================================
    //  ADMIN: LEADERSHIP
    // ================================================================
    function renderAdminLeadership() {
        ensureLeaderTiers();
        const list = document.getElementById('admin-leadership-list');
        const sortByOrder = (a, b) => (a.order ?? 99) - (b.order ?? 99);
        const topLeaders = data.leadership.filter(l => l.tier === 'top').sort(sortByOrder);
        const midLeaders = data.leadership.filter(l => l.tier === 'middle').sort(sortByOrder);
        const botLeaders = data.leadership.filter(l => l.tier === 'bottom').sort(sortByOrder);

        function leaderAdminCard(l, i) {
            const tierLabel = l.tier === 'top' ? 'Top Row' : l.tier === 'middle' ? 'Middle Row' : 'Bottom Row';
            return `<div class="admin-item-card" data-leader-index="${i}">
                <div class="admin-item-header">
                    <h4>${escHtml(l.name)} \u2014 ${escHtml(l.role)} <span style="color:var(--accent);font-size:0.75rem;font-weight:400;margin-left:8px">[${tierLabel}]</span></h4>
                    <div class="admin-item-actions">
                        <button class="btn btn-sm btn-ghost admin-move-leader" data-index="${i}" data-dir="up" title="Move Left / Up">&#9650;</button>
                        <button class="btn btn-sm btn-ghost admin-move-leader" data-index="${i}" data-dir="down" title="Move Right / Down">&#9660;</button>
                        <button class="btn btn-sm btn-secondary admin-edit-leader" data-index="${i}">Edit</button>
                        <button class="btn btn-sm btn-danger admin-del-leader" data-index="${i}">Delete</button>
                    </div>
                </div>
                <div class="admin-edit-form" id="edit-leader-${i}" style="display:none">
                    <div class="form-row">
                        <div class="form-group" style="flex:2"><label>Name</label><input class="admin-input" value="${escHtml(l.name)}" data-field="name"></div>
                        <div class="form-group" style="flex:2"><label>Role / Title</label><input class="admin-input" value="${escHtml(l.role)}" data-field="role"></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>Initials</label><input class="admin-input" value="${escHtml(l.initials)}" data-field="initials"></div>
                        <div class="form-group"><label>Color</label><input class="admin-input" type="color" value="${l.color}" data-field="color"></div>
                        <div class="form-group"><label>Row Placement</label>
                            <select class="admin-input admin-select" data-field="tier">
                                <option value="top" ${l.tier === 'top' ? 'selected' : ''}>Top Row (Sector Leads)</option>
                                <option value="middle" ${l.tier === 'middle' ? 'selected' : ''}>Middle Row (Management)</option>
                                <option value="bottom" ${l.tier === 'bottom' ? 'selected' : ''}>Bottom Row (Tech Leads)</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>Work Phone</label><input class="admin-input" value="${escHtml(l.phone || '')}" data-field="phone"></div>
                        <div class="form-group"><label>Email</label><input class="admin-input" value="${escHtml(l.email || '')}" data-field="email"></div>
                        <div class="form-group"><label>Work ID</label><input class="admin-input" value="${escHtml(l.workId || '')}" data-field="workId"></div>
                    </div>
                    <button class="btn btn-sm btn-primary admin-save-leader" data-index="${i}">Save</button>
                </div>
            </div>`;
        }

        let html = '<div class="admin-tier-label">Top Row (Sector Leads)</div>';
        html += topLeaders.map(l => leaderAdminCard(l, data.leadership.indexOf(l))).join('');
        html += '<div class="admin-tier-label" style="margin-top:24px">Middle Row (Management)</div>';
        html += midLeaders.map(l => leaderAdminCard(l, data.leadership.indexOf(l))).join('');
        html += '<div class="admin-tier-label" style="margin-top:24px">Bottom Row (Tech Leads)</div>';
        html += botLeaders.map(l => leaderAdminCard(l, data.leadership.indexOf(l))).join('');
        list.innerHTML = html;

        // Edit toggle
        list.querySelectorAll('.admin-edit-leader').forEach(b => b.addEventListener('click', () => {
            const f = document.getElementById('edit-leader-' + b.dataset.index);
            f.style.display = f.style.display === 'none' ? 'block' : 'none';
        }));
        // Save
        list.querySelectorAll('.admin-save-leader').forEach(b => b.addEventListener('click', () => {
            const i = parseInt(b.dataset.index);
            const f = document.getElementById('edit-leader-' + i);
            f.querySelectorAll('[data-field]').forEach(inp => {
                data.leadership[i][inp.dataset.field] = inp.value;
            });
            // Re-normalise order within tiers
            normaliseTierOrders();
            saveSiteData(data);
            renderLeadership(); renderOrgChart(); renderAdminLeadership();
            toast('Leader updated');
        }));
        // Delete
        list.querySelectorAll('.admin-del-leader').forEach(b => b.addEventListener('click', () => {
            if (!confirm('Delete this leader?')) return;
            data.leadership.splice(parseInt(b.dataset.index), 1);
            normaliseTierOrders();
            saveSiteData(data);
            renderLeadership(); renderOrgChart(); renderAdminLeadership();
            toast('Leader deleted');
        }));
        // Move up/down within tier
        list.querySelectorAll('.admin-move-leader').forEach(b => b.addEventListener('click', () => {
            const i = parseInt(b.dataset.index);
            const dir = b.dataset.dir;
            const leader = data.leadership[i];
            const tier = leader.tier || 'top';
            const sortByOrder = (a, b) => (a.order ?? 99) - (b.order ?? 99);
            const tierList = data.leadership.filter(l => l.tier === tier).sort(sortByOrder);
            const posInTier = tierList.indexOf(leader);
            if (dir === 'up' && posInTier > 0) {
                const swapWith = tierList[posInTier - 1];
                const tmpOrder = leader.order; leader.order = swapWith.order; swapWith.order = tmpOrder;
            } else if (dir === 'down' && posInTier < tierList.length - 1) {
                const swapWith = tierList[posInTier + 1];
                const tmpOrder = leader.order; leader.order = swapWith.order; swapWith.order = tmpOrder;
            }
            saveSiteData(data);
            renderLeadership(); renderOrgChart(); renderAdminLeadership();
        }));
    }

    function normaliseTierOrders() {
        ['top', 'middle', 'bottom'].forEach(tier => {
            const tierList = data.leadership.filter(l => l.tier === tier).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
            tierList.forEach((l, idx) => { l.order = idx; });
        });
    }

    const tierNames = { top: 'Top Row (Sector Leads)', middle: 'Middle Row (Management)', bottom: 'Bottom Row (Tech Leads)' };
    function addLeader(tier) {
        const count = data.leadership.filter(l => l.tier === tier).length;
        data.leadership.push({ id: uid(), name: 'New Leader', role: 'Role', initials: 'NL', color: '#0052cc', phone: '', email: '', tier: tier, order: count });
        saveSiteData(data);
        renderLeadership(); renderOrgChart(); renderAdminLeadership();
        toast('Leader added to ' + tierNames[tier]);
    }
    document.getElementById('add-leader-top-btn').addEventListener('click', () => addLeader('top'));
    document.getElementById('add-leader-mid-btn').addEventListener('click', () => addLeader('middle'));
    document.getElementById('add-leader-bottom-btn').addEventListener('click', () => addLeader('bottom'));

    // ================================================================
    //  ADMIN: PROJECTS
    // ================================================================
    function renderAdminProjects() {
        const list = document.getElementById('admin-projects-list');
        list.innerHTML = data.projects.map((p, i) => `<div class="admin-item-card"><div class="admin-item-header"><h4>${escHtml(p.name)}</h4><div class="admin-item-actions"><button class="btn btn-sm btn-secondary admin-edit-project" data-index="${i}">Edit</button><button class="btn btn-sm btn-danger admin-del-project" data-index="${i}">Delete</button></div></div><div class="admin-edit-form" id="edit-project-${i}" style="display:none"><div class="form-group"><label>Name</label><input class="admin-input" value="${escHtml(p.name)}" data-field="name"></div><div class="form-group"><label>Description</label><textarea class="admin-input admin-textarea" data-field="description">${escHtml(p.description)}</textarea></div><div class="form-group"><label>Status (active/planning/review)</label><input class="admin-input" value="${escHtml(p.status)}" data-field="status"></div><div class="form-group"><label>Tags (comma separated)</label><input class="admin-input" value="${(p.tags || []).join(', ')}" data-field="tags"></div><button class="btn btn-sm btn-primary admin-save-project" data-index="${i}">Save</button></div></div>`).join('');
        list.querySelectorAll('.admin-edit-project').forEach(b => b.addEventListener('click', () => { const f = document.getElementById('edit-project-' + b.dataset.index); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }));
        list.querySelectorAll('.admin-save-project').forEach(b => b.addEventListener('click', () => { const i = parseInt(b.dataset.index), f = document.getElementById('edit-project-' + i); f.querySelectorAll('[data-field]').forEach(inp => { if (inp.dataset.field === 'tags') data.projects[i].tags = inp.value.split(',').map(t => t.trim()).filter(Boolean); else data.projects[i][inp.dataset.field] = inp.value; }); saveSiteData(data); renderAdminProjects(); toast('Project updated'); }));
        list.querySelectorAll('.admin-del-project').forEach(b => b.addEventListener('click', () => { if (!confirm('Delete?')) return; data.projects.splice(parseInt(b.dataset.index), 1); saveSiteData(data); renderAdminProjects(); toast('Project deleted'); }));
    }
    document.getElementById('add-project-btn').addEventListener('click', () => { data.projects.push({ id: uid(), name: 'New Project', description: 'Description...', status: 'planning', tags: [] }); saveSiteData(data); renderAdminProjects(); toast('Project added'); });

    // ================================================================
    //  ADMIN: SUCCESSES
    // ================================================================
    function renderAdminSuccesses() {
        const list = document.getElementById('admin-successes-list');
        list.innerHTML = data.successes.map((s, i) => `<div class="admin-item-card"><div class="admin-item-header"><h4>${escHtml(s.title)}</h4><div class="admin-item-actions"><button class="btn btn-sm btn-secondary admin-edit-success" data-index="${i}">Edit</button><button class="btn btn-sm btn-danger admin-del-success" data-index="${i}">Delete</button></div></div><div class="admin-edit-form" id="edit-success-${i}" style="display:none"><div class="form-group"><label>Title</label><input class="admin-input" value="${escHtml(s.title)}" data-field="title"></div><div class="form-group"><label>Date</label><input class="admin-input" value="${escHtml(s.date)}" data-field="date"></div><div class="form-group"><label>Summary</label><textarea class="admin-input admin-textarea" data-field="summary">${escHtml(s.summary)}</textarea></div><div class="form-group"><label>Full Article (HTML)</label><textarea class="admin-input admin-textarea" style="min-height:160px" data-field="fullArticle">${escHtml(s.fullArticle)}</textarea></div><button class="btn btn-sm btn-primary admin-save-success" data-index="${i}">Save</button></div></div>`).join('');
        list.querySelectorAll('.admin-edit-success').forEach(b => b.addEventListener('click', () => { const f = document.getElementById('edit-success-' + b.dataset.index); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }));
        list.querySelectorAll('.admin-save-success').forEach(b => b.addEventListener('click', () => { const i = parseInt(b.dataset.index), f = document.getElementById('edit-success-' + i); f.querySelectorAll('[data-field]').forEach(inp => { data.successes[i][inp.dataset.field] = inp.value; }); saveSiteData(data); renderAdminSuccesses(); toast('Success updated'); }));
        list.querySelectorAll('.admin-del-success').forEach(b => b.addEventListener('click', () => { if (!confirm('Delete?')) return; data.successes.splice(parseInt(b.dataset.index), 1); saveSiteData(data); renderAdminSuccesses(); toast('Success deleted'); }));
    }
    document.getElementById('add-success-btn').addEventListener('click', () => { data.successes.push({ id: uid(), title: 'New Success', date: 'Month Year', summary: 'Summary...', fullArticle: '<p>Article...</p>' }); saveSiteData(data); renderAdminSuccesses(); toast('Success added'); });

    // ================================================================
    //  ADMIN: PREVIOUS PROJECTS
    // ================================================================
    function renderAdminPrevProjects() {
        ensurePrevProjectTags();
        const list = document.getElementById('admin-prev-projects-list');
        list.innerHTML = data.previousProjects.map((p, i) => `<div class="admin-item-card"><div class="admin-item-header"><h4>${escHtml(p.name)}</h4><div class="admin-item-actions"><button class="btn btn-sm btn-secondary admin-edit-pp" data-index="${i}">Edit</button><button class="btn btn-sm btn-danger admin-del-pp" data-index="${i}">Delete</button></div></div><div class="admin-edit-form" id="edit-pp-${i}" style="display:none"><div class="form-group"><label>Name</label><input class="admin-input" value="${escHtml(p.name)}" data-field="name"></div><div class="form-group"><label>Description</label><input class="admin-input" value="${escHtml(p.description)}" data-field="description"></div><div class="form-group"><label>Link</label><input class="admin-input" value="${escHtml(p.link)}" data-field="link"></div><div class="form-group"><label>Tags (comma separated)</label><input class="admin-input" value="${(p.tags || []).join(', ')}" data-field="tags"></div><button class="btn btn-sm btn-primary admin-save-pp" data-index="${i}">Save</button></div></div>`).join('');
        list.querySelectorAll('.admin-edit-pp').forEach(b => b.addEventListener('click', () => { const f = document.getElementById('edit-pp-' + b.dataset.index); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }));
        list.querySelectorAll('.admin-save-pp').forEach(b => b.addEventListener('click', () => { const i = parseInt(b.dataset.index), f = document.getElementById('edit-pp-' + i); f.querySelectorAll('[data-field]').forEach(inp => { if (inp.dataset.field === 'tags') data.previousProjects[i].tags = inp.value.split(',').map(t => t.trim()).filter(Boolean); else data.previousProjects[i][inp.dataset.field] = inp.value; }); saveSiteData(data); renderAdminPrevProjects(); toast('Updated'); }));
        list.querySelectorAll('.admin-del-pp').forEach(b => b.addEventListener('click', () => { if (!confirm('Delete?')) return; data.previousProjects.splice(parseInt(b.dataset.index), 1); saveSiteData(data); renderAdminPrevProjects(); toast('Deleted'); }));
    }
    document.getElementById('add-prev-project-btn').addEventListener('click', () => { data.previousProjects.push({ id: uid(), name: 'New Project', description: 'Description...', link: '#', tags: [] }); saveSiteData(data); renderAdminPrevProjects(); toast('Added'); });

    // ================================================================
    //  ADMIN: ORG GROUPS
    // ================================================================
    function renderAdminOrgGroups() {
        const list = document.getElementById('admin-org-groups-list');
        if (!data.orgGroups) data.orgGroups = [];
        list.innerHTML = data.orgGroups.map((g, i) => `<div class="admin-item-card"><div class="admin-item-header"><h4>${g.icon} ${escHtml(g.label)} (${g.count})</h4><div class="admin-item-actions"><button class="btn btn-sm btn-secondary admin-edit-og" data-index="${i}">Edit</button><button class="btn btn-sm btn-danger admin-del-og" data-index="${i}">Delete</button></div></div><div class="admin-edit-form" id="edit-og-${i}" style="display:none"><div class="form-group"><label>Label</label><input class="admin-input" value="${escHtml(g.label)}" data-field="label"></div><div class="form-group"><label>Count</label><input class="admin-input" type="number" value="${g.count}" data-field="count"></div><div class="form-group"><label>Type (staff/military/contractor/partner)</label><input class="admin-input" value="${escHtml(g.type)}" data-field="type"></div><div class="form-group"><label>Icon (HTML entity, used when no image set)</label><input class="admin-input" value="${escHtml(g.icon)}" data-field="icon"></div><div class="form-group"><label>Image</label><div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">${g.image ? `<img src="${g.image.startsWith('data:') ? g.image : escHtml(g.image)}" style="height:40px;width:40px;object-fit:contain;border-radius:6px;background:var(--bg-glass);border:1px solid var(--border)" onerror="this.style.display='none'">` : '<span style="color:var(--text-muted);font-size:0.8rem">No image</span>'}<input type="file" accept=".png" class="admin-og-img-upload" data-index="${i}" style="font-size:0.8rem"><button type="button" class="btn btn-sm btn-secondary admin-og-img-clear" data-index="${i}">Clear</button></div><input class="admin-input" value="${escHtml(g.image || '')}" data-field="image" placeholder="Or enter filename (e.g. staff.png)" id="og-img-field-${i}"></div><button class="btn btn-sm btn-primary admin-save-og" data-index="${i}">Save</button></div></div>`).join('');
        list.querySelectorAll('.admin-edit-og').forEach(b => b.addEventListener('click', () => { const f = document.getElementById('edit-og-' + b.dataset.index); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }));
        list.querySelectorAll('.admin-save-og').forEach(b => b.addEventListener('click', () => { const i = parseInt(b.dataset.index), f = document.getElementById('edit-og-' + i); f.querySelectorAll('[data-field]').forEach(inp => { if (inp.dataset.field === 'count') data.orgGroups[i].count = parseInt(inp.value) || 0; else data.orgGroups[i][inp.dataset.field] = inp.value; }); saveSiteData(data); renderAdminOrgGroups(); toast('Group updated'); }));
        list.querySelectorAll('.admin-del-og').forEach(b => b.addEventListener('click', () => { if (!confirm('Delete?')) return; data.orgGroups.splice(parseInt(b.dataset.index), 1); saveSiteData(data); renderAdminOrgGroups(); toast('Group deleted'); }));
        list.querySelectorAll('.admin-og-img-upload').forEach(inp => inp.addEventListener('change', (e) => {
            const file = e.target.files[0]; if (!file) return;
            if (!file.type.startsWith('image/png')) { toast('Please select a .png file'); return; }
            const idx = parseInt(inp.dataset.index);
            const reader = new FileReader();
            reader.onload = (ev) => { const imgField = document.getElementById('og-img-field-' + idx); if (imgField) imgField.value = ev.target.result; toast('Image loaded — click Save to apply'); };
            reader.readAsDataURL(file);
        }));
        list.querySelectorAll('.admin-og-img-clear').forEach(b => b.addEventListener('click', () => { const idx = parseInt(b.dataset.index); const imgField = document.getElementById('og-img-field-' + idx); if (imgField) imgField.value = ''; toast('Image cleared — click Save to apply'); }));
    }
    document.getElementById('add-org-group-btn').addEventListener('click', () => { if (!data.orgGroups) data.orgGroups = []; data.orgGroups.push({ id: uid(), label: 'New Group', count: 0, type: 'staff', icon: '&#128101;', image: '' }); saveSiteData(data); renderAdminOrgGroups(); toast('Group added'); });

    // ================================================================
    //  ADMIN: WHERE WE SIT
    // ================================================================
    function renderAdminWhereWeSit() {
        if (!data.whereWeSit) data.whereWeSit = [];
        const list = document.getElementById('admin-where-we-sit-list');
        list.innerHTML = data.whereWeSit.map((item, i) => {
            const isLast = i === data.whereWeSit.length - 1;
            const badge = isLast ? ' <span style="color:var(--accent);font-size:0.75rem">(You are here)</span>' : '';
            return `<div class="admin-item-card"><div class="admin-item-header"><h4>${escHtml(item.label)}${badge}</h4><div class="admin-item-actions"><button class="btn btn-sm btn-secondary admin-edit-ws" data-index="${i}">Edit</button>${i > 0 ? `<button class="btn btn-sm btn-secondary admin-move-ws-up" data-index="${i}" title="Move left">&#9664;</button>` : ''}${i < data.whereWeSit.length - 1 ? `<button class="btn btn-sm btn-secondary admin-move-ws-down" data-index="${i}" title="Move right">&#9654;</button>` : ''}<button class="btn btn-sm btn-danger admin-del-ws" data-index="${i}">Delete</button></div></div><div class="admin-edit-form" id="edit-ws-${i}" style="display:none"><div class="form-group"><label>Label</label><input class="admin-input" value="${escHtml(item.label)}" data-field="label"></div><div class="form-group"><label>Image filename (e.g. fcdo.png)</label><input class="admin-input" value="${escHtml(item.image || '')}" data-field="image"></div><div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">${item.image ? `<img src="${escHtml(item.image)}" style="height:40px;width:40px;object-fit:contain;border-radius:8px;background:var(--bg-glass);border:1px solid var(--border)" onerror="this.style.display='none'">` : ''}<span style="color:var(--text-muted);font-size:0.8rem">Place image file in site folder</span></div><button class="btn btn-sm btn-primary admin-save-ws" data-index="${i}">Save</button></div></div>`;
        }).join('');
        list.querySelectorAll('.admin-edit-ws').forEach(b => b.addEventListener('click', () => { const f = document.getElementById('edit-ws-' + b.dataset.index); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }));
        list.querySelectorAll('.admin-save-ws').forEach(b => b.addEventListener('click', () => { const i = parseInt(b.dataset.index), f = document.getElementById('edit-ws-' + i); f.querySelectorAll('[data-field]').forEach(inp => { data.whereWeSit[i][inp.dataset.field] = inp.value; }); saveSiteData(data); renderAdminWhereWeSit(); toast('Node updated'); }));
        list.querySelectorAll('.admin-del-ws').forEach(b => b.addEventListener('click', () => { if (!confirm('Delete this node?')) return; data.whereWeSit.splice(parseInt(b.dataset.index), 1); saveSiteData(data); renderAdminWhereWeSit(); toast('Node deleted'); }));
        list.querySelectorAll('.admin-move-ws-up').forEach(b => b.addEventListener('click', () => { const i = parseInt(b.dataset.index); if (i > 0) { [data.whereWeSit[i - 1], data.whereWeSit[i]] = [data.whereWeSit[i], data.whereWeSit[i - 1]]; saveSiteData(data); renderAdminWhereWeSit(); } }));
        list.querySelectorAll('.admin-move-ws-down').forEach(b => b.addEventListener('click', () => { const i = parseInt(b.dataset.index); if (i < data.whereWeSit.length - 1) { [data.whereWeSit[i], data.whereWeSit[i + 1]] = [data.whereWeSit[i + 1], data.whereWeSit[i]]; saveSiteData(data); renderAdminWhereWeSit(); } }));
    }
    document.getElementById('add-where-we-sit-btn').addEventListener('click', () => { if (!data.whereWeSit) data.whereWeSit = []; data.whereWeSit.push({ id: uid(), label: 'New Node', image: '' }); saveSiteData(data); renderAdminWhereWeSit(); toast('Node added'); });

    // ================================================================
    //  ADMIN: STATS
    // ================================================================
    function renderAdminStats() {
        const c = document.getElementById('admin-stats-form');
        // Show auto-computed tag summary
        const tagStats = computeTagStats();
        const tagEntries = Object.entries(tagStats);
        let html = '<h4 style="margin-bottom:12px;color:var(--accent)">Auto-Computed Tag Statistics</h4>';
        html += '<p style="color:var(--text-secondary);font-size:0.85rem;margin-bottom:16px">These charts are automatically generated from tags on Current and Previous projects. Edit tags on each project to update.</p>';
        if (tagEntries.length) {
            html += '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px">';
            tagEntries.forEach(([tag, count]) => {
                html += `<span style="background:var(--bg-elevated);border:1px solid var(--border);padding:4px 12px;border-radius:20px;font-size:0.82rem;color:var(--text-primary)">${escHtml(tag)} <strong style="color:var(--accent)">${count}</strong></span>`;
            });
            html += '</div>';
        } else {
            html += '<p style="color:var(--text-muted);margin-bottom:24px;font-style:italic">No tags found on any projects.</p>';
        }
        html += '<h4 style="margin-bottom:12px;color:var(--accent)">Counters</h4>';
        html += '<p style="color:var(--text-secondary);font-size:0.85rem;margin-bottom:16px">Counters are manually editable key performance indicators.</p>';
        data.stats.counters.forEach((ct, i) => { html += `<div class="form-group" style="display:flex;gap:12px;align-items:center"><input class="admin-input" style="flex:1" value="${escHtml(ct.label)}" data-counter-label="${i}"><input class="admin-input" style="width:120px" value="${escHtml(ct.value)}" data-counter-value="${i}"><button class="btn btn-sm btn-danger admin-del-counter" data-index="${i}">X</button></div>`; });
        html += '<button class="btn btn-sm btn-secondary" id="add-counter-btn" style="margin-bottom:24px">+ Add Counter</button>';
        html += '<br><button class="btn btn-primary" id="save-stats-btn">Save Counters</button>';
        c.innerHTML = html;
        document.getElementById('save-stats-btn').addEventListener('click', () => {
            data.stats.counters = []; c.querySelectorAll('[data-counter-label]').forEach(inp => { data.stats.counters.push({ label: inp.value, value: c.querySelector(`[data-counter-value="${inp.dataset.counterLabel}"]`).value }); });
            saveSiteData(data); renderAdminStats(); toast('Counters saved');
        });
        c.querySelectorAll('.admin-del-counter').forEach(b => b.addEventListener('click', () => { data.stats.counters.splice(parseInt(b.dataset.index), 1); saveSiteData(data); renderAdminStats(); }));
        document.getElementById('add-counter-btn').addEventListener('click', () => { data.stats.counters.push({ label: 'New', value: '0' }); saveSiteData(data); renderAdminStats(); });
    }

    // ================================================================
    //  ADMIN: LINKS
    // ================================================================
    function renderAdminLinks() {
        const list = document.getElementById('admin-links-list');
        list.innerHTML = data.links.map((l, i) => `<div class="admin-item-card"><div class="admin-item-header"><h4>${escHtml(l.name)}</h4><div class="admin-item-actions"><button class="btn btn-sm btn-secondary admin-edit-link" data-index="${i}">Edit</button><button class="btn btn-sm btn-danger admin-del-link" data-index="${i}">Delete</button></div></div><div class="admin-edit-form" id="edit-link-${i}" style="display:none"><div class="form-group"><label>Name</label><input class="admin-input" value="${escHtml(l.name)}" data-field="name"></div><div class="form-group"><label>Description</label><input class="admin-input" value="${escHtml(l.description)}" data-field="description"></div><div class="form-group"><label>URL</label><input class="admin-input" value="${escHtml(l.url)}" data-field="url"></div><div class="form-group"><label>Icon (HTML entity)</label><input class="admin-input" value="${escHtml(l.icon)}" data-field="icon"></div><button class="btn btn-sm btn-primary admin-save-link" data-index="${i}">Save</button></div></div>`).join('');
        list.querySelectorAll('.admin-edit-link').forEach(b => b.addEventListener('click', () => { const f = document.getElementById('edit-link-' + b.dataset.index); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }));
        list.querySelectorAll('.admin-save-link').forEach(b => b.addEventListener('click', () => { const i = parseInt(b.dataset.index), f = document.getElementById('edit-link-' + i); f.querySelectorAll('[data-field]').forEach(inp => { data.links[i][inp.dataset.field] = inp.value; }); saveSiteData(data); renderAdminLinks(); toast('Link updated'); }));
        list.querySelectorAll('.admin-del-link').forEach(b => b.addEventListener('click', () => { if (!confirm('Delete?')) return; data.links.splice(parseInt(b.dataset.index), 1); saveSiteData(data); renderAdminLinks(); toast('Link deleted'); }));
    }
    document.getElementById('add-link-btn').addEventListener('click', () => { data.links.push({ id: uid(), name: 'New Link', description: 'Description', url: '#', icon: '&#128279;' }); saveSiteData(data); renderAdminLinks(); toast('Link added'); });

    // ================================================================
    //  ADMIN: SETTINGS
    // ================================================================
    function renderAdminSettings() {
        ensureSettings();
        const topSrc = getLogoSrc('topBarLogo');
        const heroSrc = getLogoSrc('heroLogo');
        const rightSrc = getLogoSrc('topBarRightLogo');
        document.getElementById('setting-top-bar-logo').value = data.settings.topBarLogo || 'EST.png';
        document.getElementById('setting-hero-logo').value = data.settings.heroLogo || 'EST.png';
        document.getElementById('setting-right-logo').value = data.settings.topBarRightLogo || 'O3.png';
        document.getElementById('setting-top-bar-logo-preview').src = topSrc;
        document.getElementById('setting-hero-logo-preview').src = heroSrc;
        document.getElementById('setting-right-logo-preview').src = rightSrc;
        document.getElementById('setting-page-title').value = data.settings.pageTitle || '';
        document.getElementById('setting-email').value = data.settings.frontDoorEmail;
        document.getElementById('setting-email-subject').value = data.settings.frontDoorEmailSubject || '';
        document.getElementById('setting-email-body').value = data.settings.frontDoorEmailBody || '';
        document.getElementById('setting-portal-url').value = data.settings.frontDoorPortalUrl;
        document.getElementById('setting-you-are-here').value = data.settings.youAreHereBadge || '';
        document.getElementById('setting-admin-user').value = data.settings.adminUser;
        document.getElementById('setting-admin-pass').value = data.settings.adminPass;
    }

    // Handle logo file uploads
    function handleLogoUpload(fileInput, previewId, settingKey) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (!file.type.startsWith('image/png')) {
                toast('Please select a .png file'); return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => {
                const dataUrl = ev.target.result;
                localStorage.setItem('esector_logo_' + settingKey, dataUrl);
                document.getElementById(previewId).src = dataUrl;
                toast('Logo uploaded! Click Save Settings to apply.');
            };
            reader.readAsDataURL(file);
        });
    }
    handleLogoUpload(document.getElementById('setting-top-bar-logo-file'), 'setting-top-bar-logo-preview', 'topBarLogo');
    handleLogoUpload(document.getElementById('setting-hero-logo-file'), 'setting-hero-logo-preview', 'heroLogo');
    handleLogoUpload(document.getElementById('setting-right-logo-file'), 'setting-right-logo-preview', 'topBarRightLogo');

    // Reset logo buttons
    document.getElementById('reset-top-bar-logo').addEventListener('click', () => {
        localStorage.removeItem('esector_logo_topBarLogo');
        document.getElementById('setting-top-bar-logo').value = 'EST.png';
        document.getElementById('setting-top-bar-logo-preview').src = 'EST.png';
        toast('Top bar logo reset to default');
    });
    document.getElementById('reset-hero-logo').addEventListener('click', () => {
        localStorage.removeItem('esector_logo_heroLogo');
        document.getElementById('setting-hero-logo').value = 'EST.png';
        document.getElementById('setting-hero-logo-preview').src = 'EST.png';
        toast('Hero logo reset to default');
    });
    document.getElementById('reset-right-logo').addEventListener('click', () => {
        localStorage.removeItem('esector_logo_topBarRightLogo');
        document.getElementById('setting-right-logo').value = 'O3.png';
        document.getElementById('setting-right-logo-preview').src = 'O3.png';
        toast('Right logo reset to default');
    });

    document.getElementById('save-settings-btn').addEventListener('click', () => {
        ensureSettings();
        data.settings.topBarLogo = document.getElementById('setting-top-bar-logo').value.trim() || 'EST.png';
        data.settings.heroLogo = document.getElementById('setting-hero-logo').value.trim() || 'EST.png';
        data.settings.topBarRightLogo = document.getElementById('setting-right-logo').value.trim() || 'O3.png';
        data.settings.pageTitle = document.getElementById('setting-page-title').value.trim();
        data.settings.frontDoorEmail = document.getElementById('setting-email').value;
        data.settings.frontDoorEmailSubject = document.getElementById('setting-email-subject').value;
        data.settings.frontDoorEmailBody = document.getElementById('setting-email-body').value;
        data.settings.frontDoorPortalUrl = document.getElementById('setting-portal-url').value;
        data.settings.youAreHereBadge = document.getElementById('setting-you-are-here').value.trim();
        data.settings.adminUser = document.getElementById('setting-admin-user').value;
        data.settings.adminPass = document.getElementById('setting-admin-pass').value;
        saveSiteData(data); renderHero(); renderFrontDoor(); renderWhereWeSit(); toast('Settings saved');
    });

    // ---- Smooth scroll for nav links ----
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const target = this.getAttribute('href');
            if (target === '#') return;
            e.preventDefault();
            const el = document.querySelector(target);
            if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); document.querySelector('.nav-links').classList.remove('open'); }
        });
    });

    // ---- Init ----
    renderAll();
    initMatrixRain();
    initParticles();
    initCursorGlow();
    initTypewriter();
    initScrollEffects();

})();
