exports.ok = (val, res) => { 
    const data = {
        'status': 200,
        'value': val
    }
    res.json(data);
    res.end();
}

exports.failed = (val, res) => {
    const data = {
        'status': 400,
        'value': val
    }
    res.json(data);
    res.end()
}