require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Phonebook = require("./models/phonebook");

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static("build"));

morgan.token("data", (request) => {
  if (request.method == "POST") return " " + JSON.stringify(request.body);
  else return " ";
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

const generateId = () => {
  const maxId = Math.floor(Math.random() * 9999) + 1;
  return maxId;
};

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
  {
    name: "sweta",
    number: "78908907675",
    id: 5,
  },
  {
    name: "binod",
    number: "9474548288",
    id: 6,
  },
  {
    name: "sweta shaw",
    number: "7908902985",
    id: 7,
  },
  {
    name: "nisha",
    number: "7602373433",
    id: 8,
  },
  {
    name: "krritika",
    number: "98765",
    id: 10,
  },
];

app.get("/api/persons", (request, response) => {
  Phonebook.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response, next) => {
  const date = new Date();
  Phonebook.count({})
    .then((result) => {
      response.send(
        `<p>Phonebook has information for ${result} people</p>
      <p>${date}</p>`
      );
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Phonebook.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(500).end();
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Phonebook.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    response.status(404).json({
      error: "Name is missing",
    });
  } else if (!body.number) {
    response.status(404).json({
      error: "Number is missing",
    });
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

    const person = new Phonebook({
      name: body.name,
      number: body.number,
    });

    person.save().then((result) => {
      response.json(result);
    });
  }
});

app.put("/api/persons/:id", (request, response, next) => {
  body = request.body;

  newPerson = {
    number: body.number,
  };
  Phonebook.findByIdAndUpdate(request.params.id, newPerson, { new: true })
    .then((updatedResult) => {
      response.json(updatedResult);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: "unknown error" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on ${PORT}`);
