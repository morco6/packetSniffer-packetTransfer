/*
 *  Author: Mor Cohen
 *  Description: client side for sending messages to the server via loacalhost udp port
 */

const PORT = 12321;
const HOST = '127.0.0.1';

const dgram = require('dgram');
const fs = require('fs');
const xor = require('xor-crypt');

let contents = fs.readFileSync('wiki.txt', 'utf8');                             //read text from wiki.txt 
let length_of_message = contents.length;                                        
let d = Math.floor(Math.random() * length_of_message) -1;                       //generate a random number between 1 to 'length_of_message' minus 1

////////////////////////////////////////////////////////////////
splitRegex = function (str, len) {                            //
    let regex = new RegExp('[\\s\\S]{1,' + len + '}', 'g');   //--------------> A function for string spliting into an array such as         
    return str.match(regex);                                  //                every index is a d-bytes maximum length
}                                                             //
////////////////////////////////////////////////////////////////

let message = splitRegex(contents, d);                                          //split text into array with d-bytes max size
let e = xor(contents);

var client = dgram.createSocket('udp4');                                        //open socket udp4 connection

let promise = (resolve, reject) => {
    let rand = Math.floor(Math.random() * message.length);                      //random packet for lost
    for (let sequence_number = 0; sequence_number < message.length; sequence_number++) {
        //init every packet
        let packet = {
            sequence_number: sequence_number,
            content: message[sequence_number],
            msgLen: message.length,                                             //length of current packet
            total_length: contents.length,                                      //length of entire message
            e: e
        };

        if (sequence_number === rand)                                           //lost the random packet
            continue;

        //send packet to server
        client.send(JSON.stringify(packet), 0, JSON.stringify(packet).length, PORT, HOST, (err, bytes) => {
            if (err) throw err;
            console.log(`${packet.content.length} size UDP packet sent to ${HOST}: ${PORT} (sequence number: ${packet.sequence_number})`);
        });
    }
    resolve(true);
};

//intreval of 3 seconds between messages
setInterval(() => {
    Promise.all([new Promise(promise)]).then((sequence_number) => {
        client.close();//close connection
        console.log(`\nUDP message (${ sequence_number } packtes) sent to ${ HOST }:${ PORT }:`);
        client = dgram.createSocket('udp4');
    });
}, 3000);

