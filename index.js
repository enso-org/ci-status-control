const core = require('@actions/core');
const github = require('@actions/github');

try {
    // `who-to-greet` input defined in action metadata file
    const excludedPaths = core.getInput('excluded-paths');
    const stopInternally = core.getInput('stop-internally');

    console.log(`Paths ${excludedPaths}`);
    console.log(`Stop ${stopInternally}`);

    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}

