const http = require('http');
const express = require('express')
const cors = require('cors');

const app = express();

app.use(cors({
    origin: ['http://localhost:5173'], 
    methods: ['POST'], 
}))
require('dotenv').config();

app.use(express.json());

function returnClassifiedItem(item) {
    let reason;
    let reversiblyOxidizing;
    if (!(item.s1_distance && item.asa && item.p_ka_of_s0)) {
        throw new Error('Missing Field')
    }

    if (item.s1_distance < 3) {
        reversiblyOxidizing = 0;
        reason = 'permanent disulfide bond present (s1_distance less than 3)';
    } else if (item.s1_distance <= 6.2) {
        reversiblyOxidizing = 1;
        reason = 'low distance between the two thiols (s1_distance between 3 and 6.2)';
    } else if (item.asa <= 1.3) {
        reversiblyOxidizing = 0;
        reason = 'low solvent accessible surface area (asa less than/equal to 1.3)';
    } else if (item.p_ka_of_s0 <= 9.05) {
        reversiblyOxidizing = 1;
        reason = 'low pKa (pka_of_s0 less than/equal to 9.05)';
    } else {
        reversiblyOxidizing = 0;
        reason = 'high pKa (pka_of_s0 greater than 9.05)';
    }

    item["predicted_class"] = reversiblyOxidizing;
    item["reason_for_class_prediction"] = reason;

    return item;
}


app.post('/api/copafile', (req, res) => {
    try {
        let jsonData;
        if (Array.isArray(req.body)) {
            jsonData = req.body;
        } else {
            for (const i in req.body) {
                if (Array.isArray(req.body[i])) {
                    jsonData = req.body[i];
                    break;
                }
            }   
        }
        if (!jsonData) {
            throw new Error('Incorrect Format')
        }
        let result = [];
        for (const item of jsonData) {
            result.push(returnClassifiedItem(item));
        }
        res.status(200).json(result);
    } catch (error) {
        console.error('Error returning data:', error.message);
        res.status(400).json({ error: error.message }); // Send error message in JSON response
    }
})


app.post('/api/copatext', (req, res) => {
    try {
        let result = returnClassifiedItem(req.body);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error returning data:', error.message);
        res.status(400).json({ error: error.message }); // Send error message in JSON response
    }
})

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});