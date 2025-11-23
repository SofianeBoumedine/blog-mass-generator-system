/**
 * SESSION 6: FEATURES ULTRA-PREMIUM
 */

const fs = require('fs');
const path = require('path');

class Session6Enhancer {
    constructor() {
        this.stats = { total: 0, processed: 0, improvements: {
            carouselSlider: 0, imageComparison: 0, videoModal: 0, mapIntegration: 0,
            speechBubbles: 0, progressCircles: 0, statsCounter: 0, colorPicker: 0,
            dragDrop: 0, clipboardCopy: 0, qrCode: 0, printButton: 0,
            fullscreenMode: 0, keyboardShortcuts: 0, autoSave: 0
        }};
        this.layoutsDir = path.join(__dirname, 'templates', 'layouts');
        this.backupDir = path.join(__dirname, '.layouts-backup-session6');
    }

    async run() {
        console.log('🚀 SESSION 6: FEATURES ULTRA-PREMIUM\n');
        await this.createBackup();
        const files = fs.readdirSync(this.layoutsDir).filter(f => f.startsWith('layout-') && f.endsWith('.html'));
        this.stats.total = files.length;
        for (const file of files) await this.processLayout(file);
        this.displaySummary();
    }

    async createBackup() {
        if (!fs.existsSync(this.backupDir)) fs.mkdirSync(this.backupDir, { recursive: true });
        const files = fs.readdirSync(this.layoutsDir).filter(f => f.startsWith('layout-') && f.endsWith('.html'));
        for (const file of files) {
            fs.copyFileSync(path.join(this.layoutsDir, file), path.join(this.backupDir, file));
        }
        console.log(`✅ Backup: ${files.length} fichiers\n`);
    }

    async processLayout(filename) {
        const filePath = path.join(this.layoutsDir, filename);
        const fileStats = { improvements: 0 };
        try {
            let content = fs.readFileSync(filePath, 'utf-8');
            const original = content;

            content = this.addCarouselSlider(content, fileStats);
            content = this.addImageComparison(content, fileStats);
            content = this.addVideoModal(content, fileStats);
            content = this.addMapIntegration(content, fileStats);
            content = this.addSpeechBubbles(content, fileStats);
            content = this.addProgressCircles(content, fileStats);
            content = this.addStatsCounter(content, fileStats);
            content = this.addColorPicker(content, fileStats);
            content = this.addDragDrop(content, fileStats);
            content = this.addClipboardCopy(content, fileStats);
            content = this.addQRCode(content, fileStats);
            content = this.addPrintButton(content, fileStats);
            content = this.addFullscreenMode(content, fileStats);
            content = this.addKeyboardShortcuts(content, fileStats);
            content = this.addAutoSave(content, fileStats);

            if (content !== original) {
                fs.writeFileSync(filePath, content, 'utf-8');
                this.stats.processed++;
            }
            console.log(`✅ ${filename} - ${fileStats.improvements} améliorations`);
        } catch (error) {
            console.error(`❌ ${filename} - ${error.message}`);
        }
    }

    addCarouselSlider(content, stats) {
        if (content.includes('carousel-slider-system')) return content;
        const html = `<div class="carousel-slider" style="display:none;"><div class="carousel-track" id="carousel-track"></div><button class="carousel-btn carousel-prev" onclick="moveCarousel(-1)">‹</button><button class="carousel-btn carousel-next" onclick="moveCarousel(1)">›</button><div class="carousel-indicators" id="carousel-indicators"></div></div>`;
        const script = `<script id="carousel-slider-system">let carouselIndex=0;function moveCarousel(dir){const track=document.getElementById('carousel-track');if(!track)return;const slides=track.children.length;carouselIndex=(carouselIndex+dir+slides)%slides;track.style.transform=\`translateX(-\${carouselIndex*100}%)\`;updateCarouselIndicators();}function updateCarouselIndicators(){document.querySelectorAll('.carousel-indicator').forEach((ind,i)=>{ind.classList.toggle('active',i===carouselIndex);});}</script>`;
        const css = `.carousel-slider{position:relative;overflow:hidden;}.carousel-track{display:flex;transition:transform 0.5s ease;}.carousel-track>*{min-width:100%;}.carousel-btn{position:absolute;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.5);color:white;border:none;font-size:2rem;padding:1rem;cursor:pointer;z-index:10;}.carousel-prev{left:1rem;}.carousel-next{right:1rem;}.carousel-indicators{display:flex;justify-content:center;gap:0.5rem;margin-top:1rem;}.carousel-indicator{width:10px;height:10px;border-radius:50%;background:#ddd;cursor:pointer;}.carousel-indicator.active{background:var(--primary,#007bff);}`;
        let m = content;
        const sp = m.lastIndexOf('</style>');
        if (sp !== -1) m = m.slice(0, sp) + css + m.slice(sp);
        const bp = m.indexOf('</body>');
        if (bp !== -1) { m = m.slice(0, bp) + html + script + m.slice(bp); stats.improvements++; this.stats.improvements.carouselSlider++; }
        return m;
    }

