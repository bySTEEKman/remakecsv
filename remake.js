const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const moment = require('moment');
const read = [];
const answ = [];
const result = [];
const dates = [];

//модуль читання csv
fs.createReadStream('old.csv')
    .pipe(csv(['Name', 'Date', 'Time']))
    .on('data', (data) => read.push(data))
    .on('end', () => {
        //№1 сортування по іменам
        read.sort((a, b) => a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1);
        //№2 зміна назв властивостей
        function makeNewObj(res){
            let obj = {};
            let formateDate = moment(`${res.Date}`).format('YYYY-MM-DD');
            obj.name = `${res.Name}`;
            obj[formateDate] =  `${res.Time}`;
            answ.push(obj);
        }
        read.forEach(makeNewObj);
        //№3 сортування імен
        function noRepeat(object){
            let j = 0;
            const hash = {};
            let ransw = [];
            //№4 формування масивів по іменам
            for(let i = 0; i < object.length; i++){
                let now = Object.entries(object[i]);
                if (now[0][1] === 'Employee Name'){
                    break;
                }
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
            for(let i = 0; i < ransw.length; i++){              //перетворення масивів в обєкти
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
        //модуль запису csv
        const csvWriter = createCsvWriter({
            path: 'done.csv',
            header: [
                {id: 'name', title: 'Name/Date'},
            ]
        });


        csvWriter.writeRecords(result)       // returns a promise
            .then(() => {
                console.log('...Done');
            });
        console.log(result);
    });
