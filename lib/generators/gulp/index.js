const BasicGenerator = require('../../BaseGenerator')

class Generator extends BasicGenerator {
  prompting () {
    const prompts = [
      {
        name: 'name',
        message: `What's the name of your project?`,
        default: this.name,
      },
      {
        name: 'description',
        message: `What's the description of your project?`,
      },
    ]

    return this.prompt(prompts).then(props => {
      this.prompts = props
    })
  }

  writing () {
    this.writeFiles({
      context: this.prompts,
      filterFiles: f => {
        return true
      },
    })
  }
}

module.exports = Generator
