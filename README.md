# user-tracker

Tracks and reports on a users actions

## Docker
Docker image available on Dockerhub:
https://hub.docker.com/r/bradganley/buab

```
services:
  bskybot_1:
    image: bradganley/buab:0.0.1
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
      - JETSTREAM_URL=ws://<YOUR JETSREAM SERVER IP>:6008/subscribe
      - SESSION_DATA_PATH=/sessionData


  jetstream:
    image: "ghcr.io/bluesky-social/jetstream:sha-ea96859b93d1790ff20bb168e5fc442d462cea1e" 
    container_name: jetstream1
    restart: unless-stopped
    environment:
      - CURSOR_FILE=/data/cursor.json
    ports:
      - "6008:6008"
    volumes:
      - ./data:/data
```
