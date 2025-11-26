const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('node:fs')
const { parse, stringify } = require('yaml')

const Api = require('./api')

async function main() /* NOSONAR */ {
    const version = process.env.GITHUB_ACTION_REF
        ? `\u001b[35;1m${process.env.GITHUB_ACTION_REF}`
        : '\u001b[33;1mSource'
    core.info(`🏳️ Starting Label Creator Action - ${version}`)

    // // Debug
    // core.startGroup('Debug: github.context')
    // console.log(github.context)
    // core.endGroup() // Debug github.context
    // core.startGroup('Debug: process.env')
    // console.log(process.env)
    // core.endGroup() // Debug process.env

    // Inputs
    const inputs = getInputs()
    core.startGroup('Inputs')
    console.log(inputs)
    core.endGroup() // Inputs

    // Config
    const api = new Api(inputs.token, inputs.dryRun)
    let config = await getConfig(inputs, api)
    console.log('config:', config)
    if (!config) {
        core.error('Must provide a file, url, or data input.')
        core.setFailed('No configuration file found.')
        return
    }

    // Labels
    core.startGroup('Labels')
    console.log('github.context.repo:', github.context.repo)
    const labels = await api.listLabels()
    console.log('labels.length:', labels.length)
    console.log(labels)
    core.endGroup() // Labels

    const created = []
    const updated = []
    const deleted = []

    // Process Labels
    core.startGroup('Process Labels')
    for (const [name, data] of Object.entries(config)) {
        console.log(`-- Processing -- ${name}`, data)
        // console.log(`${name} - ${data.color} - ${data.description}`)
        const label = labels.find((obj) => obj.name === name)
        console.log('Current label:', label)
        if (label) {
            if (
                (data.color && data.color !== label.color) ||
                (data.description && data.description !== label.description)
            ) {
                console.log(`! ! ! Update - ${name}`)
                const result = await api.updateLabel(name, data.color, data.description)
                console.log('result:', result)
                updated.push(name)
            }
        } else {
            console.log(`+ + + Create - ${name}`)
            const result = await api.createLabel(name, data.color, data.description)
            console.log('result:', result)
            created.push(name)
        }
    }
    core.endGroup() // Process Labels

    // Delete Labels
    if (inputs.delete) {
        core.startGroup('Delete Labels')
        const keys = new Set(Object.keys(config).map((k) => k.toLowerCase()))
        const toDelete = labels
            .filter((label) => !keys.has(label.name.toLowerCase()))
            .map((label) => label.name)
        console.log('toDelete:', toDelete)
        for (const label of toDelete) {
            const result = await api.deleteLabel(label)
            console.log('result:', result)
            deleted.push(label)
            await new Promise((resolve) => setTimeout(resolve, 250))
        }
        core.endGroup() // Delete Labels
    }

    const changed = created.length > 0 || updated.length > 0 || deleted.length > 0
    console.log('changed:', changed)
    console.log('created:', created)
    console.log('updated:', updated)
    console.log('deleted:', deleted)

    // Outputs
    core.info('📩 Setting Outputs')
    core.setOutput('changed', changed)
    core.setOutput('created', created)
    core.setOutput('updated', updated)
    core.setOutput('deleted', deleted)

    // Summary
    if (inputs.summary) {
        core.info('📝 Writing Job Summary')
        try {
            await addSummary(inputs, config, created, updated, deleted)
        } catch (e) {
            console.log(e)
            core.error(`Error writing Job Summary ${e.message}`)
        }
    }

    core.info(`✅ \u001b[32;1mFinished Success`)
}

/**
 * Add Summary
 * @param {Inputs} inputs
 * @param {object} config
 * @param {string[]} created
 * @param {string[]} updated
 * @param {string[]} deleted
 * @return {Promise<void>}
 */
