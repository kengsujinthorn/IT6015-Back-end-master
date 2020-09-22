const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Job = require('./model/job')
var cors = require('cors')
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/node-api-101', {
  useNewUrlParser: true
})

const jobSchema = mongoose.Schema({
  id:String,
  empImg: String,
  jobName: String,
  jobDescription: String,
  empName: String,
  wage: Number,
  tags: [String]
})

const job = [
]

app.use(cors())

app.get('/job/', async (req, res) => {
  const job = await Job.find({})
  res.json(job)
})

app.get('/job/:id', async (req, res) => {
  const  ID  = String(req.params.id)
  const job = await Job.find({ id: ID })
  res.json(job)
})

app.post('/job', async (req, res) => {
  const payload = req.body
  const job = new Job(payload)
  await job.save()
  res.status(201).end()
})

app.put('/job/:id', async (req, res) => {
  const payload = req.body
  const { id } = req.params.id

  const job = await Job.findByIdAndUpdate(id, { $set: payload })
  res.json(job)
})

app.delete('/job/:id', async (req, res) => {
  const id = String(req.params.id)
  await Job.findOneAndDelete(id)
  res.status(204).end()
})

module.exports = mongoose.model("job", jobSchema);

app.listen(9000, () => {
  console.log('Application is running on port 9000')
})

mongoose.connection.on('error', err => {
  console.error('MongoDB error', err)
})