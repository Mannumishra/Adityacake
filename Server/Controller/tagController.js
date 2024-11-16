const Tag = require("../Model/TagModel");


// Create a new tag
exports.createTag = async (req, res) => {
    const { tagName, tagColor } = req.body;

    if (!tagName || !tagColor) {
        return res.status(400).json({ message: 'Both tagName and tagColor are required' });
    }

    try {
        const newTag = new Tag({
            tagName,
            tagColor
        });

        await newTag.save();
        res.status(201).json({ message: 'Tag created successfully', data: newTag });
    } catch (error) {
        res.status(500).json({ message: 'Error creating tag', error: error.message });
    }
};

// Get all tags
exports.getAllTags = async (req, res) => {
    try {
        const tags = await Tag.find();
        res.status(200).json({ message: 'Tags retrieved successfully', data: tags });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tags', error: error.message });
    }
};

// Get a single tag by its ID
exports.getSingleTag = async (req, res) => {
    const { id } = req.params;

    try {
        const tag = await Tag.findById(id);

        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        res.status(200).json({ message: 'Tag retrieved successfully', data: tag });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tag', error: error.message });
    }
};

// Update a tag by its ID
exports.updateTag = async (req, res) => {
    const { id } = req.params;
    const { tagName, tagColor } = req.body;

    if (!tagName || !tagColor) {
        return res.status(400).json({ message: 'Both tagName and tagColor are required' });
    }

    try {
        const updatedTag = await Tag.findByIdAndUpdate(id, { tagName, tagColor }, { new: true });

        if (!updatedTag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        res.status(200).json({ message: 'Tag updated successfully', data: updatedTag });
    } catch (error) {
        res.status(500).json({ message: 'Error updating tag', error: error.message });
    }
};

// Delete a tag by its ID
exports.deleteTag = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTag = await Tag.findByIdAndDelete(id);

        if (!deletedTag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting tag', error: error.message });
    }
};
