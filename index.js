const core = require('@actions/core');
const github = require('@actions/github');

function processPushEvent(octokit, event, excludedPaths, stopInternally) {
    console.log("processPushEvent");
}

function processPREvent(octokit, event, excludedPaths, stopInternally) {
    const body = event.pull_request;
    const headCommitHash = body.head.sha;

    console.log(headCommitHash);
}

try {
    const githubToken = core.getInput('github-token');
    const octokit = new github.GitHub(githubToken);

    // `who-to-greet` input defined in action metadata file
    const excludedPaths = core.getInput('excluded-paths').split('\n');
    const stopInternally = core.getInput('stop-internally');

    console.log(github.context.sha);

    // We only care about `pull_request` and `push` events as they're the only
    // ones that can change commit messages or files
    const eventName = github.context.eventName;
    const event = github.event;

    if (eventName == 'push') {
        processPushEvent(event, excludedPaths, stopInternally);
    } else if (eventName == 'pull_request') {
        processPREvent(event, excludedPaths, stopInternally);
    } else {
        core.setOutput('stop-code', 'nothing')
    }

    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}

