/**
 * Charlemagne Jerusalem - Digital Calling Card & Portfolio
 * Core Application Logic:
 *  - 3D Flippable Calling Card
 *  - RFC 6350 vCard Generator (Save Contact .vcf)
 *  - Dual-Mode Scannable QR Code (Portfolio Web URL vs Direct vCard)
 *  - High-Res QR Image Export
 *  - Theme Toggle & Toast Notifications
 */

document.addEventListener('DOMContentLoaded', () => {
  // State variables
  let currentQrMode = 'url'; // 'url' | 'vcard'
  let qrCodeInstance = null;
  let avatarBase64 = '';

  // Elements
  const callingCard = document.getElementById('calling-card');
  const btnToggleFlip = document.getElementById('btn-toggle-flip');
  const flipBtnLabel = document.getElementById('flip-btn-label');
  const btnFlipBack = document.getElementById('btn-flip-back');
  const qrcodeBox = document.getElementById('qrcode-box');
  const tabUrl = document.getElementById('tab-url');
  const tabVcard = document.getElementById('tab-vcard');
  const qrModeHeading = document.getElementById('qr-mode-heading');
  const qrCaptionText = document.getElementById('qr-caption-text');
  const qrCurrentUrl = document.getElementById('qr-current-url');
  const btnEditUrl = document.getElementById('btn-edit-url');
  const btnDownloadQr = document.getElementById('btn-download-qr');
  const urlModal = document.getElementById('url-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnSaveUrl = document.getElementById('btn-save-url');
  const btnResetUrl = document.getElementById('btn-reset-url');
  const inputCustomUrl = document.getElementById('input-custom-url');
  const themeToggle = document.getElementById('theme-toggle');
  const themeColorMeta = document.getElementById('theme-color-meta');
  const toast = document.getElementById('toast');

  // Contact Action Buttons
  const headerVcardBtn = document.getElementById('header-vcard-btn');
  const btnDownloadVcard = document.getElementById('btn-download-vcard');
  const dockVcardBtn = document.getElementById('dock-vcard-btn');
  const ctaVcardBtn = document.getElementById('cta-vcard-btn');
  const dockQrBtn = document.getElementById('dock-qr-btn');

  // Pre-load avatar as Base64 for rich vCard embedding
  preloadAvatarBase64();

  // ==========================================================================
  // 1. THEME MANAGEMENT (Clean Light Default + Dark Mode Option)
  // ==========================================================================
  function initTheme() {
    const savedTheme = localStorage.getItem('cj_theme');
    if (savedTheme === 'dark') {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      if (themeColorMeta) themeColorMeta.setAttribute('content', '#090d16');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      if (themeColorMeta) themeColorMeta.setAttribute('content', '#ffffff');
    }
  }

  function toggleTheme() {
    if (document.body.classList.contains('dark-theme')) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      localStorage.setItem('cj_theme', 'light');
      if (themeColorMeta) themeColorMeta.setAttribute('content', '#ffffff');
      showToast('Switched to Clean Light mode');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      localStorage.setItem('cj_theme', 'dark');
      if (themeColorMeta) themeColorMeta.setAttribute('content', '#090d16');
      showToast('Switched to Dark mode');
    }
  }

  themeToggle?.addEventListener('click', toggleTheme);
  initTheme();

  // ==========================================================================
  // 2. 3D FLIPPABLE CALLING CARD CONTROLLER
  // ==========================================================================
  function flipCard(forceState = null) {
    if (!callingCard) return;
    const willBeFlipped = forceState !== null ? forceState : !callingCard.classList.contains('is-flipped');
    
    if (willBeFlipped) {
      callingCard.classList.add('is-flipped');
      if (flipBtnLabel) flipBtnLabel.textContent = 'Flip to Card Front';
    } else {
      callingCard.classList.remove('is-flipped');
      if (flipBtnLabel) flipBtnLabel.textContent = 'Flip Card (View QR Code)';
    }
  }

  // Flip when clicking card body, except when clicking interactive pills or buttons
  callingCard?.addEventListener('click', (e) => {
    if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.qr-mode-switcher') || e.target.closest('input')) {
      return;
    }
    flipCard();
  });

  // Accessible keyboard support for card
  callingCard?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (e.target === callingCard) {
        e.preventDefault();
        flipCard();
      }
    }
  });

  btnToggleFlip?.addEventListener('click', () => flipCard());
  btnFlipBack?.addEventListener('click', (e) => {
    e.stopPropagation();
    flipCard(false);
  });

  dockQrBtn?.addEventListener('click', () => {
    const cardSection = document.getElementById('card-section');
    if (cardSection) {
      cardSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        flipCard(true);
      }, 400);
    }
  });

  // ==========================================================================
  // 3. vCARD GENERATOR (RFC 6350 / vCard 3.0 Standard)
  // ==========================================================================
  function generateVCardString(withPhoto = true) {
    const vcardLines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Jerusalem;Charlemagne;;;',
      'FN:Charlemagne Jerusalem',
      'TITLE:Cybersecurity Enthusiast & Ethical Hacker',
      'ORG:PHINMA Saint Jude College Manila;CyberwireZ',
      'TEL;TYPE=CELL,VOICE,PREF:(+63) 969-168-3923',
      'EMAIL;TYPE=INTERNET,PREF:jerusalemcharlemagne@gmail.com',
      'ADR;TYPE=HOME:;;Manila;NCR;;Philippines',
      'URL;TYPE=LinkedIn:https://www.linkedin.com/in/charlemagne-jerusalem/',
      'URL;TYPE=TryHackMe:https://tryhackme.com/p/Carlomagno',
      'URL;TYPE=HackTheBox:https://app.hackthebox.com/public/users/2135805',
      'NOTE:Cybersecurity & Ethical Hacking student. Top 15 ASEAN Cyber Shield 2025 Korea, Hack4Gov Top 8, TryHackMe Top 1%, HTB Top 2 PH. BSIT 4th Year.'
    ];

    if (withPhoto && avatarBase64) {
      vcardLines.push(`PHOTO;ENCODING=b;TYPE=PNG:${avatarBase64}`);
    }

    vcardLines.push('END:VCARD');
    return vcardLines.join('\r\n');
  }

  function downloadVCard() {
    try {
      const vcardContent = generateVCardString(true);
      const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.setAttribute('download', 'Charlemagne_Jerusalem.vcf');
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);

      showToast('Contact file downloaded! Tap to save in your phone contacts.');
    } catch (err) {
      console.error('Error generating vCard:', err);
      showToast('Failed to generate contact file.');
    }
  }

  // Attach vCard download listeners to all "Save Contact" buttons
  [headerVcardBtn, btnDownloadVcard, dockVcardBtn, ctaVcardBtn].forEach(btn => {
    btn?.addEventListener('click', downloadVCard);
  });

  // Pre-fetch avatar to convert into clean Base64 for the vCard
  function preloadAvatarBase64() {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 160;
        canvas.height = 160;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 160, 160);
        const dataURL = canvas.toDataURL('image/png');
        avatarBase64 = dataURL.replace(/^data:image\/png;base64,/, '');
      } catch (e) {
        console.warn('Could not encode avatar to base64 for vCard:', e);
      }
    };
    img.src = 'assets/avatar.png';
  }

  // ==========================================================================
  // 4. SMART DUAL-MODE QR CODE ENGINE
  // ==========================================================================
  function getEffectiveUrl() {
    const stored = localStorage.getItem('cj_custom_qr_url');
    if (stored && stored.trim() !== '') {
      return stored.trim();
    }
    // Fallback to current browser location
    if (window.location.protocol.startsWith('http')) {
      return window.location.href.split('#')[0];
    }
    // Default GitHub Pages URL
    return 'https://charjer.github.io/digital-calling-card/';
  }

  function renderQrCode() {
    if (!qrcodeBox) return;

    // Clear previous QR element
    qrcodeBox.innerHTML = '';

    let qrPayload = '';
    const currentUrl = getEffectiveUrl();

    if (qrCurrentUrl) {
      qrCurrentUrl.textContent = currentUrl;
    }

    if (currentQrMode === 'url') {
      qrPayload = currentUrl;
      if (qrModeHeading) qrModeHeading.textContent = 'Portfolio Web Link';
      if (qrCaptionText) qrCaptionText.textContent = 'Scans directly to open Charlemagne\'s portfolio in any mobile browser.';
    } else {
      // Direct vCard mode: encodes compact offline vCard directly in the QR code
      qrPayload = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'N:Jerusalem;Charlemagne;;;',
        'FN:Charlemagne Jerusalem',
        'TITLE:Cybersecurity Enthusiast',
        'ORG:PHINMA Saint Jude College',
        'TEL:+639691683923',
        'EMAIL:jerusalemcharlemagne@gmail.com',
        'URL:https://www.linkedin.com/in/charlemagne-jerusalem/',
        'END:VCARD'
      ].join('\n');

      if (qrModeHeading) qrModeHeading.textContent = 'Direct Contact Card';
      if (qrCaptionText) qrCaptionText.textContent = 'Scans straight into your phone\'s address book without needing an internet connection.';
    }

    try {
      // Use QRCode library
      qrCodeInstance = new QRCode(qrcodeBox, {
        text: qrPayload,
        width: 150,
        height: 150,
        colorDark: '#0f172a',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    } catch (e) {
      console.error('Error generating QR Code:', e);
    }
  }

  // QR Mode Switcher Tab Handlers
  tabUrl?.addEventListener('click', (e) => {
    e.stopPropagation();
    currentQrMode = 'url';
    tabUrl.classList.add('active');
    tabVcard?.classList.remove('active');
    renderQrCode();
  });

  tabVcard?.addEventListener('click', (e) => {
    e.stopPropagation();
    currentQrMode = 'vcard';
    tabVcard.classList.add('active');
    tabUrl?.classList.remove('active');
    renderQrCode();
  });

  // Initial QR Code Generation
  renderQrCode();

  // ==========================================================================
  // 5. DOWNLOAD QR CODE IMAGE
  // ==========================================================================
  btnDownloadQr?.addEventListener('click', () => {
    try {
      const qrCanvas = qrcodeBox.querySelector('canvas');
      const qrImg = qrcodeBox.querySelector('img');
      
      let sourceDataUrl = '';
      if (qrCanvas) {
        sourceDataUrl = qrCanvas.toDataURL('image/png');
      } else if (qrImg && qrImg.src) {
        sourceDataUrl = qrImg.src;
      }

      if (!sourceDataUrl) {
        showToast('Unable to export QR code.');
        return;
      }

      // Draw onto a branded composite card canvas
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = 400;
      exportCanvas.height = 480;
      const ctx = exportCanvas.getContext('2d');

      // Card Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 400, 480);

      // Border
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, 380, 460);

      // Title & Header Text
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Charlemagne Jerusalem', 200, 50);

      ctx.fillStyle = '#2563eb';
      ctx.font = '600 13px Inter, sans-serif';
      ctx.fillText('Digital Calling Card & Portfolio', 200, 72);

      // Draw QR Code
      const qrImageObj = new Image();
      qrImageObj.onload = function() {
        ctx.drawImage(qrImageObj, 75, 105, 250, 250);

        // Subtitle / Contact details
        ctx.fillStyle = '#475569';
        ctx.font = '500 12px JetBrains Mono, monospace';
        ctx.fillText('(+63) 969-168-3923', 200, 390);
        ctx.fillText('jerusalemcharlemagne@gmail.com', 200, 410);

        ctx.fillStyle = '#64748b';
        ctx.font = '500 11px Inter, sans-serif';
        ctx.fillText(currentQrMode === 'url' ? 'Scan to view web portfolio' : 'Scan to save to contacts', 200, 440);

        // Export
        const exportUrl = exportCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = exportUrl;
        link.download = `Charlemagne_Jerusalem_QR_${currentQrMode}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast('QR Code badge saved as PNG image!');
      };
      qrImageObj.src = sourceDataUrl;

    } catch (e) {
      console.error('Error downloading QR code:', e);
      showToast('Could not download QR image.');
    }
  });

  // ==========================================================================
  // 6. CUSTOM URL SETTINGS MODAL
  // ==========================================================================
  btnEditUrl?.addEventListener('click', () => {
    if (inputCustomUrl) {
      inputCustomUrl.value = getEffectiveUrl();
    }
    urlModal?.classList.add('is-active');
  });

  btnCloseModal?.addEventListener('click', () => {
    urlModal?.classList.remove('is-active');
  });

  urlModal?.addEventListener('click', (e) => {
    if (e.target === urlModal) {
      urlModal.classList.remove('is-active');
    }
  });

  btnSaveUrl?.addEventListener('click', () => {
    const newUrl = inputCustomUrl ? inputCustomUrl.value.trim() : '';
    if (newUrl) {
      localStorage.setItem('cj_custom_qr_url', newUrl);
      renderQrCode();
      urlModal?.classList.remove('is-active');
      showToast('QR Code updated with custom web link!');
    }
  });

  btnResetUrl?.addEventListener('click', () => {
    localStorage.removeItem('cj_custom_qr_url');
    renderQrCode();
    urlModal?.classList.remove('is-active');
    showToast('Reset QR link to current browser address.');
  });

  // ==========================================================================
  // 7. TOAST NOTIFICATION UTILITY
  // ==========================================================================
  let toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3200);
  }
});
