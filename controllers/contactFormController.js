import ContactForm from "../models/contactFormModel.js";

export const createContactForm = async (req, res) => {
    try {
        const {userId,  name, email, orderNumber, subject, message} = req.body   
        if( !userId || !name || !email || !orderNumber || !subject || !message) {
            return res.status(400).json({success : false, message: "All fields are required"})
        }

        const contactForm = await ContactForm.create({userId,  name, email, orderNumber, subject, message})

        contactForm.save()

        res.status(201).json({success : true, message: "Contact form created successfully"})
    } catch (error) {
        res.status(500).json({success : false, message: error.message})
    }
}


export const getContactForm = async (req, res) => {
    try {
        const contactForm = await ContactForm.find()
        res.status(200).json({success : true, message: "Contact form fetched successfully", contactForm})
    }catch (error) {
        res.status(500).json({success : false, message: error.message})
    }
}