const ApiError = require("../exceptions/api-error");
const tokenServise = require("../servises/token-servise");

module.exports = function(req, res, next) {
    try{
        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader){
            return next(ApiError.UnauthhorizedError())
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if(!accessToken){
            return next(ApiError.UnauthhorizedError());
        }
        const userData = tokenServise.validateAccessToken(accessToken);
        if(!userData){
            return next(ApiError.UnauthhorizedError());
        }

        req.user = userData;
        next()
    }catch(e){
        return next(ApiError.UnauthhorizedError())
    }
}