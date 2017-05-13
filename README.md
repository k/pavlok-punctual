# Pavlok Punctuality

This is a node module for running a server that links to Google Calendar and Pavlok to help teach punctuality through negative reinforcement.

## Brainstorm

* Use a mobile app with geofencing on calendar events to stop a zap from triggering.
* * Requires Google Calendar API for getting event locations
* * Requires a geo location API like [GeoMoby](https://geomoby.com) for geofencing

## Roadmap

### Node Server
- [ ] Get a node/express server running
- [ ] Send zaps to Pavlok using [Pavlok API](https://github.com/Behavioral-Technology-Group/Pavlok_Node_Module/wiki/Setting-Up-in-Local-Mode)
- - [ ] Test using their node module (local)
- - [ ] Then set up as server
- [ ] Connect to Google Calendar API
- - [ ] Authentication
- - [ ] Load recent events &  extract locations 

#### Other
- [ ] Set up server with [`init.d`](https://thomashunter.name/blog/running-a-node-js-process-on-debian-as-an-init-d-service/) OR [Docker](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/) container

### Mobile App Client
- [ ] Test GeoMoby with a simple iOS test app and creating regions on the dashboard
- [ ] Get [Google Calendar](https://developers.google.com/google-apps/calendar/quickstart/ios?ver=swift) events OR get them from iOS calendar

### Caveats
* How often should Google Calendar events be checked for updates?
* How far back should the calendar events be loaded for?
* * Probably one day's worth, or could be less and just update every few hours or so
