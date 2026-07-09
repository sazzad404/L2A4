import { Request, Response } from "express";
import catchAsync from "../../utilities/catchAsync";
import { categoryService } from "./category.service";
import sendResponse from "../../utilities/sendResponse";
import httpSuccess from "http-status"


const getAllCategory = catchAsync(async(req: Request, res: Response)=>{

    const result = await categoryService.getAllCategoryFromDB()

    sendResponse(res,{
        success: true,
        statusCode: httpSuccess.OK,
        message: "Categories Retrived SuccessFully",
        data: result
    })

})


export const categoryController = {
    getAllCategory
}