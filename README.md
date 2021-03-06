# Patchwork

![screenshot](./screenshot.png)

Patchwork is a decentralized sharing app.
It was built for friends of the SSB project, to test basic functions.
We use it as a test-bed for features, and for our own daily messaging.

Because SSB is a research project, **you'll need to contact an SSB team member (in #scuttlebutt on Freenode) to get onto the network!**
That's our informal barrier to entry right now, since we're not prepared for lots of users yet.

[![Hermies the Hermit Crab](https://avatars2.githubusercontent.com/u/10190339?v=3&s=200)](https://github.com/ssbc/scuttlebot)

Patchwork embeds [Scuttlebot](https://github.com/ssbc/scuttlebot), so if you're running Patchwork, you don't need to run another scuttlebot server.


## Install

Install node v4.2 (you might like to use [nvm](https://github.com/creationix/nvm)).

``` bash
npm install ssb-patchwork -g
```

or

```bash
git clone https://github.com/ssbc/patchwork.git
cd patchwork
npm install
npm run build:ui
```

## Run

```bash
# if installed globally
patchwork
```

or

```bash
# from the checkout directory
npm start
```

If it's your first time running patchwork,
follow the on screen instructions to start a new identity
and join a pub server.


## Docs

- [Building Patchwork](./docs/BUILDING.md)
- [Creating a Testing Environment, and Running Tests](./docs/TESTING.md)
- [Patchwork Project Structure](./docs/PROJECT-STRUCTURE.md)
- [SSB Docs Repo](https://github.com/ssbc/docs)
