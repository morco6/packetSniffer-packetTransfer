'''
Author: Mor Cohen
Description: script for sniffing packets 
===========: invoked from sniffer.js
'''
import sys
from scapy.all import *

fob = open("sniffLog.txt","w")													#open txt file - save packet info
def print_summary(pkt):															#invoke for every packet
    if IP in pkt:
        ip_src=pkt[IP].src
        ip_dst=pkt[IP].dst
    if UDP in pkt:
        udp_sport=pkt[UDP].sport
        udp_dport=pkt[UDP].dport
        print (" IP src " + str(ip_src) + " UDP sport " + str(udp_sport))
        print (" IP dst " + str(ip_dst) + " UDP dport " + str(udp_dport))

    fob.write(str(pkt)+'\n')													#sniff log will be in sniffLog.txt  

sniff(filter="ip",prn=print_summary)
sniff(filter='port 12321', prn=print_summary)			                        #sniffing udp packets at 127.0.0.1
#sniff(iface="lo", filter="udp and host 127.0.0.1", prn=print_summary)			#if dosn't work try this one
sys.stdout.flush()