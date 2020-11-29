const mongoose = require('mongoose')
if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullStackOpen:7nWxuK3L5GAbRu1P@cluster0.hgfgh.mongodb.net/phonebook-app?retryWrites=true&w=majority`

  console.log(url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const numberSchema = new mongoose.Schema({
  name: String,
  number: Number,
})


const PhoneNumber = mongoose.model('Number', numberSchema)

const number = new PhoneNumber({
  name: "robertito",
  number: 12412421123,
})

number.save().then(result => {
  console.log(result)
  mongoose.connection.close()
})