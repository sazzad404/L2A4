import { prisma } from "../../lib/prisma"


const getPremiumConetent = async()=>{

    const post = await prisma.service.findMany({
        where: {
            isPremium: true
        }
    })
    return post

}


export const premiumService = {
    getPremiumConetent        
}