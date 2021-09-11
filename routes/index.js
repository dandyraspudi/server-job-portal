const jobRoute = require('./jobRouter')
const userRoute = require('./userRouter');
const historyRoute = require('./historyRouter');
const router = require('express').Router();
const authentication = require('../middleware/authentication');
const errorHandler = require('../middleware/handleError');

router.use(userRoute);
router.use(authentication);
router.use('/jobs', jobRoute);
router.use('/history', historyRoute);
router.use(errorHandler);

module.exports = router;