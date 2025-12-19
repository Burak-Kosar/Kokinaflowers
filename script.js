/**
 * KOKINA ANİMASYONU - SABİT TASARIM
 * Her yenilemede aynı görünüm
 */

// ============================================
// SABİT DAL TANIMLARI - KALINLAŞTIRILMIŞ
// Her dal için önceden belirlenmiş değerler
// ============================================
const BRANCH_DATA = [
    { angle: -0.45, height: 0.38, curve: 0.08, startX: -15, thickness: 6 },
    { angle: -0.25, height: 0.42, curve: -0.05, startX: -8, thickness: 5.5 },
    { angle: -0.08, height: 0.35, curve: 0.12, startX: -3, thickness: 5 },
    { angle: 0.05, height: 0.40, curve: -0.08, startX: 5, thickness: 5.5 },
    { angle: 0.22, height: 0.36, curve: 0.06, startX: 10, thickness: 5 },
    { angle: 0.42, height: 0.33, curve: -0.10, startX: 18, thickness: 5.2 },
    { angle: -0.55, height: 0.30, curve: 0.15, startX: -20, thickness: 4.5 },
    { angle: 0.55, height: 0.28, curve: -0.12, startX: 22, thickness: 4.5 }
];

// ============================================
// KONFİGÜRASYON - BÜYÜTÜLMÜŞ ÖLÇEKLER
// ============================================
const CONFIG = {
    // Yaprak ayarları - büyütüldü
    leafLength: 16,
    leafWidth: 5,

    // Meyve ayarları - büyütüldü
    berriesPerCluster: 7,
    berryRadius: 7,

    // Saksı ayarları - büyütüldü
    potWidth: 120,
    potHeight: 85,

    // Renkler
    branchColor: '#2d5a16',
    leafColor: '#3a7a1e',
    leafHighlight: '#5aaa3e',
    berryColor: '#cc0000',
    berryHighlight: '#ff4444',
    berryShadow: '#880000'
};

// Animasyon için global değişken
let swayPhase = 0;

// Sabit yaprak pozisyonları (her segment için)
const LEAF_PATTERN = [
    { side: 1, angleOffset: 0.9, lengthMult: 0.85 },
    { side: -1, angleOffset: 1.1, lengthMult: 0.95 },
    { side: 1, angleOffset: 0.75, lengthMult: 0.80 }
];

// Sabit meyve pozisyonları - SIKI SALKIM (tight bunch)
// Meyveler birbirine değecek şekilde, ortası dolu
const BERRY_PATTERN = [
    // Merkez meyve
    { x: 0, y: -5, radiusMult: 1.0 },
    // İç halka (merkeze yakın)
    { x: -4, y: -9, radiusMult: 0.9 },
    { x: 4, y: -8, radiusMult: 0.95 },
    { x: -2, y: -1, radiusMult: 0.85 },
    { x: 3, y: -2, radiusMult: 0.9 },
    // Dış halka
    { x: -8, y: -6, radiusMult: 0.85 },
    { x: 8, y: -5, radiusMult: 0.8 },
    { x: -6, y: -12, radiusMult: 0.9 },
    { x: 6, y: -11, radiusMult: 0.85 },
    { x: 0, y: -14, radiusMult: 0.95 },
    // Ekstra dolgu
    { x: -3, y: -13, radiusMult: 0.75 },
    { x: 3, y: -12, radiusMult: 0.8 }
];

// ============================================
// GLOBAL DEĞİŞKENLER
// ============================================
let canvas, ctx;
let branches = [];

// ============================================
// BAŞLATMA
// ============================================
function init() {
    canvas = document.getElementById('kokina-canvas');
    ctx = canvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        generateBranches();
        draw();
    });

    generateBranches();
    createSnowflakes();
    createStars();
    createSparkles();
    draw();

    setTimeout(() => {
        document.getElementById('message-container').classList.add('visible');
    }, 500);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// ============================================
