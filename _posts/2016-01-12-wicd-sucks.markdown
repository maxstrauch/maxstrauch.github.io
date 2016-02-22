---
layout: post
title: "WICD sucks!"
tags: linux raspberrypi shellscript
---

I always use a WLAN USB adapter on my [Raspberry Pi](https://www.raspberrypi.org/) since the entire household is wireless. But when the WLAN goes temporary down and comes back on the standard configuration using `wpa_supplicant` will not reconnect until you reboot. But how to reboot without network connection? I know ...

While searching for an alternative I found [WICD](https://en.wikipedia.org/wiki/Wicd) which is a nice utility with a really nice `curses` [TUI](https://en.wikipedia.org/wiki/Text-based_user_interface). So when I setup a Pi last weekend using Raspbian "wheezy" I tried it out. I messed around for more than two hours to get the WICD working but WICD and `wpa_supplicant` jammed each other.

How to resolve?

<!--more-->

Very simple plan - write a little shell script which does the job (and I love writing shell scripts because they are designed to perform a special task):

{% highlight bash %}
#!/bin/sh

NWN="YOUR-NETWORK-SSID"

echo " *** WLAN connector *** "
date

WLAN0_ONLINE=$(ifconfig wlan0 | grep "inet addr" | wc -l)
if [ "$WLAN0_ONLINE" -eq "1" ]; then
        echo "wlan0 is connected:"
        ifconfig wlan0 | grep "inet addr"
else
        echo "wlan0 not connected to WIFI $NWN"
        echo "Is $NWN avialable?"
        AVAIL=$(iwlist wlan0 scan | grep "$NWN" | wc -l)
        echo "Found $AVAIL WLAN networks with SSID $NWN"
        if [ "$AVAIL" -eq "1" ]; then
                echo "Trying to connect to that network"
                ifconfig wlan0 down
                sleep 1
                ifconfig wlan0 up
                iwconfig wlan0 essid "$NWN"
                service networking stop
                service networking start
                echo "Connection should be established"
        else
                echo "Nothing to do when $NWN unavailable"
        fi
fi
{% endhighlight %}

First of all: the script is really simple! It assumes that your WLAN device is connected on `wlan0` and that `/etc/network/interfaces` is configured correctly e.g. using `wpa_passphrase "YOUR-NETWORK-SSID"` to generate the `wpa-ssid` and `wpa-psk` string. The script could be improved with no doubt but hey: it works and that is important.

To get this "daemon" working one needs a crontab entry which executes this script every once in a while:

	$ crontab -e
	*/1 * * * * sudo /home/pi/scripts/wland.sh >/dev/null 2>&1

Simply run it every minute and dump the output to the garbage bin. One certainly could remove all the `echo` statements in the script but for debugging I left them there and they don't take up much performance.

The script basically operates according to this scheme:

 - Check if a WLAN connection is active. This can be done very simple by running `ifconfig wlan0` to get the state of the WLAN interface and then using `grab` to get the line which contains "inet addr". This line is only present when the WLAN device has an IP address and is connected. So counting the lines (`wc -l`) of the grab result gives a boolean value if there is a WLAN connection.
 - If there is at least one line (although there won't be more than one line since a device has only one IP address in general) returned we're connected to the WLAN, everything fine, exit. If not, continue (or in the script: perform the else branch).
 - WLAN is not connected. Is it even available? Using `iwlist wlan0 scan` and then looking into the output and using the same method as before and grabbing the SSID of our network we can generate an other boolean value which indicates if the WLAN is available. This case is executed when the WLAN temporarily went down while the device was up.
 - If there is no WLAN with the right SSID we can exit because there is nothing to connect to. Otherwise we will try to connect to the WLAN.
 - Connecting to the WLAN is simply done by putting the device down and up, calling `iwconfig` and restarting the networking service. This is surely not a scientific founded approach - it's a more an expierence based approach about what works best.


And that's it. It took me about 5 Minutes to write this script (okay, with testing and manpage research maybe 10 minutes) and it runs smoothly (until now). On the other side I messed over two hours with [WICD](https://en.wikipedia.org/wiki/Wicd). You can guess which method is my favorite ...

Side note: [WICD](https://en.wikipedia.org/wiki/Wicd) works without any problems on Raspbian "Jessie" after one did `systemctl disable wpa_supplicant`.

