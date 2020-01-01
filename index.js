const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const port = 8000
const app = express()
const csv = require('csv-parser')
const fs = require('fs')
const controller = require('./controller')
const response = require('./response')
const cors = require('cors')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

app.listen(port, () => console.log('listen to ', port))

app.get('/', (req,res) => {     
    controller.index(req,res)    
});

app.post('/dataset', (req,res) => {        
        
    const readStream = request.get(req.body.url)
    const ownerId = req.body.ownerId
    const datasetId = req.body.datasetId
    
    const writeStream = readStream.pipe(fs.createWriteStream('uploads/dataset'+ownerId+'.csv'))                
    writeStream.on('finish', () => {
        fs.createReadStream('uploads/dataset'+ownerId+'.csv')
            .pipe(csv())
            .on('data', (data) => {
                controller.insertData(req,res,data,ownerId, datasetId)
            })
            .on('error', (err) =>  {
                console.log(err);
                response.failed('fail to upload dataset', res)
            })
            .on('end', () => {
                console.log('done');
                response.ok('upload dataset complete', res)
        })
    }) 
})

app.get('/labeli/dataset', (req,res) => {
    controller.getData(req,res,req.body.userId)
})

app.get('/kontribusi', (req,res) => {
    controller.getKontribusi(req,res,req.body.userId)
})

app.get('/labeli/dilabeli', (req,res) => {    
    controller.getLabeledData(req,res, req.body.ownerId, req.body.datasetId)
})

app.post('/labeli/update', (req,res) => {
    // const data = JSON.parse(req.body.data)
    const data = req.body.data
    controller.updateLabel(req,res,data)
})