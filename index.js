var proxys = ['1', '2', '3']
var proxyPort = 80;

const express = require('express');
const app = express();
const port = 80;

var tcpp = require('tcp-ping');

// uptime checks
var check1var = false;
var check2var = false;
var check3var = false;
var DC_Uptime_check = false;

// Rate Limiter
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowsMS: 5 * 60 * 1000,
    max: 15
});

// Render the HTML shit
app.set('views', __dirname + '/status');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// Discord.js shit
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login('');

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.use('*', apiLimiter);

app.get('*', (req, res) =>{
    tcpp.probe(proxys[0], proxyPort, function(err, available){
        if (available){
            res.redirect('https://' + proxys[0]);
            DC_Uptime_check = true;
            console.log("Server 1 seems to be online, redirecting...")
        }else{
            console.log(proxys[0] + " " + "is down :(");
            tcpp.probe(proxys[1], proxyPort, function(err1, available1){
                if (available1){
                    res.redirect('https://' + proxys[1]);
                    DC_Uptime_check = true;
                    console.log("Server 2 seems to be online, redirecting...")
                }else{
                    console.log(proxys[0] + ", " + proxys[1] + " is down :(");
                    tcpp.probe(proxys[2], proxyPort, function(err2, available2){
                        if (available2){
                            res.redirect('https://' + proxys[2]);
                            DC_Uptime_check = true;
                            console.log("Server 3 seems to be online, redirecting...")
                        }else{
                            console.log("No server available, im sorry :(")
                            res.send("No Server available to handle your request.")
                        }
                    })
                }
            })
        }
    })
})
