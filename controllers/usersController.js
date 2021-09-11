const {
    User
} = require('../models/')
const {
    decode
} = require('../helper/bcryptjs')
const {
    sign
} = require('../helper/jwt')
const {
    OAuth2Client
} = require('google-auth-library')

class UserController {

    static async userList(req, res, next) {
        try {
            const result = await User.findAll()
            res.status(200).json(result)
        } catch (err) {
            next(err)
        }
    }

    static async findById(req, res, next) {
        const {
            id
        } = req.params;
        try {
            const result = await Job.findByPk(id, {
                where: {
                    id
                }
            })
            if (result) {
                res.status(200).json(result)
            } else {
                next({
                    name: "NotFound",
                    message: `Job id ${id} not found`
                })
            }
        } catch (err) {
            next(err)
        }
    }

    static async deleteById(req, res, next) {
        const {
            id
        } = req.params;
        try {
            const result = await Job.findByPk(id)
            if (result) {
                await Job.destroy({
                    where: {
                        id
                    }
                })
                res.status(200).json({
                    message: `User ${id} success to delete`
                })
            } else {
                next({
                    name: "NotFound",
                    message: `Job id ${id} not found`
                })
            }
        } catch (err) {
            next(err)
        }
    }

    static async postRegister(req, res, next) {
        const {
            name,
            email,
            password,
        } = req.body;

        try {
            const createUser = await User.create({
                name,
                email,
                password,
                role: 'admin'
            });

            const data = {
                id: createUser.id,
                email: createUser.email
            }

            const token = sign(data)
            res.status(201).json({
                token
            });
        } catch (err) {
            next(err);
        }
    }

    static async postLogin(req, res, next) {
        try {
            const {
                email,
                password
            } = req.body;

            const findUser = await User.findOne({
                where: {
                    email
                }
            });

            if (findUser) {
                const isValid = decode(password, findUser.password)
                if (isValid) {
                    const token = sign({
                        id: findUser.id,
                        email: findUser.email,
                        role: findUser.role,
                        name: findUser.name
                    });
                    res.status(201).json({
                        token
                    });
                } else {
                    next({
                        name: 'InvalidEmailPass'
                    })
                }
            } else {
                next({
                    name: 'InvalidEmailPass'
                })
            }
        } catch (err) {
            next(err);
        }
    }

    static async postAuthGoogle(req, res, next) {
        const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
        const client = new OAuth2Client(CLIENT_ID);

        const idToken = req.body.idTokenClient
        // console.log(idToken, " <====id token server");

        try {
            const ticket = await client.verifyIdToken({
                idToken,
                audience: CLIENT_ID
            })

            // console.log(ticket, " <==== ticket");

            const payload = ticket.getPayload()

            // console.log(payload, " <==== payload");

            const {
                email,
                name
            } = payload

            const [user] = await User.findOrCreate({
                where: {
                    email
                },
                defaults: {
                    password: name,
                    role: 'staff'
                }
            })

            const access_token = sign({
                id: user.id,
                email: user.email,
                role: user.role
            })

            res.status(201).json({
                access_token: access_token
            })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = UserController