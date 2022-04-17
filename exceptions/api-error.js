module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, massage, errors = []){
        super(massage);
        this.status = status;
        this.errors = errors;
    }


    static UnauthhorizedError(){
        return new ApiError(401, "Avtorizatsiyadan o'tmagan foydalanuvchi!")
    }


    static BadRequest(massage, errors = []){
        return new ApiError(400, massage, errors)
    }
}