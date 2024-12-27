import {
    ActionTakenByUserValidator,
    CreateSkeetAction,
    DebugLog,
    HandlerAgent,
    JetstreamEventCommit,
    JetstreamSubject,
    JetstreamSubscription,
    LogInputTextAction,
    MessageHandler
} from 'bsky-event-handlers';

const testAgent = new HandlerAgent(
    'user-tracker',
    <string>Bun.env.TRACKER_BSKY_HANDLE,
    <string>Bun.env.TRACKER_BSKY_PASSWORD
);


/**
 * Jetstream Subscription setup
 */
let jetstreamSubscription: JetstreamSubscription;


let handlers = {
    post: {
        c: [
            new MessageHandler(
                // @ts-ignore
                [ActionTakenByUserValidator.make(<string>Bun.env.USER_DID)],
                [
                    CreateSkeetAction.make(
                        (handler: HandlerAgent, commit: JetstreamEventCommit): string => {
                            // @ts-ignore
                            let text = "\"" + commit.commit.record?.text + "\"";
                            if(text.length > 300){
                                text = text.substring(1, 301)
                            }
                            return text;
                        },
                        undefined,
                        (handler: HandlerAgent, commit: JetstreamEventCommit): JetstreamSubject => {
                            return {
                                cid: MessageHandler.getCidFromMessage(handler, commit),
                                uri: MessageHandler.getUriFromMessage(handler, commit)
                            }
                        }),

                    LogInputTextAction.make("Post")
                ],
                testAgent
            )
        ]
    },
    like: {
        c: [
            new MessageHandler(
                // @ts-ignore
                [ActionTakenByUserValidator.make(<string>Bun.env.USER_DID)],
                [
                    CreateSkeetAction.make(<string>Bun.env.NAME +" liked:", undefined, (handler: HandlerAgent, commit: JetstreamEventCommit): JetstreamSubject => {
                        return commit.commit.record.subject as JetstreamSubject;
                    }),
                    LogInputTextAction.make("Like")
                ],
                testAgent
            )
        ]
    },
    repost: {
        c: [
            new MessageHandler(
                // @ts-ignore
                [ActionTakenByUserValidator.make(<string>Bun.env.USER_DID)],
                [
                    CreateSkeetAction.make(<string>Bun.env.NAME + " reposted:", undefined, (handler: HandlerAgent, commit: JetstreamEventCommit): JetstreamSubject => {
                        return commit.commit.record.subject as JetstreamSubject;
                    }),
                    LogInputTextAction.make("Repost")
                ],
                testAgent
            )
        ]
    },
    block: {
        c: [
            new MessageHandler(
                // @ts-ignore
                [
                    ActionTakenByUserValidator.make(<string>Bun.env.USER_DID)
                ],
                [
                    CreateSkeetAction.make((handler: HandlerAgent, event: JetstreamEventCommit): string => {
                        const blockedDid = event.commit.record.subject
                        return "Aaron blocked a user: " + blockedDid;
                    }, undefined, undefined),
                    LogInputTextAction.make("Block"),
                ],
                testAgent
            )
        ]
    }
}


async function initialize() {
    await testAgent.authenticate()
    jetstreamSubscription = new JetstreamSubscription(
        handlers,
        <string>Bun.env.JETSTREAM_URL,
        [<string>Bun.env.USER_DID]
    );
}

initialize().then(() => {
    jetstreamSubscription.createSubscription()
    DebugLog.info("INIT", 'Initialized and watching ' + <string>Bun.env.NAME + ' (' + <string>Bun.env.USER_DID + ')')
});


