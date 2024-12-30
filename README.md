# user-tracker

Tracks and reports on a users actions

## Docker
Docker image available on Dockerhub:
https://hub.docker.com/r/bradganley/buab

```
services:
  bskybot_1:
    image: bradganley/buab:latest
    restart: unless-stopped
    volumes:
      - ./sessionData:/sessionData
    environment:
      - NAME=Brad
      - USER_DID=did:plc:pi3zhvcqttk2hrdpmkynqrfi
      - TRACKER_BSKY_HANDLE=
      - TRACKER_BSKY_PASSWORD=
      - DEBUG_LOG_ACTIVE=true
      - DEBUG_LOG_LEVEL=info
      - JETSTREAM_URL=wss://jetstream1.us-west.bsky.network/subscribe
      - SESSION_DATA_PATH=/sessionData
```
