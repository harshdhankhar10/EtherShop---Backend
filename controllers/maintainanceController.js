import MaintainanceMode from "../models/maintainanceModel.js"



export const getMaintainanceStatus = async (req,res) =>{
    try {
        const status = await MaintainanceMode.find({})
        res.status(200).json({success:true,status})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({success :false,message: "Internal Server Error"})
    }

}

export const setMaintainanceStatus = async (req,res) =>{
    try {
      const {status} = req.body;
      if(!["Active","Inactive"].includes(status)){
          return res.status(400).json({success:false,message: "Invalid Status"})
      }
      const maintainance = await MaintainanceMode.findOne({})
      if(maintainance){
          maintainance.status = status
          await maintainance.save()
        }else{
            await MaintainanceMode.create({status})
        }
        res.status(200).json({success:true,message: "Maintainance Mode Updated Successfully"})



    } catch (error) {
        console.log(error)
        res.status(500).json({success :false,message: "Internal Server Error"})
    }

}
