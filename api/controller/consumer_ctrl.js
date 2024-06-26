const {Consumer} = require('../models/consumer');
const db = require('../dboperations');
const controller = require('../controller/generic_controller');


const CreateUser = controller.create(db.consumer_create);

const Register_Verify = controller.patch(db.consumer_registration_verify_section);

const Update_Verify = controller.patch(db.verify_email_mobile)

const GetEthinicity = controller.get(db.get_ethinicity);

const GetBloodgroup = controller.get(db.get_Bloodgroup)

const UpdateUser = controller.patch(db.consumer_update);

const ForgotPswrd = controller.patch(db.forget);

const ForgotPswrdCheck = controller.patch(db.forget_check);

const GetUser = controller.get(db.get_consumer);

const CreateReminder = controller.p_create(db.reminder_create);

const GetAllUser = async(req,res) => {
    const users = await Consumer.find().select("-_id -password -__v ");
    res.status(200).json({'error' : false, 'data': users});
}




module.exports = {CreateUser, GetAllUser, Register_Verify, GetEthinicity, GetBloodgroup, UpdateUser, Update_Verify, GetUser, ForgotPswrd, ForgotPswrdCheck, CreateReminder}