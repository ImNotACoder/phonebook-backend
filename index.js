const http = require('http')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

morgan.token('body', (request) => JSON.stringify(request.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
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
    }
]

const generateId = () => {
    const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
    return maxId
}

const generateRandomId = (min, max) => {
    const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); 
}

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    
    if (person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    const id = String(generateId())
    const d = new Date()
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
    const date = dateFormatter.format(d)

    let time = d.toLocaleTimeString()
    response.send(`<p>This server has ${id} people. </p> 
        <p> ${date} ${time} </p>`)
})


app.post('/api/persons', (request, response) => {
    const personContent = request.body

    if (!personContent.name || !personContent.number) {
        return response.status(400).json({ 
          error: 'content missing' 
        })
    }

    const existingPerson = persons.find(person => person.name === personContent.name)
    if (existingPerson){
        return response.status(400).json({
            error: "person already exists in phonebook"
        })
    }

    const id = personContent.id || generateRandomId(10, 200) + 1;

    const person = {
        id: id,
        name: personContent.name,
        number: personContent.number,
    }

    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})