const core = require('@actions/core');
const github = require('@actions/github');
import { Octokit } from "octokit";

let OCTOKIT_DEFAULT_HEADERS = {'X-GitHub-Api-Version': '2022-11-28'}
let octokit = null;

const init_octokit = () => {
  const token = core.getInput('token');
      
  if(!token){
    throw new Error('Token required!');    
  }

  octokit = new Octokit({
    auth: token
  });
}

const get_projects_by_organization = async (payload) => {
  return await octokit.request('GET /orgs/{org}/projects', {
    org: payload.repository.owner.login,
    headers: OCTOKIT_DEFAULT_HEADERS
  })
}

const get_projects_by_user = async (payload) => {
  return await octokit.request('GET /users/{username}/projects', {
    username: payload.repository.owner.login,
    headers: OCTOKIT_DEFAULT_HEADERS
  })
};

const get_projects = async (payload) => {
  if(payload.repository.owner.type === "Organization"){
    return get_projects_by_organization(payload);
  }
  return get_projects_by_user(payload);
};

//TODO get columns by projects

//TODO get cards by colum

//TODO filter issue by card

const action = () => {
    try {
      const payload = github.context.payload 
      const issueNumber = core.getInput('issue_number');
      const prNumber = core.getInput('pr_number');
      
      init_octokit();
      
      let projects = get_projects(payload);
      
      console.log(`The event payload: ${JSON.stringify(payload, undefined, 2)}`);
      console.log(`Is Issue: ${!!issueNumber}`);
      console.log(`Is PR: ${!!prNumber}`);
      console.log(`Projects: ${projects}`);

      core.setOutput("projects", projects);
    
    } catch (error) {
      core.setFailed(error.message);
    }
}

action();
