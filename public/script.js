// script.js
document.getElementById('itemForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const files = formData.getAll('images');

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        formData.append(`image${i}`, file);
    }

    formData.delete('images');

    try {
        const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            document.getElementById('message').textContent = 'Item successfully uploaded!';
        } else {
            document.getElementById('message').textContent = 'Error uploading item.';
        }
    } catch (error) {
        document.getElementById('message').textContent = 'Error uploading item.';
    }
});
