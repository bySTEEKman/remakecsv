const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const moment = require('moment');
const results = [];
const answ = [];

fs.createReadStream('old.csv')
    .pipe(csv(['Name', 'Date', 'Time']))
    .on('data', (data) => results.push(data))
    .on('end', () => {
        function sortByName(a, b){
            return a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1;
        }
        results.sort(sortByName);
        function makeobj(res){
            let obj = {};
            let formateDate = moment(`${res.Date}`).format('YYYY-MM-DD');
            obj.name = `${res.Name}`
            obj[formateDate] =  `${res.Time}`;
            answ.push(obj);
        }
        results.forEach(makeobj);
        const csvWriter = createCsvWriter({
            path: 'done.csv',
            header: [
                {id: 'name', title: 'Name/Date'}
            ]
        });


        csvWriter.writeRecords(answ)       // returns a promise
            .then(() => {
                console.log('...Done');
            });
        console.log(answ);
    });
