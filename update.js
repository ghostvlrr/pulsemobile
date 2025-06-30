// APK indirme ve güncelleme kontrolü
const versionUrl = 'app-version.json';
const downloadBtn = document.getElementById('downloadBtn');
const updateInfo = document.getElementById('updateInfo');
const changelogDiv = document.getElementById('changelog');

// Uygulamanın mevcut sürümünü burada manuel belirt (veya dinamik çek)
const currentVersion = "1.0.0"; // Bunu her yeni APK'da güncelle

fetch(versionUrl)
  .then(res => res.json())
  .then(data => {
    downloadBtn.onclick = () => {
      window.location.href = data.apkUrl;
    };
    changelogDiv.innerText = data.changelog || '';
    if (data.latestVersion !== currentVersion) {
      updateInfo.innerHTML = `<span style="color:red;font-weight:bold;">Yeni sürüm mevcut: v${data.latestVersion}</span>`;
    } else {
      updateInfo.innerHTML = `<span style="color:green;">Uygulamanız güncel.</span>`;
    }
  });

// Galeriye otomatik görsel ekle (statik çözüm, dinamik için sunucu tarafı gerekir)
const gallery = document.getElementById('gallery');
const images = [
  'mockup1.png',
  'mockup2.png',
  'mockup3.png',
  'mockup4.png',
  'mockup5.png',
  'mockup6.png',
  'mockup7.png',
  'mockup8.png',
  // src/images klasöründeki görsellerin isimlerini buraya ekle
];
images.forEach(img => {
  const el = document.createElement('img');
  el.src = 'src/images/' + img;
  el.alt = 'Uygulama Görseli';
  el.classList.add('fade-in');
  gallery.appendChild(el);
});

// Modern slider/karusel okları ile galeri kaydırma
const leftBtn = document.getElementById('galleryLeft');
const rightBtn = document.getElementById('galleryRight');

// SLIDER/KARUSEL LOGİĞİ
const galleryDots = document.getElementById('galleryDots');
let currentSlide = 0;
let sliderInterval = null;

function setGalleryHeight() {
  const imgs = gallery.querySelectorAll('img');
  if (!imgs.length) return;
  const activeImg = imgs[currentSlide];
  if (activeImg && activeImg.complete) {
    gallery.style.height = activeImg.offsetHeight + 'px';
  } else if (activeImg) {
    activeImg.onload = () => {
      gallery.style.height = activeImg.offsetHeight + 'px';
    };
  }
}

function showSlide(idx) {
  const imgs = gallery.querySelectorAll('img');
  if (!imgs.length) return;
  imgs.forEach((img, i) => {
    img.style.opacity = (i === idx) ? '1' : '0';
    img.style.pointerEvents = (i === idx) ? 'auto' : 'none';
    img.style.zIndex = (i === idx) ? '2' : '1';
    img.style.position = 'absolute';
    img.style.left = 0;
    img.style.top = 0;
    img.style.right = 0;
    img.style.margin = 'auto';
    img.style.transition = 'opacity 0.4s';
  });
  setGalleryHeight();
  // Dotları güncelle
  if (galleryDots) {
    galleryDots.innerHTML = '';
    imgs.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === idx ? ' active' : '');
      dot.onclick = () => { currentSlide = i; showSlide(i); resetSliderInterval(); };
      galleryDots.appendChild(dot);
    });
  }
}
function nextSlide() {
  const imgs = gallery.querySelectorAll('img');
  if (!imgs.length) return;
  currentSlide = (currentSlide + 1) % imgs.length;
  showSlide(currentSlide);
}
function prevSlide() {
  const imgs = gallery.querySelectorAll('img');
  if (!imgs.length) return;
  currentSlide = (currentSlide - 1 + imgs.length) % imgs.length;
  showSlide(currentSlide);
}
function resetSliderInterval() {
  if (sliderInterval) clearInterval(sliderInterval);
  sliderInterval = setInterval(nextSlide, 3500);
}
// Galeriye img'leri ekledikten sonra slider başlat
function startSliderWhenImagesLoaded() {
  const imgs = gallery.querySelectorAll('img');
  if (!imgs.length) return;
  let loaded = 0;
  imgs.forEach(img => {
    if (img.complete) loaded++;
    else img.onload = () => { loaded++; if (loaded === imgs.length) startSlider(); };
  });
  if (loaded === imgs.length) startSlider();
}
function startSlider() {
  const imgs = gallery.querySelectorAll('img');
  if (imgs.length) {
    gallery.style.position = 'relative';
    imgs.forEach(img => { img.style.position = 'absolute'; img.style.width = '100%'; img.style.left = 0; img.style.top = 0; });
    showSlide(0);
    resetSliderInterval();
  }
}
setTimeout(startSliderWhenImagesLoaded, 200);
if (leftBtn && rightBtn && gallery) {
  leftBtn.onclick = () => { prevSlide(); resetSliderInterval(); };
  rightBtn.onclick = () => { nextSlide(); resetSliderInterval(); };
  // Mobil swipe desteği
  let startX = null;
  gallery.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });
  gallery.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) { nextSlide(); } else { prevSlide(); }
      resetSliderInterval();
    }
    startX = null;
  });
  // Hover'da duraklat
  gallery.addEventListener('mouseenter', () => { if (sliderInterval) clearInterval(sliderInterval); });
  gallery.addEventListener('mouseleave', () => { resetSliderInterval(); });
}

// SSS Akordeon (sadece bir tanesi açık kalsın)
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  item.addEventListener('click', function(e) {
    if (!e.target.classList.contains('faq-q') && !e.target.classList.contains('faq-toggle')) return;
    // Diğer açık olanı kapat
    faqItems.forEach(i => { if (i !== this) i.classList.remove('open'); });
    this.classList.toggle('open');
  });
}); 