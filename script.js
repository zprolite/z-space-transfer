
document.addEventListener('DOMContentLoaded', function () {
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const emailInput = document.getElementById('emailInput');
    const titleInput = document.getElementById('titleInput');
    const progressContainer = document.getElementById('progressContainer');
    const progressValue = document.getElementById('progressValue');
    const completionMessage = document.getElementById('completionMessage');
    const downloadLinkContainer = document.getElementById('downloadLinkContainer');
    const downloadLinkElement = document.getElementById('downloadLink');

    uploadForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const files = fileInput.files;
        const recipientEmail = emailInput.value;
        const customTitle = titleInput.value;

        if (files.length === 0 || !recipientEmail || !customTitle) {
            alert('Please select files, enter a title, and a recipient email.');
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('file', files[i]);
        }

        progressContainer.style.display = 'block';
        progressValue.textContent = '0%';

        const uploadUrl = 'https://file.io/api/v1/upload'; // Correct upload URL
        fetch(uploadUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                progressValue.textContent = '100%';
                completionMessage.style.display = 'block';
                downloadLinkContainer.style.display = 'block';
                downloadLinkElement.href = data.link;
                downloadLinkElement.textContent = data.link;
            } else {
                alert('Upload failed. Please try again.');
                console.error(data);
            }
        })
        .catch(error => {
            alert('Upload failed. Please try again.');
            console.error('Upload error:', error);
        });
    });
});
