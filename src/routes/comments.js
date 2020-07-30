import express from 'express';
import Comment from '../models/comment';
import auth from '../helpers/auth';
import crypto from 'crypto';
import Settings from '../models/settings';
const router = express.Router();

// Create a new comment
router.post('/comment', async (req, res, next) => {
	let set = await Settings.findOne();
	try {
		let payload = {
			slug: req.body.slug,
			name: req.body.name,
			email: req.body.email,
			website: req.body.website,
			comment: req.body.comment,
			ip: req.headers['x-forwarded-for'] || 
     			req.connection.remoteAddress || 
     			req.socket.remoteAddress ||
     			(req.connection.socket ? req.connection.socket.remoteAddress : null),
			articleId: req.body.articleId,
			profilePicture:
				'https://gravatar.com/avatar/' +
				crypto
					.createHash('md5')
					.update(req.body.email)
					.digest('hex')
					.toString() +
				'?s=200' +
				'&d=retro',
			active: set.approveComment == true ? true : false,
		};
		Comment.create(payload)
			.then(done => {
				if (set.approveComment == true) res.send('Comment posted Successfully');
				else res.send('Comment has been logged for moderation');
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// Update a comment
router.post('/comment/update', (req, res, next) => {
	try {
		Comment.updateOne({ _id: req.body.commentId }, req.body)
			.then(activated => {
				req.flash('success_msg', 'Comment has been updated successfully');
				return res.redirect('back');
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// Delete a comment
router.post('/comment/delete', auth, (req, res, next) => {
	try {
		Comment.deleteOne({ _id: req.body.commentId })
			.then(deleted => {
				req.flash('success_msg', 'Comment has been deleted');
				return res.redirect('back');
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// Delete many comment
router.post('/comment/deleteMany', auth, (req, res, next) => {
	try {
		Comment.deleteMany({ _id: req.body.ids })
			.then(deleted => {
				if (!req.body.ids) {
					req.flash('success_msg', 'Nothing was Deleted');
					return res.redirect('back');
				} else {
					req.flash('success_msg', 'Comment has been Deleted');
					return res.redirect('back');
				}
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// Activate a commet
router.post('/comment/activate', auth, (req, res, next) => {
	try {
		Comment.updateOne({ _id: req.body.commentId }, { $set: { active: true } })
			.then(activated => {
				req.flash('success_msg', 'Comment has been activated');
				return res.redirect('back');
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// Deactivate a comment
router.post('/comment/deactivate', auth, (req, res, next) => {
	try {
		Comment.updateOne({ _id: req.body.commentId }, { $set: { active: false } })
			.then(activated => {
				req.flash('success_msg', 'Comment has been Deactivated');
				return res.redirect('back');
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// Approve many comments
router.post('/comment/approveMany', auth, (req, res, next) => {
	try {
		Comment.updateMany({ _id: req.body.ids }, { $set: { active: true } })
			.then(activated => {
				if (!req.body.ids) {
					req.flash('success_msg', 'No Comment was Approved');
					return res.redirect('back');
				} else {
					req.flash('success_msg', 'Comments has been Approved');
					return res.redirect('back');
				}
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// Unapprove many comments
router.post('/comment/unapproveMany', auth, (req, res, next) => {
	try {
		Comment.updateMany({ _id: req.body.ids }, { $set: { active: false } })
			.then(activated => {
				if (!req.body.ids) {
					req.flash('success_msg', 'No Changes was Made');
					return res.redirect('back');
				} else {
					req.flash('success_msg', 'Comments has been Unapproved Successfully');
					return res.redirect('back');
				}
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// Reply to a comment
router.post('/reply', (req, res, next) => {
	try {
		let payload = {
			name: req.body.name,
			email: req.body.email,
			reply: req.body.reply,
			profilePicture:
				'https://gravatar.com/avatar/' +
				crypto
					.createHash('md5')
					.update(req.body.email)
					.digest('hex')
					.toString() +
				'?s=200' +
				'&d=retro',
		};
		Comment.updateOne({ _id: req.body.commentId }, { $push: { replies: payload } })
			.then(replied => {
				res.status(200).send('Replied successfully');
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// Update a reply
router.post('/reply/update', (req, res, next) => {
	try {
		Comment.updateOne({ 'replies._id': req.body.replyId });
	} catch (error) {
		next(error);
	}
});

module.exports = router;