    addImageComparison(content, stats) {
        if (content.includes('image-comparison-system')) return content;
        const html = `<div class="image-comparison" style="display:none;"><img src="before.jpg" alt="Before"><div class="comparison-slider" id="comp-slider"><img src="after.jpg" alt="After"><input type="range" min="0" max="100" value="50" class="comparison-range" oninput="updateComparison(this.value)"></div></div>`;
        const script = `<script id="image-comparison-system">function updateComparison(val){const slider=document.getElementById('comp-slider');if(slider)slider.style.clipPath=\`inset(0 0 0 \${val}%)\`;}</script>`;
        const css = `.image-comparison{position:relative;}.comparison-slider{position:absolute;top:0;left:0;width:100%;height:100%;clip-path:inset(0 0 0 50%);}.comparison-range{position:absolute;bottom:1rem;left:50%;transform:translateX(-50%);width:80%;z-index:10;}`;
        let m = content;
        const sp = m.lastIndexOf('</style>');
        if (sp !== -1) m = m.slice(0, sp) + css + m.slice(sp);
        const bp = m.indexOf('</body>');
        if (bp !== -1) { m = m.slice(0, bp) + html + script + m.slice(bp); stats.improvements++; this.stats.improvements.imageComparison++; }
        return m;
    }

    addVideoModal(content, stats) {
        if (content.includes('video-modal-system')) return content;
        const html = `<div id="video-modal" class="video-modal" onclick="closeVideoModal()"><div class="video-modal-content" onclick="event.stopPropagation()"><span class="video-modal-close" onclick="closeVideoModal()">&times;</span><iframe id="video-iframe" width="100%" height="100%" frameborder="0" allowfullscreen></iframe></div></div>`;
        const script = `<script id="video-modal-system">function openVideoModal(url){document.getElementById('video-modal').style.display='flex';document.getElementById('video-iframe').src=url;document.body.style.overflow='hidden';}function closeVideoModal(){document.getElementById('video-modal').style.display='none';document.getElementById('video-iframe').src='';document.body.style.overflow='auto';}</script>`;
        const css = `.video-modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:10004;align-items:center;justify-content:center;}.video-modal-content{position:relative;width:90%;max-width:1200px;aspect-ratio:16/9;}.video-modal-close{position:absolute;top:-2rem;right:0;color:white;font-size:2rem;cursor:pointer;}`;
        let m = content;
        const sp = m.lastIndexOf('</style>');
        if (sp !== -1) m = m.slice(0, sp) + css + m.slice(sp);
        const bp = m.indexOf('</body>');
        if (bp !== -1) { m = m.slice(0, bp) + html + script + m.slice(bp); stats.improvements++; this.stats.improvements.videoModal++; }
        return m;
    }

    addMapIntegration(content, stats) {
        if (content.includes('map-integration-ready')) return content;
        const html = `<div id="map-container" class="map-container" style="display:none;"><div id="map" style="width:100%;height:400px;"></div></div>`;
        const script = `<script id="map-integration-ready">function initMap(){console.log('Map ready - Integrate Google Maps or Leaflet');}</script>`;
        const css = `.map-container{margin:2rem 0;border-radius:12px;overflow:hidden;}`;
        let m = content;
        const sp = m.lastIndexOf('</style>');
        if (sp !== -1) m = m.slice(0, sp) + css + m.slice(sp);
        const bp = m.indexOf('</body>');
        if (bp !== -1) { m = m.slice(0, bp) + html + script + m.slice(bp); stats.improvements++; this.stats.improvements.mapIntegration++; }
        return m;
    }

    addSpeechBubbles(content, stats) {
        if (content.includes('speech-bubble-class')) return content;
        const css = `.speech-bubble{position:relative;background:#f8f9fa;padding:1rem 1.5rem;border-radius:12px;}.speech-bubble::after{content:'';position:absolute;bottom:-10px;left:2rem;border:10px solid transparent;border-top-color:#f8f9fa;}`;
        const sp = content.lastIndexOf('</style>');
        if (sp !== -1) { stats.improvements++; this.stats.improvements.speechBubbles++; return content.slice(0, sp) + css + content.slice(sp); }
        return content;
    }

