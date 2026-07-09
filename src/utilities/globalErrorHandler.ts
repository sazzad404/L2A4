import { ErrorRequestHandler } from "express";
import httpStatus from "http-status"


const globalErrorHandler: ErrorRequestHandler= (err, req, res, next) => {

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal Server Error",
        error: err.message,
    });
}

export default globalErrorHandler;