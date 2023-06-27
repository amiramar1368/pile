import {Router} from 'express';

import {HomePage} from '../controller/homePageController.js';

const router = new Router();

router.get("/",HomePage.mainPage);


export default router;