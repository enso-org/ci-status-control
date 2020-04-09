const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const token = core.getInput('github-token');
        const octokit = new github.GitHub(token);

        const skipCIMessage = core.getInput('skip-ci-message');

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

            const actionId = core.getInput('run-id');

            if (headCommit.data.message.includes(skipCIMessage)) {
                console.log("SKIP");
                core.setOutput('stop-code', 'cancel');

                if (stopInternally) {
                    console.log(actionId);
                    const checks = await octokit.checks.listForRef({
                        owner: repoOwner,
                        repo: repoName,
                        ref: headCommitHash
                    });

                    const currentAction = octokit.actions.getWorkflowRun({
                        owner: repoOwner,
                        repo: repoName,
                        run_id: actionId
                    });

                    console.log(currentAction);
                }
            } else {
                console.log("NO SKIP");
            }
        } else {
            core.setOutput('stop-code', 'nothing')
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

