/**
 * Configure the server and create databases
 * @authors Milan Karunarathne <mhkarunarathne@gmail.com>
 *
 * USAGE:
 *
 */

'use strict';

let nano = require('nano')('http://localhost:5984');
let debug = require('debug')('src:routes/apps');
var argv = require('minimist')(process.argv.slice(2));

const dbInfo = {
    'phr_users': [],
    'phr_apps_journal': [{
        "_id": "_design/apps",
        "language": "javascript",
        "views": {
            "by_type": {
                "map": "function(doc) {\n  emit(doc.type, doc);\n}"
            }
        }
    }],
    'phr_apps_appointments': [{
        "_id": "_design/apps",
        "language": "javascript",
        "views": {
            "by_type": {
                "map": "function(doc) {\n  emit(doc.type, doc);\n}"
            }
        }
    }]
};
console.log(argv);
nano.auth(argv.u, argv.p, (err, body, headers) => {
    if(!err) {
        const auth = headers['set-cookie'];
        nano = require('nano')({
            url : 'http://localhost:5984',
            cookie: auth
        });
        for(let dbName of Object.keys(dbInfo)) {
            nano.db.get(dbName, (err, body) => {
                if(err) { // If database doesn't exists, then create
                    console.log('DB details: ', err.reason);
                    nano.db.create(dbName, (err, body) => {
                        console.log(`Database ${dbName} created. `);
                        if(!err) { // If Database created, then insert data
                            let docs = dbInfo[dbName];
                            for(let doc of docs) {
                                let db = nano.use(dbName);
                                db.insert(doc, (err, newDoc) => {
                                    if(!err) {
                                        console.log(
                                            'Data insertition successful.'
                                        );
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
    }
});
