const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Number = require('../models/number.js')
const PORT = process.env.PORT || 3001

require('dotenv').config()

morgan.token('id', function getId (req) {
	return JSON.stringify(req.body)
})

const app = express()
app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-body] - :response-time ms :id'))
  
app.get('/info', (request, response) => {
	Number.find({}).then(result => {
		response.send(
			`<h1>Phonebook has info for ${result.length} people</h1>
			<p>${new Date()}</p>`
		)
	})	
})

app.get('/api/persons', (request, response) => {
	Number.find({}).then(result => response.json(result))	
})

app.get('/api/persons/:id', (request, response, next) => {
	Number.findById(request.params.id)
		.then(person => {
			if(person){
				response.json(person)
			} else{
				response.status(404).end()		
			}
		})
		.catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body

	const number = {
		name: body.name,
		number: body.number
	}

	Number.findByIdAndUpdate(request.params.id, number, {new: true})
		.then(updatedNumber => {
			response.json(updatedNumber)
		})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Number.findByIdAndDelete(request.params.id)
		.then(result => {
			response.status(202).end()
		})
		.catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
	const newPerson = request.body;

	/*if(newPerson === 'undefined'){
			return response.status(400).json({
				error: 'content missing'
			})
		}

		else if(!newPerson.name || !newPerson.number){
			return response.status(404).json({
				error: 'content missing'
			})
		}*/

	(async () => {
		const checkNumber = await Number.findOne(newPerson)
			
		if(checkNumber){
			return response.status(400).json({
				error: 'name must be unique'
			})
		}

		const number = new Number({
			name: newPerson.name,
			number: newPerson.number
		})
	
		number.save(number)
			.then(savedNumber =>{
				return savedNumber.toJSON()
			})
			.then(formattedNumber => {
				response.json(formattedNumber)
			})
			.catch(error => next(error)) 

	
	})()	
})


const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		
		return response.status(400).json({ error: error.message })
	}
	next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})