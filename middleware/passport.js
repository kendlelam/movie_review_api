require('dotenv').config();
const User = require('../models/user')
const passport = require('passport');
const {Strategy, ExtractJwt} = require('passport-jwt');
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_KEY;


passport.use(new Strategy(opts, async function(jwt_payload, done) {
    try{
        const user = await User.findOne({_id: jwt_payload.sub});
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err,false);
    }
    
   
}));

module.exports = passport;