const express = require('express')
const https = require('https');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const app = express()
var cors = require('cors')
const port = process.env.PORT || 80
const path = require('path');
r = require('rethinkdb');
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('build'));
const fs = require('fs');
let jalaali = require('jalaali-js')

// const vapidKeys = webPush.generateVAPIDKeys();
// console.log(JSON.stringify(vapidKeys));
// webPush.setVapidDetails('mailto:example@s3noo1.work', vapidKeys.publicKey, vapidKeys.privateKey);

// app.post('/subscribe', (req, res) => {
//     const subscription = req.body;
//     res.status(201).json({});
//     const payload = JSON.stringify({ title: 'Push Test' });
  
//     webPush.sendNotification(subscription, payload).catch(error => console.error(error));
//   });

app.get('/login', (req, res) => {
    fs.readFile("users.txt", 'utf8', function(err, data) {
        if (err) throw err;
        let fileObject = JSON.parse(data);
        if (fileObject[req.query.user]) {
            if (fileObject[req.query.user]['pass'] == req.query.pass) {
                let userObject = {
                    user: req.query.user,
                    cert: 'NJFbjru424bgBFB31@#4',
                    message: 'logged in'
                }
                res.send(JSON.stringify(userObject));
            }
        }
      });
})


app.get('/addNewSession', (req, res) => {
    fs.readFile("sessions.txt", 'utf8', function(err, data) {
        if (err) throw err;
        let fileObject = JSON.parse(data);
        fileObject[req.query.user] = {
            user: req.query.user,
            startTime: new Date(),
            isInProccess: true,
            endTime: null,
            task: req.query.task
        }
        fileObject = JSON.stringify(fileObject,null,2);
        fs.writeFile("sessions.txt", fileObject, (err) => {
            if (err)
              console.log(err);
            else {
                res.send("session added");
            }
          });
      });
})


app.get('/deleteOldSession', (req, res) => {
    fs.readFile("sessions.txt", 'utf8', function(err, data) {
        if (err) throw err;
        let fileObject = JSON.parse(data);
        if (fileObject[req.query.user]) {
            let sessionDuration = () =>{
                let minute = 1000 * 60;
                let hour = minute * 60;
                let endTime = new Date();
                diffInMS = endTime.getTime() - new Date(fileObject[req.query.user]['startTime']);
                let hoursDuration = Math.floor(diffInMS / hour);
                let minuteDuration = (diffInMS % hour) / minute;
                return {hours: hoursDuration, minutes: minuteDuration, startTime: new Date(fileObject[req.query.user]['startTime']), endTime: endTime, year: new Date(fileObject[req.query.user]['startTime']).getFullYear(), month: new Date(fileObject[req.query.user]['startTime']).getMonth(), day: new Date(fileObject[req.query.user]['startTime']).getDate(), startHour: new Date(fileObject[req.query.user]['startTime']).getHours(), startMinute: new Date(fileObject[req.query.user]['startTime']).getMinutes(), task: fileObject[req.query.user]['task']}
            }
            let sessionDurationObj = sessionDuration();
            fs.readFile("users.txt", 'utf8', function(err, data) {
                if (err) throw err;
                let fileObject2 = JSON.parse(data);
                if (fileObject2[req.query.user]['mofidPerDay'][String(sessionDurationObj.year) + '-' + String(sessionDurationObj.month) + '-' + String(sessionDurationObj.day)]) {
                    fileObject2[req.query.user]['mofidPerDay'][String(sessionDurationObj.year) + '-' + String(sessionDurationObj.month) + '-' + String(sessionDurationObj.day)].push({startHour:sessionDurationObj.startHour,startMinute:sessionDurationObj.startMinute,hourDuration:sessionDurationObj.hours,minutesDuration:sessionDurationObj.minutes,task:sessionDurationObj.task})
                }
                else {
                    fileObject2[req.query.user]['mofidPerDay'][String(sessionDurationObj.year) + '-' + String(sessionDurationObj.month) + '-' + String(sessionDurationObj.day)] = [];
                    fileObject2[req.query.user]['mofidPerDay'][String(sessionDurationObj.year) + '-' + String(sessionDurationObj.month) + '-' + String(sessionDurationObj.day)].push({startHour:sessionDurationObj.startHour,startMinute:sessionDurationObj.startMinute,hourDuration:sessionDurationObj.hours,minutesDuration:sessionDurationObj.minutes,task:sessionDurationObj.task})
                }
                fs.writeFile("users.txt", JSON.stringify(fileObject2,null,2), (err) => {
                    if (err)
                      console.log(err);
                    else {
                        fileObject[req.query.user] = null;
                        fileObject = JSON.stringify(fileObject,null,2);
                        fs.writeFile("sessions.txt", fileObject, (err) => {
                            if (err)
                              console.log(err);
                            else {
                                res.send("session deleted and saved");
                            }
                          });
                    }
                  });
              });
        }
      });
})

