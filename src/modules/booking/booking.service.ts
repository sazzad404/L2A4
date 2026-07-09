import { prisma } from "../../lib/prisma"
import { IBooking } from "./booking.interface"


const createBookingIntoDB = async(userId: string, payload: IBooking)=>{
   const  {serviceId, bookingDate, slotTime} = payload

    const service = await prisma.service.findUniqueOrThrow({
        where:{
            id:serviceId
        }
    })

    const result = await prisma.booking.create({
        data:{
            customerId: userId,
            technicianId: service.technicianId,
            serviceId: service.id,
            bookingDate,
            slotTime
        }
    })


    return result



}


const getBookingsFromDB = async(userId: string)=>{

    const result = await prisma.booking.findMany({
        
    })
}

export const bookingService ={
    createBookingIntoDB
}