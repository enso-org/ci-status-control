import * as core from '@actions/core'
import * as github from '@actions/github'
import * as Webhooks from '@octokit/webhooks'

async function run(): Promise<void> {
  const skipCIMessage: string = '[skip ci]'

  try {
    const token: string = core.getInput('github-token')
    const octokit: github.GitHub = new github.GitHub(token)

    const excludedPaths: string[] = core.getInput('excluded-paths').split('\n')
    const stopInternally: boolean = JSON.parse(core.getInput('stop-internally'))

    const eventName: string = github.context.eventName

    const repoOwner: string = github.context.repo.owner
    const repoName: string = github.context.repo.repo

    // We only care about 'pull_request' and 'push' events as they are the only
    // two kinds that can change files.
    if (eventName == 'pull_request' || eventName == 'push') {
      const commitHash: string = github.context.sha
      var headCommitHash: string

      if (github.context.payload.pull_request) {
        headCommitHash = github.context.payload.pull_request.head.sha
      } else {
        headCommitHash = github.context.sha
      }

      const commit = await octokit.git.getCommit({
        owner: repoOwner,
        repo: repoName,
        commit_sha: commitHash
      })

      const headCommit = await octokit.git.getCommit({
        owner: repoOwner,
        repo: repoName,
        commit_sha: headCommitHash
      })

      const actionId: string = core.getInput('run-id')

      if (headCommit.data.message.includes(skipCIMessage)) {
        console.log('SKIP')
      } else {
        console.log('NO SKIP')
      }
    } else {
      core.setOutput('stop-code', 'nothing')
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
