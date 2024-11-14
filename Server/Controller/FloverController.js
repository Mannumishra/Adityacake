const Flover = require("../Model/FloverModel");


// Create a new flover
const createFlover = async (req, res) => {
    try {
        const { floverName, floverStatus } = req.body;

        if (!floverName) {
            return res.status(400).json({
                success: false,
                message: "Flover Name is must required"
            })
        }

        const newFlover = new Flover({
            floverName,
            floverStatus: floverStatus || "False" // Default to "False" if not provided
        });

        const savedFlover = await newFlover.save();
        res.status(201).json({ message: 'Flover created successfully', data: savedFlover });
    } catch (error) {
        res.status(400).json({ message: 'Error creating flover', error: error.message });
    }
};

// Get all flowers
const getAllFlowers = async (req, res) => {
    try {
        const flowers = await Flover.find();
        res.status(200).json({ message: 'Flowers fetched successfully', data: flowers });
    } catch (error) {
        res.status(400).json({ message: 'Error fetching flowers', error: error.message });
    }
};

// Get a single flover by ID
const getSingleFlover = async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        const flover = await Flover.findById(id);
        console.log(flover)
        if (!flover) {
            return res.status(404).json({ message: 'Flover not found' });
        }
        res.status(200).json({ message: 'Flover fetched successfully', data: flover });
    } catch (error) {
        res.status(400).json({ message: 'Error fetching flover', error: error.message });
    }
};

// Update a flover by ID
const updateFlover = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedFlover = await Flover.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedFlover) {
            return res.status(404).json({ message: 'Flover not found' });
        }
        res.status(200).json({ message: 'Flover updated successfully', data: updatedFlover });
    } catch (error) {
        res.status(400).json({ message: 'Error updating flover', error: error.message });
    }
};

// Delete a flover by ID
const deleteFlover = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedFlover = await Flover.findByIdAndDelete(id);
        if (!deletedFlover) {
            return res.status(404).json({ message: 'Flover not found' });
        }
        res.status(200).json({ message: 'Flover deleted successfully', data: deletedFlover });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting flover', error: error.message });
    }
};

// Exporting the controller functions
module.exports = {
    createFlover,
    getAllFlowers,
    getSingleFlover,
    updateFlover,
    deleteFlover
};
