import express from 'express';
import Tags from '../models/tags';
import auth from '../helpers/auth';
import Article from '../models/articles';
const router = express.Router();

// Create a new tag
router.post('/tags/create', auth, async (req, res, next) => {
	try {
		let exist = await Tags.find({ name: req.body.name });
		if (exist == '') {
			req.body.slug = !req.body.slug
				? req.body.name
						.split(' ')
						.join('-')
						.toLowerCase()
				: req.body.slug
						.split(' ')
						.join('-')
						.toLowerCase();
			let payload = { name: req.body.name.toLowerCase(), slug: req.body.slug, description: req.body.description };
			let tag = new Tags(payload);
			tag.save()
				.then(saved => {
					req.flash('success_msg', 'Tag was created successfully');
					return res.redirect('back');
				})
				.catch(e => next(e));
		} else {
			req.flash('success_msg', "There's a Tag with that name already");
			return res.redirect('back');
		}
	} catch (error) {
		next(error);
	}
});

// Edit a tag
router.post('/tags/edit', auth, (req, res, next) => {
	try {
		Tags.updateOne({ _id: req.body.tagId.trim() }, req.body)
			.then(updated => {
				req.flash('success_msg', 'Tag has been updated');
				return res.redirect('back');
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// Delete a tag
router.post('/tags/delete', auth, (req, res, next) => {
	try {
		Tags.deleteOne({ _id: req.body.tagId.trim() })
			.then(deleted => {
				req.flash('success_msg', 'Tag has been deleted');
				return res.redirect('back');
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// Delete many Tags
router.post('/tags/deleteMany', auth, (req, res, next) => {
	try {
		Tags.deleteMany({ _id: req.body.ids })
			.then(deleted => {
				req.flash('success_msg', 'Tags has been Deleted');
				return res.redirect('back');
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// Get tags page
router.get('/tags/:tag', async (req, res, next) => {
	let perPage = 9;
	let page = req.query.page || 1;
	let post = await Article.find({ tags: { $regex: req.params.tag, $options: '$i' } })
		.populate('category')
		.populate('postedBy')
		.skip(perPage * page - perPage)
		.limit(perPage)
		.sort({ createdAt: -1 });
	let count = await Article.countDocuments({ tags: { $regex: req.params.tag, $options: '$i' } });
	let popular = await Article.find({ tags: { $regex: req.params.tag, $options: '$i' } })
		.populate('category')
		.populate('postedBy')
		.skip(perPage * page - perPage)
		.limit(perPage)
		.sort({ views: -1 });
	res.render('tags', {
		title: req.params.tag,
		cat: req.params.tag,
		post: post,
		current: page,
		pages: Math.ceil(count / perPage),
		popular: popular,
	});
});

module.exports = router;
