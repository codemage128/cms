import express from 'express';
import formidable from 'formidable';
import Ads from '../models/ads';
import auth from '../helpers/auth';
import role from '../helpers/role';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
const router = express.Router();

// Create a new advert
router.post('/advert/create', auth, role('admin'), (req, res, next) => {
	try {
		let form = new formidable.IncomingForm();
		form.parse(req, (err, fields, files) => {
			const fileUpload = files.fileName;
			const uploadedData = fields;
			const name = `${crypto.randomBytes(20).toString('hex')}${Date.now().toString()}.${fileUpload.name
				.split('.')
				.pop()}`;
			const dest = `${path.join(__dirname, '..', 'public', 'media', `${name}`)}`;
			const data = fs.readFileSync(fileUpload.path);
			fs.writeFileSync(dest, data);
			fs.unlinkSync(fileUpload.path);
			let ads = new Ads();
			ads.fileSize = fileUpload.size;
			ads.fileType = fileUpload.type;
			ads.fileName = `/media/${name}`;
			ads.url = uploadedData.url;
			ads.location = uploadedData.location;
			ads.save()
				.then(done => {
					req.flash('success_msg', 'Advert has been Created Successfully');
					return res.redirect('back');
				})
				.catch(e => next(e));
		});
	} catch (error) {
		next(error);
	}
});

// Delete an advert
router.post('/advert/delete', auth, role('admin'), (req, res, next) => {
	try {
		Ads.deleteOne({ _id: req.body.advertId })
			.then(deleted => {
				req.flash('success_msg', 'Advert has been Deleted successfully');
				return res.redirect('back');
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

module.exports = router;
