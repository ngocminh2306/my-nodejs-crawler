const sql = require("./db.js");

// constructor
const CrawlerLog = function (crawlerLog) {
    this.Type = crawlerLog.Type;
    this.EntityOrClassName = crawlerLog.EntityOrClassName;
    this.Title = crawlerLog.Title;
    this.Note = crawlerLog.Note;
};

CrawlerLog.create = (newCrawlerLog, result) => {
    sql.query("INSERT INTO CrawlerLog SET ?, CreationTime = now()", newCrawlerLog, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created newCrawlerLog: ", { id: res.insertId, ...newCrawlerLog });
        result(null, { id: res.insertId, ...newCrawlerLog });
    });
};

module.exports = CrawlerLog;