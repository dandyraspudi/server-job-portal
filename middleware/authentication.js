const {
    User
} = require('../models/');
const {
    verifyToken
} = require('../helper/jwt');

const authentication = async (req, res, next) => {

    const token = req.headers.access_token;
    console.log(token);
    try {
        if (!token) {
            throw {
                name: "NotAuthorized"
            }
        }
        const payload = verifyToken(token);
        const foundUser = await User.findOne({
            where: {
                id: payload.id,
                email: payload.email,
            }
        })

        if (!foundUser) {
            throw new Error("UserNotFound")
        }

        req.user = {
            id: foundUser.id,
            email: foundUser.email,
            role: foundUser.role
        }

        next()
    } catch (err) {
        if (err.message === "UserNotFound") {
            next({
                name: "NotFound",
                message: "Invalid JWT token"
            })
        } else {
            next(err)
        }
    }

}

module.exports = authentication