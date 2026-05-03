const Task = require('../models/Task');

exports.createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        let tasks;
        if (req.user.role === 'admin') {
            tasks = await Task.find({}).populate('projectId', 'title').populate('assignedTo', 'name email');
        } else {
            tasks = await Task.find({ assignedTo: req.user.id }).populate('projectId', 'title').populate('assignedTo', 'name email');
        }
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        
        // Only allow members to update status if they are assigned to it, or admin
        if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        task.status = req.body.status || task.status;
        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.assignedTo = req.body.assignedTo || task.assignedTo;
        task.dueDate = req.body.dueDate || task.dueDate;
        
        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        
        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        let tasks;
        if (req.user.role === 'admin') {
            tasks = await Task.find({});
        } else {
            tasks = await Task.find({ assignedTo: req.user.id });
        }
        
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'Completed').length;
        const pending = tasks.filter(t => t.status === 'Pending').length;
        const inProgress = tasks.filter(t => t.status === 'In Progress').length;
        const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed').length;
        
        res.json({ total, completed, pending, inProgress, overdue });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
