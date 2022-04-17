const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-servise')
const tokenService = require('./token-servise')
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');



class UserService{

    async registration(email, password){
        const candidate = await UserModel.findOne({email});
        if(candidate){
            throw ApiError.BadRequest(`Bu ${email} addressida foydalanuvchi mavjud`)
        }
        const activationLink = uuid.v4()
        const hashPassword = await bcrypt.hash(password, 3)
        const user = await UserModel.create({email, password: hashPassword, activationLink});
        
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);


        const userDto = new UserDto(user);
        const tokens = await tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink});
        if(!user){
            throw ApiError.BadRequest('Noto\'ri link');
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({email});
        if(!user){
            throw ApiError.BadRequest('Bu emailda foydalanuvchi topilmadi.')
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals){
            throw ApiError.BadRequest('Parol xato!')
        }
        const userDto = new UserDto(user);
        const tokens = await tokenService.generateTokens({...userDto})
        
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken);
        return token
    }


    async refresh(refreeshToken){
        if(!refreeshToken){
            throw ApiError.UnauthhorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreeshToken);
        const tokenFromDb = await tokenService.findToken(refreeshToken);

        if(!userData || !tokenFromDb){
            throw ApiError.UnauthhorizedError()
        }
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user);
        const tokens = await tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async getAllUsers(){
        const users = await UserModel.find()
        return users
    }
}

module.exports = new UserService();