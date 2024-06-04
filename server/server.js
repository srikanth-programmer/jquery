const express = require('express')
const fs = require('fs')
const cors = require('cors')
const app = express()
const PORT = 3000;
const path = require('path')
app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, '..', 'db', 'form.json');

// admin

// app.use(bodyParser.json());

app.get('/api/requests', (req, res) => {
    console.log("reached")
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data' });
        }
        res.json(JSON.parse(data));
    });
});

app.post('/api/requests/update', (req, res) => {
    const { employeeId, approved } = req.body;
    console.log(typeof(employeeId),employeeId)
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data' });
        }
        let requests = JSON.parse(data);
        const requestIndex = requests.findIndex(req => req.employeeId === employeeId);
        if (requestIndex !== -1) {
            requests[requestIndex].approved = approved;
            fs.writeFile(filePath, JSON.stringify(requests, null, 2), err => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to update data' });
                }
                res.json({ success: true });
            });
        } else {
            res.status(404).json({ error: 'Request not found' });
        }
    });
});


// users
 
function readExistingData(callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return callback(null, []);
            }
            return callback(err);
        }

        let existingData = {};
        if (data) {
            try {
                existingData = JSON.parse(data) ;
                console.log(existingData)
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                return callback(parseError);
            }
        }
         
        callback(null, existingData);
        return;
    });
}
app.post('/submit-form', (req, res) => {

    const newFormData = req.body;
    newFormData.approved = "pending";
    readExistingData((err, existingData) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }
        id = newFormData.employeeId
        for(let i =0;i<existingData;i++){
            if (id == existingData[i].employeeId){
                res.status(500).send('Record already exist');
            }
        }
        existingData.push(newFormData);
         
        const updatedData = JSON.stringify(existingData, null, 2);
        console.log(existingData,updatedData)
        
        fs.writeFile(filePath, updatedData, (err) => {
            if (err) {
                res.status(500).send('Internal Server Error');
            } else {
                res.status(200).send('Form data appended successfully.');
            }
        });
    });
});
 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