app.get('/addNewTask', (req, res) => {
    fs.readFile("tasks.txt", 'utf8', function(err, data) {
        if (err) throw err;
        let fileObject = JSON.parse(data);
        if (!fileObject[req.query.user]) {
            fileObject[req.query.user] = {
                task1: {
                    name: req.query.name,
                    weekDays: req.query.weekDays,
                    dates: [],
                    description: req.query.description
                }
            }
        }
        else {
            let m = 1;
            for (let a in fileObject[req.query.user]) {
                m = m + 1;
              }
            fileObject[req.query.user]['task' + String(m)] = {
                name: req.query.name,
                weekDays: req.query.weekDays,
                dates: [],
                description: req.query.description
            }
        }
        fileObject = JSON.stringify(fileObject,null,2);
        fs.writeFile("tasks.txt", fileObject, (err) => {
            if (err)
              console.log(err);
            else {
                res.send("task added");
            }
          });
      });
})

app.get('/deleteOldTask', (req, res) => {
    fs.readFile("tasks.txt", 'utf8', function(err, data) {
        if (err) throw err;
        let fileObject = JSON.parse(data);
        if (fileObject[req.query.user]) {
            fileObject[req.query.user][req.query.task] = undefined;
        }
        fileObject = JSON.stringify(fileObject,null,2);
        fs.writeFile("tasks.txt", fileObject, (err) => {
            if (err)
              console.log(err);
            else {
                res.send("task deleted");
            }
          });
      });
})

app.get('/getIsMofid', (req, res) => {
    fs.readFile("sessions.txt", 'utf8', function(err, data) {
        if (err) throw err;
        let fileObject = JSON.parse(data);
        if (fileObject[req.query.user]) {
            let mofidObj = {
                message: "mofid",
                time: fileObject[req.query.user]['startTime'],
                newTime: new Date()
            }
            res.send(JSON.stringify(mofidObj));
        }
        else {
            let mofidObj = {
                message: "not mofid"
            }
            res.send(JSON.stringify(mofidObj));
        }
      });
})

app.get('/getMofidToDay', (req, res) => {
    fs.readFile("users.txt", 'utf8', function(err, data) {
        if (err) throw err;
        let fileObject = JSON.parse(data);
        let users = {};
        let newDate = new Date();
        fs.readFile("sessions.txt", 'utf8', function(err2, data2) {
            if (err2) throw err2;
            let fileObject2 = JSON.parse(data2);
        for(let x in fileObject) {
            users[fileObject[x].showName] = {};
            // users[fileObject[x].showName]['hours'] = 0;
            // users[fileObject[x].showName]['minutes'] = 0;
            // users[fileObject[x].showName]['online'] = 0;
            if (fileObject2[x]) {
                users[fileObject[x].showName]['online'] = 1;
            }
            if (fileObject[x].mofidPerDay) {
                for(let y in fileObject[x].mofidPerDay) {
                    users[fileObject[x].showName][y] = {};
                    users[fileObject[x].showName][y]['hours'] = 0;
                    users[fileObject[x].showName][y]['minutes'] = 0;
                    let eachday = fileObject[x].mofidPerDay[y];
                    for (let aw = 0; aw < eachday.length; aw++) {
                        users[fileObject[x].showName][y]['hours'] = users[fileObject[x].showName][y]['hours'] + Math.floor(eachday[aw].hourDuration);
                        users[fileObject[x].showName][y]['minutes'] = users[fileObject[x].showName][y]['minutes'] + Math.floor(eachday[aw].minutesDuration);
                }
                }
            }
            // if (fileObject[x].mofidPerDay[String(newDate.getFullYear() + "-" + newDate.getMonth() + "-" + newDate.getDate())]) {
            //     let eachday = fileObject[x].mofidPerDay[String(newDate.getFullYear() + "-" + newDate.getMonth() + "-" + newDate.getDate())];
            //     for (let aw = 0; aw < eachday.length; aw++) {
            //         users[fileObject[x].showName]['hours'] = users[fileObject[x].showName]['hours'] + Math.floor(eachday[aw].hourDuration);
            //         users[fileObject[x].showName]['minutes'] = users[fileObject[x].showName]['minutes'] + Math.floor(eachday[aw].minutesDuration);
            //     }
            // }
        }
        res.send(JSON.stringify(users));
          });
      });
})

