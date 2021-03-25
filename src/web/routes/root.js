const faker = require('faker')

module.exports = async (app) => {
  app.get('/', async (req, rep) => {
    rep.view('home.pug', {
      header: faker.company.companyName(),
      catchPhrase: faker.company.catchPhrase(),
      title: faker.commerce.productName(),
      subtitle: faker.company.catchPhrase(),
      sentence: faker.lorem.sentence(),
      lorem1: faker.lorem.paragraph(),
      lorem2: faker.lorem.paragraph(),
      lorem3: faker.lorem.paragraph(),
      lorem4: faker.lorem.paragraph(),
    })
  })
}
