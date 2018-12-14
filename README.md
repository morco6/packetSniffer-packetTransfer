# How To Use

1. Run "npm i" (installing the pack's for the current task).

2. Run "npm run server"

   ![](https://i.imgur.com/MMPhDNT.png)

3. Open another cmd in same directory and insert "npm run client"

   ![](https://i.imgur.com/qvfHRSc.png)

   - After that you should see in your server window the packets and the full message the client sent.

     - A random packet is lost in every 3 sec of message delivery.
     - In the example below you can see that the message divided into 3 packets while one of them was lost (packet number 1 was lost).

     ![](https://i.imgur.com/VYdXIpO.png)

4. At the same time, in the server window, you can see the packets that already delivered and their full message. As you can distinguish the full message is not the complete message.

   - After that, the app recognize the lost packet and restore that packet.
     - At the end of the connection you can see the complete message after the lost packet restore.

   ![](https://i.imgur.com/6K2vCjx.png)

# The sniffer

1. Open another cmd window in same directory and insert "npm run sniffer"

   ![](https://i.imgur.com/j32JpEb.png)

   <span style="color: red">*===ONLY FOR WINDOWS===*</span>

   *Note: if a dialog box appear -> click yes.

   - Now you see the sub window :

     ![](https://i.imgur.com/IAmuyHk.png)

     In this screen you should choose the 127.0.0.1 option (in my case its '5')

     - After that you need to press Enter button on keyboard

     - Then the sniffing is start:

       ![](https://i.imgur.com/wDscvmX.png)
       *Note: to stop sniffing press 'ctrl+c'.

       - Now your sniffer got the UDP packets:

         ![](https://i.imgur.com/rN7YDXh.png)

       ​    

   <span style="color: red">*===For Linux/Windows===*</span>

   For Linux I used the 'scapy' pack of python:

   After "npm run sniffer" -> you should see the a async packet capture.

   If you stop the sniffing you can see the log file in "sniffLog.txt"

   NOTES:

   - The project codded in nodeJS .
   - Sometimes if you dont have wincap working properly in your Windows OS, then problems with capturing may happen, so for windows OS I used RawCap.exe (see code/documentation).
   - For Linux I used 'scapy' package for python (I codded a python script that invoke from the js code). 
