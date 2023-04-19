const core = require('@actions/core');
const github = require('@actions/github');
import { Octokit } from "octokit";
const { graphql } = require("@octokit/graphql");

let OCTOKIT_DEFAULT_HEADERS = {'X-GitHub-Api-Version': '2022-11-28'}
let octokit = null;

const init_octokit = (token) => {
  if(!token){
    throw new Error('Token required!');
  }

  octokit = new Octokit({
    auth: token
  });
}

const get_projects_by_organization_graphql = async (payload, token) => {
  const { projects } = await graphql(
    `
      query($organization: String!){
        organization(login: $organization){
          projectsV2(first: 100) {
            nodes {
              id
              title
            }
          }
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

const get_projects_by_organization = (payload) => {
  return octokit.request('GET /orgs/{org}/projects', {
    org: payload.repository.owner.login,
    headers: OCTOKIT_DEFAULT_HEADERS
  });
}

const get_projects_by_user = (payload) => {
  return octokit.request('GET /users/{username}/projects', {
    username: payload.repository.owner.login,
    headers: OCTOKIT_DEFAULT_HEADERS
  });
};

const get_repository_projects = (payload) => {
  return octokit.request('GET /repos/{owner}/{repo}/projects', {
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    headers: OCTOKIT_DEFAULT_HEADERS
  });
};

const get_projects = (payload) => {
  if(payload.repository.owner.type === "Organization"){
    return get_projects_by_organization(payload);
  }
  return get_projects_by_user(payload);
};

//TODO get columns by projects

//TODO get cards by colum

//TODO filter issue by card

const action = async () => {
    try {
      const payload = github.context.payload 
      const issueNumber = core.getInput('issue_number');
      const prNumber = core.getInput('pr_number');
      const token = core.getInput('token');

      init_octokit(token);
      
      let projects = await get_projects(payload);

      let repository_projects = await get_repository_projects(payload);

      let projects_v2 = await get_projects_by_organization_graphql(payload, token);
      
     // console.log(`The event payload: ${JSON.stringify(payload, undefined, 2)}`);
      console.log(`Is Issue: ${!!issueNumber}`);
      console.log(`Is PR: ${!!prNumber}`);
      console.log(`Projects: ${JSON.stringify(projects, undefined, 2)}}`);
      console.log(`Repo Projects: ${JSON.stringify(repository_projects, undefined, 2)}}`);
      console.log(`ProjectsV2: ${JSON.stringify(projects_v2, undefined, 2)}}`);

      core.setOutput("projects", projects);
    
    } catch (error) {
      core.setFailed(error.message);
    }
}

action();
