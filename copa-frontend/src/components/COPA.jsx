import React, { useState } from 'react';
import UploadArea from './COPA1/UploadArea';
import TextArea from './COPA1/TextArea';



export default function COPA() {
    const [inputTypeText, setInputTypeText] = useState(false);


    function handleInputChange() {
        setInputTypeText(!inputTypeText);
    }

    return (
        <div className='page'>
            <header className = 'title'> Cysteine Oxidation Prediction Algorithm (COPA)</header> 

            <section className = 'text'>
                <p>
                    A C4.5 decision tree applied to the BALOSCTdb was used to develop an algorithm that segregates protein
cysteines into oxidation-susceptible and oxidation-nonsusceptible classes. When this algorithm was applied to
cysteines in the BALOSCTdb, it was able to properly
classify the cysteines in 80.4% of the cases. To use COPA, you can either input a .json file containing an array of objects, each with s1_distance,
 asa, and p_ka_of_s0 as parameters, or you can input text for these fields.  
                </p>
            </section>
            <fieldset id = 'inputFormats' > Input Format:  
                <label>File<input type='radio' checked = {!inputTypeText} onChange={handleInputChange}/> </label>
                <label>Text<input type='radio' checked = {inputTypeText} onChange={handleInputChange}/></label>
            </fieldset>
            {!inputTypeText && <UploadArea/>}
            {inputTypeText && <TextArea/>}
        </div>
    );
}
