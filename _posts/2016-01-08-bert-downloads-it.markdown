---
layout: post
title: "Bert downloads it!"
tags: linux raspberrypi
---

[Bert](https://github.com/maxstrauch/bert) is a very simple web-based download manager written in NodeJS and some client Javascript, CSS and HTML. You can get it directly from my GitHub page [here](https://github.com/maxstrauch/bert). It runs on one of my various Pis and downloads files all the day (if I want) silent in his niche near to the router.

[Check it out](https://github.com/maxstrauch/bert) - it's a really nice project and worth it!

<!--more-->

![Screenshot of Bert.](https://raw.githubusercontent.com/maxstrauch/bert/master/screenshot.png)


## Motivation

I often need to download large files from the internet like Linux images or a lot other stuff. Since my internet connection isn't that great at all I decided to look for a simple download manager. Unfortunately I couldn't find any suitable one for the Pi which provides a *simple* (!) web-interface to provide a URL and let it download in a queue setting. The last point is really important since my internet connection is not good enough for handling multiple file downloads. 

## A look into the history

This happened back in october 2012. Since the Pi was a really new thing I decided to get one and dedicate it to download files. Since there was no suitable software out there I created a really dirty PHP script which uses the `system` function quite often to invoke bash scripts and `wget` to download things.

In August 2015 I decided that my solution works so nice (despite the fact that its a dirty PHP hack) and is so simple that I really should spend an other X hours to make it nicer and publish it so that other people could use it if they need a simple download manager for the Pi - *it works certainly on all other Linux systems and on Mac OS X*.

One interesting thing you can see here is that I used the dirty hack for around three years. And that's a behaviour I often see in (big) business: if there is a system the people stick to it and this is not at all motivated by costs of migration to a new system. People get used to a certain behaviour and familiarize with it. Even if there are bugs they create little workarounds and live with it - just like me. And this is a really nice oberservation.

## Why NodeJS?

So Javascript was one of the first programming languages I get used to back in - I think - 2005 and I really like it because of it's functional touch and clear structure and freedom (and obviously since I'm a Java guy). So when I heared about [NodeJS](https://nodejs.org/en/) I really wanted to try it and use it for a little project. So I thought: why not create a re-spin of my download manager and do it with NodeJS?

And I did it and it turned out really nice. I even compiled it on the Raspberry Pi with some trouble which you can read about [here](http://stackoverflow.com/q/29407283/2429611). 

## Features

 - First of all: **it's simple**. I really wanted something which works out-of-the box and has a URL submit function and downlaods the files in a queue setting. If I want something complex I could probably find it out there (like [FatRat](http://alternativeto.net/software/fatrat/) etc.).
 - Very important: the **queue behaviour** for the reason explained before.
 - The ability of executing a user script: when I get my downloaded files from the Pi I use a USB thumb drive. I've a script which mounts it, copies all files and unmounts it. Running this script from the web interface **and** monitoring the script's output is a requirement which is not so common in other available software products ... project justified ;-)
 - Clear downloads, shutdown server and other helpful stuff. Yes, check.
 - With my old "stupid" download manager I often downloaded some **files twice**. So [Bert](https://github.com/maxstrauch/bert) detects this and warns me. Nice.
 - **Lightweight** -- it's written on NodeJS and runs on all Linux systems (since it uses `wget`, `du` and `df`). It's small and no installation needed. Check.

## Future development

As you might guess there might be no huge future development besides bug fixing since I don't know if somebody is interested in this project and for me it fits my needs so no need to invest a huge amount of further work into it (yet). It fulfils its purpose quite good since I'm using it the last couple of days now and it gives me all features that I need.

If I really have spare time I might consider the following points:

 - **proper disk space usage** -- currently the disk space usage indicator is not as good as I like it. The current amount of disk space is calculated by dividing the size of the downloads directory by the total space of the partition [Bert](https://github.com/maxstrauch/bert) is stored on. Yes, there might be other files on this partition so that these values are not showing the *real* remaining space.
 - **configuration file instead of `server.js`** -- it might be also a good idea to put the configuration variables from the first 32 lines of `server.js` into a seperate JSON file to allow a more simple access and update of [Berts](https://github.com/maxstrauch/bert) files. Currently you must manually copy over the variables.
 - **create a custom download module** -- invoking `wget` from NodeJS might work (obviously) but is not very nice. It would be nicer to have a NodeJS implementation of a web downloader. 

<br/>

So that's it. [Bert](https://github.com/maxstrauch/bert) the f*****g hippo is really nice. [Go check it out!](https://github.com/maxstrauch/bert).
