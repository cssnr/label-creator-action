const github = require('@actions/github')

class Labeler {
    /**
     * GitHub Labeler
     * @param {String} token
     * @param {Boolean} dryRun
     */
    constructor(token, dryRun = false) {
        this.dryRun = dryRun
        this.repo = github.context.repo
        this.octokit = github.getOctokit(token)
    }

    /**
     * List Labels
     * @return {Promise<Object[]|null>}
     */
    async listLabels() {
        console.debug('listLabels')
        const response = await this.octokit.rest.issues.listLabelsForRepo({
            ...this.repo,
        })
        return response.data
    }

    /**
     * Create Label
     * @param {String} name
     * @param {String} color
     * @param {String} description
     * @return {Promise<Object>}
     */
    async createLabel(name, color, description) {
        console.debug(`createLabel: ${name} - ${color} - ${description}`)
        if (this.dryRun) return 'Dry Run'
        const response = await this.octokit.rest.issues.createLabel({
            ...this.repo,
            name,
            color,
            description,
        })
        return response.data
    }

    /**
     * Update Label
     * @param {String} name
     * @param {String} color
     * @param {String} description
     * @return {Promise<Object>}
     */
    async updateLabel(name, color, description) {
        console.debug(`updateLabel: ${name} - ${color} - ${description}`)
        if (this.dryRun) return 'Dry Run'
        const response = await this.octokit.rest.issues.updateLabel({
            ...this.repo,
            name,
            color,
            description,
        })
        return response.data
    }

    /**
     * Delete Label
     * @param {String} name
     * @return {Promise<InstanceType<typeof github.GitHub>|Undefined>}
     */
    async deleteLabel(name) {
        console.debug(`deleteLabel: ${name}`)
        if (this.dryRun) return 'Dry Run'
        return await this.octokit.rest.issues.deleteLabel({
            ...this.repo,
            name,
        })
    }

    /**
     * Get File Content
     * @param {String} path
     * @return {Promise<String>}
     */
    async getContent(path) {
        console.debug('getContent:', path)
        const response = await this.octokit.rest.repos.getContent({
            ...this.repo,
            path: path,
            // ref: github.context.sha,
        })
        // console.debug('response:', response)
        return Buffer.from(response.data.content, response.data.encoding).toString()
    }
}

module.exports = Labeler
