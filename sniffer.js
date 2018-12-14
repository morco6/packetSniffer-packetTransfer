/*
 *  Author: Mor Cohen
 *  Description: script for sniffing packets
 *  +   How To Use (windows):
 *      -   In option screen please choose the localhost/loopback option (127.0.0.1)
 *      -   Then press enter again ('dumpfile.pcap' is default)
 *      -   Now sniffing start - log file 'dumpfile.pcap' created in the same directory (you can open it in wireshark)
 *      -   Stop with 'ctrl+c' -> The console will print the packets of victim from port '12321' 
 *  NOTE: In linux OS - sniffing is autorun (stop with 'ctrl+c')
 */

const exec = require("child_process").exec;
const pcapp = require('pcap-parser');
const util = require("util");
const spawn = require("child_process").spawn;
const fs = require('fs');

/* -For windows (if the second option in line 55 dosn't work)- */
if (process.platform === "win32") {                                         //check OS
    let child = exec('RawCap');                                             //execute RawCap.exe
    child.stdout.on('data', function (data) {});                            //listen to child process
    child.on('close', function () {                                         //closing child process
        if (fs.existsSync('dumpfile.pcap')) {                               //any pcap file?
            let parser = pcapp.parse('dumpfile.pcap');                      //parse the pcap file

            /* -Parsing and sorting- */
            parser.on('packet', function (packet) {
                let strPacket = (packet.data).toString('utf8');
                let packetSorted = '';
                let arrPackets = [];
                for (let i = 0; i < strPacket.length; i++) {
                    if (strPacket[i] === '{' && strPacket[i+1] === '"') {
                        while (strPacket[i] != '}') {
                            packetSorted += strPacket[i];
                            i++;
                        }
                        packetSorted += '}';
                        arrPackets.push(packetSorted);
                    }
                }
                for (let x = 0; x < arrPackets.length; x++) {
                    let parsedPacket = JSON.parse(arrPackets[x]);
                    if (parsedPacket != null || parsedPacket.sequence_number != undefined) {
                        console.log(`Packet sequenceNumber: ${parsedPacket.sequence_number}`)
                        console.log(`Data: ${parsedPacket.content}`);      //print to screen the packet data
                        console.log('\n');
                    }
                }
                //console.log(arrPackets);                                 //Optional - print to screen all packet not parsed&sorted
            });
        }
    });
}
/* -For linux/windows (using scapy)- */
else {
    let process = spawn('python', ["snifferPythonScript.py"]);              //call to python script that i code 
    util.log('Sniffing - Please wait for the packets...')
    util.log("Open script from 'snifferPythonScript.py'...")
    process.stdout.on('data', function (chunk) {                            //async function for print to screen the packets
        let textChunk = chunk.toString('utf8');                             //parse buffer packet into string type
        util.log(textChunk);                                                //print to console the packets
    });
}

