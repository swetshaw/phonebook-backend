const express = require("express");

const app = express();
app.use(express.json());

const persons = [
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
  response.json(persons);
});

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(
    `<p>Phonebook has information for ${persons.length} people</p>
    <p>${date}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on ${PORT}`);