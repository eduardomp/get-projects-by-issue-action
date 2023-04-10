# Get projects by Issue or PR

This action get all associated projects to an issue/PR

## Inputs

issue_number:
    description: 'The number of the issue'
  pr_number:
    description: 'The number of the PR'
  token:
    description: 'Github token'
    required: true
### `issue_number`

The issue number

### `pr_number`

The PR number

### `token`

**Required** Github Token


## Outputs

### `projects`

A JSON array containing a list of objects that represents the associated projects

## Example usage

```yaml
    - name: Get associated projects by Issue number
        uses: eduardomp/get-projects-by-issue-action@main
        with:
          issue_number: ${{ github.event.issue.number }}
          token: ${{ secrets.GITHUB_TOKEN }}
```