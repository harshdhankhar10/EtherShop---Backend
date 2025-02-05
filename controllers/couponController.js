import Coupon from "../models/couponModel.js";

export const createCoupon = async (req, res) => {
    try {
        const { name, expiry, discount } = req.body;
            const coupon = await Coupon.create({ name, expiry, discount });
            res.status(201).json({success : true, message : "Coupon Created Successfully", coupon});
        } catch (error) {
            res.status(500).json({success : false, message : "Internal Server Error", error : error.message });
        }
    }

    export const getCoupons = async (req, res) => {
        try {
            const coupons = await Coupon.find();
            res.status(200).json({success : true, message : "Coupons Fetched Successfully", coupons});
        } catch (error) {
        res.status(500).json({success : false, message : "Internal Server Error", error : error.message });
    }
}

export const updateCoupon = async (req, res) => {
    try {
        const { name, expiry, discount } = req.body;
        const coupon = await Coupon.findById(req.params.id);
        if(coupon) {
            coupon.name = name;
            coupon.expiry = expiry;
            coupon.discount = discount;
            await coupon.save();
            res.status(200).json({success : true, message : "Coupon Updated Successfully", coupon});
        } else {
            res.status(404).json({success : false, message : "Coupon Not Found"});
        }
    } catch (error) {
        res.status(500).json({success : false, message : "Internal Server Error", error : error.message });
    }
}

export const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if(coupon) {
            res.status(200).json({success : true, message : "Coupon Deleted Successfully"});
            
        } else {
            res.status(404).json({success : false, message : "Coupon Not Found"});
        }
    } catch (error) {
        res.status(500).json({success : false, message : "Internal Server Error", error : error.message });
    }
}


export const gettingCouponStatus = async (req, res) => {
    try {
        const { coupon } = req.body;
        const validCoupon = await Coupon.findOne({ name : coupon });
        if(validCoupon) {
            res.status(200).json({success : true, message : "Coupon Applied Successfully", coupon : validCoupon});
        } else {
            res.status(400).json({success : false, message : "Invalid Coupon Code"});
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({success : false, message : "Internal Server Error", error : error.message });
    }
}
