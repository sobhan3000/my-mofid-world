To run this express.js app(server), you need to have nodejs and npm installed on your system, for this I suggest you the official website of [nodejs](https://nodejs.org/en/download).

Now just run the following command in the terminal and you will see server running.
```
cd path/to/server
node index.js
```
The server will run on port 80 of your system and you can luanch app from you browser with http://localhost address. (you can change port in index.js).

you can define users in app by changing the *users.txt*.

*users.txt:*
```
{
  "user1" : {
        "user": "user1",
        "showName": "user1-show-name",
        "pass": "user-password1",
        "mofidPerDay": {},
        "mofidThisDay": {},
        "lastTimeLogged": ""
    },
    "user2" : {
        "user": "user2",
        "showName": "user2-show-name",
        "pass": "user-password2",
        "mofidPerDay": {},
        "mofidThisDay": {},
        "lastTimeLogged": ""
    }
}
```
replace all "user1", "user2", ... (you can add more) with your usernames in file.
replace all "user1-show-name", "user2-show-name", ... with your name you want to show in app to others.
replace "user-password1", "user-password2", ... with your users passwords they want to login to app with.

enjoy playing with codes !