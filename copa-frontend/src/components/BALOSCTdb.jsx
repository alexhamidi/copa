import React, { useEffect, useState } from 'react'
import balosctdbData from '../json/balosctdb.json'

export default function BALOSCTdb() {
    const balosctdb = balosctdbData.balosctdb
    const initialParams = {
        pdb_id: true, chain: true, sequence_position: true, sequence: true, s1_distance: true,
        s1_position: true, s1_asa: true, n1_distance: true, n1_donor: true, n1_id: true,
        n1_position: true, n1_asa: true, o1_distance: true, o1_donor: true, o1_id: true,
        o1_position: true, o1_asa: true, asa: true, ep_of_s0: true, p_ka_of_s0: true,
        class: true, ref_structure: true, molecule: true, oxidant: true, ligand: true,
        source: true, classification: true, ec_number: true
    };

    const [ctrlPressed, setCtrlPressed] = useState(false);
    const [shiftPressed, setShiftPressed] = useState(false);
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [selectedParams, setSelectedParams] = useState(() => {
        const savedParams = JSON.parse(localStorage.getItem('balosctdbSelectedParams'));
        return savedParams || initialParams;
    });


    useEffect(() => {
        localStorage.setItem('balosctdbSelectedParams', JSON.stringify(selectedParams));
    }, [selectedParams]);


    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

   
    const handleMouseDown = (event) => {
        event.preventDefault(); 
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Shift') {
            setShiftPressed(true);
        } else if (event.key === 'Control' || event.key === 'Meta') {
            setCtrlPressed(true);
        }
    };

    const handleKeyUp = (event) => {
        if (event.key === 'Shift') {
            setShiftPressed(false);
        } else if (event.key === 'Control' || event.key === 'Meta') {
            setCtrlPressed(false);
        }
    };

    const handleCellClick = (object, rowIndex, param, index) => {
        if (shiftPressed) {
            let newSet = new Set(selectedRows); // Create a new Set based on current selectedRows

            const minValue = Math.min(...selectedRows);
            const maxValue = Math.max(...selectedRows);
            let startingPoint;
            let endingPoint
            if (rowIndex < minValue) {
                startingPoint = rowIndex;
                endingPoint = minValue;
            } else if (rowIndex > maxValue) {
                startingPoint = maxValue;
                endingPoint = rowIndex;
            } else {
                startingPoint = rowIndex;
                endingPoint = maxValue;
            }
            for (let i = startingPoint; i <= endingPoint; i++) {
                newSet.add(i);
            }
            setSelectedRows(newSet);
        } else if (ctrlPressed) {
            if (selectedRows.has(rowIndex)) {
                selectedRows.delete(rowIndex);
            } else {
                setSelectedRows((prevSet) => new Set(prevSet).add(rowIndex));
            }
        } else {
            setSelectedRows(new Set().add(rowIndex));
        }
    }

    const handleParamToggle = (param) => {
        setSelectedParams({ ...selectedParams, [param]: !selectedParams[param] }); //makes the changed parameter opposite in value
    };

    const handleDownload = () => {
        if (selectedRows.size===0) {
            alert('Error: No data selected')
        } else {
            let download = [];
            for (const index of selectedRows) {
                let filteredEntry = {};
                for (const key in balosctdb[index]) {
                    if (selectedParams[key]) {
                        filteredEntry[key] = balosctdb[index][key];
                    }
                }
                download.push(filteredEntry);
            }
            const json = JSON.stringify(download, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'balosctdb_download.json';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    const handleFullScreen = () => {
        const databaseElement = document.querySelector('.database');
        if (databaseElement.requestFullscreen) {
            databaseElement.requestFullscreen();
        } else if (databaseElement.webkitRequestFullscreen) {
            databaseElement.webkitRequestFullscreen();
        } else if (databaseElement.mozRequestFullScreen) {
            databaseElement.mozRequestFullScreen();
        }
    }

    return (
        <div className='page' onMouseDown={handleMouseDown}>
            <header className = 'title'> Balanced Oxidation Susceptible Cysteine Thiol Database (BALOSCTdb)</header> 
            <section className = 'text'>
                <p>
                    
                                    To achieve balance between
                    oxidization-susceptible and oxidation-non-susceptible
                    cysteine thiols, the number of oxidation-non-susceptible
                    cysteines was lowered to 161 in a randomized fashion
                    to create a balanced OSCTdb (BALOSCTdb). Algorithm
                    development and statistical analysis were performed on
                    data in BALOSCTdb
                    <br/>
                    <br/>
                    To modify the information displayed in the database, simply select parameters from the box below. 
To download data from the database, select elements and download the selection by clicking the download 
button. Select single elements by clicking, multiply elements by ctrl-clicking, and groups of elements by shift-clicking.
                </p>
            </section>
            <section className='aboveTable'>
                <fieldset className='parameters'>
                    {Object.keys(selectedParams).map(param => ( //for every param in selectedParam, do this:
                        <label key={param}>
                            {param}
                            <input
                            type="checkbox"
                            checked={selectedParams[param]} //refrers to the values above
                            onChange={() => handleParamToggle(param)} //change function
                            />
                        </label>
                    ))}
                </fieldset>
                <div className='tableOptions'>
                    <button onClick={handleFullScreen}> 
                        <svg width="4vw" height="4vw" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none"><path d="M6 1H1V6H3V3H6V1Z" fill="black"/><path d="M3 10H1V15H6V13H3V10Z" fill="black"/><path d="M15 1H10V3L13 3L13 6H15L15 1Z" fill="black"/><path d="M15 15V10H13V13H10V15H15Z" fill="black"/></svg>
                    </button>
                    <button onClick={handleDownload}>
                        <svg width="4vw" height="4vw" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M21 15.6V19.2C21 20.1941 20.1941 21 19.2 21H4.8C3.80589 21 3 20.1941 3 19.2V15.6H4.8V19.2H19.2V15.6H21ZM12.9 12.5272L15.8636 9.5636L17.1364 10.8364L12 15.9728L6.86362 10.8364L8.13641 9.5636L11.1 12.5272V3H12.9V12.5272Z" fill="#000000"/></svg>
                    </button>
                </div>
            </section>
            <section className='database'>
                <table>
                    
                    <thead>
                        {/* Make headers sticky */}
                        {/* Want: on click to everything in that row be selected - pass something to the object? */}
                        {/* Use localstorage to save selected params */}
                        {/* Wierd extra line on the right of the table  */}
                        <tr> 
                        {Object.keys(selectedParams).map((param, index) => ( //first is the value, second is the index.
                            selectedParams[param] && <th key={index}>{param}</th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                        {balosctdb.map((object, rowIndex) => (
                        <tr key={rowIndex}>
                            {Object.keys(selectedParams).map((param, index) => (
                                selectedParams[param] && <td key={index} className={selectedRows.has(rowIndex) ? 'selected' : 'notSelected'} onClick={() => handleCellClick(object, rowIndex, param, index)}>{object[param]}</td>
                            ))}
                        </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
  )
}
