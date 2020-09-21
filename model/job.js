const mongoose = require('mongoose')
const Schema = mongoose.Schema

const jobSchema = new Schema({
    empImg: String,
    jobName: String,
    jobDescription: String,
    empName: String,
    wage: String,
    tags: [String]
},
    { timestamps: true, versionKey: false }
)

const JobModel = mongoose.model('Job', jobSchema)

module.exports = JobModel