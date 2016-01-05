---
layout: post
title: "Writing Pi images on Mac OS X using dd"
tags: linux macos raspberrypi
---

So the commandline utility `dd` is a core tool which I use very often to achieve different things. Right now I'm writing an Raspberry Pi image to a SD card. The problem with `dd` is that it does not print any status information during runtime. And here comes the trap for young players: the trick using `dd -USR1 [pid]` does __not__ print status information on Mac OS. __It terminates `dd`!__

<!--more-->

Writing an image to an SD card on Mac OS is very simple assuming that you've opened the Terminal.app and stay in the directory where the image file is stored.

 1. Run `diskutil list` to get a list of all storage devices connected to your computer. Get the device name like `/dev/disk3` from the list - use the size of the device as identifying property.
 2. Run `diskutil unmountDisk [device name]` to detach the device from the file system.
 3. Use the command `sudo dd if=[image filename] of=[device name] bs=1024` to write the image to the sd card. Be aware of the fact that this command overwrites all contents of the SD card. So make sure that you've selected the right device name.

Step three might now take some time. To let `dd` print the progress you simply need to know this command: `sudo kill -SIGINFO [pid]`. That's all it is! Simply replace `USR1` with `SIGINFO` and you're back on track.

_Tip:_ use `ps ax | grep dd` to get the PID of the `dd` process and don't use the PID of the sudo process.