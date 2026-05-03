const express = require('express');
const { createProject, getProjects, deleteProject } = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getProjects)
    .post(protect, admin, createProject);

router.route('/:id')
    .delete(protect, admin, deleteProject);

module.exports = router;
