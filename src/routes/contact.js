import express from 'express';
import Contact from '../models/contact';
import auth from '../helpers/auth';
import Settings from '../models/settings';
import _mail from '../helpers/_mail';
import install from '../helpers/install';
const router = express.Router();

// Get contact page
router.get('/contact', install.redirectToLogin, (req, res, next) => {
	res.render('contact');
});

// Post contact
router.post('/contact', install.redirectToLogin, async (req, res, next) => {
	let set = await Settings.find();
	try {
		let payload = {
			fullname: req.body.fullname,
			email: req.body.email,
			number: req.body.number,
			help: req.body.help,
			message: req.body.message,
			siteLink: res.locals.siteLink,
			logo: res.locals.siteLogo,
			instagram: res.locals.instagram,
			facebook: res.locals.facebook,
			twitter: res.locals.twitter,
		};
		if (set[0].sendContactToEmail == true) {
			_mail('A new contact form message', set[0].emailForContact, 'contact-details', payload, req.headers.host, (err, info) => {
				if(err)throw err;
			});
			const contact = new Contact(req.body);
			await contact.save();
			res.send('Thanks for contacting us, will get back to you soon.');
		} else {
			const contact = new Contact(req.body);
			await contact.save();
			res.send('Thanks for contacting us, will get back to you soon.');
		}
	} catch (error) {
		next(error);
	}
});

// Delete a contact
router.post('/contact/delete', install.redirectToLogin, auth, (req, res, next) => {
	try {
		Contact.deleteOne({ _id: req.body.contactId })
			.then(success => {
				req.flash('success_msg', 'Contact has been deleted');
				return res.redirect('back');
			})
			.catch(e => next(e));
	} catch (e) {
		next(e);
	}
});

// Delete many contact
router.post('/contact/deleteMany', install.redirectToLogin, auth, (req, res, next) => {
	try {
		Contact.deleteMany({ _id: req.body.ids })
			.then(deleted => {
				if (!req.body.ids) {
					req.flash('success_msg', 'Nothing was Deleted');
					return res.redirect('back');
				} else {
					req.flash('success_msg', 'Contact Deleted Successfully');
					return res.redirect('back');
				}
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

module.exports = router;
