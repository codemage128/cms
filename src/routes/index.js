import express from 'express';
import Article from '../models/articles';
import Category from '../models/category';
import Settings from '../models/settings';
import Comment from '../models/comment';
import Tags from '../models/tags';
import flash from 'express-flash';
import moment from 'moment';
import dotenv from 'dotenv';
import User from '../models/users';
import url from 'url';
import Ads from '../models/ads';
import install from '../helpers/install';
import Menu from '../models/menu';
const router = express.Router();

dotenv.config({ path: './.env' });

router.use(flash());
router.use(async function(req, res, next) {
	console.log("AAAAAAAAAAAAAAAAAAA")
	let settingsInfo = await Settings.find({});
	console.log(settingsInfo)
	res.locals.mainMenu = await Menu.find().sort({ position: 1 });
	res.locals.time = ev => {
		const wordsPerMinute = 200; // Average case.
		let result;

		let textLength = ev.split(/\s/g).length; // Split by words
		if (textLength > 0) {
			let value = Math.ceil(textLength / wordsPerMinute);
			result = `${value} min read`;
		}
		return result;
	};
	res.locals.getmonth = data => {
		switch (data) {
			case 0:
				return 'Jan';
				break;
			case 1:
				return 'Feb';
				break;
			case 2:
				return 'March';
				break;
			case 3:
				return 'Apr';
				break;
			case 4:
				return 'May';
				break;
			case 5:
				return 'Jun';
				break;
			case 6:
				return 'Jul';
				break;
			case 7:
				return 'Aug';
				break;
			case 8:
				return 'Sep';
				break;
			case 9:
				return 'Oct';
				break;
			case 10:
				return 'Nov';
				break;
			case 11:
				return 'Dec';
				break;
			default:
				break;
		}
	};
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	res.locals.siteTitle =
		settingsInfo == ''
			? 'Pls edit site title in the admin dashboard'
			: typeof settingsInfo[0].siteName == 'undefined'
			? 'Pls edit site title in the admin dashboard'
			: `${settingsInfo[0].siteName}`;
	res.locals.siteDescription =
		settingsInfo == ''
			? 'Edit site description in the admin dashboard'
			: typeof settingsInfo[0].siteDescription == 'undefined'
			? 'edit site title in the admin dashboard'
			: `${settingsInfo[0].siteDescription}`;
	res.locals.recent = await Article.find({
		slug: {
			$ne: url
				.parse(req.url)
				.path.split('/')
				.pop(),
		},
	})
		.populate('category')
		.populate('postedBy')
		.sort({ createdAt: -1 })
		.limit(5);
	res.locals.sidebarPop = await Article.find({
		slug: {
			$ne: url
				.parse(req.url)
				.path.split('/')
				.pop(),
		},
	})
		.populate('category')
		.populate('postedBy')
		.sort({ views: -1 })
		.limit(5);
	res.locals.comments = await Comment.aggregate([
		{
			$lookup: {
				from: 'articles',
				localField: 'articleId',
				foreignField: '_id',
				as: 'article',
			},
		},
		{
			$unwind: {
				path: '$article',
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: 'article.postedBy',
				foreignField: '_id',
				as: 'postedBy',
			},
		},
		{
			$unwind: {
				path: '$postedBy',
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$lookup: {
				from: 'categories',
				localField: 'article.category',
				foreignField: '_id',
				as: 'category',
			},
		},
		{
			$unwind: {
				path: '$category',
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$sort: {
				createdAt: -1,
			},
		},
		{
			$limit: 5,
		},
	]);
	res.locals.tags = await Tags.find()
		.sort({ createdAt: -1 })
		.limit(12);
	res.locals.tags2 = await Tags.find().sort({ createdAt: -1 });
	res.locals.category = await Category.aggregate([
		{
			$sort: {
				createdAt: -1,
			},
		},
		{
			$limit: 7,
		},
		{
			$lookup: {
				from: 'articles',
				localField: '_id',
				foreignField: 'category',
				as: 'total',
			},
		},
	]);
	res.locals.hotCategory = await Category.aggregate([
		{
			$limit: 7,
		},
		{
			$lookup: {
				from: 'articles',
				localField: '_id',
				foreignField: 'category',
				as: 'total',
			},
		},
		{
			$sort: {
				total: -1,
			},
		},
	]);
	res.locals.category2 = await Category.aggregate([
		{
			$sort: {
				createdAt: -1,
			},
		},
		{
			$lookup: {
				from: 'articles',
				localField: '_id',
				foreignField: 'category',
				as: 'total',
			},
		},
	]);
	res.locals.subCategory2 = await Category.aggregate([
		{
			$match: {
				parent: {
					$exists: false,
				},
			},
		},
		{
			$sort: {
				createdAt: -1,
			},
		},
	]);
	res.locals.subCategory = await Category.aggregate([
		{
			$match: {
				parent: {
					$exists: true,
				},
			},
		},
		{
			$sort: {
				createdAt: -1,
			},
		},
	]);
	res.locals.formatDate = function(arg) {
		return moment(arg).fromNow();
	};
	res.locals.strip = function(stringWithHTML) {
		let text = stringWithHTML
			.replace(/<!--[\s\S]*?(-->|$)/g, '')
			.replace(/<(script|style)[^>]*>[\s\S]*?(<\/\1>|$)/gi, '')
			.replace(/<\/?[a-z][\s\S]*?(>|$)/gi, '');
		return text;
	};
	res.locals.siteLink = `${req.protocol}://${req.headers.host}`;
	res.locals.facebook =
		settingsInfo == ''
			? 'https://facebook.com'
			: typeof settingsInfo[0].socialMedia.facebook == 'undefined'
			? 'https://facebook.com'
			: `${settingsInfo[0].socialMedia.facebook}`;
	res.locals.twitter =
		settingsInfo == ''
			? 'https://twitter.com'
			: typeof settingsInfo[0].socialMedia.twitter == 'undefined'
			? 'https://twitter.com'
			: `${settingsInfo[0].socialMedia.twitter}`;
	res.locals.instagram =
		settingsInfo == ''
			? 'https://instagram.com'
			: typeof settingsInfo[0].socialMedia.instagram == 'undefined'
			? 'https://instagram.com'
			: `${settingsInfo[0].socialMedia.instagram}`;
	res.locals.linkedin =
		settingsInfo == ''
			? 'https://linkedin.com'
			: typeof settingsInfo[0].socialMedia.linkedin == 'undefined'
			? 'https://linkedin.com'
			: `${settingsInfo[0].socialMedia.linkedin}`;
	res.locals.youtube =
		settingsInfo == ''
			? 'https://youtube.com'
			: typeof settingsInfo[0].socialMedia.youtube == 'undefined'
			? 'https://youtube.com'
			: `${settingsInfo[0].socialMedia.youtube}`;
	res.locals.pinterest =
		settingsInfo == ''
			? 'https://pinterest.com'
			: typeof settingsInfo[0].socialMedia.pinterest == 'undefined'
			? 'https://pinterest.com'
			: `${settingsInfo[0].socialMedia.pinterest}`;
	res.locals.textAsIcon = settingsInfo == '' ? false : settingsInfo[0].textAsIcon;
	res.locals.siteLogo =
		settingsInfo == ''
			? 'default.png'
			: typeof settingsInfo[0].siteLogo == 'undefined'
			? 'default.png'
			: settingsInfo[0].siteLogo;
	res.locals.favicon =
		settingsInfo == ''
			? 'default.png'
			: typeof settingsInfo[0].favicon == 'undefined'
			? 'default.png'
			: settingsInfo[0].favicon;
	res.locals.siteEmail =
		settingsInfo == ''
			? 'update site email in the admin dashboard'
			: typeof settingsInfo[0].contactInfo.email == 'undefined'
			? 'update site email in the admin dashboard'
			: settingsInfo[0].contactInfo.email;
	res.locals.siteNumber =
		settingsInfo == ''
			? 'update Phone number in the admin dashboard'
			: typeof settingsInfo[0].contactInfo.phoneNumber == 'undefined'
			? 'update phone number in the admin dashboard'
			: settingsInfo[0].contactInfo.phoneNumber;
	res.locals.otherInfo =
		settingsInfo == ''
			? 'update this in the admin dashboard'
			: typeof settingsInfo[0].contactInfo.otherInfo == 'undefined'
			? 'update this in the admin dashboard'
			: settingsInfo[0].contactInfo.otherInfo;
	res.locals.headerCategory = await Category.find()
		.populate('parent')
		.sort({ createdAt: -1 })
		.limit(3);
	res.locals.operatingSystem = process.platform;
	res.locals.myPost =
		typeof req.user !== 'undefined' ? await Article.countDocuments({ postedBy: req.user.id }) : null;
	res.locals.copyright = settingsInfo == '' ? `Copright ${new Date().getFullYear()}` : settingsInfo[0].copyright;
	res.locals.mainSettings = settingsInfo[0];
	res.locals.homepageFooter = await Ads.find({ location: 'homepageFooter' }).sort({ createdAt: -1 });
	res.locals.homepageSidebar = await Ads.find({ location: 'homepageSidebar' }).sort({ createdAt: -1 });
	res.locals.categoryFooter = await Ads.find({ location: 'categoryFooter' }).sort({ createdAt: -1 });
	res.locals.authorFooter = await Ads.find({ location: 'authorFooter' }).sort({ createdAt: -1 });
	res.locals.searchFooter = await Ads.find({ location: 'searchFooter' }).sort({ createdAt: -1 });
	res.locals.getCat = arg => {
		let promise = new Promise((resolve, reject) => {
			resolve(Category.findOne({ slug: arg.split('/').pop() }));
		});
		return promise.then(data => {
			return data.name;
		});
	};
	next();
});

// Disable post request in the demo
// router.post('*', (req, res, next) => {
// 	if (req.path == '/login') {
// 		return next();
// 	} else {
// 		req.flash('success_msg', 'Post request is disabled in demo');
// 		return res.redirect('back');
// 	}
// });

// Get index page
router.get('/', install.redirectToLogin, async (req, res, next) => {
	try {
		let perPage = 9;
		let page = req.query.page || 1;
		let slider1 = await Article.aggregate([
			{
				$match: {
					showPostOnSlider: true,
					active: true,
				},
			},
			{
				$lookup: {
					from: 'categories',
					localField: 'category',
					foreignField: '_id',
					as: 'category',
				},
			},
			{
				$unwind: {
					path: '$category',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'postedBy',
					foreignField: '_id',
					as: 'postedBy',
				},
			},
			{
				$unwind: {
					path: '$postedBy',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: 'comments',
					localField: '_id',
					foreignField: 'articleId',
					as: 'comments',
				},
			},
			{
				$sort: {
					createdAt: -1,
				},
			},
			{
				$limit: 4,
			},
		]);
		let featured = await Article.aggregate([
			{
				$match: {
					addToFeatured: true,
					active: true,
				},
			},
			{
				$lookup: {
					from: 'categories',
					localField: 'category',
					foreignField: '_id',
					as: 'category',
				},
			},
			{
				$unwind: {
					path: '$category',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'postedBy',
					foreignField: '_id',
					as: 'postedBy',
				},
			},
			{
				$unwind: {
					path: '$postedBy',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: 'comments',
					localField: '_id',
					foreignField: 'articleId',
					as: 'comments',
				},
			},
			{
				$sort: {
					createdAt: -1,
				},
			},
			{
				$limit: 4,
			},
		]);
		let post = await Article.find({ active: true })
			.populate('postedBy')
			.populate('category')
			.sort({ createdAt: -1 })
			.skip(perPage * page - perPage)
			.limit(perPage);
		let count = await Article.countDocuments({ active: true });
		let popularNews = await Article.find({ active: true })
			.sort({ views: -1 })
			.populate('category')
			.populate('postedBy')
			.limit(1);
		let popNews = await Article.find({ active: true })
			.sort({ views: -1 })
			.populate('category')
			.limit(3);
		let img = await Article.find({ active: true })
			.sort({ createdAt: -1 })
			.limit(12);
		let recommended = await Article.find({ active: true, addToRecommended: true })
			.populate('category')
			.populate('postedBy')
			.sort({ createdAt: -1 })
			.limit(4);
		let breakingNews = await Article.find({
			active: true,
			addToBreaking: true,
		})
			.populate('category')
			.populate('postedBy')
			.sort({ createdAt: -1 })
			.limit(4);
		let video = await Article.aggregate([
			{
				$match: {
					postType: 'video',
					active: true,
				},
			},
			{
				$lookup: {
					from: 'categories',
					localField: 'category',
					foreignField: '_id',
					as: 'category',
				},
			},
			{
				$unwind: {
					path: '$category',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'postedBy',
					foreignField: '_id',
					as: 'postedBy',
				},
			},
			{
				$unwind: {
					path: '$postedBy',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: 'comments',
					localField: '_id',
					foreignField: 'articleId',
					as: 'comments',
				},
			},
			{
				$sort: {
					createdAt: -1,
				},
			},
			{
				$limit: 12,
			},
		]);
		res.render('index', {
			post: post,
			current: page,
			pages: Math.ceil(count / perPage),
			slider1: slider1,
			popular: popularNews[0],
			popNews: popNews,
			img: img,
			breakingNews: breakingNews,
			featured: featured,
			video: video,
			recommended: recommended,
		});
	} catch (error) {
		next(error);
	}
});

// Get search page
router.get('/search', install.redirectToLogin, async (req, res, next) => {
	try {
		if (req.query.q) {
			let perPage = 9;
			let page = req.query.page || 1;
			let count = await Article.countDocuments({
				active: true,
				$or: [
					{ title: { $regex: req.query.q, $options: '$i' } },
					{ tags: { $regex: req.query.q, $options: '$i' } },
				],
			});
			let data = await Article.find({
				active: true,
				$or: [
					{ title: { $regex: req.query.q, $options: '$i' } },
					{ tags: { $regex: req.query.q, $options: '$i' } },
				],
			})
				.populate('postedBy')
				.populate('category')
				.skip(perPage * page - perPage)
				.limit(perPage)
				.sort({ createdAt: -1 });
			let random = await Article.aggregate([
				{
					$match: {
						active: true,
					},
				},
				{
					$sample: {
						size: 4,
					},
				},
				{
					$lookup: {
						from: 'users',
						localField: 'postedBy',
						foreignField: '_id',
						as: 'postedBy',
					},
				},
				{
					$unwind: '$postedBy',
				},
				{
					$lookup: {
						from: 'categories',
						localField: 'category',
						foreignField: '_id',
						as: 'category',
					},
				},
				{
					$unwind: '$category',
				},
			]);
			res.render('search', {
				data: data,
				search: req.query.q,
				current: page,
				pages: Math.ceil(count / perPage),
				random: random,
			});
		} else {
			res.render('404');
		}
	} catch (error) {
		next(error);
	}
});

router.get('/author/:username', install.redirectToLogin, async (req, res, next) => {
	let user = await User.findOne({ username: req.params.username });
	let featured = await Article.aggregate([
		{
			$match: {
				addToFeatured: true,
				active: true,
			},
		},
		{
			$lookup: {
				from: 'categories',
				localField: 'category',
				foreignField: '_id',
				as: 'category',
			},
		},
		{
			$unwind: {
				path: '$category',
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: 'postedBy',
				foreignField: '_id',
				as: 'postedBy',
			},
		},
		{
			$unwind: {
				path: '$postedBy',
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$lookup: {
				from: 'comments',
				localField: '_id',
				foreignField: 'articleId',
				as: 'comments',
			},
		},
		{
			$sort: {
				createdAt: -1,
			},
		},
		{
			$limit: 4,
		},
	]);
	if (!user) res.render('404');
	else {
		let perPage = 9;
		let page = req.query.page || 1;
		let article = await Article.find({ active: true, postedBy: user._id })
			.populate('postedBy')
			.populate('category')
			.skip(perPage * page - perPage)
			.limit(perPage)
			.sort({ createdAt: -1 });
		let count = await Article.countDocuments({ active: true, postedBy: user._id });
		res.render('author', {
			author: user,
			article: article,
			featured: featured,
			current: page,
			pages: Math.ceil(count / perPage),
		});
	}
});

module.exports = router;
