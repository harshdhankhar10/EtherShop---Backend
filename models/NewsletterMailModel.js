import mongoose from 'mongoose';


const NewsletterMailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    
}, {timestamps: true});

const NewsletterMail = mongoose.model('NewsletterMail', NewsletterMailSchema);


export default NewsletterMail;