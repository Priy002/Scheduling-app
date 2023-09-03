const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 4000;

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// array representing the data
const database = [];

// generates a random string as ID
const generateID = () => Math.random().toString(36).substring(2, 10);

app.post("/register", (req, res) =>{
    const {username, email, password} = req.body;
    console.log(req.body);
    let result = database.filter(
        // checks if the user does not exist
        (user) => user.email === email || user.username === username
    );
    // creates the user's data structure on the server
    if(result.length === 0){
        database.push({
            id: generateID(),
            username,
            password,
            email,
            timezone: {},
            schedule: [],
        });
        console.log("AccountCreated");
        return res.json({message: "Account Created Succesfully!"});
    }
    // returns an error
    console.log("account exists");
    return res.json({error_message: "User Already Exists!"});
});

app.post("/login", (req, res) => {
    const {username, password} = req.body;
    console.log(req.body);
    let result = database.filter(
        (user) => user.username === username && user.password === password
    );
    // user doesn't exist
    if(result.length !== 1){
        console.log("register first");
        return res.json({
            error_message: "Incorrect Credentials",
        });
    }
    // user exists
    res.json({
        message: "Login Succesfully!",
        data:{
            _id: result[0].id,
            _email: result[0].email,
        },
    });

});

app.post("/schedule/create", (req, res) => {
    const {userId, timezone, schedule} = req.body;
    // console.log(req.body);
    // filters the database via the id
    let result = database.filter((db) => db.id === userId);
    result[0].timezone = timezone;
    result[0].schedule = schedule;
    res.json({message: "OK"});
});


app.get("/schedules/:id", (req, res) => {
    const {id} = req.params;
    // filters the array via the ID
    let result = database.filter((db) => db.id === id);
    // returns the schedule, time and username
    if (result.length === 1){
        return res.json({
            message: "Schedules succesfully retrieved!",
            schedules: result[0].schedule,
            username: result[0].username,
            timezone: result[0].timezone,
        });
    }
    res.json({error_message: "Sign in again.. error occured"});
});

app.post("/schedules/:username", (req, res) => {
    const {username} = req.body;
    let result = database.filter((db) => db.username === username);
    if (result.length === 1){
        const scheduleArray = result[0].schedule;
        const filteredArray = scheduleArray.filter((sch) => sch.startTime !== "");
        return res.json({
            message: "Schedules successfully retrieved!",
            schedules: filteredArray,
            timezone: result[0].timezone,
            receiverEmail: result[0].email,
        });
    }
    return res.json({error_message: "user does not exists"});
})

app.listen(PORT, ()=>{
    console.log(`Server Listening on ${PORT}`);

});