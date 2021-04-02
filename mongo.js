const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  )
  // eslint-disable-next-line no-undef
  process.exit(1)
}

// eslint-disable-next-line no-undef
const password = process.argv[2]
// eslint-disable-next-line no-undef
const name = process.argv[3]
// eslint-disable-next-line no-undef
const number = Number(process.argv[4])

const url = `mongodb+srv://sweta:${password}@cluster0.etzji.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

if (name && number) {
  const person = new Phonebook({
    name: name,
    number: number,
  })

  person.save().then(() => {
    console.log('person saved!!')
    mongoose.connection.close()
  })
} else {
  Phonebook.find({}).then((result) => {
    result.forEach((person) => console.log(person))
    mongoose.connection.close()
  })
}
