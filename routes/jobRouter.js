const router = require('express').Router();
const jobController = require('../controllers/jobsController');
const authorization = require('../middleware/authorization');
const imageMulter = require('../middleware/multer')
const imageKit = require('../middleware/imageKit');
const statusAuthorization = require('../middleware/statusAuthorization');

router.get('/company', jobController.getCompanies);
router.get('/', jobController.getJobs);
router.post('/', imageMulter, imageKit, jobController.postJobs);
router.get('/:id', jobController.getIdJobs);
router.put('/:id', authorization, imageMulter, imageKit, jobController.putIdJobs);
router.delete('/:id', authorization, jobController.putIdDeleteJobs);
router.patch('/:id', statusAuthorization, jobController.patchStatus);

module.exports = router