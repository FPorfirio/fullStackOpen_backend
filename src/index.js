const express = require('express')
const morgan = require('morgan');
const cors = require('cors')

morgan.token('id', function getId (req) {
	return JSON.stringify(req.body)
})

const app = express()
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-body] - :response-time ms :id'))

const persons = [
    { 
			"name": "Arto Hellas", 
			"number": "040-123456",
			"id": 1
    },
    { 
			"name": "Ada Lovelace", 
			"number": "39-44-5323523",
			"id": 2
    },
    { 
			"name": "Dan Abramov", 
			"number": "12-43-234345",
			"id": 3
    },
    { 
			"name": "Mary Poppendieck", 
			"number": "39-23-6423122",
			"id": 4
    }
]

const generateId = () => {
	const maxId = persons.length > 0 ?
	Math.max(...persons.map(person => person.id))
	: 0

	return maxId + 1
}
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const person = persons.find(person => person.id === id)
	console.log('rarw')
	if (person) {
		response.json(person)
	} else{
		response.status(404).end()
	}
})

app.get('/info', (request, response) => {
		response.send(
			`<h1>Phonebook has info for ${persons.length}</h1>
			<p>${new Date()}</p>`
		)
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons.splice(persons.indexOf(id), 1)
	response.status(202).end()
})

app.post('/api/persons', (request, response) => {
		const newPerson = request.body;
		
		if(!newPerson.name || !newPerson.number){
			return response.status(404).json({
				error: 'content missing'
			})
		}
		else if(persons.find(person => person.name == newPerson.name)){
			return response.status(400).json({
				error: 'name must be unique'
			})
		}
		persons.push({...newPerson, id: generateId()})
		return response.json(newPerson)

})
  
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})