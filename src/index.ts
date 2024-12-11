import {
    BadBotHandler,
    CreateSkeetHandler,
    DebugLog,
    GoodBotHandler,
    HandlerAgent,
    InputEqualsValidator,
    JetstreamSubscription,
    LogMessageAction,
    ReplyingToBotValidator,
    MessageHandler,
    IntervalSubscription,
    IntervalSubscriptionHandlers,
    AbstractHandler,
    IsSpecifiedTimeValidator,
    CreateSkeetAction,
    ActionTakenByUserValidator,
    LogInputTextAction,
    JetstreamEventCommit,
    JetstreamSubject,
    JetstreamRecord, TestValidator
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
                    CreateSkeetAction.make("Aaron posted:", undefined, (handler: HandlerAgent, commit: JetstreamEventCommit): JetstreamSubject =>{
                    return {
                        cid: MessageHandler.getCidFromMessage(handler, commit),
                        uri: MessageHandler.getUriFromMessage(handler, commit)
                    }
                }),
                    LogInputTextAction.make("Post")
                ],
                testAgent
            ),
            GoodBotHandler.make(testAgent)
        ]
    },
    like: {
        c: [
            new MessageHandler(
                // @ts-ignore
                [ActionTakenByUserValidator.make(<string>Bun.env.USER_DID)],
                [
                    CreateSkeetAction.make("Aaron liked:", undefined, (handler: HandlerAgent, commit: JetstreamEventCommit): JetstreamSubject =>{
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
                    CreateSkeetAction.make("Aaron reposted:", undefined, (handler: HandlerAgent, commit: JetstreamEventCommit): JetstreamSubject =>{
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
        <string>Bun.env.JETSTREAM_URL
    );

}

initialize().then(() =>{
    jetstreamSubscription.createSubscription()
    DebugLog.info("INIT", 'Initialized!')
});


