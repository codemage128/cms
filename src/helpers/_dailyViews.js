import Views from '../models/views';

export default async function(req, res, next) {
    const ip = req.headers['x-fowarded-for'] || req.connection.remoteAddress;
    Date.prototype.getWeek = function() {
		let dt = new Date(this.getFullYear(), 0, 1);
		return Math.ceil(((this - dt) / 86400000 + dt.getDay() + 1) / 7);
	};
    let date = new Date().toLocaleDateString().split('/').join('-');
    let _view = await Views.findOne({viewerIp: ip, date: date}) // log views only after 24 hours
    if(!_view){
        await Views.create({
            viewerIp: ip, 
            date: date, 
            week: new Date().getWeek(), 
            month: new Date().getMonth(), 
            year: new Date().getFullYear()
        });
        return next();
    } else return next();
};