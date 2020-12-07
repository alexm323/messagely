const express = require('express');
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('../config');
const router = new express.Router();

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.get('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const correctLogin = await User.authenticate(username, password)
        if (correctLogin) {
            await User.updateLoginTimestamp(username)
            const token = jwt.sign({ username }, SECRET_KEY)
            return res.json({ _token: token })
        }
    } catch (error) {
        return next(error)
    }



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
        if (user) {
            await User.updateLoginTimestamp(username)
            const token = jwt.sign(username, SECRET_KEY)
            return res.json({ _token: token })
        }
    } catch (error) {
        return next(error)
    }
})



module.exports = router;