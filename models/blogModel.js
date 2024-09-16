import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    title: { type: String, required: true },
    imageURL: { type: String, required: true },
    subtitle: { type: String, required: true },
    category: { type: String, required: true },
    minutesRead: { type: Number, required: true },
    content: { type: String, required: true },
    authorName: { type: String, required: true },
    isFeatured: { type: Boolean, required: true, default: false },
    tags : {type : [String], required: true},

    // Meta Tags
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    metaKeywords: { type: String, required: true },
    slug: { type: String, required: true },


},{timestamps: true});


const Blog = mongoose.model('Blog', blogSchema);

export default Blog;