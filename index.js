const ProbotConfigCheck = require('probot-report-error');
const schema = require('./schema');

module.exports = robot => {
    const pccOptions = { 
        title: 'ProBot Error Checker YAML is Bad',
        config: './config.yml',
        schema: schema,
        body: 'Something is wrong!',
        owner: 'philpalmieri',
        repo: 'probot-useless-box'
    }

    robot.on('issues.reopened', async context => {
        try {
            const pbc = new ProbotConfigCheck(context.github, pccOptions);

            if(!await pbc.validate()) {
                // Create issue
               await pbc.createIssue();
            }
            // Code was pushed to the repo, what should we do with it?

            return context.github.issues.edit(context.issue({state: 'closed'}));  
        } catch( e ) {
           console.log('Outer Error', e.message);
        }
    });
}