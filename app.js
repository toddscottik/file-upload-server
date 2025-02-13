import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;
const uploadDir = 'uploads';

app.use(express.json())

// Set up storage for uploaded files
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir);
		}
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		const encodedFileName = Buffer.from(file.originalname, 'binary').toString('utf-8');
		cb(null, `${Date.now()}_${encodedFileName}`);
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

		// Read the "name" field from the body
		let nameField = null;
		if (req.body && req.body.name) {
			nameField = req.body.name;
		}
		else {
			return res.status(400).json({ error: 'No name field provided' });
		}

		// Ensure the upload directory has no more than 20 files
		const files = fs.readdirSync(uploadDir);
		if (files.length > 20) {
			// Sort files by creation time (oldest first)
			const filesWithStats = files.map(file => {
				const filePath = path.join(uploadDir, file);
				return {
					file,
					createdAt: fs.statSync(filePath).birthtime
				};
			});
			filesWithStats.sort((a, b) => a.createdAt - b.createdAt);

			// Delete the oldest file if there are more than 20
			const fileToDelete = filesWithStats[0].file;
			const filePathToDelete = path.join(uploadDir, fileToDelete);
			fs.unlinkSync(filePathToDelete);
			console.log(`Deleted oldest file: ${fileToDelete}`);
		}

		// Simulate delay
		const randomDelay = Math.random() * 2000;
		await new Promise(resolve => setTimeout(resolve, randomDelay));

		const clientIp = req.ip || req.connection.remoteAddress;
		const userAgent = req.get('User-Agent');

		console.log(new Date(), `filename=${req.file.filename}`, `name=${nameField}`, clientIp, userAgent);

		// Send response
		res.json({
			message: 'File uploaded successfully',
			filename: req.file.filename,
			name: nameField,
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error', details: error.message });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
