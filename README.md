# DTDash

A simple dashboard for FIRST Robotics, an alternative to SmartDashboard.

Status: In development


## Project setup

You need to install [yarn](https://yarnpkg.com/).

### To Compile and hot-reload for development

```
yarn dev
```
Then access at the provided URL.

To get a data feed, the UI looks attempts to connect to NetworkTables on the same host.
For development, this will be `localhost`. The simplest way to get a feed on localhost
is to run a robot in simulation.

Eventually, we plan to host the built assets on the robot and serve them with a simple
Java http file server. At that point, the UI host will be the robot and it will get
live data from the robot.


### To Compile and minify for production

```
yarn build
```
