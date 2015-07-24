var express       = require('express');
var cookieParser  = require('cookie-parser');
var Bluebird      = require('bluebird');
var router        = express.Router();
var config        = require('./config');
var instaApi      = require('instagram-node').instagram();

Bluebird.promisifyAll(instaApi);

router.get('/authorize-user', function (req, res){
    instaApi.use(
        {
        client_id: config.instagram_client_id,
        client_secret: config.instagram_client_secret
    });
    res.redirect(instaApi.get_authorization_url(config.instagram_redirect_uri));
});

router.get('/handleauth', function (req, res){
    instaApi.authorize_userAsync(req.query.code, config.instagram_redirect_uri)
        .then(function (result){
            res.cookie('instaToken', result.access_token, { maxAge: 900000, httpOnly: true});
            res.redirect('/');
        })
        .catch(function (reason){
            console.error(reason);
        });
});

router.get('/', function (req, res){
    if(req.cookies && req.cookies.instaToken ){
        instaApi.use({ access_token: req.cookies.instaToken});
        return instaApi.user_self_media_recentAsync(50)
            .spread(function (medias, pagination, remaining, limit){
                return instaApi.mediaAsync(medias[Math.floor(Math.random() * medias.length - 1) + 1].id);
            })
            .then(function (image){
                res.render('index', {
                    image: image[0].images.standard_resolution.url
                });
            })
            .catch(function (reason){
                console.error(reason);
            });
    }
    else{
        res.render('index', {
            showLogin: true
        });
    }

});

module.exports = router;
