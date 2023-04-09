const core = require('@actions/core');
const github = require('@actions/github');
//const { graphql } = require("@octokit/graphql");

const action = () => {
    try {
      
      const issueNumber = core.getInput('issue_number');
      const prNumber = core.getInput('pr_number');
      let projects = [];  
      console.log(`Is Issue: ${!!issueNumber}`);
      console.log(`Is PR: ${!!prNumber}`);
    
      core.setOutput("projects", projects);
      
      // Get the JSON webhook payload for the event that triggered the workflow
      const payload = JSON.stringify(github.context.payload, undefined, 2)
      console.log(`The event payload: ${payload}`);
    
    } catch (error) {
      core.setFailed(error.message);
    }
}

action();
