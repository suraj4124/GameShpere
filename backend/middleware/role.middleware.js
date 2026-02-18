const ErrorResponse = require('../utils/errorResponse');

// Grant access to specific roles (This logic is already in auth.middleware.js `authorize` export,
// but creating separate file as requested by structure)

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `User role ${req.user.role} is not authorized to access this route`,
                    403
                )
            );
        }
        next();
    };
};
