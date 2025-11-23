const fs = require('fs');
const path = require('path');

const layoutsDir = path.join(__dirname, 'templates/layouts');
const files = fs.readdirSync(layoutsDir).filter(f => f.endsWith('.html'));

let count = 0;
files.forEach(file => {
    const filePath = path.join(layoutsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Ajouter {hero_content} après {hero_subtitle}
    if (!content.includes('{hero_content}') && content.includes('{hero_subtitle}')) {
        content = content.replace('{hero_subtitle}', '{hero_subtitle}\n            <div class="hero-description">{hero_content}</div>');
        console.log(`✅ ${file} - hero_content ajouté`);
        modified = true;
    }

    // Ajouter {cta_button} après {cta_text} ou {hero_content}
    if (!content.includes('{cta_button}')) {
        if (content.includes('{cta_text}')) {
            content = content.replace('{cta_text}', '{cta_text}\n            <a href="#contact" class="btn-cta">{cta_button}</a>');
        } else if (content.includes('{hero_content}')) {
            content = content.replace('{hero_content}', '{hero_content}\n            <a href="#contact" class="btn-cta">{cta_button}</a>');
        }
        modified = true;
    }

    // Ajouter {navigation_menu} dans <nav> si manquant
    if (!content.includes('{navigation_menu}') && content.match(/<nav[^>]*>/)) {
        content = content.replace(/<nav([^>]*)>/, '<nav$1>\n        <div class="nav-menu">{navigation_menu}</div>');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content);
        count++;
    }
});

console.log(`\n✅ ${count}/${files.length} layouts modifiés`);