// DAL OLUŞTURMA - SABİT DEĞERLER
// ============================================
function generateBranches() {
    branches = [];
    const centerX = canvas.width / 2;
    const baseY = canvas.height - CONFIG.potHeight + 5;

    BRANCH_DATA.forEach((data, index) => {
        const branch = generateSingleBranch(
            centerX + data.startX,
            baseY,
            -Math.PI / 2 + data.angle,
            data.height,
            data.curve,
            data.thickness,
            index
        );
        branches.push(branch);
    });

    // Dalları yüksekliğe göre sırala
    branches.sort((a, b) => b.height - a.height);
}

function generateSingleBranch(startX, startY, baseAngle, heightRatio, curveAmount, thickness, branchIndex) {
    const points = [];
    const leaves = [];
    const berryClusters = [];

    let x = startX;
    let y = startY;
    let angle = baseAngle;

    const totalHeight = canvas.height * heightRatio;
    const segments = 10;
    const segmentLength = totalHeight / segments;

    for (let i = 0; i <= segments; i++) {
        points.push({ x, y });

        // Yapraklar - sabit pattern ile
        if (i > 2 && i < segments - 1) {
            const leafPatternIndex = (i + branchIndex) % LEAF_PATTERN.length;
            const leafData = LEAF_PATTERN[leafPatternIndex];

            leaves.push({
                x: x,
                y: y,
                angle: angle + leafData.side * leafData.angleOffset,
                length: CONFIG.leafLength * leafData.lengthMult
            });
        }

        // Sabit eğrilik uygula
        angle += curveAmount * 0.1;
        x += Math.cos(angle) * segmentLength;
        y += Math.sin(angle) * segmentLength;
    }

    // Meyve kümesi - sabit pattern ile
    const lastPoint = points[points.length - 1];
    const cluster = {
        x: lastPoint.x,
        y: lastPoint.y,
        berries: []
    };

    BERRY_PATTERN.forEach(berry => {
        cluster.berries.push({
            offsetX: berry.x,
            offsetY: berry.y,
            radius: CONFIG.berryRadius * berry.radiusMult
        });
    });
    berryClusters.push(cluster);

    return { points, leaves, berryClusters, thickness, height: heightRatio };
}

// ============================================
// ÇİZİM FONKSİYONLARI
// ============================================
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sallanma animasyonu için faz güncelle
    swayPhase += 0.02;

    // 1. Zemin karı (en arkada)
    drawSnowGround();

    // 2. Yılbaşı ağaçları (arka planda) - BÜYÜTÜLDÜ ve merkeze yaklaştırıldı
    drawChristmasTree(120, canvas.height, 1.0);   // Sol ağaç
    drawChristmasTree(canvas.width - 120, canvas.height, 1.0);  // Sağ ağaç

    // 3. Dallar ve yapraklar - ANİMASYONLU
    branches.forEach((branch, index) => {
        drawBranchAnimated(branch, index);
        drawLeavesAnimated(branch, index);
    });

    // 4. Meyveler - ANİMASYONLU
    branches.forEach((branch, index) => {
        drawBerriesAnimated(branch, index);
    });

    // 5. Saksı (en önde)
    drawPot();

    // 6. Ağaç ışıkları (animasyon için ayrı çağrı)
    drawTreeLights();
}

