import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function PBD() {
    const [dataReturnedSuccessfully, setDataReturnedSuccessfully] = useState(true);
    const [returnedData, setReturnedData] = useState([]);
    const [pbdid, setPbdid] = useState('');

    const results = [
        {
            residiue_id:123,
            amino_acids: [
                {
                    type: 'ligase'
                } 
                //and so on (x20)

            ],
            is_susceptible: 1,
            rule: 'too much sauce',
            is_already_ocidized,
        }
    ]

    const handleChange = (e) => {
        pbdid = e.target
    };

        const handleSubmit = (e) => {
        e.preventDefault();
        try {
            axios.post('http://localhost:3000/api/pbdid', pbdid) // just pbd:x
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
            const errorMessage = `Error parsing data: ${error.message}`;
            alert(errorMessage);
            console.error(errorMessage);
        }
    }

    // Push back everything during the retrieval. Current code supports results, and array of js objects.

    return (
        <section id='textArea'>
            <form className='textInputs' onSubmit={handleSubmit}>
                <label>Enter pbd id <input type='text' name='pbd' value={pbdid} onChange={handleChange} /></label>
                <input id='submit' type='submit' />
            </form>
            <div className='results'>
                {dataReturnedSuccessfully &&
                    <table className='result'>
                        <thead>
                            <tr>
                                <th>Thiol</th>
                                <th>Oxidation Susceptibility</th>
                                <th>Rule</th>
                                <th>Already Oxidized</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((row, rowIndex) => ( // instead of results, will be returnedData
                                <tr key={rowIndex}>
                                    <td>{rowIndex+1}</td>
                                    {Object.keys(row).map((param, index) => (
                                        <td key={index}>{row[param]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }
            </div>
        </section>
    )
}


    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     try {
    //         axios.post('http://localhost:3000/api/copatext', formData)
    //             .then(response => {
    //                 setReturnedData(response.data);
    //                 setDataReturnedSuccessfully(true);
    //             })
    //             .catch(error => {
    //                 let errorMessage = 'An error occurred during the POST request.';
    //                 if (error.response && error.response.data && error.response.data.error) {
    //                     errorMessage = error.response.data.error;
    //                 }
    //                 console.error('Error:', errorMessage);
    //                 throw new Error(errorMessage);
    //             });
    //     } catch (error) {
    //         const errorMessage = `Error parsing data: ${error.message}`;
    //         alert(errorMessage);
    //         console.error(errorMessage);
    //     }
    // }