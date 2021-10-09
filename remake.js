const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const moment = require('moment');
const read = [];
const answ = [];
const result = [];
const dates = [];
const header = [];

//модуль читання csv
fs.createReadStream('old.csv')
    .pipe(csv(['Name', 'Date', 'Time']))
    .on('data', (data) => read.push(data))
    .on('end', () => {
        //сортування по іменам
        read.sort((a, b) => a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1);
        //зміна назв властивостей
        function makeNewObj(res){
            let obj = {};
            let formateDate = moment(`${res.Date}`).format('YYYY-MM-DD');
            obj.name = `${res.Name}`;
            obj[formateDate] =  `${res.Time}`;
            answ.push(obj);
        }
        read.forEach(makeNewObj);
        //сортування імен
        function noRepeat(object){
            let j = 0;
            const hash = {};
            let ransw = [];
            //формування масивів по іменам
            for(let i = 0; i < object.length; i++){
                let now = Object.entries(object[i]);
                if (now[0][1] === 'Employee Name'){
                    break;
                }
                if(!(now[1][0] in hash)){
                    hash[now[1][0]] = true;
                    dates.push(now[1][0]);
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
            //перетворення масивів в обєкти
            for(let i = 0; i < ransw.length; i++){
                let pushing = {};
                for (let y = 0; y < ransw[i].length; y++) {
                    let keyword = ransw[i][y][0];
                    pushing[keyword] = ransw[i][y][1];
                }
                result.push(pushing);
            }
        }
        noRepeat(answ);
        function addMoreHeader(array){
            let felement = {id: 'name', title: 'Name/Date'};
            header.push(felement);
            for(let i = 0; i < array.length; i++){
                let obj = {};
                obj.id = array[i];
                obj.title = array[i];
                header.push(obj);
            }
        }
        //додавання обєктів в масив header
        addMoreHeader(dates);
        //модуль запису csv
        const csvWriter = createCsvWriter({
            path: 'done.csv',
            header
        });


        csvWriter.writeRecords(result)       // returns a promise
            .then(() => {
                console.log('...Done');
            });
        //console.log(result);
    });