async function addSummary(inputs, config, created, updated, deleted) {
    core.summary.addRaw('## Label Creator Action\n')

    if (inputs.dryRun) {
        core.summary.addRaw('⚠️ **Dry Run - No Changes Made!** ')
        core.summary.addRaw('Set `dry-run` to `false` to process changes.\n\n')
    }
    if (created.length) {
        core.summary.addRaw(`➕ Created ${created.length} Labels:\n`)
        core.summary.addCodeBlock(created.join('\n'), 'text')
    }
    if (updated.length) {
        core.summary.addRaw(`📝 Updated ${updated.length} Labels:\n`)
        core.summary.addCodeBlock(updated.join('\n'), 'text')
    }
    if (deleted.length) {
        core.summary.addRaw(`❌ Deleted ${deleted.length} Labels:\n`)
        core.summary.addCodeBlock(deleted.join('\n'), 'text')
    }
    if (!created.length && !updated.length && !deleted.length) {
        core.summary.addRaw('✅ All Labels are Up-to-Date.\n\n')
    }

    core.summary.addRaw('<details><summary>Configuration</summary>')
    core.summary.addCodeBlock(stringify(config), 'yaml')
    core.summary.addRaw('</details>\n')

    delete inputs.token
    core.summary.addRaw('<details><summary>Inputs</summary>')
    core.summary.addCodeBlock(stringify(inputs), 'yaml')
    core.summary.addRaw('</details>\n')

    const text = 'View Documentation, Report Issues or Request Features'
    const link = 'https://github.com/cssnr/label-creator-action'
    core.summary.addRaw(`\n[${text}](${link}?tab=readme-ov-file#readme)\n\n---`)
    await core.summary.write()
}

/**
 * Get Config
 * @param {Inputs} inputs
 * @param {Api} api
 * @return {object}
 */
async function getConfig(inputs, api) {
    if (inputs.data) {
        console.log('Processing DATA:', inputs.data)
        return parseData(inputs.data)
    } else if (inputs.url) {
        console.log('Processing URL:', inputs.url)
        const response = await fetch(inputs.url)
        if (!response.ok) throw new Error(response.statusText)
        const text = await response.text()
        return parseData(text)
    } else if (inputs.file) {
        console.log('Processing File:', inputs.file)
        if (fs.existsSync(inputs.file)) {
            console.log('Local file found, reading file content.')
            const text = fs.readFileSync(inputs.file, 'utf8')
            return parseData(text)
        } else {
            console.log('File not found, get content from API.')
            const text = await api.getContent(inputs.file)
            return parseData(text)
        }
    }
}

/**
 * Parse Data from Input
 * @param {string} data
 * @return {object}
 */
function parseData(data) {
    core.debug(`parseData: ${typeof data}: ${data}`)
    // console.log(`parseData: ${typeof data}: ${data}`)
    if (!data) return {}
    try {
        return JSON.parse(data)
    } catch (e) {
        core.debug(`JSON.parse failed: ${e.message}`)
        // console.log(`JSON.parse failed: ${e.message}`)
    }
    try {
        return parse(data)
    } catch (e) {
        core.debug(`YAML.parse failed: ${e.message}`)
        // console.log(`YAML.parse failed: ${e.message}`)
    }
    throw new Error(`Unable to parse data: ${data}`)
}

/**
 * Get Inputs
 * @typedef {object} Inputs
 * @property {string} file
 * @property {string} url
 * @property {string} data
 * @property {boolean} delete
 * @property {boolean} summary
 * @property {boolean} dryRun
 * @property {string} token
 * @return {Inputs}
 */
function getInputs() {
    return {
        file: core.getInput('file'),
        url: core.getInput('url'),
        data: core.getInput('data') || core.getInput('json'),
        delete: core.getBooleanInput('delete'),
        summary: core.getBooleanInput('summary'),
        dryRun: core.getBooleanInput('dry-run'),
        token: core.getInput('token', { required: true }),
    }
}

main().catch((e) => {
    core.debug(e)
    core.info(e.message)
    core.setFailed(e.message)
})
