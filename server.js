const express = require('express');
const app = express();
// for parsing the body in POST request
const bodyParser = require('body-parser');
const fs = require('fs');
const { publishToQueue } = require('./queue');
const blockedDomains = JSON.parse(fs.readFileSync('blacklist.json', 'utf8'));

console.log(blockedDomains)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/users', async function (req, res) {
    const {firstName, lastName, email} = req.body;
    const address = email.split('@').pop()
    if(!blockedDomains[address]){
        const userData = JSON.stringify({firstName, lastName, email})
        await publishToQueue(userData)
        return res.send('User added.');
    } else {
        return res.send('User domain is being blacklisted.');
    }
});

app.listen('3000', function(){
    console.log('Server listening on port 3000');
});