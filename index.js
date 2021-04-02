require( 'dotenv' ).config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Phonebook = require('./models/Phonebook')

const app = express()
app.use(express.json())
app.use(cors())

app.use(express.static('build'))

morgan.token('data', (request) => {
  if (request.method === 'POST') return ' ' + JSON.stringify(request.body)
  else return ' '
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
)

app.get('/api/persons', (request, response) => {
  Phonebook.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/info', (request, response, next) => {
  const date = new Date()
  Phonebook.count({})
    .then((result) => {
      response.send(
        `<p>Phonebook has information for ${result} people</p>
      <p>${date}</p>`
      )
    })
    .catch((error) => {
      next(error)
    })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Phonebook.findById(id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(() => {
      response.status(500).end()
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Phonebook.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => {
      next(error)
    })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (body.name === '') {
    response.status(404).json({
      error: 'Name is missing',
    })
  } else if (!body.number) {
    response.status(404).json({
      error: 'Number is missing',
    })
  } else if (body.name) {
    // res = persons.find((person) => person.name === body.name);
    // if (res) {
    //   response.status(205).json({
    //     error: "Name already exists",
    //   });
    // } else {
    //   const person = {
    //     name: body.name,
    //     number: body.number,
    //     id: generateId(),
    //   };

    //   persons = persons.concat(person);
    //   response.json(person);
    // }

    let person = new Phonebook({
      name: body.name,
      number: body.number,
    })

    person
      .save()
      .then((savedPerson) => {
        return savedPerson.toJSON()
      })
      .then((savedAndFormattedPerson) => response.json(savedAndFormattedPerson))
      .catch((error) => { next(error) })
    // .then((result) => {
    //   response.json(result);
    // })
    // .catch((error) => {
    //   error: error.message;
    // });
  }
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  let newPerson = {
    number: body.number,
  }
  Phonebook.findByIdAndUpdate(request.params.id, newPerson, { new: true })
    .then((updatedResult) => {
      response.json(updatedResult)
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown error' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  // console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'ValidationError') {
    // console.log("Validation error response");
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on ${PORT}`)
