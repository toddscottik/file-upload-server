import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;

// Set up storage for uploaded files
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadDir = 'uploads';
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir);
		}
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}_${file.originalname}`);
	}
});

const upload = multer({ storage });

app.post('/api/v1/upload', upload.single('file'), async (req, res) => {
	try {
		// Check if file is provided
		if (!req.file) {
			return res.status(400).json({ error: 'No file uploaded' });
		}

		// Check file extension
		const allowedExtensions = ['.json', '.txt', '.csv'];
		const fileExt = path.extname(req.file.originalname).toLowerCase();
		if (!allowedExtensions.includes(fileExt)) {
			return res.status(400).json({ error: 'Invalid file type' });
		}

		// Read JSON content if it's a JSON file
		let nameField = null;
		if (fileExt === '.json') {
			const fileContent = fs.readFileSync(req.file.path, 'utf8');
			const jsonData = JSON.parse(fileContent);
			nameField = jsonData.name || null;
		}

		// Simulate delay
		await new Promise(resolve => setTimeout(resolve, 2000));

		// Send response
		res.json({
			message: 'File uploaded successfully',
			filename: req.file.filename,
			nameField: nameField,
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error', details: error.message });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
