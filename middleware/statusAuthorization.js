const {
    Job
} = require('../models')

const statusAuthorization = async (req, res, next) => {
    const {
        id,
        role
    } = req.user
    const jobId = req.params.id

    try {
        await Job.findByPk(jobId)
        if (role === 'admin') {
            next()
        } else {
            throw ({
                name: 'Forbiden'
            })
        }
    } catch (error) {
        next(error)
    }

}

module.exports = statusAuthorization