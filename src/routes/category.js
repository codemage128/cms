import express from 'express';
import Category from '../models/category';
import SubCategory from '../models/subcategory';
import Article from '../models/articles';
import auth from '../helpers/auth';
import mongoose from 'mongoose';
const router = express.Router();

// Create a new category
router.post('/category/create', auth, async (req, res, next) => {
	try {
		let exist = await Category.find({ name: req.body.name });
		if (exist == '') {
			let payload = {
				name: req.body.name.toLowerCase(),
				slug: !req.body.slug
					? req.body.name
							.split(' ')
							.join('-')
							.toLowerCase()
					: req.body.slug
							.split(' ')
							.join('-')
							.toLowerCase(),
				description: req.body.description,
				background: req.body.background,
				color: req.body.color,
				parent: !req.body.parent ? undefined : req.body.parent,
			};
			let category = new Category(payload);
			category
				.save()
				.then(saved => {
					req.flash('success_msg', 'Category was created successfully');
					return res.redirect('back');
				})
				.catch(e => next(e));
		} else {
			req.flash('success_msg', "There's a category with that name already");
			return res.redirect('back');
		}
	} catch (error) {
		next(error);
	}
});

// Edit a category
router.post('/category/edit', auth, (req, res, next) => {
	try {
		req.body.slug = !req.body.slug
			? req.body.name
					.split(' ')
					.join('-')
					.toLowerCase()
			: req.body.slug
					.split(' ')
					.join('-')
					.toLowerCase();
		Category.updateOne({ _id: req.body.categoryId.trim() }, req.body)
			.then(updated => {
				req.flash('success_msg', 'Category has been updated');
				return res.redirect('back');
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// Delete a category
router.post('/category/delete', auth, (req, res, next) => {
	try {
		Article.deleteMany({ category: req.body.categoryId })
			.then(deleted => {
				Category.deleteOne({ _id: req.body.categoryId.trim() })
					.then(deleted => {
						req.flash('success_msg', 'Category has been deleted');
						return res.redirect('back');
					})
					.catch(e => next(e));
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// Delete many Categories
router.post('/category/deleteMany', auth, (req, res, next) => {
	try {
		Article.deleteMany({ category: req.body.ids })
			.then(deleted => {
				Category.deleteMany({ _id: req.body.ids })
					.then(deleted => {
						req.flash('success_msg', 'Category has been Deleted');
						return res.redirect('back');
					})
					.catch(e => next(e));
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// Create a new SubCategory
router.post('/subcategory/create', auth, async (req, res, next) => {
	try {
		let exist = await Category.find({ parent: { $ne: undefined }, name: req.body.name });
		if (exist == '') {
			let payload = {
				name: req.body.name.toLowerCase(),
				slug: !req.body.slug
					? req.body.name
							.split(' ')
							.join('-')
							.toLowerCase()
					: req.body.slug
							.split(' ')
							.join('-')
							.toLowerCase(),
				description: req.body.description,
				parent: req.body.parent,
			};
			let subcategory = new Category(payload);
			subcategory
				.save()
				.then(saved => {
					req.flash('success_msg', 'Sub Category was created successfully');
					return res.redirect('back');
				})
				.catch(e => next(e));
		} else {
			req.flash('success_msg', "There's a Category or Sub Category with that name already");
			return res.redirect('back');
		}
	} catch (error) {
		next(error);
	}
});

// Edit a Subcategory
router.post('/subcategory/edit', auth, (req, res, next) => {
	try {
		req.body.slug = !req.body.slug
			? req.body.name
					.split(' ')
					.join('-')
					.toLowerCase()
			: req.body.slug
					.split(' ')
					.join('-')
					.toLowerCase();
		Category.updateOne({ _id: req.body.subcategoryId.trim() }, req.body)
			.then(updated => {
				req.flash('success_msg', 'Sub Category has been updated');
				return res.redirect('back');
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// Delete a Sub category
router.post('/subcategory/delete', auth, (req, res, next) => {
	try {
		Article.deleteMany({ subCategory: req.body.subcategoryId })
			.then(deleted => {
				Category.deleteOne({ _id: req.body.subcategoryId.trim() })
					.then(deleted => {
						req.flash('success_msg', 'Sub Category has been deleted');
						return res.redirect('back');
					})
					.catch(e => next(e));
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// Delete many Sub Categories
router.post('/subcategory/deleteMany', auth, (req, res, next) => {
	try {
		Article.deleteMany({ subCategory: req.body.ids })
			.then(deleted => {
				Category.deleteMany({ _id: req.body.ids })
					.then(deleted => {
						req.flash('success_msg', 'Sub Category has been Deleted');
						return res.redirect('back');
					})
					.catch(e => next(e));
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

// get some categories and send ti the client side
router.post('/get-sub-categories', auth, async (req, res, next) => {
	try {
		let data = await Category.aggregate([
			{
				$match: {
					_id: mongoose.Types.ObjectId(req.body.b),
				},
			},
			{
				$lookup: {
					from: 'subcategories',
					localField: '_id',
					foreignField: 'parent',
					as: 'data',
				},
			},
		]);
		res.send(data);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
