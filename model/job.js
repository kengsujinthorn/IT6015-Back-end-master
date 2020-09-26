const mongoose = require('mongoose')
const Schema = mongoose.Schema

const jobSchema = new Schema({
    id: String,
    empImg: String,
    jobName: String,
    jobDescription: String,
    empName: String,
    wage: String,
    startDate: Date,
    tags: [String]
}
)

const JobModel = mongoose.model('Job', jobSchema)

module.exports = JobModel