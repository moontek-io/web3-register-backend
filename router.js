const { Router } = require('express');
const { errorHandler, notFound } = require('./middleware');
const { auth, discord, profile, public  } = require('./routes');

const router = Router();
module.exports = router;

// use the router instances defined
router.use('/ping', (req, res) => res.status(200).send({ message: "success"}));

router.use(auth);
router.use(discord);
router.use(profile);
router.use(public);


// matches any other HTTP method and route not matched before
router.all('*', notFound);

// finally, an error handler
router.use(errorHandler);
