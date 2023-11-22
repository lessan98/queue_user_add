
const amqp = require("amqplib/callback_api");

const mysql = require('mysql');

const dbConn = mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword"
});

let ch = null

amqp.connect("amqp://localhost", (err, conn) => {
    conn.createChannel(async (err, channel) => {

        await channel.assertQueue('add-user', {
            durable: false,
            autoDelete: true,
            messageTtl: 5 * 60 * 1000,
            expires: 2 * 3600 * 1000,
        })

        ch = channel
        ch.consume("add-user", (msg) => {
            const userData = JSON.parse(msg.content.toString())

            dbConn.connect(function(err) {
                if (err) throw err;
                var sql = "INSERT INTO users (first_name, last_name, email) VALUES ?";
                var values = [
                  [userData.firstName, userData.lastName, userData.email],
                ];
                dbConn.query(sql, [values], function (err, result) {
                  if (err) throw err;
                });
            });
            
        })
    })
})

exports.publishToQueue = async (data) => {
    ch.sendToQueue("add-user", Buffer.from(data))
}

process.on("exit", (code) => {
    ch.close()
})