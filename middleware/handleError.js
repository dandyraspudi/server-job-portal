const handleError = (err, req, res, next) => {
    let code = 500;
    let message = ["internal server error"];

    console.log(err);

    switch (err.name) {
        case "SequelizeValidationError":
        case "imageError":
            code = 400;
            message = [`${err.message ? err.message : err.name}`];
            break;
        case "NotFound":
            code = 404;
            message = [err.message];
            break;
        case "NotAuthorized":
            code = 401;
            message = ["Please login first"];
            break;
        case "Forbiden":
            code = 403;
            message = [err.name];
            break;
        case "InvalidEmailPass":
            code = 401;
            message = ["Wrong Email and Password"];
            break;
        default:
            break;
    }

    res.status(code).json({
        message
    });
}

module.exports = handleError