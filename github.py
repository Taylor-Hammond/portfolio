import requests

USERNAME = "TayIsGod"
TOKEN = "your_token"  # Optional for public repos, recommended to avoid rate limits

headers = {}
if TOKEN:
    headers["Authorization"] = f"Bearer {TOKEN}"

total_commits = 0

# Get repositories
page = 1
while True:
    repos = requests.get(
        f"https://api.github.com/users/{USERNAME}/repos?per_page=100&page={page}",
        headers=headers
    ).json()

    if not repos:
        break

    for repo in repos:
        repo_name = repo["name"]

        commits = requests.get(
            f"https://api.github.com/repos/{USERNAME}/{repo_name}/commits?author={USERNAME}&per_page=1",
            headers=headers
        )

        if "Link" in commits.headers:
            # Extract last page number for commit count estimate
            links = commits.headers["Link"]
            if 'rel="last"' in links:
                last_page = int(
                    links.split('page=')[-2].split(">")[0]
                )
                total_commits += last_page
            else:
                total_commits += len(commits.json())
        else:
            total_commits += len(commits.json())

    page += 1

print("Total commits:", total_commits)