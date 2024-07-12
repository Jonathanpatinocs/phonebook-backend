const express = require('express')

const app = express()
const cors = require('cors')
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:', request.path);
    console.log('Body:', request.body);
    console.log('---');
    next()
}
app.use(requestLogger)


let phonebook = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }]

app.get('/', (request, response ) => {
    response.send('<h1>Hello </h1>')
})

app.get('/api/persons',(request, response) => {
    response.json(phonebook)
})

app.get('/info', (request, response) => {
    const persons = phonebook.length
    const info = `Phonebook has info for ${persons} people`
    const date = new Date()
    response.send(`${info} <br/> ${date}` )
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = phonebook.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.sendStatus(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    phonebook = phonebook.filter(person => person.id !== id)
    response.status(204).end()
})
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    if ( phonebook.find(persons => persons.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const id = String(Math.floor(Math.random() * 1000))
    const newPerson = {
        id: id,
        name: body.name,
        number: body.number
    }
    console.log(newPerson);
    phonebook = phonebook.concat(newPerson)
    response.json(newPerson)
})
const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})