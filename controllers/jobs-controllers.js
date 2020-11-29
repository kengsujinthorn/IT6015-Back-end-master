const fs = require("fs");
const express = require("express");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Job = require("../models/job");
const User = require("../models/user");
const usersController = require("./users-controllers");

const getJobs = async (req, res, next) => {
  let jobs;
  try {
    jobs = await Job.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching jobs failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ jobs: jobs.map((job) => job.toObject({ getters: true })) });
};

const getJobById = async (req, res, next) => {
  const jobId = req.params.jid;

  let job;
  try {
    job = await Job.findById(jobId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a job.",
      500
    );
    return next(error);
  }

  if (!job) {
    const error = new HttpError("Could not find job for the provided id.", 404);
    return next(error);
  }

  res.json({ job: job.toObject({ getters: true }) });
};

const getJobsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  try {
    jobs = await Job.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching jobs failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!jobs || jobs.length === 0) {
    return next(
      new HttpError("Could not find jobs for the provided user id.", 404)
    );
  }

  res.json({
    jobs: jobs.map((jobs) => jobs.toObject({ getters: true })),
  });
  console.log(jobs);
};

const createJobs = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    title,
    description,
    companyAddress,
    companyName,
    wage,
    expDate,
    categories,
  } = req.body;

  try {
  } catch (error) {
    return next(error);
  }

  const createdJob = new Job({
    title,
    description,
    image: req.file.path,
    companyAddress,
    companyName,
    wage,
    expDate,
    categories,
    creator: req.userData.userId,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError("Creating job failed, please try again.", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdJob.save({ session: sess });
    user.jobs.push(createdJob);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating job failed, please try again.", 500);
    return next(err);
  }

  res.status(201).json({ jobs: createdJob });
};

const updateJob = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, wage, categories, expDate } = req.body;
  const jobId = req.params.jid;

  let job;
  try {
    job = await Job.findById(jobId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update job.",
      500
    );
    return next(error);
  }

  if (job.creator.toString() !== req.userData.userId) {
    const error = new HttpError("You are not allowed to edit this job.", 401);
    return next(error);
  }

  job.title = title;
  job.description = description;
  // job.companyAddress = companyAddress;
  job.wage = wage;
  job.expDate = expDate;
  job.categories = categories;

  try {
    await job.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update job.",
      500
    );
    return next(error);
  }

  res.status(200).json({ job: job.toObject({ getters: true }) });
};

const deleteJob = async (req, res, next) => {
  const jobId = req.params.jid;

  let job;
  try {
    job = await Job.findById(jobId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete job.",
      500
    );
    return next(error);
  }

  if (!job) {
    const error = new HttpError("Could not find job for this id.", 404);
    return next(error);
  }

  if (job.creator.id !== req.userData.userId) {
    const error = new HttpError("You are not allowed to delete this job.", 401);
    return next(error);
  }

  const imagePath = job.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await job.remove({ session: sess });
    job.creator.jobs.pull(job);
    await job.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete job.",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted job." });
};
exports.getJobs = getJobs;
exports.getJobById = getJobById;
exports.getJobsByUserId = getJobsByUserId;
exports.createdJob = createJobs;
exports.updateJob = updateJob;
exports.deleteJob = deleteJob;
