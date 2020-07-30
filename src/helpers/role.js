export default function permit(...allowed) {
    const isAllowed = roleId => allowed.indexOf(roleId) > -1;
    return (req, res, next) => {
        if (req.user && isAllowed(req.user.roleId))
            next();
        else {
            res.render('404');
        }
    }
};