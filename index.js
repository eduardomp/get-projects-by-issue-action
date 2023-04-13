const core = require('@actions/core');
const github = require('@actions/github');
const { graphql } = require("@octokit/graphql");



//TODO:get projects by organization
const get_projects_by_organization = async (payload, token) => {
  const { projects } = await graphql(
    `
      query($organization: String!){
        organization(login: $organization){
          projectV2
        }
      }
    `,
    {
      organization: payload.repository.owner.login,
      headers: {
        authorization: `token ${token}`,
      },
    }
  );

  return projects || [];
}

//TODO:get projects by repository owner???? (if is out of an organization)


//TODO get columns by projects

//TODO get cards by colum

//TODO filter issue by card




const action = () => {
    try {
      const token = core.getInput('token');
      const issueNumber = core.getInput('issue_number');
      const prNumber = core.getInput('pr_number');
      let projects = [];  

      console.log(`Is Issue: ${!!issueNumber}`);
      console.log(`Is PR: ${!!prNumber}`);
    
      projects = get_projects_by_organization(payload,token);

      console.log(`Projects: ${projects}`);

      core.setOutput("projects", projects);
      
      // Get the JSON webhook payload for the event that triggered the workflow
      const payload = JSON.stringify(github.context.payload, undefined, 2)
      console.log(`The event payload: ${payload}`);
    
    } catch (error) {
      core.setFailed(error.message);
    }
}

action();
