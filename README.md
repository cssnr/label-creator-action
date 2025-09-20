[![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/label-creator-action?sort=semver&filter=!v*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/label-creator-action/tags)
[![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/label-creator-action?sort=semver&filter=!v*.*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/label-creator-action/tags)
[![GitHub Release Version](https://img.shields.io/github/v/release/cssnr/label-creator-action?logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/label-creator-action/releases/latest)
[![GitHub Dist Size](https://img.shields.io/github/size/cssnr/label-creator-action/dist%2Findex.js?label=dist%20size)](https://github.com/cssnr/label-creator-action/blob/master/src/index.js)
[![Workflow Release](https://img.shields.io/github/actions/workflow/status/cssnr/label-creator-action/release.yaml?logo=cachet&label=release)](https://github.com/cssnr/label-creator-action/actions/workflows/release.yaml)
[![Workflow Test](https://img.shields.io/github/actions/workflow/status/cssnr/label-creator-action/test.yaml?logo=cachet&label=test)](https://github.com/cssnr/label-creator-action/actions/workflows/test.yaml)
[![Workflow Lint](https://img.shields.io/github/actions/workflow/status/cssnr/label-creator-action/lint.yaml?logo=cachet&label=lint)](https://github.com/cssnr/label-creator-action/actions/workflows/lint.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cssnr_label-creator-action&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=smashedr_label-creator-action)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/cssnr/label-creator-action?logo=github&label=updated)](https://github.com/cssnr/label-creator-action/pulse)
[![Codeberg Last Commit](https://img.shields.io/gitea/last-commit/shaner/label-creator-action/master?gitea_url=https%3A%2F%2Fcodeberg.org%2F&logo=codeberg&logoColor=white&label=updated)](https://codeberg.org/shaner/label-creator-action)
[![GitHub Contributors](https://img.shields.io/github/contributors/cssnr/label-creator-action?logo=github)](https://github.com/cssnr/label-creator-action/graphs/contributors)
[![GitHub Repo Size](https://img.shields.io/github/repo-size/cssnr/label-creator-action?logo=bookstack&logoColor=white&label=repo%20size)](https://github.com/cssnr/label-creator-action)
[![GitHub Top Language](https://img.shields.io/github/languages/top/cssnr/label-creator-action?logo=htmx)](https://github.com/cssnr/label-creator-action)
[![GitHub Forks](https://img.shields.io/github/forks/cssnr/label-creator-action?style=flat&logo=github)](https://github.com/cssnr/label-creator-action/forks)
[![GitHub Repo Stars](https://img.shields.io/github/stars/cssnr/label-creator-action?style=flat&logo=github)](https://github.com/cssnr/label-creator-action/stargazers)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=github&label=org%20stars)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-72a5f2?logo=kofi&label=support)](https://ko-fi.com/cssnr)

# Label Creator Action

- [Configuration](#Configuration)
- [Inputs](#Inputs)
  - [Permissions](#Permissions)
- [Outputs](#Outputs)
- [Examples](#Examples)
- [Tags](#Tags)
- [Support](#Support)
- [Contributing](#Contributing)

Automatically Create or Update Labels to ensure they exist and are synchronized.
Works from a centralized remote configuration file, local file or inline config.

This works by fetching the configuration file and current repository labels.
It loops through the configuration and checks if the provided labels exist.
If the label exist, it makes sure the color and description match, otherwise updates it.
If the label does not exist, it creates a new label with the name, color and description.

```yaml
- name: 'Label Creator Action'
  uses: cssnr/label-creator-action@master
```

## Features

- Keep Labels up-to-date on every workflow run.
- Use a centralized configuration file, local file, or inline JSON.

### Planned

- Option to delete labels not in configuration.

## Configuration

The configuration file can be remote file, local file, or inline JSON string.
In all cases the same format is used.

```yaml
source:
  color: fbca04
  description: Source modification
documentation:
  color: 0075ca
  description: Documentation updates
```

Both `color` and `description` are optional; however, I assume you are using this action because you want to set one of them.
If you are using [actions/labeler](https://github.com/actions/labeler) it will create the labels, but not set the description or color.

By default, the file is sourced from `.github/labels.yaml` but can be placed anywhere.

This includes remote files. Example: https://raw.githubusercontent.com/cssnr/label-creator-action/refs/heads/master/.github/labeler.yaml

## Inputs

All inputs are optional.

|  Input  | Default               | Input&nbsp;Description       |
| :-----: | :-------------------- | :--------------------------- |
|  file   | `.github/labels.yaml` | Configuration file path      |
|   url   | `.github/labels.yaml` | Configuration file URL       |
|  json   | -                     | Configuration JSON string    |
| summary | `true`                | Add Summary to Job \*        |
|  token  | `${{ github.token }}` | GitHub Access Token PAT [^1] |

```yaml
- name: 'Label Creator Action'
  uses: cssnr/label-creator-action@master
```

See the [Examples](#examples) for usage.

### Permissions

This action requires the following permissions:

```yaml
permissions:
  pull-requests: write
```

Permissions documentation for [Workflows](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/controlling-permissions-for-github_token) and [Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication).

## Outputs

| Output  | Description    |
| :------ | :------------- |
| created | Labels Created |
| updated | Labels Updated |

```yaml
- name: 'Label Creator Action'
  id: label
  uses: cssnr/label-creator-action@master

- name: 'Echo Output'
  run: |
    echo "created: ${{ steps.label.outputs.created }}"
    echo "updated: ${{ steps.label.outputs.updated }}"
```

## Examples

💡 _Click on an example heading to expand or collapse the example._

With a local file.

```yaml
- name: 'Label Creator Action'
  uses: cssnr/label-creator-action@master
  with:
    file: .github/labels.yaml
```

With a remote file.

```yaml
- name: 'Label Creator Action'
  uses: cssnr/label-creator-action@master
  with:
    url: https://raw.githubusercontent.com/cssnr/label-creator-action/refs/heads/master/.github/labeler.yaml
```

With an inline JSON string.

```yaml
- name: 'Label Creator Action'
  uses: cssnr/label-creator-action@master
  with:
    json: |
      {
        "source": {"color": "FBCA04", "description": "Source modifications"},
        "documentation": {"color": "0052CC", "description": "Documentation updates"}
      }
```

For more examples, you can check out other projects using this action:  
https://github.com/cssnr/label-creator-action/network/dependents

## Tags

The following rolling [tags](https://github.com/cssnr/label-creator-action/tags) are maintained.

| Version&nbsp;Tag                                                                                                                                                                                                         | Rolling | Bugs | Feat. |   Name    |  Target  | Example  |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----: | :--: | :---: | :-------: | :------: | :------- |
| [![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/label-creator-action?sort=semver&filter=!v*.*&style=for-the-badge&label=%20&color=44cc10)](https://github.com/cssnr/label-creator-action/releases/latest) |   ✅    |  ✅  |  ✅   | **Major** | `vN.x.x` | `vN`     |
| [![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/label-creator-action?sort=semver&filter=!v*.*.*&style=for-the-badge&label=%20&color=blue)](https://github.com/cssnr/label-creator-action/releases/latest) |   ✅    |  ✅  |  ❌   | **Minor** | `vN.N.x` | `vN.N`   |
| [![GitHub Release](https://img.shields.io/github/v/release/cssnr/label-creator-action?style=for-the-badge&label=%20&color=red)](https://github.com/cssnr/label-creator-action/releases/latest)                           |   ❌    |  ❌  |  ❌   | **Micro** | `vN.N.N` | `vN.N.N` |

You can view the release notes for each version on the [releases](https://github.com/cssnr/label-creator-action/releases) page.

The **Major** tag is recommended. It is the most up-to-date and always backwards compatible.
Breaking changes would result in a **Major** version bump. At a minimum you should use a **Minor** tag.

# Support

For general help or to request a feature, see:

- Q&A Discussion: https://github.com/cssnr/label-creator-action/discussions/categories/q-a
- Request a Feature: https://github.com/cssnr/label-creator-action/discussions/categories/feature-requests

If you are experiencing an issue/bug or getting unexpected results, you can:

- Report an Issue: https://github.com/cssnr/label-creator-action/issues
- Chat with us on Discord: https://discord.gg/wXy6m2X8wY
- Provide General Feedback: [https://cssnr.github.io/feedback/](https://cssnr.github.io/feedback/?app=Update%20Release%20Notes)

For more information, see the CSSNR [SUPPORT.md](https://github.com/cssnr/.github/blob/master/.github/SUPPORT.md#support).

# Contributing

Please consider making a donation to support the development of this project
and [additional](https://cssnr.com/) open source projects.

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/cssnr)

If you would like to submit a PR, please review the [CONTRIBUTING.md](#contributing-ov-file).

Additionally, you can support other GitHub Actions I have published:

- [Stack Deploy Action](https://github.com/cssnr/stack-deploy-action?tab=readme-ov-file#readme)
- [Portainer Stack Deploy](https://github.com/cssnr/portainer-stack-deploy-action?tab=readme-ov-file#readme)
- [VirusTotal Action](https://github.com/cssnr/virustotal-action?tab=readme-ov-file#readme)
- [Mirror Repository Action](https://github.com/cssnr/mirror-repository-action?tab=readme-ov-file#readme)
- [Update Version Tags Action](https://github.com/cssnr/update-version-tags-action?tab=readme-ov-file#readme)
- [Update JSON Value Action](https://github.com/cssnr/update-json-value-action?tab=readme-ov-file#readme)
- [Parse Issue Form Action](https://github.com/cssnr/parse-issue-form-action?tab=readme-ov-file#readme)
- [Cloudflare Purge Cache Action](https://github.com/cssnr/cloudflare-purge-cache-action?tab=readme-ov-file#readme)
- [Mozilla Addon Update Action](https://github.com/cssnr/mozilla-addon-update-action?tab=readme-ov-file#readme)
- [Docker Tags Action](https://github.com/cssnr/docker-tags-action?tab=readme-ov-file#readme)
- [Package Changelog Action](https://github.com/cssnr/package-changelog-action?tab=readme-ov-file#readme)
- [NPM Outdated Check Action](https://github.com/cssnr/npm-outdated-action?tab=readme-ov-file#readme)

For a full list of current projects visit: [https://cssnr.github.io/](https://cssnr.github.io/)

[^1]:
    The `${{ github.token }}` / `{{ secrets.GITHUB_TOKEN }}` is automatically passed, there is no need to manually pass these!
    This is only available to allow users to pass a different token they have created and defined in their `secrets`.
