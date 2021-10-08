const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const moment = require('moment');
const results = [];
const answ = [];
const resultat = [];
const dates = [];

fs.createReadStream('old.csv')
    .pipe(csv(['Name', 'Date', 'Time']))
    .on('data', (data) => results.push(data))
    .on('end', () => {
        results.sort((a, b) => a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1);
        function makeNewObj(res){
            let obj = {};
            let formateDate = moment(`${res.Date}`).format('YYYY-MM-DD');
            obj.name = `${res.Name}`;
            obj[formateDate] =  `${res.Time}`;
            answ.push(obj);
        }
        results.forEach(makeNewObj);
        function noRepeat(object){
            let j = 0;
            const hash = {};
            let ransw = [];
            for(let i = 0; i < object.length; i++){
                let now = Object.entries(object[i]);
                if(!(now[1][0] in dates)){
                    dates[now[1][0]] = true;
                }
                if (!(now[0] in hash)){
                    if(i === 0){
                        hash[now[0]] = true;
                        ransw.push(now);
                    } else {
                        hash[now[0]] = true;
                        ransw.push(now);
                        j++;
                    }
                } else {
                    ransw[j].push(now[1]);
                }
            }
            for(let i = 0; i < ransw.length; i++){
                let pushing = {};
                for (let y = 0; y < ransw[i].length; y++) {
                    let keyword = ransw[i][y][0];
                    let value = ransw[i][y][1];
                    pushing[keyword] = value;
                }
                resultat.push(pushing);
            }
        }
        noRepeat(answ);
        const csvWriter = createCsvWriter({
            path: 'done.csv',
            header: [
                {id: 'name', title: 'Name/Date'},
                {id: '2020-06-29', title: '2020-06-29'},
                {id: '2020-06-30', title: '2020-06-30'},
                {id: '2020-07-01', title: '2020-07-01'},
                {id: '2020-07-02', title: '2020-07-02'},
                {id: '2020-07-03', title: '2020-07-03'}
            ]
        });


        csvWriter.writeRecords(resultat)       // returns a promise
            .then(() => {
                console.log('...Done');
            });
        console.log(resultat);
    });
