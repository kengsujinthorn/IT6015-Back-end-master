let mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router();

let jobSchema = require('../model/job');

// CREATE Job
router.route('/create-job').post((req, res, next) => {
  jobSchema.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      console.log(data)
      res.json(data)
    }
  })
});

// READ ALL JOB
router.route('/').get((req, res) => {
  jobSchema.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get Single Job
router.route('/job/:id').get((req, res) => {
  const ID = req.params.id
  jobSchema.find({ id: ID }, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// READ TAGS
router.route('/tag/:tags').get((req, res) => {
  const TAGS = req.params.tags
  jobSchema.find({ tags: TAGS }, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Update Job
router.route('/update-job/:id').put((req, res, next) => {
  const ID = req.params.id
  jobSchema.findOneAndUpdate({ id: ID }, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Job updated successfully !')
    }
  })
})

// Delete Job
router.route('/delete-job/').delete((req, res, next) => {
  const data = res.params;
  jobSchema.findOneAndDelete({params:data},(error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

router.route('/delete-job/:id').delete((req, res, next) => {
  const ID = req.params.id
  jobSchema.findOneAndDelete({ id: ID }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = router;