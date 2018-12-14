/*
 *  Author: Mor Cohen
 *  Description: server side listening and recieving packets from client at localhost:12321 via udp port
 */

const PORT = 12321;
const HOST = '127.0.0.1';

const dgram = require('dgram');
const xor = require('xor-crypt');
const server = dgram.createSocket('udp4');                                      //open socket udp4 connection
let msg = '';

let how_many_pkts = 0;
let pkt_count = 0;

//listen to connections
server.on('listening', function () {
    const address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

//packet recieved -> print to console
server.on('message', function (packet, remote) {
    let packet1 = JSON.parse(packet);
    console.log(`\n---Packet ${packet1.sequence_number} Connection Information:---`);
    console.log(`::: Sender Address: ${remote.address}`);
    console.log(`::: Port: ${remote.port}`);
    console.log(`::: Packet Size: ${packet1.content.length} bytes`);
    console.log(`::: IP Type: ${remote.family}`);
    console.log(`::: Packet Content: ${packet1.content}`);

    pkt_count++;
    if (packet1.sequence_number === 0 || packet1.sequence_number === 1)          //the number of packets that should arrive for complete message
        how_many_pkts = packet1.msgLen;

    msg += packet1.content;                                                      //join the packets

    //print full message
    if (packet1.msgLen === (packet1.sequence_number + 1)) {
        console.log(`=======The complete message: \n${msg}`);
        msg = '';
    }
    if ((how_many_pkts) === (pkt_count+1)) {                                    //if there is a packet lost then..
        console.log(`=======Some packet has lost: retriving packet..`);
        let c_msg = xor(packet1.e + msg);                                       //xor for restore the packet lost
        console.log(`=======The complete message: \n${c_msg.substring(0, packet1.total_length)}`);
        msg = '';
        c_msg = '';
        pkt_count = 0;
    }
});

server.bind(PORT, HOST);