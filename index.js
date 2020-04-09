const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const token = core.getInput('github-token');
        const octokit = new github.GitHub(token);

        // `who-to-greet` input defined in action metadata file
        const excludedPaths = core.getInput('excluded-paths').split('\n');
        const stopInternally = core.getInput('stop-internally');

        const repoOwner = github.context.repo.owner
        const repoName = github.context.repo.repo

        // We only care about `pull_request` and `push` events as they're the
        // only ones that can change commit messages or files
        const eventName = github.context.eventName;

        if (eventName == 'push' || eventName == 'pull_request') {
            var headCommitHash;

            if (eventName == 'pull_request') {
                headCommitHash = github.context.payload.pull_request.head.sha;
            } else {
                github.context.sha;
            }

            const commitHash = github.context.sha;

            const commit = await octokit.git.getCommit({
                owner: repoOwner,
                repo: repoName,
                commit_sha: commitHash
            });

            const headCommit = await octokit.git.getCommit({
                owner: repoOwner,
                repo: repoName,
                commit_sha: headCommitHash
            });

            console.log(commit.data.message);
            console.log(headCommit.data.message);
        } else {
            core.setOutput('stop-code', 'nothing')
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

