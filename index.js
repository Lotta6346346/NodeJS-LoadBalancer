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

client.on('message', msg => {
    if (msg.content === '/uptime') {
      if (msg.channel.id === '744531622300483677'){
        tcpp.probe(proxys[0], proxyPort, function(err99, check123){
            if (check123){
                DC_Uptime_check = true;
            }else{
                DC_Uptime_check = false;
            }
        })
        tcpp.probe(proxys[1], proxyPort, function(err999, check1239){
            if (check1239){
                DC_Uptime_check = true;
            }
        })
        tcpp.probe(proxys[1], proxyPort, function(err9999, check12399){
            if (check12399){
                DC_Uptime_check = true;
            }
        })
      }
      if (DC_Uptime_check){
          msg.channel.send("Server seems to be online!");
      }else{
          msg.channel.send("Server seems to be offline!");
      }
    }
});

client.login('');

app.get('/status', (req1, res1) =>{
    setTimeout(function(){
        res.send(check1var, check2var, check3var);
    }, 5000);
    // Check the 1. Server uptime
    tcpp.probe(proxys[0], proxyPort, function(err0, check1){
        if (check1){
            check1var = true;
        }else{
            console.log("Server 1 seems to be down!");
        }
    })
    // Check the 2. Server uptime
    tcpp.probe(proxys[1], proxyPort, function(err00, check2){
        if (check2){
            check2var = true;
        }else{
            console.log("Server 2 seems to be down!");
        }
    })
    // Check the 3. Server uptime
    tcpp.probe(proxys[2], proxyPort, function(err000, check3){
        if (check3){
            check3var = true;
        }else{
            console.log("Server 3 seems to be down!");
        }
    })
})


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