const fs = require('fs');
const extras = exports;

let logFileName = "logs/" + new Date().toISOString().slice(0,10).replace(/-/g,"");
let seed = 0;

extras.generateId = function () {
    return Date.now() + seed++;
}

extras.saveArticles = function (data) {
    console.log(data);
    fs.writeFile("content/articles.json", JSON.stringify(data), "utf8", (err) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log("articles updated");
        }
    });
};

extras.logRequest = function (url, body, time) {
    let result = {
        "time" : time,
        "url" : url,
        "body" : body
    };
    fs.appendFile(logFileName,
                  fs.existsSync(logFileName) ? "," + JSON.stringify(result, null, "\t") : "[" + JSON.stringify(result, null, "\t"),
                  (err) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log("log updated");
        }
    });
};

extras.logSend = function (req, res, payload, cb) {
    cb(null, JSON.parse(fs.readFileSync(logFileName, "utf8", (err) => {
        if (err) {
            console.error("Ошибка чтения файла log");
        }
    }) + "]"));
};