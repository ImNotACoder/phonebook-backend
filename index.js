const http = require('http')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()


require('dotenv').config()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (request) => JSON.stringify(request.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
app.use(requestLogger)


// const generateId = () => {
//     const maxId = persons.length > 0
//     ? Math.max(...persons.map(n => Number(n.id)))
//     : 0
//     return maxId
// }

// const generateRandomId = (min, max) => {
//     const minCeiled = Math.ceil(min);
//   const maxFloored = Math.floor(max);
//   return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); 
// }

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

    const person = {
        id: personContent.id,
        name: personContent.name,
        number: personContent.number,
    }

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
    response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})