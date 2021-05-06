const express = require('express');

const router = express.Router();

const homeController =require('../controllers/home_controllers');

console.log('router loaded');

//For home page
router.get('/' ,homeController.home );

//For /users route ( use ) it reuqires the users.js 
router.use('/users' , require('./users'));

//For /posts route ( use ) it reuqires the posts.js 
router.use('/posts' , require('./posts'));

router.use('/comments', require('./comments'));

router.use('/api' , require('./api')); 

router.use('/likes' , require('./likes'));

//for any further routes , access from here
// router.use('/routerName' , require('./routerFile'));


module.exports = router;