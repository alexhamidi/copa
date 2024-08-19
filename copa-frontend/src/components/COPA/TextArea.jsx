import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function TextArea() {
    const [dataReturnedSuccessfully, setDataReturnedSuccessfully] = useState(false);
    const [returnedData, setReturnedData] = useState({});
    const [result, setResult] = useState('');
    const [formData, setFormData] = useState({
        s1_distance:'',
        asa:'',
        p_ka_of_s0:'',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            axios.post('https://friendly-mountie-34761-cb952c5c6fed.herokuapp.com/api/copatext', formData)
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

    useEffect(() => {
        setResult(`Result: ${returnedData.predicted_class ? 'reveribly oxidizing' : 'not reversibly oxidizing'}. Reasons: ${returnedData.reason_for_class_prediction}`);
    }, [returnedData]);

    return (
        <section id='textArea'>
            <form className='textInputs' onSubmit={handleSubmit}>
                <label>Enter s1_distance: <input type = 'text' name='s1_distance' value={formData.s1_distance} onChange={handleChange}></input></label>
                <label>Enter asa: <input type = 'text' name='asa' value={formData.asa} onChange={handleChange}></input></label>
                <label>Enter p_ka_of_s0: <input type = 'text' name='p_ka_of_s0' value={formData.p_ka_of_s0} onChange={handleChange}></input></label>
                <input id = 'submit' type = 'submit'/>
            </form>
            <div className='results'>
                {dataReturnedSuccessfully && <div> {result} </div> }
            </div>
        </section>
    )
}