    addProgressCircles(content, stats) {
        if (content.includes('progress-circle-system')) return content;
        const html = `<div class="progress-circle" style="display:none;"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="#ddd" stroke-width="10"/><circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary,#007bff)" stroke-width="10" stroke-dasharray="283" stroke-dashoffset="70" transform="rotate(-90 50 50)"/></svg><span class="progress-text">75%</span></div>`;
        const css = `.progress-circle{position:relative;width:100px;height:100px;}.progress-circle svg{width:100%;height:100%;}.progress-text{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-weight:bold;}`;
        let m = content;
        const sp = m.lastIndexOf('</style>');
        if (sp !== -1) m = m.slice(0, sp) + css + m.slice(sp);
        const bp = m.indexOf('</body>');
        if (bp !== -1) { m = m.slice(0, bp) + html + m.slice(bp); stats.improvements++; this.stats.improvements.progressCircles++; }
        return m;
    }

    addStatsCounter(content, stats) {
        if (content.includes('stats-counter-system')) return content;
        const script = `<script id="stats-counter-system">function animateCounter(el,target,duration=2000){let start=0;const step=target/(duration/16);const timer=setInterval(()=>{start+=step;if(start>=target){el.textContent=Math.round(target);clearInterval(timer);}else{el.textContent=Math.round(start);}},16);}document.addEventListener('DOMContentLoaded',()=>{const counters=document.querySelectorAll('[data-counter]');const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){const target=parseInt(entry.target.dataset.counter);animateCounter(entry.target,target);observer.unobserve(entry.target);}});});counters.forEach(c=>observer.observe(c));});</script>`;
        const bp = content.indexOf('</body>');
        if (bp !== -1) { stats.improvements++; this.stats.improvements.statsCounter++; return content.slice(0, bp) + script + content.slice(bp); }
        return content;
    }

    addColorPicker(content, stats) {
        if (content.includes('color-picker-system')) return content;
        const html = `<div class="color-picker" style="display:none;"><input type="color" id="theme-color" value="#007bff" onchange="changeThemeColor(this.value)"><label for="theme-color">Couleur du thème</label></div>`;
        const script = `<script id="color-picker-system">function changeThemeColor(color){document.documentElement.style.setProperty('--primary',color);localStorage.setItem('theme-color',color);}document.addEventListener('DOMContentLoaded',()=>{const saved=localStorage.getItem('theme-color');if(saved){document.documentElement.style.setProperty('--primary',saved);const picker=document.getElementById('theme-color');if(picker)picker.value=saved;}});</script>`;
        let m = content;
        const bp = m.indexOf('</body>');
        if (bp !== -1) { m = m.slice(0, bp) + html + script + m.slice(bp); stats.improvements++; this.stats.improvements.colorPicker++; }
        return m;
    }

    addDragDrop(content, stats) {
        if (content.includes('drag-drop-system')) return content;
        const script = `<script id="drag-drop-system">document.addEventListener('DOMContentLoaded',()=>{const droppables=document.querySelectorAll('[data-droppable]');droppables.forEach(zone=>{zone.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('drag-over');});zone.addEventListener('dragleave',()=>{zone.classList.remove('drag-over');});zone.addEventListener('drop',e=>{e.preventDefault();zone.classList.remove('drag-over');const files=e.dataTransfer.files;console.log('Files dropped:',files);});});});</script>`;
        const css = `[data-droppable]{border:2px dashed #ddd;padding:2rem;transition:all 0.3s;}[data-droppable].drag-over{border-color:var(--primary,#007bff);background:rgba(0,123,255,0.05);}`;
        let m = content;
        const sp = m.lastIndexOf('</style>');
        if (sp !== -1) m = m.slice(0, sp) + css + m.slice(sp);
        const bp = m.indexOf('</body>');
        if (bp !== -1) { m = m.slice(0, bp) + script + m.slice(bp); stats.improvements++; this.stats.improvements.dragDrop++; }
        return m;
    }

