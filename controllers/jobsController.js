const {
    Job,
    Company,
    User,
    History
} = require('../models/');

class JobsController {

    static async getCompanies(req, res, next) {
        try {
            const findCompanies = await Company.findAll();
            res.status(200).json(findCompanies);
        } catch (err) {
            next(err)
        }
    }

    static async getJobs(req, res, next) {
        try {
            const findJobs = await Job.findAll({
                include: [Company, User]
            });
            res.status(200).json(findJobs);
        } catch (err) {
            next(err)
        }
    }

    static async postJobs(req, res, next) {
        const {
            title,
            description,
            jobType,
            companyId
        } = req.body;

        const updatedBy = req.user.id

        try {
            const result = await Job.create({
                title,
                description,
                imgUrl: req.body.imgUrl,
                jobType,
                authorId: req.user.id,
                companyId
            });

            await History.create({
                entityId: result.id,
                title: result.title,
                description: `New job with id ${result.id} created`,
                updatedBy
            })

            if (result) {
                res.status(201).json(result);
            } else {
                next({
                    name: "SequelizeValidationError"
                })
            }
        } catch (err) {
            next(err)
        }
    }

    static async getIdJobs(req, res, next) {
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

    static async putIdJobs(req, res, next) {
        const {
            title,
            description,
            imgUrl,
            jobType,
            authorId,
            companyId
        } = req.body;

        const {
            id
        } = req.params;

        const updatedBy = req.user.id

        try {
            const job = await Job.findByPk(id);
            if (job) {
                const dataUpdate = await Job.update({
                    title,
                    description,
                    imgUrl,
                    jobType,
                    authorId,
                    companyId
                }, {
                    where: {
                        id
                    },
                    returning: true
                })

                const data = dataUpdate[1][0]

                await History.create({
                    entityId: data.id,
                    title: data.title,
                    description: `Job with id ${data.id} updated`,
                    updatedBy
                })
                res.status(200).json(data)
            } else {
                next({
                    name: 'NotFound',
                    message: `Jobs id ${id} not found`
                })
            }
        } catch (err) {
            if (err.name === 'SequelizeValidationError') {
                let error = err.errors.map(item => item.message)
                next({
                    message: error,
                    name: "SequelizeValidationError"
                })
            } else {
                next(err)
            }
        }
    }

    static async putIdDeleteJobs(req, res, next) {
        const {
            id
        } = req.params;

        const updatedBy = req.user.id

        try {
            const result = await Job.findByPk(id)
            if (result) {

                await History.create({
                    entityId: result.id,
                    title: result.title,
                    description: `Job with id ${result.id} permanently deleted`,
                    updatedBy
                })

                await Job.destroy({
                    where: {
                        id
                    }
                })
                res.status(200).json({
                    message: `Job id ${id} success to delete`
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

    static async patchStatus(req, res, next) {
        const id = req.params.id
        const payload = {
            status: req.body.status
        }

        console.log(payload);

        const updatedBy = req.user.id
        try {
            const foundJob = await Job.findByPk(id)
            if (foundJob) {
                const result = await Job.update(payload, {
                    where: {
                        id
                    },
                    returning: true
                })

                console.log(result);
                console.log(id);

                const data = result[1][0]

                console.log(data);

                await History.create({
                    entityId: data.id,
                    title: data.title,
                    description: `Job ${data.title} with id ${data.id} status has been updated from ${foundJob.status} into ${data.status}`,
                    updatedBy
                })
                res.status(200).json(data)
            } else {
                throw ({
                    name: 'ID not found'
                })
            }

        } catch (err) {
            next(err)
        }
    }

}

module.exports = JobsController;