app.get('/getJobsToDay', (req, res) => {
    fs.readFile("tasks.txt", 'utf8', function(err, data) {
        if (err) throw err;
        let fileObject = JSON.parse(data);
        let toDay = new Date();
        let toDayTasks = [];
        if (fileObject[req.query.user]) {
            let tasks = fileObject[req.query.user];
            for (let x in tasks) {
                let days =tasks[x]['weekDays'];
                days = days.split(',');
                if (days[toDay.getDay()] == 1) {
                    toDayTasks.push({name: tasks[x]['name'], description: tasks[x]['description']})
                }
                else {
                    for(let i = 0; i < tasks[x].dates.length; i++) {
                        if (tasks[x].dates[String(toDay.getFullYear()) + "-" + String(toDay.getMonth()) + "-" + String(toDay.getDay())]) {
                        toDayTasks.push({name: tasks[x]['name'], description: tasks[x]['description']})
                        }
                    }
                }
            }
        }
        res.send(JSON.stringify(toDayTasks));
      });
})

app.get('/addNewTaskWithDate', (req, res) => {
    fs.readFile("tasks.txt", 'utf8', function(err, data) {
        if (err) throw err;
        let fileObject = JSON.parse(data);
        if (!fileObject[req.query.user]) {
            fileObject[req.query.user] = {};
        }
        let tasks = fileObject[req.query.user];
        let theTask;
        for (let x in tasks) {
            if (tasks[x]['name'] == req.query.name) {
                theTask = x;
            }
        }
        if (!theTask) {
            let m = 1;
        for (let a in tasks) {
            m = m + 1;
          }
          tasks['task' + String(m)] = {
            name: req.query.name,
            weekDays: '',
            dates: [],
            description: req.query.description
        }
        theTask = 'task' + String(m);
        }
        if (req.query.date) {
            tasks[theTask]['dates'].push(req.query.date);
        }
        else {
            let time = new Date();
            time.setDate(time.getDate() + 1);
            tasks[theTask]['dates'].push(String(time.getFullYear()) + "-" + String(time.getMonth()) + "-" + String(time.getDate()));
        }
        fileObject[req.query.user] = tasks;
        fileObject = JSON.stringify(fileObject,null,2);
        fs.writeFile("tasks.txt", fileObject, (err) => {
            if (err)
              console.log(err);
            else {
                res.send("task added");
            }
          });
      });
})

app.get('/getJobs', (req, res) => {
    fs.readFile("tasks.txt", 'utf8', function(err, data) {
        if (err) throw err;
        let fileObject = JSON.parse(data);
        if (fileObject[req.query.user]) {
            res.send(JSON.stringify(fileObject[req.query.user]));
        }
      });
})

app.get('/getMofidHistory', (req, res) => {
    fs.readFile("users.txt", 'utf8', function(err, data) {
        if (err) throw err;
        let fileObject = JSON.parse(data);
        if (fileObject[req.query.user]['mofidPerDay']) {
            let daily = [];
            let i = 0;
            for(let x in fileObject[req.query.user]['mofidPerDay']) {
                daily[i] = [];
                let l = 0;
                for(let k = 0; k < fileObject[req.query.user]['mofidPerDay'][x].length; k++) {
                    if (fileObject[req.query.user]['mofidPerDay'][x][k]['hourDuration'] >= 1 || fileObject[req.query.user]['mofidPerDay'][x][k]['minutesDuration'] >= 1) {
                        daily[i][l] = fileObject[req.query.user]['mofidPerDay'][x][k];
                        daily[i][l]['date'] = x;
                        l = l + 1;
                    }
                }
                if (l == 0) {
                    daily[i][l] = {};
                }
                i = i + 1;
            }
            let weekly = [];
            let w = 0;
            for(let j = 0; j < daily.length; j++) {
                let dailyHour = 0;
                let dailyMinute = 0;
                if (daily[j]) {
                    for(let p = 0; p < daily[j].length; p++) {
                        dailyHour = dailyHour + daily[j][p]['hourDuration'];
                        dailyMinute = dailyMinute + daily[j][p]['minutesDuration'];
                    }
                    weekly[w] = {
                        hourDuration: dailyHour,
                        minutesDuration: dailyMinute,
                        date: daily[j][0]['date']
                    }
                    w = w + 1;
                }
            }
            let sendObj = {
                daily: daily,
                weekly: weekly
            }
            res.send(JSON.stringify(sendObj));
        }
      });
})

