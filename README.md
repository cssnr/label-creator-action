[![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/label-creator-action?sort=semver&filter=!v*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/label-creator-action/tags)
[![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/label-creator-action?sort=semver&filter=!v*.*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/label-creator-action/releases)
[![GitHub Release Version](https://img.shields.io/github/v/release/cssnr/label-creator-action?logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/label-creator-action/releases/latest)
[![GitHub Dist Size](https://img.shields.io/github/size/cssnr/label-creator-action/dist%2Findex.js?logo=bookstack&logoColor=white&label=dist%20size)](https://github.com/cssnr/label-creator-action/blob/master/src)
[![Action Run Using](https://img.shields.io/badge/dynamic/yaml?url=https%3A%2F%2Fraw.githubusercontent.com%2Fcssnr%2Flabel-creator-action%2Frefs%2Fheads%2Fmaster%2Faction.yml&query=%24.runs.using&logo=githubactions&logoColor=white&label=runs)](https://github.com/cssnr/label-creator-action/blob/master/action.yml)
[![Workflow Release](https://img.shields.io/github/actions/workflow/status/cssnr/label-creator-action/release.yaml?logo=cachet&label=release)](https://github.com/cssnr/label-creator-action/actions/workflows/release.yaml)
[![Workflow Test](https://img.shields.io/github/actions/workflow/status/cssnr/label-creator-action/test.yaml?logo=cachet&label=test)](https://github.com/cssnr/label-creator-action/actions/workflows/test.yaml)
[![Workflow Lint](https://img.shields.io/github/actions/workflow/status/cssnr/label-creator-action/lint.yaml?logo=cachet&label=lint)](https://github.com/cssnr/label-creator-action/actions/workflows/lint.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cssnr_label-creator-action&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=cssnr_label-creator-action)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/cssnr/label-creator-action?logo=github&label=updated)](https://github.com/cssnr/label-creator-action/pulse)
[![Codeberg Last Commit](https://img.shields.io/gitea/last-commit/cssnr/label-creator-action/master?gitea_url=https%3A%2F%2Fcodeberg.org%2F&logo=codeberg&logoColor=white&label=updated)](https://codeberg.org/cssnr/label-creator-action)
[![GitHub Contributors](https://img.shields.io/github/contributors-anon/cssnr/label-creator-action?logo=github)](https://github.com/cssnr/label-creator-action/graphs/contributors)
[![GitHub Repo Size](https://img.shields.io/github/repo-size/cssnr/label-creator-action?logo=bookstack&logoColor=white&label=repo%20size)](https://github.com/cssnr/label-creator-action?tab=readme-ov-file#readme)
[![GitHub Top Language](https://img.shields.io/github/languages/top/cssnr/label-creator-action?logo=htmx)](https://github.com/cssnr/label-creator-action)
[![GitHub Discussions](https://img.shields.io/github/discussions/cssnr/label-creator-action?logo=github)](https://github.com/cssnr/label-creator-action/discussions)
[![GitHub Forks](https://img.shields.io/github/forks/cssnr/label-creator-action?style=flat&logo=github)](https://github.com/cssnr/label-creator-action/forks)
[![GitHub Repo Stars](https://img.shields.io/github/stars/cssnr/label-creator-action?style=flat&logo=github)](https://github.com/cssnr/label-creator-action/stargazers)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=github&label=org%20stars)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-72a5f2?logo=kofi&label=support)](https://ko-fi.com/cssnr)

# Label Creator Action

- [Features](#Features)
- [Configuration](#Configuration)
- [Inputs](#Inputs)
  - [Permissions](#Permissions)
- [Outputs](#Outputs)
- [Examples](#Examples)
- [Tags](#Tags)
- [Support](#Support)
- [Contributing](#Contributing)

Automatically Create or Update Labels to ensure they exist and are synchronized.
Works from a centralized remote configuration file/url, local file or inline config.

This works by fetching the configuration file and current repository labels.
It loops through the configuration and checks if the provided labels exist.
If the label does not exist, it creates a new label with the name, color and description.
If the label exist, it makes sure the color and description matches, otherwise updates them.
You can also enable `delete` which will delete any labels not in the configuration file.

```yaml
- name: 'Label Creator'
  uses: cssnr/label-creator-action@v1
```

This is the workflow I use on all my repos: [.github/workflows/labeler.yaml](.github/workflows/labeler.yaml)  
Which checks out these centralized configs: [https://github.com/cssnr/configs](https://github.com/cssnr/configs/tree/master/labels)

## Features

- Keep Labels up-to-date on every workflow run.
- Use a [centralized configuration](#Configuration) local or remote file or inline JSON or YAML.

## Configuration

The configuration file can be remote file, local file, or inline JSON or YAML string.
In all cases the same format is used.

```yaml
workflows:
  color: ffffff
  description: Workflows modification
documentation:
  color: 0075ca
  description: Documentation updates
source:
  color: fbca04
  description: Source modification
```

Both `color` and `description` are optional; however, I assume you are using this action because you want to set one of them.
If you are using [actions/labeler](https://github.com/actions/labeler) it will create the labels, but not set the description or color.

By default, the file is sourced from [.github/labels.yaml](https://raw.githubusercontent.com/cssnr/label-creator-action/refs/heads/master/.github/labels.yaml) but can be placed anywhere.

This includes remote files.  
Example URL: https://raw.githubusercontent.com/cssnr/label-creator-action/refs/heads/master/.github/labels.yaml

## Inputs

All inputs are optional.

| Input   | Default&nbsp;Value    | Description&nbsp;of&nbsp;Input |
| :------ | :-------------------- | :----------------------------- |
| file    | `.github/labels.yaml` | Configuration file path        |
| url     | -                     | Configuration file URL         |
| data    | -                     | Configuration JSON/YAML string |
| delete  | `false`               | Delete labels not in config    |
| summary | `true`                | Add Summary to Job             |
| dry-run | `false`               | Dry Run, only output results   |
| token   | `github.token`        | GitHub Access Token PAT [^1]   |

This action is designed to work on the `pull_request_target` trigger.  
Example workflow: [.github/workflows/labeler.yaml](https://github.com/cssnr/label-creator-action/blob/master/.github/workflows/labeler.yaml)

```yaml
- name: 'Label Creator'
  uses: cssnr/label-creator-action@v1
```

See the [Examples](#examples) for usage options.

### Permissions

This action requires the following permissions:

```yaml
permissions:
  issues: write
```

Permissions documentation for [Workflows](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/controlling-permissions-for-github_token) and [Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication).

## Outputs

| Output  | Description&nbsp;of&nbsp;Output  |
| :------ | :------------------------------- |
| changed | `true` if any changes or `false` |
| created | Labels Created JSON Array        |
| updated | Labels Updated JSON Array        |
| deleted | Labels Deleted JSON Array        |

Note: All outputs are Strings per GitHub Spec.

```yaml
- name: 'Label Creator'
  id: label
  uses: cssnr/label-creator-action@v1

- name: 'Echo Output'
  run: |
    echo "changed: ${{ steps.label.outputs.changed }}"
    echo "created: ${{ steps.label.outputs.created }}"
    echo "updated: ${{ steps.label.outputs.updated }}"
    echo "deleted: ${{ steps.label.outputs.deleted }}"
```

## Examples

💡 _Click on an example heading to expand or collapse the example._

With a local file.

```yaml
- name: 'Label Creator'
  uses: cssnr/label-creator-action@v1
  with:
    file: .github/labels.yaml
```

With a remote file.

```yaml
- name: 'Label Creator'
  uses: cssnr/label-creator-action@v1
  with:
    url: https://raw.githubusercontent.com/cssnr/label-creator-action/refs/heads/master/.github/labels.yaml
```

With an inline JSON string.

```yaml
- name: 'Label Creator'
  uses: cssnr/label-creator-action@v1
  with:
    data: |
      {
        "workflows": {"color": "ffffff", "description": "Workflows modification"},
        "documentation": {"color": "0075ca", "description": "Documentation updates"},
        "source": {"color": "fbca04", "description": "Source modification"}
      }
```

With an inline YAML + JSON string

```yaml
- name: 'Label Creator'
  uses: cssnr/label-creator-action@v1
  with:
    data: |
      workflows: {"color": "ffffff", "description": "Workflows modification"}
      source: {"color": "fbca04", "description": "Source modification"}
      documentation: {"color": "0075ca", "description": "Documentation updates"}
```

With an inline YAML string.

```yaml
- name: 'Label Creator'
  uses: cssnr/label-creator-action@v1
  with:
    data: |
      workflows:
        color: ffffff
        description: Workflows modification
      source:
        color: fbca04
        description: Source modification
      documentation:
        color: 0075ca
        description: Documentation updates
```

<details><summary>Full Workflow</summary>

This is the workflow I use to pull centralized configuration files from a repository.

```yaml
name: 'PR Labeler'

on:
  pull_request_target:

permissions:
  issues: write

jobs:
  labeler:
    name: 'Labeler'
    runs-on: ubuntu-latest
    timeout-minutes: 5

    steps:
      - name: 'Checkout Configs'
        uses: actions/checkout@v4
        with:
          repository: cssnr/configs
          ref: master
          path: .configs
          sparse-checkout-cone-mode: false
          sparse-checkout: |
            labels/**

      - name: 'Debug'
        continue-on-error: true
        run: |
          echo "::group::labels.yaml"
          cat .configs/labels/labels.yaml
          echo "::endgroup::"

          echo "::group::labeler.yaml"
          cat .configs/labels/labeler.yaml
          echo "::endgroup::"

      - name: 'Label Creator'
        continue-on-error: true
        uses: cssnr/label-creator-action@v1
        with:
          file: .configs/labels/labels.yaml

      - name: 'Labeler'
        uses: actions/labeler@v6
        with:
          sync-labels: true
          configuration-path: .configs/labels/labeler.yaml
```

Note: Steps with `continue-on-error: true` will fail silently.

</details>

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
- Provide General Feedback: [https://cssnr.github.io/feedback/](https://cssnr.github.io/feedback/?app=Label%20Creator%20Action)

For more information, see the CSSNR [SUPPORT.md](https://github.com/cssnr/.github/blob/master/.github/SUPPORT.md#support).

# Contributing

If you would like to submit a PR, please review the [CONTRIBUTING.md](#contributing-ov-file).

Please consider making a donation to support the development of this project
and [additional](https://cssnr.com/) open source projects.

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/cssnr)

Additionally, you can support other GitHub Actions I have published:

- [Stack Deploy Action](https://github.com/cssnr/stack-deploy-action?tab=readme-ov-file#readme)
- [Portainer Stack Deploy Action](https://github.com/cssnr/portainer-stack-deploy-action?tab=readme-ov-file#readme)
- [Docker Context Action](https://github.com/cssnr/docker-context-action?tab=readme-ov-file#readme)
- [Actions Up Action](https://github.com/cssnr/actions-up-action?tab=readme-ov-file#readme)
- [VirusTotal Action](https://github.com/cssnr/virustotal-action?tab=readme-ov-file#readme)
- [Mirror Repository Action](https://github.com/cssnr/mirror-repository-action?tab=readme-ov-file#readme)
- [Update Version Tags Action](https://github.com/cssnr/update-version-tags-action?tab=readme-ov-file#readme)
- [Docker Tags Action](https://github.com/cssnr/docker-tags-action?tab=readme-ov-file#readme)
- [Update JSON Value Action](https://github.com/cssnr/update-json-value-action?tab=readme-ov-file#readme)
- [JSON Key Value Check Action](https://github.com/cssnr/json-key-value-check-action?tab=readme-ov-file#readme)
- [Parse Issue Form Action](https://github.com/cssnr/parse-issue-form-action?tab=readme-ov-file#readme)
- [Cloudflare Purge Cache Action](https://github.com/cssnr/cloudflare-purge-cache-action?tab=readme-ov-file#readme)
- [Mozilla Addon Update Action](https://github.com/cssnr/mozilla-addon-update-action?tab=readme-ov-file#readme)
- [Package Changelog Action](https://github.com/cssnr/package-changelog-action?tab=readme-ov-file#readme)
- [NPM Outdated Check Action](https://github.com/cssnr/npm-outdated-action?tab=readme-ov-file#readme)
- [Label Creator Action](https://github.com/cssnr/label-creator-action?tab=readme-ov-file#readme)
- [Algolia Crawler Action](https://github.com/cssnr/algolia-crawler-action?tab=readme-ov-file#readme)
- [Upload Release Action](https://github.com/cssnr/upload-release-action?tab=readme-ov-file#readme)
- [Check Build Action](https://github.com/cssnr/check-build-action?tab=readme-ov-file#readme)
- [Web Request Action](https://github.com/cssnr/web-request-action?tab=readme-ov-file#readme)
- [Get Commit Action](https://github.com/cssnr/get-commit-action?tab=readme-ov-file#readme)

<details><summary>❔ Unpublished Actions</summary>

These actions are not published on the Marketplace, but may be useful.

- [cssnr/create-files-action](https://github.com/cssnr/create-files-action?tab=readme-ov-file#readme) - Create various files from templates.
- [cssnr/draft-release-action](https://github.com/cssnr/draft-release-action?tab=readme-ov-file#readme) - Keep a draft release ready to publish.
- [cssnr/env-json-action](https://github.com/cssnr/env-json-action?tab=readme-ov-file#readme) - Convert env file to json or vice versa.
- [cssnr/push-artifacts-action](https://github.com/cssnr/push-artifacts-action?tab=readme-ov-file#readme) - Sync files to a remote host with rsync.
- [smashedr/update-release-notes-action](https://github.com/smashedr/update-release-notes-action?tab=readme-ov-file#readme) - Update release notes.
- [smashedr/combine-release-notes-action](https://github.com/smashedr/combine-release-notes-action?tab=readme-ov-file#readme) - Combine release notes.

---

</details>

<details><summary>📝 Template Actions</summary>

These are basic action templates that I use for creating new actions.

- [js-test-action](https://github.com/smashedr/js-test-action?tab=readme-ov-file#readme) - JavaScript
- [ts-test-action](https://github.com/smashedr/ts-test-action?tab=readme-ov-file#readme) - TypeScript
- [py-test-action](https://github.com/smashedr/py-test-action?tab=readme-ov-file#readme) - Python (Dockerfile)
- [docker-test-action](https://github.com/smashedr/docker-test-action?tab=readme-ov-file#readme) - Docker (Image)

Note: The `docker-test-action` builds, runs and pushes images to [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

---

</details>

For a full list of current projects visit: [https://cssnr.github.io/](https://cssnr.github.io/)

[^1]:
    The `${{ github.token }}` / `{{ secrets.GITHUB_TOKEN }}` is automatically passed, there is no need to manually pass these!
    This is only available to allow users to pass a different token they have created and defined in their `secrets`.
