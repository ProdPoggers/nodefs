const request = require("request");
const express = require("express");
const fs = require("fs");

const app = express();

app.get(/\/fs\/(.+)\!(.+).(swf|png|jpg)/, (req, res) => {
    const ext = "." + req.params[2];
    const filename = req.params[0] + ext;
    if (fs.existsSync(__dirname + "/storage/" + filename)) {
        console.log("File is cached", filename);
        return res.sendFile(__dirname + "/storage/" + filename);
    } else {
        console.log("File is proxied", filename);
        const reqw = request
            .get("http://sharaball.ru/fs/" + req.params[0] + "!bebra" + ext)
            .on("response", (resp) => {
                if(resp.statusCode == 200) {
                    reqw.pipe(res);
                    reqw.pipe(fs.createWriteStream(__dirname + "/storage/" + filename));
                } else {
                    res.statusCode = 404;
                    return res.send("peepoSad");
                }
            });
    }
});

app.listen(8080);
