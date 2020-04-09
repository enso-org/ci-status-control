const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const octokit = new github.GitHub(github.context.githubToken);

        // `who-to-greet` input defined in action metadata file
        const excludedPaths = core.getInput('excluded-paths').split('\n');
        const stopInternally = core.getInput('stop-internally');

        const repoOwner = github.context.repo.owner
        const repoName = github.context.repo.repo

        // We only care about `pull_request` and `push` events as they're the only
        // ones that can change commit messages or files
        const eventName = github.context.eventName;

        if (eventName == 'push' || eventName == 'pull_request') {
            const mergeCommitSha = github.context.sha;

            console.log(mergeCommitSha);
            console.log(repoOwner);
            console.log(repoName);
            console.log(excludedPaths);

            const commit = await octokit.git.getCommit(
                repoOwner,
                repoName,
                "cb984466aacf2c39a142a9726e3be8d46709c8bf"
            );
        } else {
            core.setOutput('stop-code', 'nothing')
        }

        // const payload = JSON.stringify(github.context.payload, undefined, 2)
        // console.log(`The event payload: ${payload}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

