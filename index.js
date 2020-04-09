const core = require('@actions/core');
const github = require('@actions/github');

function processPushEvent(github, octokit, event, excludedPaths, stopInternally) {
    console.log("processPushEvent");
}

/** This function makes use of the fact that a PR event generates a merge commit
 *  that contains _all_ the changes in the PR.
 */
function processPREvent(github, octokit, event, excludedPaths, stopInternally) {
    const mergeCommitSha = github.context.sha;
    const repoName = github.context.repoName;
    const repoOwner = github.context.repoOwner;

    const commit = octokit.git.getCommit({repoOwner, repoName, mergeCommitSha});

    const files = commit.files;

    console.log(files);
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

