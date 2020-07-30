import express from 'express';
import auth from '../helpers/auth';
import Announcement from '../models/announcement';
const router = express.Router();

// Create a new announcement
router.post('/announcement/create', auth, (req, res, next) => {
	try {
		let payload = {
			title: req.body.title,
			body: req.body.body,
			type: !req.body.type ? 'success' : req.body.type,
		};
		Announcement.create(payload)
			.then(created => {
				req.flash('success_msg', 'Announcement Has been created');
				return res.redirect('back');
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// Edit Single Announcement
router.post('/announcement/edit', auth, (req, res, next) => {
	try {
		Announcement.updateOne({ _id: req.body.announcementId }, req.body)
			.then(updated => {
				req.flash('success_msg', 'Announcement has been updated successfully');
				return res.redirect('back');
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// delete many announcements
router.post('/announcement/deleteMany', auth, (req, res, next) => {
	try {
		Announcement.deleteMany({ _id: req.body.ids })
			.then(deleted => {
				if (!req.body.ids) {
					req.flash('success_msg', 'Nothing has been Deleted');
					return res.redirect('back');
				} else {
					req.flash('success_msg', 'Announcements has been Deleted');
					return res.redirect('back');
				}
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// Activate many announcements
router.post('/announcement/activateMany', auth, (req, res, next) => {
	try {
		Announcement.updateMany({ _id: req.body.ids }, { $set: { active: true } })
			.then(updated => {
				if (!req.body.ids) {
					req.flash('success_msg', 'Nothing was updated');
					return res.redirect('back');
				} else {
					req.flash('success_msg', 'Announcements has been Activated successfully');
					return res.redirect('back');
				}
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// Deactivate many announcements
router.post('/announcement/deactivateMany', auth, (req, res, next) => {
	try {
		Announcement.updateMany({ _id: req.body.ids }, { $set: { active: false } })
			.then(updated => {
				if (!req.body.ids) {
					req.flash('success_msg', 'Nothing was Deactivated');
					return res.redirect('back');
				} else {
					req.flash('success_msg', 'Announcement has been Deactivated successfully');
					return res.redirect('back');
				}
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// Activate an announcement
router.post('/announcement/activate', auth, (req, res, next) => {
	try {
		Announcement.updateOne({ _id: req.body.announcementId }, { $set: { active: true } })
			.then(updated => {
				req.flash('success_msg', 'Announcement has been Activated successfully');
				return res.redirect('back');
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// Deactivate an announcement
router.post('/announcement/deactivate', auth, (req, res, next) => {
	try {
		Announcement.updateOne({ _id: req.body.announcementId }, { $set: { active: false } })
			.then(updated => {
				req.flash('success_msg', 'Announcement has been Deactivated successfully');
				return res.redirect('back');
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// Delete an annoucement
router.post('/announcement/delete', auth, (req, res, next) => {
	try {
		Announcement.deleteOne({ _id: req.body.announcementId })
			.then(deleted => {
				req.flash('success_msg', 'Announcement has been Deleted');
				return res.redirect('back');
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

module.exports = router;