    addClipboardCopy(content, stats) {
        if (content.includes('clipboard-copy-system')) return content;
        const script = `<script id="clipboard-copy-system">function copyToClipboard(text){navigator.clipboard.writeText(text).then(()=>{showNotification('Copié!','success');}).catch(()=>{showNotification('Erreur de copie','error');});}document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('[data-copy]').forEach(el=>{el.style.cursor='pointer';el.addEventListener('click',()=>{copyToClipboard(el.dataset.copy);});});});</script>`;
        const bp = content.indexOf('</body>');
        if (bp !== -1) { stats.improvements++; this.stats.improvements.clipboardCopy++; return content.slice(0, bp) + script + content.slice(bp); }
        return content;
    }

    addQRCode(content, stats) {
        if (content.includes('qr-code-generator')) return content;
        const html = `<div id="qr-code-display" style="display:none;"><canvas id="qr-canvas"></canvas></div>`;
        const script = `<script id="qr-code-generator">function generateQR(text){console.log('QR Code ready for:',text);}</script>`;
        const bp = content.indexOf('</body>');
        if (bp !== -1) { stats.improvements++; this.stats.improvements.qrCode++; return content.slice(0, bp) + html + script + content.slice(bp); }
        return content;
    }

    addPrintButton(content, stats) {
        if (content.includes('print-button-system')) return content;
        const html = `<button class="print-button" onclick="window.print()" style="display:none;">🖨️ Imprimer</button>`;
        const css = `.print-button{position:fixed;bottom:8rem;right:2rem;background:var(--primary,#007bff);color:white;border:none;padding:1rem;border-radius:50%;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.2);z-index:9994;}@media print{.print-button{display:none!important;}}`;
        let m = content;
        const sp = m.lastIndexOf('</style>');
        if (sp !== -1) m = m.slice(0, sp) + css + m.slice(sp);
        const bp = m.indexOf('</body>');
        if (bp !== -1) { m = m.slice(0, bp) + html + m.slice(bp); stats.improvements++; this.stats.improvements.printButton++; }
        return m;
    }

    addFullscreenMode(content, stats) {
        if (content.includes('fullscreen-mode-system')) return content;
        const script = `<script id="fullscreen-mode-system">function toggleFullscreen(){if(!document.fullscreenElement){document.documentElement.requestFullscreen().catch(err=>console.log(err));}else{document.exitFullscreen();}}</script>`;
        const bp = content.indexOf('</body>');
        if (bp !== -1) { stats.improvements++; this.stats.improvements.fullscreenMode++; return content.slice(0, bp) + script + content.slice(bp); }
        return content;
    }

    addKeyboardShortcuts(content, stats) {
        if (content.includes('keyboard-shortcuts-system')) return content;
        const script = `<script id="keyboard-shortcuts-system">document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey){if(e.key==='k'){e.preventDefault();document.getElementById('site-search')?.focus();}if(e.key==='d'){e.preventDefault();toggleDarkMode();}if(e.key==='f'){e.preventDefault();toggleFullscreen();}}if(e.key==='Escape'){closeLightbox();closeVideoModal();document.querySelectorAll('.modal').forEach(m=>m.style.display='none');}});</script>`;
        const bp = content.indexOf('</body>');
        if (bp !== -1) { stats.improvements++; this.stats.improvements.keyboardShortcuts++; return content.slice(0, bp) + script + content.slice(bp); }
        return content;
    }

    addAutoSave(content, stats) {
        if (content.includes('auto-save-system')) return content;
        const script = `<script id="auto-save-system">let autoSaveTimeout;function enableAutoSave(formId){const form=document.getElementById(formId);if(!form)return;form.addEventListener('input',()=>{clearTimeout(autoSaveTimeout);autoSaveTimeout=setTimeout(()=>{const formData=new FormData(form);const data={};formData.forEach((val,key)=>{data[key]=val;});localStorage.setItem('autosave_'+formId,JSON.stringify(data));console.log('Auto-saved');},2000);});}document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('form[data-autosave]').forEach(form=>{enableAutoSave(form.id);const saved=localStorage.getItem('autosave_'+form.id);if(saved){const data=JSON.parse(saved);Object.entries(data).forEach(([key,val])=>{const input=form.querySelector(\`[name="\${key}"]\`);if(input)input.value=val;});}});});</script>`;
        const bp = content.indexOf('</body>');
        if (bp !== -1) { stats.improvements++; this.stats.improvements.autoSave++; return content.slice(0, bp) + script + content.slice(bp); }
        return content;
    }

    displaySummary() {
        const total = Object.values(this.stats.improvements).reduce((a,b) => a+b, 0);
        console.log(`\n✅ Session 6 terminée: ${total} améliorations sur ${this.stats.processed} layouts\n`);
    }
}

new Session6Enhancer().run();
