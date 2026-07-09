import { prisma } from "../../lib/prisma"


const getAllCategoryFromDB = async()=>{
const result = await prisma.category.findMany({
    include:{
        services: true
    }
})
return result
}


export const categoryService = {
    getAllCategoryFromDB
}