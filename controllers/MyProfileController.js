import MyProfile from "../models/MyProfileModel.js";

// Fetching the profile for the logged-in user

// creating MyProfile
export const createProfile = async (req, res) => {
    try {
        const user = req.user._id;
        const { address, phoneNo, gender, dateOfBirth } = req.body;

        const myProfile = await MyProfile.create({ user, address, phoneNo, gender, dateOfBirth });
        res.status(200).json({ status: true, message: "Profile Created Successfully", myProfile });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
}


export const getMyProfile = async (req, res) => {
    try {
        const user = req.user._id;
        const myProfile = await MyProfile.findOne({ user });
        if (!myProfile) {
            return res.status(404).json({ status: false, message: "Profile Not Found" });
        }
        res.status(200).json({ status: true, message: "Profile Fetched Successfully", myProfile });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
};

// Updating the profile for the logged-in user
export const updateMyProfile = async (req, res) => {
    try {
        const user = req.user._id;
        const { address, phoneNo, gender, dateOfBirth } = req.body;

        const myProfile = await MyProfile.findOneAndUpdate(
            { user },
            { address, phoneNo, gender, dateOfBirth },
            { new: true, runValidators: true }
        );

        if (!myProfile) {
            return res.status(404).json({ status: false, message: "Profile Not Found" });
        }

        res.status(200).json({ status: true, message: "Profile Updated Successfully", myProfile });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
};






