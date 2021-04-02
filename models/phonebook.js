const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI

console.log('Connecting to', url)

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB', error.message)
  })

const phonebookSchema = new mongoose.Schema({
  name: { type: String, require: true, unique: true, minlength: [3, 'Name must be at least 3 characters'] },
  number: { type: Number, require: true, unique: false, minlength: 8 },
})

phonebookSchema.plugin(uniqueValidator)

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

// const Phonebook = mongoose.model('Phonebook', phonebookSchema)

module.exports = mongoose.model('Phonebook', phonebookSchema)
