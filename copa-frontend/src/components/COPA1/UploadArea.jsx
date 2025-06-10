import React, { useState } from 'react';
import axios from 'axios';

export default function UploadArea() {
    const [returnedData, setReturnedData] = useState([]);
    const [dataReturnedSuccessfully, setDataReturnedSuccessfully] = useState(false);

    const handleFile = () => {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];
        if (!file) {
            alert('No file selected.');
            return;
        }
        const reader = new FileReader();
        reader.readAsText(file);
        
        reader.onload = function(event) {
            const content = event.target.result;
            try {
                const jsonData = JSON.parse(content);
                axios.post('http://localhost:3000/api/copafile', jsonData)
                    .then(response => {
                        setReturnedData(response.data);
                        setDataReturnedSuccessfully(true);
                    })
                    .catch(error => {
                        let errorMessage = 'An error occurred during the POST request.';
                        if (error.response && error.response.data && error.response.data.error) {
                            errorMessage = error.response.data.error;
                        }
                        console.error('Error:', errorMessage);
                        throw new Error(errorMessage);
                    });
            } catch (error) {
                const errorMessage = `Error parsing JSON file: ${error.message}`;
                alert(errorMessage);
                console.error(errorMessage);
            }
        };
    };

    const handleChange = () => {
        setDataReturnedSuccessfully(false)
    }

    const downloadFile = () => {
        if (returnedData.length === 0) {
            alert('No data to download.');
            return;
        }

        const blob = new Blob([JSON.stringify(returnedData)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'results.json';
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    }

    return (
        <section id='uploadArea'>
            <header> Supported: .json array. Must include s1_distance, asa, and p_ka_of_s0 as parameters for each object. </header>
            <input type="file" id="fileInput" accept=".json" onChange={handleChange} />
            <button onClick={handleFile}>Upload JSON</button>
            {dataReturnedSuccessfully && <button onClick={downloadFile}>Download Results</button>}
        </section>
    );
}
