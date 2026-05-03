const Project = require('../models/Project');

exports.createProject = async (req, res) => {
    try {
        const { title, description, teamMembers } = req.body;
        const project = await Project.create({
            title,
            description,
            createdBy: req.user.id,
            teamMembers
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        let projects;
        if (req.user.role === 'admin') {
            projects = await Project.find({}).populate('teamMembers', 'name email');
        } else {
            projects = await Project.find({ teamMembers: req.user.id }).populate('teamMembers', 'name email');
        }
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        await project.deleteOne();
        res.json({ message: 'Project removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
