const request = require("request");
const express = require("express");
const fs = require("fs");

const app = express();

app.get(/\/fs\/(.+)\!(.+).(swf|png|jpg)/, serve);
app.get(/\/fs\/(.+)\!.(swf|png|jpg)/, serve);
app.get(/\/fs\/(.+).(swf|png|jpg)/, serve);

function serve(req, res) {
    let ext = ".";
    if(req.params[2]) {
        ext += req.params[2];
    } else {
        ext += req.params[1];
    }
    const filename = req.params[0] + ext;
    if (fs.existsSync(__dirname + "/storage/" + filename)) {
        console.log("File is cached", filename);
        return res.sendFile(__dirname + "/storage/" + filename);
    } else {
        console.log("File is proxied", filename);
        const reqw = request
            .get("http://sharaball.ru/fs/" + req.params[0] + "!" + ext)
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
}

app.listen(8080);
