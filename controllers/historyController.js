const {
    History
} = require('../models/');

class historyController {

    static async getHistory(req, res, next) {
        try {
            const findHistory = await History.findAll({
                order: [
                    ["createdAt", "DESC"]
                ]
            });
            res.status(200).json(findHistory);
        } catch (err) {
            next(err)
        }
    }

}

module.exports = historyController