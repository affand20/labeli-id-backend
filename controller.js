const connect = require('./db/db')
const response = require('./response')

exports.allData = (req, res) => {
    connect.query('SELECT * FROM dataset', (err, rows, field) => {
        if (err) {
            console.log(err);            
        } else {
            response.ok(rows, res)
        }
    })
}

exports.insertData = (req,res,data, ownerId, datasetId) => {
    connect.query('INSERT INTO dataset ('+
        'text, owner_id, dataset_id) '+        
        'values (?,?,?)',
    [ data.text, ownerId, datasetId ],
    (error, rows, fields) => {
        if(error){
            console.log('error: ',error)
        } else{
            // response.ok("Berhasil menambahkan dataset!", res)
            console.log('berhasil menambahkan dataset!')
        }
    });
}

// fetch satu data yang labelnya <4 dan belum pernah dilabeli oleh user
exports.getData = (req,res,userId) => {
    connect.query("SELECT * FROM dataset WHERE "+
    "(`label_1` IS NULL OR `label_2` IS NULL OR `label_3` IS NULL OR `label_4` IS NULL) AND "+
    "("+
        "(`pelabel_1`!=? OR pelabel_1 IS NULL) AND "+
        "(`pelabel_2`!=? OR pelabel_2 IS NULL) AND "+
        "(`pelabel_3`!=? OR pelabel_3 IS NULL) AND "+
        "(`pelabel_4`!=? OR pelabel_4 IS NULL)"+
    ") ORDER BY RAND() LIMIT 1",
    [ userId, userId, userId, userId ],
    (err, rows, fields) => {
        if (err) {
            console.log('error:', error);
        } else {
            response.ok(rows, res)
        }
    })
}

exports.index = (req,res) => {
    response.ok("Hello from nodejs restful API!", res);
}

exports.getKontribusi = (req,res, userId) => {
    connect.query("SELECT COUNT(*) AS kontribusi FROM `dataset` WHERE "+
    "`pelabel_1`=? OR `pelabel_2`=? OR `pelabel_3`=? OR `pelabel_4`=?",
    [ userId, userId, userId, userId ],
    (err, rows, fields) => {
        if (err) {
            console.log('error:', error);        
        } else {
            response.ok(rows, res)
        }
    })
}

exports.updateLabel = (req,res,data) => {    
    connect.query("UPDATE dataset SET "+
    "label_1=?, label_2=?, label_3=?, label_4=?, pelabel_1=?, pelabel_2=?, pelabel_3=?, pelabel_4=? "+
    "WHERE id=?", 
    [ data.label_1, data.label_2, data.label_3, data.label_4, data.pelabel_1, data.pelabel_2, data.pelabel_3, data.pelabel_4, data.id ],
    (err, rows, fields) => {
        if (err) {
            console.log('error:', err);            
        } else {
            response.ok('berhasil update label', res)
        }
    })
}

exports.getLabeledData = (req,res, ownerId, datasetId) => {    
    connect.query("SELECT COUNT(*) as total FROM dataset WHERE label_1 IS NOT NULL AND label_2 IS NOT NULL "+
    "AND label_3 IS NOT NULL AND label_4 IS NOT NULL AND pelabel_1 IS NOT NULL AND pelabel_2 "+
    "IS NOT NULL AND pelabel_3 IS NOT NULL AND pelabel_4 IS NOT NULL AND owner_id=? AND dataset_id=?",
    [ ownerId, datasetId ],
    (err, rows, fields) => {
        if (err) {
            console.log('error:', err);
        } else {
            response.ok(rows, res)
        }
    })
}