function drawPot() {
    const centerX = canvas.width / 2;
    const baseY = canvas.height;
    const w = CONFIG.potWidth;
    const h = CONFIG.potHeight;

    ctx.save();

    // Zemin Gölgesi (Yeni Eklenen)
    ctx.save();
    ctx.transform(1, 0, 0, 0.3, 0, 0); // Y ekseninde sıkıştır
    ctx.beginPath();
    ctx.ellipse(centerX, (baseY - 5) / 0.3, w * 0.6, h * 0.4, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; // Opaklık artırıldı
    ctx.filter = 'blur(8px)'; // Blur artırıldı
    ctx.fill();
    ctx.restore();

    // Nesne kendi gölgesi (Eski drop shadow - korunuyor)
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 3;

    // Ana gövde - modern antrasit saksı
    ctx.beginPath();
    ctx.moveTo(centerX - w / 2, baseY - h);
    ctx.lineTo(centerX - w / 2 + 8, baseY - 5);
    ctx.quadraticCurveTo(centerX, baseY + 5, centerX + w / 2 - 8, baseY - 5);
    ctx.lineTo(centerX + w / 2, baseY - h);
    ctx.closePath();

    const potGrad = ctx.createLinearGradient(centerX - w / 2, 0, centerX + w / 2, 0);
    potGrad.addColorStop(0, '#2a2a2a');
    potGrad.addColorStop(0.3, '#4a4a4a');
    potGrad.addColorStop(0.5, '#5a5a5a');
    potGrad.addColorStop(0.7, '#4a4a4a');
    potGrad.addColorStop(1, '#2a2a2a');

    ctx.fillStyle = potGrad;
    ctx.fill();

    ctx.restore();

    // Üst kenar
    ctx.beginPath();
    ctx.moveTo(centerX - w / 2 + 3, baseY - h + 2);
    ctx.lineTo(centerX + w / 2 - 3, baseY - h + 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Saksı içi
    ctx.beginPath();
    ctx.ellipse(centerX, baseY - h + 3, w / 2 - 5, 8, 0, 0, Math.PI);
    ctx.fillStyle = '#1a1a1a';
    ctx.fill();
}

// ============================================
// ZEMİN KARI
// ============================================
function drawSnowGround() {
    const baseY = canvas.height;
    const snowHeight = 40;

    // Ana kar zemini
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    ctx.lineTo(0, baseY - snowHeight + 10);

    // Dalgalı kar yüzeyi
    ctx.quadraticCurveTo(canvas.width * 0.15, baseY - snowHeight - 5, canvas.width * 0.25, baseY - snowHeight + 8);
    ctx.quadraticCurveTo(canvas.width * 0.35, baseY - snowHeight + 15, canvas.width * 0.5, baseY - snowHeight + 5);
    ctx.quadraticCurveTo(canvas.width * 0.65, baseY - snowHeight - 5, canvas.width * 0.75, baseY - snowHeight + 10);
    ctx.quadraticCurveTo(canvas.width * 0.85, baseY - snowHeight + 18, canvas.width, baseY - snowHeight + 5);

    ctx.lineTo(canvas.width, baseY);
    ctx.closePath();

    // Kar gradyanı
    const snowGrad = ctx.createLinearGradient(0, baseY - snowHeight, 0, baseY);
    snowGrad.addColorStop(0, '#ffffff');
    snowGrad.addColorStop(0.3, '#f0f5ff');
    snowGrad.addColorStop(0.7, '#e0e8f5');
    snowGrad.addColorStop(1, '#d0d8e8');

    ctx.fillStyle = snowGrad;
    ctx.fill();

    // Kar parıltısı
    ctx.save();
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 20; i++) {
        const x = (i / 20) * canvas.width + 25;
        const y = baseY - snowHeight + 15 + Math.sin(i * 0.8) * 8;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
    ctx.restore();
}

// ============================================
// YILBAŞI AĞACI
// ============================================
// ============================================
// YILBAŞI AĞACI (Tırtıklı & Gölgeli)
// ============================================
function drawChristmasTree(x, baseY, scale) {
    const treeHeight = 180 * scale;
    const layers = 4;

    ctx.save();

    // Zemin Gölgesi - Düzeltildi (basit elips, transform yok)
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(x, baseY - 25, 50 * scale, 12 * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fill();
    ctx.restore();

    // Ağaç gövdesi - GÖRÜNÜR HALE GETİRİLDİ
    const trunkWidth = 24 * scale;
    const trunkHeight = 50 * scale; // Yükseklik artırıldı
    // Gövdeyi daha aşağıdan başlat (kara sapla)
    ctx.beginPath();
    // baseY - 15 noktasına kadar insin
    ctx.rect(x - trunkWidth / 2, baseY - 15 - trunkHeight, trunkWidth, trunkHeight);
    const trunkGrad = ctx.createLinearGradient(x - trunkWidth / 2, 0, x + trunkWidth / 2, 0);
    trunkGrad.addColorStop(0, '#3e2b1f');
    trunkGrad.addColorStop(0.5, '#5d4030');
    trunkGrad.addColorStop(1, '#3e2b1f');
    ctx.fillStyle = trunkGrad;
    ctx.fill();

    // Ağaç katmanları (alttan üste) - Tırtıklı Kenar
    for (let i = 0; i < layers; i++) {
        const layerY = baseY - 40 - (i * treeHeight / layers) - 5;
        const layerWidth = (layers - i) * 38 * scale;
        const layerHeight = treeHeight / layers + 20 * scale;

        ctx.beginPath();

        // Zikzaklı üçgen çizimi
        const startX = x - layerWidth;
        const startY = layerY;
        const peakX = x;
        const peakY = layerY - layerHeight;
        const endX = x + layerWidth;
        const endY = layerY;

        // Sol kenar (zikzak)
        ctx.moveTo(startX, startY);
        const zigzags = 5;
        for (let j = 0; j < zigzags; j++) {
            const t1 = j / zigzags;
            const t2 = (j + 1) / zigzags;

            // Ana hat üzerindeki noktalar
            const p1x = startX + (peakX - startX) * t1;
            const p1y = startY + (peakY - startY) * t1;
            const p2x = startX + (peakX - startX) * t2;
            const p2y = startY + (peakY - startY) * t2;

            // İçeri girinti (diken)
            if (j < zigzags - 1) {
                const midX = p1x + (p2x - p1x) * 0.6 + 5;
                const midY = p1y + (p2y - p1y) * 0.6 + 2;
                ctx.lineTo(midX, midY);
            }
            ctx.lineTo(p2x, p2y);
        }

        // Sağ kenar (zikzak) - Simetrik olarak düzeltildi
        for (let j = 0; j < zigzags; j++) {
            const t1 = j / zigzags;
            const t2 = (j + 1) / zigzags;

            const p1x = peakX + (endX - peakX) * t1;
            const p1y = peakY + (endY - peakY) * t1;
            const p2x = peakX + (endX - peakX) * t2;
            const p2y = peakY + (endY - peakY) * t2;

            // İçeri girinti (diken) - sol tarafla simetrik
            if (j < zigzags - 1) {
                const midX = p1x + (p2x - p1x) * 0.6 - 5;
                const midY = p1y + (p2y - p1y) * 0.6 + 2;
                ctx.lineTo(midX, midY);
            }
            ctx.lineTo(p2x, p2y);
        }

        // Alt kenar (kavisli)
        ctx.quadraticCurveTo(x, layerY + 15, startX, startY);
        ctx.closePath();

        // Yeşil gradient
        const treeGrad = ctx.createLinearGradient(x - layerWidth, layerY - layerHeight, x + layerWidth, layerY);
        treeGrad.addColorStop(0, '#0a2e0a');
        treeGrad.addColorStop(0.3, '#145214');
        treeGrad.addColorStop(0.5, '#1e7b1e');
        treeGrad.addColorStop(0.8, '#145214');
        treeGrad.addColorStop(1, '#0a2e0a');

        ctx.fillStyle = treeGrad;
        ctx.fill();

        // Kenar ışığı
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1.5;
        // ctx.stroke(); // Kenar çizgisi bazen yapay durabiliyor, kapalı kalsın
    }

    // Yıldız (tepe)
    const starY = baseY - 40 - treeHeight - 15;
    drawStar(x, starY, 14 * scale, '#ffd700');

    ctx.restore();
}

function drawStar(x, y, size, color) {
    ctx.save();
    ctx.beginPath();

    for (let i = 0; i < 5; i++) {
        const outerAngle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const innerAngle = outerAngle + Math.PI / 5;

        const outerX = x + Math.cos(outerAngle) * size;
        const outerY = y + Math.sin(outerAngle) * size;
        const innerX = x + Math.cos(innerAngle) * size * 0.4;
        const innerY = y + Math.sin(innerAngle) * size * 0.4;

        if (i === 0) {
            ctx.moveTo(outerX, outerY);
        } else {
            ctx.lineTo(outerX, outerY);
        }
        ctx.lineTo(innerX, innerY);
    }

    ctx.closePath();
    ctx.fillStyle = color;
    ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.restore();
}

// ============================================
// AĞAÇ IŞIKLARI (Yanıp Sönen)
// ============================================
let lightPhase = 0;

function drawTreeLights() {
    lightPhase += 0.05;

    // Sol ağaç ışıkları - scale 1.0 (ağaçlarla uyumlu)
    drawTreeLightsAt(120, canvas.height, 1.0);
    // Sağ ağaç ışıkları
    drawTreeLightsAt(canvas.width - 120, canvas.height, 1.0);

    // Işıkları animasyonla güncelle
    requestAnimationFrame(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw();
    });
}

function drawTreeLightsAt(x, baseY, scale) {
    const colors = ['#ff0000', '#ffff00', '#00ff00', '#ff00ff', '#00ffff', '#ffa500'];

    // Işık pozisyonları - HEM SOL HEM SAĞ TARAFA DAĞITILDI
    const lights = [
        // Sol taraf
        { xOff: -35, yOff: 55 },
        { xOff: -45, yOff: 80 },
        { xOff: -30, yOff: 110 },
        { xOff: -50, yOff: 140 },
        { xOff: -25, yOff: 165 },
        // Sağ taraf
        { xOff: 35, yOff: 60 },
        { xOff: 45, yOff: 85 },
        { xOff: 30, yOff: 115 },
        { xOff: 50, yOff: 145 },
        { xOff: 25, yOff: 170 },
        // Orta kısım
        { xOff: -10, yOff: 70 },
        { xOff: 10, yOff: 95 },
        { xOff: -5, yOff: 125 },
        { xOff: 8, yOff: 155 }
    ];

    lights.forEach((light, i) => {
        const brightness = 0.5 + 0.5 * Math.sin(lightPhase + i * 0.5);
        const color = colors[i % colors.length];

        ctx.save();
        ctx.globalAlpha = brightness;
        ctx.beginPath();
        ctx.arc(x + light.xOff * scale, baseY - 40 - light.yOff * scale, 4 * scale, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
    });
}

function drawBranch(branch) {
    if (branch.points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(branch.points[0].x, branch.points[0].y);

    for (let i = 1; i < branch.points.length - 1; i++) {
        const xc = (branch.points[i].x + branch.points[i + 1].x) / 2;
        const yc = (branch.points[i].y + branch.points[i + 1].y) / 2;
        ctx.quadraticCurveTo(branch.points[i].x, branch.points[i].y, xc, yc);
    }

    const last = branch.points[branch.points.length - 1];
    ctx.lineTo(last.x, last.y);

    ctx.strokeStyle = CONFIG.branchColor;
    ctx.lineWidth = branch.thickness;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
}

function drawLeaves(branch) {
    branch.leaves.forEach(leaf => {
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.angle);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(leaf.length * 0.5, -CONFIG.leafWidth / 2, leaf.length, 0);
        ctx.quadraticCurveTo(leaf.length * 0.5, CONFIG.leafWidth / 2, 0, 0);

        const leafGrad = ctx.createLinearGradient(0, 0, leaf.length, 0);
        leafGrad.addColorStop(0, CONFIG.branchColor);
        leafGrad.addColorStop(0.5, CONFIG.leafColor);
        leafGrad.addColorStop(1, CONFIG.leafHighlight);

        ctx.fillStyle = leafGrad;
        ctx.fill();

        ctx.restore();
    });
}

// ============================================
// ANİMASYONLU ÇİZİM FONKSİYONLARI
// ============================================
function getSwayOffset(pointIndex, totalPoints, branchIndex) {
    // Her dal için farklı faz
    const phase = swayPhase + branchIndex * 0.5;
    // Saksıdan uca doğru artan amplitüd
    const amplitude = (pointIndex / totalPoints) * 8;
    return Math.sin(phase) * amplitude;
}

function drawBranchAnimated(branch, branchIndex) {
    if (branch.points.length < 2) return;

    const animatedPoints = branch.points.map((point, i) => ({
        x: point.x + getSwayOffset(i, branch.points.length, branchIndex),
        y: point.y
    }));

    ctx.beginPath();
    ctx.moveTo(animatedPoints[0].x, animatedPoints[0].y);

    for (let i = 1; i < animatedPoints.length - 1; i++) {
        const xc = (animatedPoints[i].x + animatedPoints[i + 1].x) / 2;
        const yc = (animatedPoints[i].y + animatedPoints[i + 1].y) / 2;
        ctx.quadraticCurveTo(animatedPoints[i].x, animatedPoints[i].y, xc, yc);
    }

    const last = animatedPoints[animatedPoints.length - 1];
    ctx.lineTo(last.x, last.y);

    ctx.strokeStyle = CONFIG.branchColor;
    ctx.lineWidth = branch.thickness;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
}

function drawLeavesAnimated(branch, branchIndex) {
    branch.leaves.forEach((leaf, leafIndex) => {
        // Yaprağın dalın hangi noktasına yakın olduğunu bul
        const progress = leafIndex / branch.leaves.length;
        const swayOff = getSwayOffset(Math.floor(progress * branch.points.length), branch.points.length, branchIndex);

        ctx.save();
        ctx.translate(leaf.x + swayOff, leaf.y);
        ctx.rotate(leaf.angle + Math.sin(swayPhase + branchIndex) * 0.05);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(leaf.length * 0.5, -CONFIG.leafWidth / 2, leaf.length, 0);
        ctx.quadraticCurveTo(leaf.length * 0.5, CONFIG.leafWidth / 2, 0, 0);

        const leafGrad = ctx.createLinearGradient(0, 0, leaf.length, 0);
        leafGrad.addColorStop(0, CONFIG.branchColor);
        leafGrad.addColorStop(0.5, CONFIG.leafColor);
        leafGrad.addColorStop(1, CONFIG.leafHighlight);

        ctx.fillStyle = leafGrad;
        ctx.fill();

        ctx.restore();
    });
}

function drawBerriesAnimated(branch, branchIndex) {
    // Meyve kümeleri dalın ucunda, en çok sallanan kısım
    const swayOff = getSwayOffset(branch.points.length - 1, branch.points.length, branchIndex);

    branch.berryClusters.forEach(cluster => {
        cluster.berries.forEach(berry => {
            const x = cluster.x + berry.offsetX + swayOff;
            const y = cluster.y + berry.offsetY;
            const r = berry.radius;

            // Dış glow efekti
            ctx.save();
            ctx.shadowColor = 'rgba(255, 50, 50, 0.6)';
            ctx.shadowBlur = 10;

            // Gölge
            ctx.beginPath();
            ctx.arc(x + 1, y + 1, r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(100,0,0,0.3)';
            ctx.fill();

            // Meyve - daha parlak renkler
            const berryGrad = ctx.createRadialGradient(x - r / 3, y - r / 3, 0, x, y, r);
            berryGrad.addColorStop(0, '#ff6666');
            berryGrad.addColorStop(0.4, '#ee0000');
            berryGrad.addColorStop(0.8, '#cc0000');
            berryGrad.addColorStop(1, '#880000');

            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = berryGrad;
            ctx.fill();

            ctx.restore();

            // Parlak nokta
            ctx.beginPath();
            ctx.arc(x - r / 3, y - r / 3, r / 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.fill();

            // İkinci küçük parlak nokta
            ctx.beginPath();
            ctx.arc(x - r / 5, y - r / 2, r / 6, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.fill();
        });
    });
}

// Eski fonksiyonları yedek olarak bırak (gerekirse kullanılabilir)
function drawBranch(branch) { drawBranchAnimated(branch, 0); }
function drawLeaves(branch) { drawLeavesAnimated(branch, 0); }
function drawBerries(branch) { drawBerriesAnimated(branch, 0); }

// ============================================
// KAR EFEKTİ
// ============================================
function createSnowflakes() {
    const container = document.getElementById('snow-container');

    // Sabit kar tanesi pozisyonları
    const snowData = [
        { left: 5, duration: 8, delay: 0, size: 14, opacity: 0.5 },
        { left: 15, duration: 10, delay: 2, size: 12, opacity: 0.4 },
        { left: 25, duration: 7, delay: 1, size: 16, opacity: 0.6 },
        { left: 35, duration: 9, delay: 3, size: 11, opacity: 0.5 },
        { left: 45, duration: 11, delay: 0.5, size: 13, opacity: 0.4 },
        { left: 55, duration: 8, delay: 2.5, size: 15, opacity: 0.5 },
        { left: 65, duration: 10, delay: 1.5, size: 12, opacity: 0.6 },
        { left: 75, duration: 9, delay: 4, size: 14, opacity: 0.4 },
        { left: 85, duration: 7, delay: 0, size: 16, opacity: 0.5 },
        { left: 95, duration: 11, delay: 3, size: 11, opacity: 0.6 },
        { left: 10, duration: 9, delay: 5, size: 13, opacity: 0.4 },
        { left: 30, duration: 8, delay: 4, size: 15, opacity: 0.5 },
        { left: 50, duration: 10, delay: 2, size: 12, opacity: 0.6 },
        { left: 70, duration: 7, delay: 1, size: 14, opacity: 0.4 },
        { left: 90, duration: 9, delay: 3, size: 16, opacity: 0.5 },
        { left: 20, duration: 11, delay: 0, size: 11, opacity: 0.6 },
        { left: 40, duration: 8, delay: 2, size: 13, opacity: 0.4 },
        { left: 60, duration: 10, delay: 4, size: 15, opacity: 0.5 },
        { left: 80, duration: 9, delay: 1, size: 12, opacity: 0.6 },
        { left: 12, duration: 7, delay: 3, size: 14, opacity: 0.4 },
        { left: 28, duration: 11, delay: 5, size: 16, opacity: 0.5 },
        { left: 48, duration: 8, delay: 0, size: 11, opacity: 0.6 },
        { left: 68, duration: 10, delay: 2, size: 13, opacity: 0.4 },
        { left: 88, duration: 9, delay: 4, size: 15, opacity: 0.5 },
        { left: 8, duration: 7, delay: 1, size: 12, opacity: 0.6 }
    ];

    const snowflakes = ['❄', '❅', '❆', '•'];

    snowData.forEach((data, i) => {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = snowflakes[i % snowflakes.length];
        snowflake.style.left = data.left + '%';
        snowflake.style.animationDuration = data.duration + 's';
        snowflake.style.animationDelay = data.delay + 's';
        snowflake.style.fontSize = data.size + 'px';
        snowflake.style.opacity = data.opacity;
        container.appendChild(snowflake);
    });
}

// ============================================
// YILDIZ EFEKTİ
// ============================================
function createStars() {
    const container = document.getElementById('stars-container');
    if (!container) return;

    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2;overflow:hidden;';

    const starData = [
        { left: 10, top: 15, size: 2, delay: 0 },
        { left: 25, top: 8, size: 3, delay: 0.5 },
        { left: 40, top: 22, size: 2, delay: 1 },
        { left: 55, top: 12, size: 4, delay: 0.3 },
        { left: 70, top: 18, size: 2, delay: 0.8 },
        { left: 85, top: 10, size: 3, delay: 0.2 },
        { left: 15, top: 35, size: 2, delay: 1.2 },
        { left: 80, top: 28, size: 3, delay: 0.6 },
        { left: 5, top: 25, size: 2, delay: 0.9 },
        { left: 95, top: 20, size: 2, delay: 1.5 },
        { left: 35, top: 5, size: 3, delay: 0.4 },
        { left: 60, top: 30, size: 2, delay: 1.1 }
    ];

    starData.forEach(data => {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = data.left + '%';
        star.style.top = data.top + '%';
        star.style.width = data.size + 'px';
        star.style.height = data.size + 'px';
        star.style.animationDelay = data.delay + 's';
        container.appendChild(star);
    });
}

// ============================================
// IŞILTI EFEKTİ
// ============================================
function createSparkles() {
    const container = document.getElementById('sparkle-container');
    if (!container) return;

    const sparkleData = [
        { left: 20, top: 40, delay: 0, size: 4 },
        { left: 45, top: 35, delay: 0.8, size: 5 },
        { left: 70, top: 42, delay: 1.5, size: 4 },
        { left: 30, top: 50, delay: 0.4, size: 3 },
        { left: 55, top: 55, delay: 1.2, size: 5 },
        { left: 80, top: 48, delay: 0.6, size: 4 },
        { left: 15, top: 35, delay: 1.8, size: 3 }, // Yukarı taşındı (60 -> 35)
        { left: 65, top: 45, delay: 0.2, size: 5 }
    ];

    sparkleData.forEach(data => {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = data.left + '%';
        sparkle.style.top = data.top + '%';
        sparkle.style.width = data.size + 'px';
        sparkle.style.height = data.size + 'px';
        sparkle.style.animationDelay = data.delay + 's';
        container.appendChild(sparkle);
    });
}

// ============================================
// BAŞLAT
// ============================================
window.addEventListener('load', init);
