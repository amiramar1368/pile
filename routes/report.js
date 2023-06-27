import {Router} from 'express';

import {Report} from '../controller/report-controller.js';

const router = new Router();

router.post("/pile",Report.pile);
router.post("/services",Report.services);
router.post("/sub-rows",Report.sub_rows);
router.post("/saha",Report.saha_cr);
export default router;