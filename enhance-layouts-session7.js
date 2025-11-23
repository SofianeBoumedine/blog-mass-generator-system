/**
 * SESSION 7: FEATURES NEXT-GEN
 */

const fs = require('fs');
const path = require('path');

class Session7Enhancer {
    constructor() {
        this.stats = { total: 0, processed: 0, improvements: {
            voiceSearch: 0, imageZoomPan: 0, stickyElements: 0, confettiEffects: 0,
            typewriterEffect: 0, particlesBackground: 0, wavesAnimation: 0, matrixRain: 0,
            glitchEffect: 0, neonText: 0, glassCard: 0, blobShapes: 0,
            gradientAnimation: 0, textReveal: 0, magneticButtons: 0, cursorFollower: 0,
            soundEffects: 0, hapticFeedback: 0, gestureControls: 0, voiceCommands: 0
        }};
        this.layoutsDir = path.join(__dirname, 'templates', 'layouts');
        this.backupDir = path.join(__dirname, '.layouts-backup-session7');
    }

    async run() {
        console.log('🚀 SESSION 7: FEATURES NEXT-GEN\n');
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

            content = this.addVoiceSearch(content, fileStats);
            content = this.addImageZoomPan(content, fileStats);
            content = this.addStickyElements(content, fileStats);
            content = this.addConfettiEffects(content, fileStats);
            content = this.addTypewriterEffect(content, fileStats);
            content = this.addParticlesBackground(content, fileStats);
            content = this.addWavesAnimation(content, fileStats);
            content = this.addMatrixRain(content, fileStats);
            content = this.addGlitchEffect(content, fileStats);
            content = this.addNeonText(content, fileStats);
            content = this.addGlassCard(content, fileStats);
            content = this.addBlobShapes(content, fileStats);
            content = this.addGradientAnimation(content, fileStats);
            content = this.addTextReveal(content, fileStats);
            content = this.addMagneticButtons(content, fileStats);
            content = this.addCursorFollower(content, fileStats);
            content = this.addSoundEffects(content, fileStats);
            content = this.addHapticFeedback(content, fileStats);
            content = this.addGestureControls(content, fileStats);
            content = this.addVoiceCommands(content, fileStats);

            if (content !== original) {
                fs.writeFileSync(filePath, content, 'utf-8');
                this.stats.processed++;
            }
            console.log(`✅ ${filename} - ${fileStats.improvements} améliorations`);
        } catch (error) {
            console.error(`❌ ${filename} - ${error.message}`);
        }
    }

    addVoiceSearch(content, stats) {
        if (content.includes('voice-search-system')) return content;
        const html = `<button class="voice-search-btn" onclick="startVoiceSearch()" style="display:none;">🎤</button>`;
        const script = `<script id="voice-search-system">function startVoiceSearch(){if('webkitSpeechRecognition'in window||'SpeechRecognition'in window){const recognition=new(window.SpeechRecognition||window.webkitSpeechRecognition)();recognition.lang='fr-FR';recognition.onresult=e=>{const transcript=e.results[0][0].transcript;document.getElementById('site-search').value=transcript;performSearch(transcript);};recognition.start();}else{showNotification('Recherche vocale non supportée','error');}}</script>`;
        let m = content;
        const bp = m.indexOf('</body>');
        if (bp !== -1) { m = m.slice(0, bp) + html + script + m.slice(bp); stats.improvements++; this.stats.improvements.voiceSearch++; }
        return m;
    }

    addImageZoomPan(content, stats) {
        if (content.includes('image-zoom-pan-system')) return content;
        const script = `<script id="image-zoom-pan-system">document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('[data-zoomable]').forEach(img=>{let scale=1;let panning=false;let pointX=0;let pointY=0;let start={x:0,y:0};img.style.cursor='zoom-in';img.addEventListener('wheel',e=>{e.preventDefault();const xs=(e.clientX-pointX)/scale;const ys=(e.clientY-pointY)/scale;const delta=e.wheelDelta?e.wheelDelta:-e.deltaY;scale=delta>0?Math.min(scale*1.2,5):Math.max(scale/1.2,1);pointX=e.clientX-xs*scale;pointY=e.clientY-ys*scale;img.style.transform=\`translate(\${pointX}px,\${pointY}px) scale(\${scale})\`;img.style.cursor=scale>1?'grab':'zoom-in';});img.addEventListener('mousedown',e=>{if(scale>1){panning=true;start={x:e.clientX-pointX,y:e.clientY-pointY};img.style.cursor='grabbing';}});img.addEventListener('mouseup',()=>{panning=false;if(scale>1)img.style.cursor='grab';});img.addEventListener('mousemove',e=>{if(!panning)return;e.preventDefault();pointX=e.clientX-start.x;pointY=e.clientY-start.y;img.style.transform=\`translate(\${pointX}px,\${pointY}px) scale(\${scale})\`;});img.addEventListener('dblclick',()=>{scale=1;pointX=0;pointY=0;img.style.transform='';img.style.cursor='zoom-in';});});});</script>`;
        const css = `[data-zoomable]{transition:transform 0.1s ease;transform-origin:center;}`;
        let m = content;
        const sp = m.lastIndexOf('</style>');
        if (sp !== -1) m = m.slice(0, sp) + css + m.slice(sp);
        const bp = m.indexOf('</body>');
        if (bp !== -1) { m = m.slice(0, bp) + script + m.slice(bp); stats.improvements++; this.stats.improvements.imageZoomPan++; }
        return m;
    }

    addStickyElements(content, stats) {
        if (content.includes('sticky-elements-system')) return content;
        const script = `<script id="sticky-elements-system">document.addEventListener('DOMContentLoaded',()=>{const stickyElements=document.querySelectorAll('[data-sticky]');const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting){entry.target.classList.add('is-sticky');}else{entry.target.classList.remove('is-sticky');}});},{threshold:[1]});stickyElements.forEach(el=>observer.observe(el));});</script>`;
        const css = `[data-sticky]{position:sticky;top:0;z-index:100;transition:all 0.3s;}[data-sticky].is-sticky{box-shadow:0 2px 12px rgba(0,0,0,0.1);}`;
        let m = content;
        const sp = m.lastIndexOf('</style>');
        if (sp !== -1) m = m.slice(0, sp) + css + m.slice(sp);
        const bp = m.indexOf('</body>');
        if (bp !== -1) { m = m.slice(0, bp) + script + m.slice(bp); stats.improvements++; this.stats.improvements.stickyElements++; }
        return m;
    }

    addConfettiEffects(content, stats) {
        if (content.includes('confetti-system')) return content;
        const script = `<script id="confetti-system">function createConfetti(){const colors=['#ff0000','#00ff00','#0000ff','#ffff00','#ff00ff','#00ffff'];for(let i=0;i<50;i++){const confetti=document.createElement('div');confetti.className='confetti';confetti.style.left=Math.random()*100+'%';confetti.style.backgroundColor=colors[Math.floor(Math.random()*colors.length)];confetti.style.animationDelay=Math.random()*3+'s';document.body.appendChild(confetti);setTimeout(()=>confetti.remove(),4000);}}</script>`;
        const css = `.confetti{position:fixed;top:-10px;width:10px;height:10px;z-index:10005;animation:confetti-fall 3s linear forwards;}@keyframes confetti-fall{to{top:100%;transform:translateY(100%) rotate(720deg);}}`;
        let m = content;
        const sp = m.lastIndexOf('</style>');
        if (sp !== -1) m = m.slice(0, sp) + css + m.slice(sp);
        const bp = m.indexOf('</body>');
        if (bp !== -1) { m = m.slice(0, bp) + script + m.slice(bp); stats.improvements++; this.stats.improvements.confettiEffects++; }
        return m;
    }

    addTypewriterEffect(content, stats) {
        if (content.includes('typewriter-system')) return content;
        const script = `<script id="typewriter-system">function typewriter(element,text,speed=50){let i=0;element.textContent='';const timer=setInterval(()=>{if(i<text.length){element.textContent+=text.charAt(i);i++;}else{clearInterval(timer);}},speed);}document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('[data-typewriter]').forEach(el=>{const text=el.textContent;const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){typewriter(el,text);observer.unobserve(el);}});},{threshold:0.5});observer.observe(el);});});</script>`;
        const bp = content.indexOf('</body>');
        if (bp !== -1) { stats.improvements++; this.stats.improvements.typewriterEffect++; return content.slice(0, bp) + script + content.slice(bp); }
        return content;
    }

    addParticlesBackground(content, stats) {
        if (content.includes('particles-background')) return content;
        const html = `<canvas id="particles-canvas" class="particles-background"></canvas>`;
        const script = `<script>const canvas=document.getElementById('particles-canvas');if(canvas){const ctx=canvas.getContext('2d');canvas.width=window.innerWidth;canvas.height=window.innerHeight;const particles=[];for(let i=0;i<50;i++){particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,vx:Math.random()*2-1,vy:Math.random()*2-1,radius:Math.random()*3+1});}function animate(){ctx.clearRect(0,0,canvas.width,canvas.height);particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>canvas.width)p.vx*=-1;if(p.y<0||p.y>canvas.height)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);ctx.fillStyle='rgba(0,123,255,0.5)';ctx.fill();});requestAnimationFrame(animate);}animate();window.addEventListener('resize',()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;});}</script>`;
        const css = `.particles-background{position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;}`;
        let m = content;
        const sp = m.lastIndexOf('</style>');
        if (sp !== -1) m = m.slice(0, sp) + css + m.slice(sp);
        const bodyStart = m.indexOf('<body');
        if (bodyStart !== -1) {
            const bodyContentStart = m.indexOf('>', bodyStart) + 1;
            m = m.slice(0, bodyContentStart) + '\n' + html + script + '\n' + m.slice(bodyContentStart);
            stats.improvements++;
            this.stats.improvements.particlesBackground++;
        }
        return m;
    }

    addWavesAnimation(content, stats) {
        if (content.includes('waves-animation-svg')) return content;
        const html = `<div class="waves-container" style="display:none;"><svg class="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none"><defs><path id="wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"/></defs><g class="wave-parallax"><use href="#wave" x="48" y="0" fill="rgba(0,123,255,0.7)"/><use href="#wave" x="48" y="3" fill="rgba(0,123,255,0.5)"/><use href="#wave" x="48" y="5" fill="rgba(0,123,255,0.3)"/><use href="#wave" x="48" y="7" fill="#fff"/></g></svg></div>`;
        const css = `.waves-container{position:absolute;bottom:0;left:0;width:100%;overflow:hidden;}.waves{width:100%;height:15vh;min-height:100px;max-height:150px;}.wave-parallax>use{animation:wave-move 25s cubic-bezier(0.55,0.5,0.45,0.5) infinite;}@keyframes wave-move{0%{transform:translate3d(-90px,0,0);}100%{transform:translate3d(85px,0,0);}}`;
        let m = content;
        const sp = m.lastIndexOf('</style>');
        if (sp !== -1) m = m.slice(0, sp) + css + m.slice(sp);
        const bp = m.indexOf('</body>');
        if (bp !== -1) { m = m.slice(0, bp) + html + m.slice(bp); stats.improvements++; this.stats.improvements.wavesAnimation++; }
        return m;
    }

    addMatrixRain(content, stats) {
        if (content.includes('matrix-rain-system')) return content;
        const html = `<canvas id="matrix-canvas" style="display:none;position:fixed;top:0;left:0;z-index:-1;opacity:0.3;"></canvas>`;
        const script = `<script id="matrix-rain-system">const matrixCanvas=document.getElementById('matrix-canvas');if(matrixCanvas){const ctx=matrixCanvas.getContext('2d');matrixCanvas.width=window.innerWidth;matrixCanvas.height=window.innerHeight;const chars='01';const fontSize=14;const columns=matrixCanvas.width/fontSize;const drops=[];for(let i=0;i<columns;i++)drops[i]=1;function drawMatrix(){ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,matrixCanvas.width,matrixCanvas.height);ctx.fillStyle='#0f0';ctx.font=fontSize+'px monospace';for(let i=0;i<drops.length;i++){const text=chars[Math.floor(Math.random()*chars.length)];ctx.fillText(text,i*fontSize,drops[i]*fontSize);if(drops[i]*fontSize>matrixCanvas.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}requestAnimationFrame(drawMatrix);}drawMatrix();}</script>`;
        let m = content;
        const bodyStart = m.indexOf('<body');
        if (bodyStart !== -1) {
            const bodyContentStart = m.indexOf('>', bodyStart) + 1;
            m = m.slice(0, bodyContentStart) + '\n' + html + script + '\n' + m.slice(bodyContentStart);
            stats.improvements++;
            this.stats.improvements.matrixRain++;
        }
        return m;
    }

    addGlitchEffect(content, stats) {
        if (content.includes('glitch-effect-class')) return content;
        const css = `.glitch{position:relative;}.glitch::before,.glitch::after{content:attr(data-text);position:absolute;top:0;left:0;width:100%;height:100%;}.glitch::before{left:2px;text-shadow:-2px 0 #ff00ff;clip:rect(24px,550px,90px,0);animation:glitch-anim-2 3s infinite linear alternate-reverse;}@keyframes glitch-anim-2{0%{clip:rect(61px,9999px,85px,0);}5%{clip:rect(33px,9999px,47px,0);}10%{clip:rect(68px,9999px,40px,0);}15%{clip:rect(14px,9999px,96px,0);}20%{clip:rect(58px,9999px,12px,0);}25%{clip:rect(77px,9999px,63px,0);}30%{clip:rect(23px,9999px,85px,0);}100%{clip:rect(67px,9999px,26px,0);}}`;
        const sp = content.lastIndexOf('</style>');
        if (sp !== -1) { stats.improvements++; this.stats.improvements.glitchEffect++; return content.slice(0, sp) + css + content.slice(sp); }
        return content;
    }

    addNeonText(content, stats) {
        if (content.includes('neon-text-class')) return content;
        const css = `.neon-text{color:#fff;text-shadow:0 0 10px #fff,0 0 20px #fff,0 0 30px #fff,0 0 40px #0ff,0 0 70px #0ff,0 0 80px #0ff,0 0 100px #0ff,0 0 150px #0ff;animation:neon-flicker 1.5s infinite alternate;}.neon-text:hover{animation:neon-flicker 0.5s infinite alternate;}@keyframes neon-flicker{0%,19%,21%,23%,25%,54%,56%,100%{text-shadow:0 0 10px #fff,0 0 20px #fff,0 0 30px #fff,0 0 40px #0ff,0 0 70px #0ff,0 0 80px #0ff,0 0 100px #0ff,0 0 150px #0ff;}20%,24%,55%{text-shadow:none;}}`;
        const sp = content.lastIndexOf('</style>');
        if (sp !== -1) { stats.improvements++; this.stats.improvements.neonText++; return content.slice(0, sp) + css + content.slice(sp); }
        return content;
    }

    addGlassCard(content, stats) {
        if (content.includes('glass-card-class')) return content;
        const css = `.glass-card{background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);border-radius:16px;border:1px solid rgba(255,255,255,0.2);box-shadow:0 8px 32px rgba(0,0,0,0.1);padding:2rem;transition:all 0.3s;}.glass-card:hover{background:rgba(255,255,255,0.15);transform:translateY(-5px);box-shadow:0 12px 40px rgba(0,0,0,0.15);}`;
        const sp = content.lastIndexOf('</style>');
        if (sp !== -1) { stats.improvements++; this.stats.improvements.glassCard++; return content.slice(0, sp) + css + content.slice(sp); }
        return content;
    }

    addBlobShapes(content, stats) {
        if (content.includes('blob-shape-class')) return content;
        const css = `.blob-shape{border-radius:30% 70% 70% 30% / 30% 30% 70% 70%;animation:blob-morph 8s ease-in-out infinite;background:linear-gradient(45deg,var(--primary,#007bff),var(--secondary,#6610f2));}@keyframes blob-morph{0%,100%{border-radius:30% 70% 70% 30% / 30% 30% 70% 70%;}25%{border-radius:58% 42% 75% 25% / 76% 46% 54% 24%;}50%{border-radius:50% 50% 33% 67% / 55% 27% 73% 45%;}75%{border-radius:33% 67% 58% 42% / 63% 68% 32% 37%;}}`;
        const sp = content.lastIndexOf('</style>');
        if (sp !== -1) { stats.improvements++; this.stats.improvements.blobShapes++; return content.slice(0, sp) + css + content.slice(sp); }
        return content;
    }

    addGradientAnimation(content, stats) {
        if (content.includes('gradient-animation-class')) return content;
        const css = `.gradient-animated{background:linear-gradient(-45deg,#ee7752,#e73c7e,#23a6d5,#23d5ab);background-size:400% 400%;animation:gradient-shift 15s ease infinite;}@keyframes gradient-shift{0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}`;
        const sp = content.lastIndexOf('</style>');
        if (sp !== -1) { stats.improvements++; this.stats.improvements.gradientAnimation++; return content.slice(0, sp) + css + content.slice(sp); }
        return content;
    }

    addTextReveal(content, stats) {
        if (content.includes('text-reveal-system')) return content;
        const css = `.text-reveal{position:relative;overflow:hidden;}.text-reveal span{display:inline-block;opacity:0;transform:translateY(100%);animation:reveal-text 0.8s forwards;}.text-reveal span:nth-child(n){animation-delay:calc(0.05s * var(--index));}@keyframes reveal-text{to{opacity:1;transform:translateY(0);}}`;
        const script = `<script>document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('.text-reveal').forEach(el=>{const text=el.textContent;el.innerHTML='';text.split('').forEach((char,i)=>{const span=document.createElement('span');span.textContent=char;span.style.setProperty('--index',i);el.appendChild(span);});});});</script>`;
        let m = content;
        const sp = m.lastIndexOf('</style>');
        if (sp !== -1) m = m.slice(0, sp) + css + m.slice(sp);
        const bp = m.indexOf('</body>');
        if (bp !== -1) { m = m.slice(0, bp) + script + m.slice(bp); stats.improvements++; this.stats.improvements.textReveal++; }
        return m;
    }

    addMagneticButtons(content, stats) {
        if (content.includes('magnetic-buttons-system')) return content;
        const script = `<script id="magnetic-buttons-system">document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('[data-magnetic]').forEach(btn=>{btn.addEventListener('mousemove',e=>{const rect=btn.getBoundingClientRect();const x=e.clientX-rect.left-rect.width/2;const y=e.clientY-rect.top-rect.height/2;btn.style.transform=\`translate(\${x*0.3}px, \${y*0.3}px)\`;});btn.addEventListener('mouseleave',()=>{btn.style.transform='translate(0,0)';});});});</script>`;
        const css = `[data-magnetic]{transition:transform 0.3s ease;}`;
        let m = content;
        const sp = m.lastIndexOf('</style>');
        if (sp !== -1) m = m.slice(0, sp) + css + m.slice(sp);
        const bp = m.indexOf('</body>');
        if (bp !== -1) { m = m.slice(0, bp) + script + m.slice(bp); stats.improvements++; this.stats.improvements.magneticButtons++; }
        return m;
    }

    addCursorFollower(content, stats) {
        if (content.includes('cursor-follower-system')) return content;
        const html = `<div class="cursor-follower"></div>`;
        const script = `<script id="cursor-follower-system">const cursor=document.querySelector('.cursor-follower');if(cursor){document.addEventListener('mousemove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';});document.querySelectorAll('a,button').forEach(el=>{el.addEventListener('mouseenter',()=>cursor.classList.add('active'));el.addEventListener('mouseleave',()=>cursor.classList.remove('active'));});}</script>`;
        const css = `.cursor-follower{position:fixed;width:20px;height:20px;border-radius:50%;border:2px solid var(--primary,#007bff);pointer-events:none;z-index:10006;transition:transform 0.15s ease;transform:translate(-50%,-50%);}.cursor-follower.active{transform:translate(-50%,-50%) scale(2);}`;
        let m = content;
        const sp = m.lastIndexOf('</style>');
        if (sp !== -1) m = m.slice(0, sp) + css + m.slice(sp);
        const bodyStart = m.indexOf('<body');
        if (bodyStart !== -1) {
            const bodyContentStart = m.indexOf('>', bodyStart) + 1;
            m = m.slice(0, bodyContentStart) + '\n' + html + script + '\n' + m.slice(bodyContentStart);
            stats.improvements++;
            this.stats.improvements.cursorFollower++;
        }
        return m;
    }

    addSoundEffects(content, stats) {
        if (content.includes('sound-effects-system')) return content;
        const script = `<script id="sound-effects-system">const sounds={click:new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizcIGWi77OieSxIMU6rm8LViHAU7k9nywnoqBSh+zPLaizsKGGe67OydTBMOV6zl8bFfHQU9k9jxwncnBS2AzfHajDgHH2u98eaeTRQVXrPm8K1cHgU7lNr0xHkpBSx7yvLdk0EHF2S37ueZUxMRVanl8LJgIAQ9ktjyxnknBS19y/LaizYHH2e77OWYURYWWbHn8K9aIAU+k9fyxnooBS19y/Ldiz0HHGa67OSYURYWWbHm8K9aIAU9k9fyxncoBS19y/Ldij0HHGa67OSYURYWWrHn8K9aIAU9k9jyxngoBS19y/Ldiz4HH2a67OOYURYWWbHn8K9aHwU9ktjyxngoBS19y/Ldiz4HH2a67OOYURYVWbLn8K9aHwU9ktjyxncoBS19y/Ldiz4HH2a77OOYURYVWbLn8K9aHwU9ktjyxncoBS19y/Pdiz4HH2a77OOYURYVWbLn8K9aHwU9ktjyxncoBS19y/Pdiz4HH2a77OOYURYVWbLn8K9aHwU9ktjyxncoBS19y/Pdiz4HH2a77OOYURYVWbLn8K9aHwU9ktjyxncoBS19y/Pdiz4HH2a77OOYURYVWbLn8K9aHwU9ktjyxncoBS19y/Pdiz4HH2a77OOYURYV')};function playSound(type){if(sounds[type]){sounds[type].currentTime=0;sounds[type].volume=0.3;sounds[type].play().catch(()=>{});}}</script>`;
        const bp = content.indexOf('</body>');
        if (bp !== -1) { stats.improvements++; this.stats.improvements.soundEffects++; return content.slice(0, bp) + script + content.slice(bp); }
        return content;
    }

    addHapticFeedback(content, stats) {
        if (content.includes('haptic-feedback-system')) return content;
        const script = `<script id="haptic-feedback-system">function vibrate(pattern=10){if('vibrate'in navigator){navigator.vibrate(pattern);}}document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('button,a.btn,[data-haptic]').forEach(el=>{el.addEventListener('click',()=>vibrate(10));});});</script>`;
        const bp = content.indexOf('</body>');
        if (bp !== -1) { stats.improvements++; this.stats.improvements.hapticFeedback++; return content.slice(0, bp) + script + content.slice(bp); }
        return content;
    }

    addGestureControls(content, stats) {
        if (content.includes('gesture-controls-system')) return content;
        const script = `<script id="gesture-controls-system">let touchStartX=0;let touchEndX=0;document.addEventListener('touchstart',e=>{touchStartX=e.changedTouches[0].screenX;});document.addEventListener('touchend',e=>{touchEndX=e.changedTouches[0].screenX;handleGesture();});function handleGesture(){const diff=touchStartX-touchEndX;if(Math.abs(diff)>50){if(diff>0){console.log('Swipe left');}else{console.log('Swipe right');}}}</script>`;
        const bp = content.indexOf('</body>');
        if (bp !== -1) { stats.improvements++; this.stats.improvements.gestureControls++; return content.slice(0, bp) + script + content.slice(bp); }
        return content;
    }

    addVoiceCommands(content, stats) {
        if (content.includes('voice-commands-system')) return content;
        const script = `<script id="voice-commands-system">function initVoiceCommands(){if('webkitSpeechRecognition'in window||'SpeechRecognition'in window){const recognition=new(window.SpeechRecognition||window.webkitSpeechRecognition)();recognition.continuous=true;recognition.lang='fr-FR';recognition.onresult=e=>{const command=e.results[e.results.length-1][0].transcript.toLowerCase();if(command.includes('recherche')){document.getElementById('site-search')?.focus();}else if(command.includes('menu')){document.querySelector('.mobile-menu')?.click();}else if(command.includes('haut')){window.scrollTo({top:0,behavior:'smooth'});}else if(command.includes('bas')){window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'});}};}}document.addEventListener('keydown',e=>{if(e.ctrlKey&&e.key==='v'){initVoiceCommands();}});</script>`;
        const bp = content.indexOf('</body>');
        if (bp !== -1) { stats.improvements++; this.stats.improvements.voiceCommands++; return content.slice(0, bp) + script + content.slice(bp); }
        return content;
    }

    displaySummary() {
        const total = Object.values(this.stats.improvements).reduce((a,b) => a+b, 0);
        console.log(`\n✅ Session 7 terminée: ${total} améliorations sur ${this.stats.processed} layouts\n`);
    }
}

new Session7Enhancer().run();
