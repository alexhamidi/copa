function handleFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('No file selected.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
        const content = event.target.result;
        try {
            const jsonData = JSON.parse(content);
            displayJSON(jsonData);
        } catch (e) {
            alert('Error parsing JSON file.');
            console.error(e);
        }
    };

    reader.readAsText(file);
}

function displayJSON(jsonData) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '<pre>' + JSON.stringify(jsonData, null, 2) + '</pre>';
}
