const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs')
const YAML = require('yaml')

const Labeler = require('./labeler')

;(async () => {
    try {
        core.info(`🏳️ Starting Label Creator Action`)

        // Debug
        core.startGroup('Debug: github.context')
        console.log(github.context)
        core.endGroup() // Debug github.context
        core.startGroup('Debug: process.env')
        console.log(process.env)
        core.endGroup() // Debug process.env

        // Inputs
        const inputs = getInputs()
        core.startGroup('Inputs')
        console.log(inputs)
        core.endGroup() // Inputs

        // Config
        let config = await getConfig(inputs)
        console.log('config:', config)

        // Labels
        core.startGroup('Labels')
        console.log('github.context.repo:', github.context.repo)
        const labeler = new Labeler(inputs.token)
        const labels = await labeler.listLabels()
        console.log('labels.length:', labels.length)
        console.log(labels)
        core.endGroup() // Labels

        const created = []
        const updated = []

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
                    const result = await labeler.updateLabel(
                        name,
                        data.color,
                        data.description
                    )
                    console.log('result:', result)
                    updated.push(name)
                }
            } else {
                console.log(`+ + + Create - ${name}`)
                const result = await labeler.createLabel(
                    name,
                    data.color,
                    data.description
                )
                console.log('result:', result)
                created.push(name)
            }
        }
        core.endGroup() // Process Labels

        console.log('created:', created)
        console.log('updated:', updated)

        // Outputs
        core.info('📩 Setting Outputs')
        core.setOutput('created', JSON.stringify(created))
        core.setOutput('updated', JSON.stringify(updated))

        // Summary
        if (inputs.summary) {
            core.info('📝 Writing Job Summary')
            try {
                await addSummary(inputs, config, created, updated)
            } catch (e) {
                console.log(e)
                core.error(`Error writing Job Summary ${e.message}`)
            }
        }

        core.info(`✅ \u001b[32;1mFinished Success`)
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        core.setFailed(e.message)
    }
})()

/**
 * Add Summary
 * @param {Inputs} inputs
 * @param {Object} config
 * @param {String[]} created
 * @param {String[]} updated
 * @return {Promise<void>}
 */
async function addSummary(inputs, config, created, updated) {
    core.summary.addRaw('## Label Creator Action\n')

    if (created.length) {
        core.summary.addRaw(`Created ${created.length} Labels:\n`)
        core.summary.addCodeBlock(created.join('\n'), 'text')
    }

    if (updated.length) {
        core.summary.addRaw(`Updated ${updated.length} Labels:\n`)
        core.summary.addCodeBlock(updated.join('\n'), 'text')
    }

    core.summary.addRaw('<details><summary>Configuration</summary>')
    core.summary.addCodeBlock(YAML.stringify(config), 'yaml')
    core.summary.addRaw('</details>\n')

    delete inputs.token
    core.summary.addRaw('<details><summary>Inputs</summary>')
    core.summary.addCodeBlock(YAML.stringify(inputs), 'yaml')
    core.summary.addRaw('</details>\n')

    const text = 'View Documentation, Report Issues or Request Features'
    const link = 'https://github.com/cssnr/label-creator-action'
    core.summary.addRaw(`\n[${text}](${link}?tab=readme-ov-file#readme)\n\n---`)
    await core.summary.write()
}

/**
 * Get Config
 * @param {Inputs} inputs
 * @return {Object}
 */
async function getConfig(inputs) {
    if (inputs.json) {
        console.log('Processing JSON:', inputs.json)
        return JSON.parse(inputs.json)
    } else if (fs.existsSync(inputs.file)) {
        console.log('Processing File:', inputs.file)
        const file = fs.readFileSync(inputs.file, 'utf8')
        return YAML.parse(file)
    } else {
        const url = new URL(inputs.file)
        console.log('Processing URL:', url.href)
        const response = await fetch(url)
        if (!response.ok) throw new Error(response.statusText)
        const text = await response.text()
        return YAML.parse(text)
    }
}

/**
 * Get Inputs
 * @typedef {Object} Inputs
 * @property {String|undefined} file
 * @property {String|undefined} json
 * @property {Boolean} summary
 * @property {String} token
 * @return {Inputs}
 */
function getInputs() {
    return {
        file: core.getInput('file'),
        json: core.getInput('json'),
        summary: core.getBooleanInput('summary'),
        token: core.getInput('token', { required: true }),
    }
}
