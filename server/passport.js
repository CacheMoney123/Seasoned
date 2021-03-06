const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user.model');
const JwtStrat = require('passport-jwt').Strategy;

const cookieExtract = req => {
    let token = null;
    if(req && req.cookies) {
        token = req.cookies["access_token"];
    }
    return token;
}

passport.use(new JwtStrat({
    jwtFromRequest : cookieExtract,
    secretOrKey : "CacheMoney$$"
}, (payload, done) => {
    User.findById({_id : payload.sub }, (err, user)=>{
        if(err)
            return done(err, false);
        if(user)
            return done(null, user);
        });
}) );

passport.use(new LocalStrategy((username, password, done)=> {
    User.findOne({username}, (err, user)=> {
        if(err)
            return done(err);
        if(!user)
            return done(null, false);
        user.comparePassword(password, done);
    });
}));