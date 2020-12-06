const express = require('express');
const User = require('../models/user');
const router = new express.Router();

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.get('/login', async (req, res, next) => {
    const { username, password } = req.body;
    const idk = await User.authenticate(username, password)
    if (idk) {
        await User.updateLoginTimestamp(username)
    }
    return res.json(idk)

})

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post('/register', async (req, res, next) => {

    try {
        const { username, password, first_name, last_name, phone } = req.body;
        let user = await User.register(username, password, first_name, last_name, phone)
        return res.json(user)
    } catch (error) {
        return next(error)
    }
})

router.get('/all', async (req, res, next) => {
    const all = await User.all()
    return res.json(all)
})
router.get('/get', async (req, res, next) => {
    const { username } = req.body
    const user = await User.get(username)
    return res.json(user)
})
module.exports = router;