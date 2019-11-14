const fs = require('fs')

var jsonDatabasePath = "./bikesdatabase.json"

if (process.env.NODE_ENV === 'test') {
    jsonDatabasePath = "./test/bikesdatabase.json"
}

var jsonDatabaseBackupPath = "./test/bikesdatabaseBackup.json"

exports.write = (databaseObject) => {
    try {
        fs.writeFileSync(jsonDatabasePath, JSON.stringify(databaseObject))
    } catch (err) {
        // If there was an Datase error, log it and throw it back to controller
        console.error(err)
        throw err
    }
}

exports.load = () => {
    try {
        data = fs.readFileSync(jsonDatabasePath, 'utf8')
        return databaseObject = JSON.parse(data)
    } catch (err) {
        // If there was an Datase error, log it and throw it back to controller
        console.error(err)
        throw err
    }
}

exports.loadBackup = () => {
    try {
        data = fs.readFileSync(jsonDatabaseBackupPath, 'utf8')
        return databaseObject = JSON.parse(data)
    } catch (err) {
        // If there was an Datase error, log it and throw it back to controller
        console.error(err)
        throw err
    }
}