const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const results = [];

fs.createReadStream('old.csv')
    .pipe(csv(['Name', 'Date', 'WorkTime']))
    .on('data', (data) => results.push(data))
    .on('end', () => {
        const csvWriter = createCsvWriter({
            path: 'done.csv',
            header: [
                {id: 'Name/Date', title: 'Name/Date'}
            ]
        });
        csvWriter.writeRecords(answ)       // returns a promise
            .then(() => {
                console.log('...Done');
            });
        console.log(answ);
    });
