const core = require('@actions/core');
const github = require('@actions/github');

function processPushEvent(event) {
    console.log("processPushEvent");
}

function processPREvent(event) {
    console.log("processPREvent");
}

try {
    // `who-to-greet` input defined in action metadata file
    const excludedPaths = core.getInput('excluded-paths');
    const stopInternally = core.getInput('stop-internally');

    // We only care about `pull_request` and `push` events as they're the only
    // ones that can change commit messages or files
    const eventName = github.context.eventName;
    const event = github.event;

    if (eventName == 'push') {
        processPushEvent(event);
    } else if (eventName == 'pull_request') {
        processPREvent(event);
    } else {
        core.setOutput('stop-code', 'nothing')
    }

    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}

