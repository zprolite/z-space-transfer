// --- Particles Animation ---
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '-1';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
for (let i = 0; i < 100; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5
    });
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// --- Upload Handling ---
const uploadForm = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const emailInput = document.getElementById('emailInput');
const titleInput = document.getElementById('titleInput');
const progressContainer = document.getElementById('progressContainer');
const progressRing = document.getElementById('progressRing');
const progressText = document.getElementById('progressText');
const resultMessage = document.getElementById('resultMessage');
const resultLink = document.getElementById('resultLink');

uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (fileInput.files.length === 0 || emailInput.value.trim() === '' || titleInput.value.trim() === '') {
        alert('Please select files, enter a title, and provide a recipient email.');
        return;
    }

    const formData = new FormData();
    for (let i = 0; i < fileInput.files.length; i++) {
        formData.append('file', fileInput.files[i]);
    }

    progressContainer.style.display = 'flex';
    progressText.textContent = '0%';
    setProgress(0);

    try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://file.io');

        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percentComplete = Math.round((e.loaded / e.total) * 100);
                setProgress(percentComplete);
            }
        });

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    setProgress(100);
                    resultMessage.textContent = 'Transfer Complete!';
                    resultLink.innerHTML = `<br><a href="${response.link}" target="_blank">${response.link}</a>`;
                } else {
                    alert('Upload failed. Please try again.');
                }
            }
        };

        xhr.send(formData);

    } catch (error) {
        console.error('Upload error:', error);
        alert('Upload failed. Please try again.');
    }
});

function setProgress(percent) {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;
    progressRing.style.strokeDashoffset = offset;
    progressText.textContent = `${percent}%`;
}
