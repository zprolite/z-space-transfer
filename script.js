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
