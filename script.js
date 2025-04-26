
const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const emailInput = document.getElementById('email-input');
const titleInput = document.getElementById('title-input');
const progressContainer = document.getElementById('progress-container');
const progressText = document.getElementById('progress-text');
const message = document.getElementById('message');
const downloadLink = document.getElementById('download-link');
const downloadBtn = document.getElementById('download-btn');
const fileTitle = document.getElementById('file-title');

if (uploadBtn) {
  uploadBtn.addEventListener('click', async () => {
    const files = fileInput.files;
    if (!files.length || !emailInput.value || !titleInput.value) {
      alert('Please select files, enter a title, and recipient email.');
      return;
    }

    let formData = new FormData();
    Array.from(files).forEach(file => formData.append('file', file));
    progressContainer.classList.remove('hidden');

    const response = await fetch('https://file.io', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    if (result.success) {
      message.innerText = 'Transfer Complete';
      downloadLink.innerHTML = `<a href="${result.link}" target="_blank">${result.link}</a>`;
    } else {
      message.innerText = 'Transfer Failed. Please try again.';
    }
  });
}

if (downloadBtn) {
  downloadBtn.addEventListener('click', async () => {
    progressContainer.classList.remove('hidden');
    const url = new URL(window.location.href);
    const fileUrl = url.searchParams.get('file');
    const title = url.searchParams.get('title');
    if (title) fileTitle.innerText = title;

    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = "downloaded_file";
    link.click();
    message.innerText = 'Download Complete';
  });
}

// Particles background
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createParticles() {
  particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: Math.random() * 0.5 - 0.25,
      speedY: Math.random() * 0.5 - 0.25
    });
  }
}
createParticles();

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();