app.get('/getMofidToWeek', (req, res) => {
    fs.readFile("users.txt", 'utf8', function(err, data) {
        if (err) throw err;
        let fileObject = JSON.parse(data);
        let weeks = [];
        let toDay = new Date();
        let isSuturDay = false;
        for (let i = 0; i < 3; i++) {
            while (!isSuturDay) {
                for (let x in fileObject) {
                    if(fileObject[x]['mofidPerDay']) {
                        if(fileObject[x]['mofidPerDay'][toDay.getFullYear() + "-" + toDay.getMonth() + "-" + toDay.getDate()]) {
                            let userDayHours = 0;
                            let userDayMinutes = 0;
                            let userDayArray = fileObject[x]['mofidPerDay'][toDay.getFullYear() + "-" + toDay.getMonth() + "-" + toDay.getDate()];
                            for (let j = 0; j < userDayArray.length; j ++) {
                                userDayHours = userDayHours + Math.floor(userDayArray[j]['hourDuration']);
                                userDayMinutes = userDayMinutes + Math.floor(userDayArray[j]['minutesDuration']);
                            }
                            if (!weeks[i]) {
                                weeks[i] = {};
                            }
                            if (!weeks[i][fileObject[x]['showName']]) {
                                weeks[i][fileObject[x]['showName']] = {};
                            }
                            if (!weeks[i][fileObject[x]['showName']]['hours'] && !weeks[i][fileObject[x]['showName']]['minutes']) {
                                weeks[i][fileObject[x]['showName']]['hours'] = 0;
                                weeks[i][fileObject[x]['showName']]['minutes'] = 0;
                            }
                            weeks[i][fileObject[x]['showName']]['hours'] = weeks[i][fileObject[x]['showName']]['hours'] + userDayHours;
                            weeks[i][fileObject[x]['showName']]['minutes'] = weeks[i][fileObject[x]['showName']]['minutes'] + userDayMinutes;
                        }
                    }
                }
                if (toDay.getDay() == 6) {
                    isSuturDay = true;
                }
                toDay.setDate(toDay.getDate() - 1);
            }
            let aDate = toDay;
            aDate.setDate(aDate.getDate() + 1);
            if (weeks[i]) {
                weeks[i]['date'] = aDate.getFullYear() + "-" + aDate.getMonth() + "-" + aDate.getDate();
            }
            isSuturDay = false;
            toDay.setDate(toDay.getDate() - 1);
        }
        res.send(JSON.stringify(weeks));
      });
})

app.get('/getMofidToMonth', (req, res) => {
    fs.readFile("users.txt", 'utf8', function(err, data) {
        if (err) throw err;
        let fileObject = JSON.parse(data);
        let months = [];
        let toDay = new Date();
        let isFirstDay = false;
        for (let i = 0; i < 6; i++) {
            let aDate = toDay;
            let jalaliDate = jalaali.toJalaali(aDate.getFullYear(), aDate.getMonth() + 1, aDate.getDate());
            let jalaliFirstDay = jalaali.toGregorian(jalaliDate.jy, jalaliDate.jm, 1);
            while (!isFirstDay) {
                for (let x in fileObject) {
                    if(fileObject[x]['mofidPerDay']) {
                        if(fileObject[x]['mofidPerDay'][toDay.getFullYear() + "-" + toDay.getMonth() + "-" + toDay.getDate()]) {
                            let userDayHours = 0;
                            let userDayMinutes = 0;
                            let userDayArray = fileObject[x]['mofidPerDay'][toDay.getFullYear() + "-" + toDay.getMonth() + "-" + toDay.getDate()];
                            for (let j = 0; j < userDayArray.length; j ++) {
                                userDayHours = userDayHours + Math.floor(userDayArray[j]['hourDuration']);
                                userDayMinutes = userDayMinutes + Math.floor(userDayArray[j]['minutesDuration']);
                            }
                            if (!months[i]) {
                                months[i] = {};
                            }
                            if (!months[i][fileObject[x]['showName']]) {
                                months[i][fileObject[x]['showName']] = {};
                            }
                            if (!months[i][fileObject[x]['showName']]['hours'] && !months[i][fileObject[x]['showName']]['minutes']) {
                                months[i][fileObject[x]['showName']]['hours'] = 0;
                                months[i][fileObject[x]['showName']]['minutes'] = 0;
                            }
                            months[i][fileObject[x]['showName']]['hours'] = months[i][fileObject[x]['showName']]['hours'] + userDayHours;
                            months[i][fileObject[x]['showName']]['minutes'] = months[i][fileObject[x]['showName']]['minutes'] + userDayMinutes;
                        }
                    }
                }
                if (toDay.getDate() == jalaliFirstDay.gd) {
                    isFirstDay = true;
                }
                toDay.setDate(toDay.getDate() - 1);
            }
            if (months[i]) {
                months[i]['date'] = aDate.getFullYear() + "-" + aDate.getMonth() + "-" + (Number(aDate.getDate()) + 1);
            }
            isFirstDay = false;
        }
        res.send(JSON.stringify(months));
      });
})

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
})

const httpsOptions = {
  cert: fs.readFileSync('certificate.crt'),
  key: fs.readFileSync('private.key')
};

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})

https.createServer(httpsOptions, app).listen(443, () => {
  console.log(`Server started on port 443`);
});