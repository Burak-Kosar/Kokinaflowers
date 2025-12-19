# Kokina Animasyon Projesi - Memory Bank

## Proje Özeti
Yılbaşı temalı, sevdiklerine gönderilecek bir hediye animasyon sitesi. Herhangi bir satış yok, sadece görsel bir deneyim.

## Görsel Konsept
- **Ana Öğeler**: Saksı + Kokina dalları (Ruscus)
- **Çiçek Detayları**:
    - Yeşil dikenimsi yapraklar
    - Dalların uçlarında parlak kırmızı top şeklinde meyveler
- **Yılbaşı Teması**: Kar yağışı efekti

## Referans Görseller
Proje için kullanıcı tarafından sağlanan örnek Kokina fotoğrafları:
- `uploaded_image_0_1765831608649.jpg` - Elde tutulan kokina buketi
- `uploaded_image_1_1765831608649.png` - Bağlanmış kokina dalları (şeffaf arka plan)

## Teknik Kararlar
| Özellik | Karar |
|---------|-------|
| Animasyon Teknolojisi | HTML5 Canvas |
| Başlatma | **Statik** (Sayfa açıldığında hazır) |
| Görsel Tarz | Gerçekçi illüstrasyon |
| Dalların Yapısı | Daha ayrık, ferah (Revize edilecek) |
| Meyve Yoğunluğu | Daha az, doğal dağılım (Revize edilecek) |

## Animasyon Akışı
1. Sayfa açılır → Çiçek ve saksı hazır durur
2. Kar efekti yağar
3. Mesaj belirir

## Dosya Yapısı
```
P2/
├── index.html      # Ana HTML
├── style.css       # Stiller, kar efekti
├── script.js       # Canvas animasyon mantığı
└── assets/         # Ek görseller (varsa)
```

## Notlar
- Satış yok, sadece görsel deneyim
- Mobil uyumlu olmalı
- Akıcı animasyon (60 FPS hedef)
