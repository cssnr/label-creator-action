const github = require('@actions/github')

class Api {
    /**
     * GitHub Api
     * @param {string} token
     * @param {boolean} dryRun
     */
    constructor(token, dryRun = false) {
        this.dryRun = dryRun
        this.repo = github.context.repo
        this.octokit = github.getOctokit(token)
    }

    /**
     * List Labels
     * https://docs.github.com/en/rest/issues/labels?apiVersion=2022-11-28#list-labels-for-a-repository
     * @return {Promise<Object[]>} Label Data Object Array
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
     * https://docs.github.com/en/rest/issues/labels?apiVersion=2022-11-28#create-a-label
     * @param {string} name
     * @param {string} color
     * @param {string} description
     * @return {Promise<object>} Label Data Object
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
     * https://docs.github.com/en/rest/issues/labels?apiVersion=2022-11-28#update-a-label
     * @param {string} name
     * @param {string} color
     * @param {string} description
     * @return {Promise<object>} Label Data Object
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
     * @return {Promise<InstanceType<typeof github.GitHub>|undefined>}
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
     * https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-repository-content
     * @param {string} path
     * @return {Promise<string>} File Content String
     */
    async getContent(path) {
        console.debug('getContent:', path)
        /** @type {object} */
        const response = await this.octokit.rest.repos.getContent({
            ...this.repo,
            path: path,
            // ref: github.context.sha,
        })
        // console.debug('response:', response)
        return Buffer.from(response.data.content, response.data.encoding).toString()
    }
}

module.exports = Api
