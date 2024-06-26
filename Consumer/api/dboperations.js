const {Consumer,Reminder} = require('./models/consumer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const utils = require('./utils');
const CustomError = require('./middleware/customerror');
const logger = require('./logger');
const moment = require('moment');
const { date } = require('joi');
const otplib = require('otplib');
require('dotenv').config();
let lastgeneratedtime;



async function generate_cofferid()
{
    const cid = crypto.randomBytes(8).toString('hex')
    const con = await Consumer.findOne({coffer_id : cid})
    if (con)   
        return await generate_cofferid() 
    return cid
}

async function consumer_find(query)
{
    if (Object.keys(query) == 'email')
        {
            query.email = query.email.toLowerCase()
        }
    return await Consumer.findOne(query)

}

async function createuser(data)
{
    const country_data = {
        'index': 'citizen_primary',
        'country': data['country'],
        'affiliation_type': 'citz'
    };
        
    data['coffer_id'] = await generate_cofferid();
    data['password'] = await bcrypt.hash(data['password'],10);
    data["joined"] = Date.now();
    delete data['confirm_password'];

    const user = new Consumer(data);
    user.citizen = [country_data];

    return user

}

async function notify_email(user,email)
{

    await check({email:email})
    
    user.email = email.toLowerCase();
    user.email_verified = false
    email_verification_token = crypto.randomBytes(8).toString('hex');
    console.log("\n ---------- vitagist email verfication ----------\nName: ", user.consumer_fullname(),`\ntoken: ${email_verification_token}\n`);
    user.email_verification_token = email_verification_token;

    return user;

}

async function notify_mobile(user,mobile)
{

    await check({mobile:mobile})

    user.mobile = mobile;
    user.mobile_verified = false
    mobile_verification_token = crypto.randomBytes(8).toString('hex').toUpperCase();
    console.log(`\n ---------- VitaGist  Mobile Verification ----------\n            Number: ${utils.get_country_phone_code(user.country)} `,user.mobile ,"\n            msg: ",`Use token ${mobile_verification_token} to verify your mobile and get started with DigiCoffer Personal\n`)
    user.mobile_verification_token = mobile_verification_token; 

    return user;
}

async function email_mobile_verification(con, verify_type, token)
{
   
    if (token == con[`${verify_type}_verification_token`])
        {
            con[`${verify_type}_verified`] = true
            con[`${verify_type}_verification_token`] = null

            await con.save()

            return {'error': false, 'msg': `${verify_type} verification successful.`, 'status': 200};
        }
    throw new CustomError('please enter a valid token', 400)
    
}


async function  consumer_create(data)
{
    const user = await createuser(data)

    if ('email' in data)
        await notify_email(user,data["email"])

    else if ('mobile' in data)
        await notify_mobile(user,data["mobile"])
    
    await user.save()

    logger.info("Consumer created successfully\n")
    return {'error': false, 'msg': 'Consumer created successfully.', 'data': user, 'status': 201};
    
}

async function consumer_registration_verify_section(params,data)
{
    console.log(params,data)
    const {verify_type,token_type} = params;

    if (verify_type == 'email')
        con = await consumer_find({email: data['email']});

    else if (verify_type == 'mobile')
        con = await consumer_find({mobile: data['mobile']}); 

    if (con)
        {
            if (token_type == 'resend')
                {
                    if (verify_type == 'email')
                        console.log(" ------------- VitaGist Personal Email Verification ------------\nName: ", con.consumer_fullname() ,"\ntoken: ",con.email_verification_token);
                    
                    else if (verify_type == 'mobile')
                        console.log(" ------------- VitaGist Personal Mobile Verification ------------\nNumber: ",`${utils.get_country_phone_code(con.country)} ${con.mobile}`,"\nmsg: ",`Use token ${con.mobile_verification_token} to verify your mobile and get started with DigiCoffer Personal`)

                    return {'error': false, 'msg': 'Resend successful.', 'token': con[`${verify_type}_verification_token`], 'status': 200};
                }
            else if (token_type == 'verify')
                {
                    token = data['token']
                    return  await email_mobile_verification(con,verify_type,token)
                }
        }
    throw new CustomError('Account not found',404)
        
}

function get_ethinicity() {  return utils.ETHINICTY  }

function get_Bloodgroup() {  return utils.BLOOD_GROUPS }

async function update_password(con,o_password,n_password)
{
    const password = await bcrypt.compare(o_password,con.password);

    if(!password)
        throw new CustomError("Invalid old password", 400)

    return await bcrypt.hash(n_password,10)
}

async function check(data)
{
    const type = Number(Object.values(data)[0])
    const user = await consumer_find(data)
    if (user)
        throw new CustomError(
            isNaN(type)
                ? 'Email ID is already registered with DigiCoffer Personal.'
                : 'Mobile number is already registered with DigiCoffer Personal.',
                409
        );              
}

async function consumer_update(params = null,data)
{
    const cofferid = data["cofferid"];
    console.log("--------",cofferid,data)
    const fields = ["first_name","last_name","middle_name"];

    let con = await consumer_find({coffer_id: cofferid});

    if (con)
        {
            fields.forEach((field) => {
                if (field in data && data[field] != con[field])
                    con[field] = data[field];
            })

            if ( "dob" in data && data["dob"] != con.dob)
                    con.dob = moment(data["dob"], "DD-MM-YYYY").format("YYYY-MM-DD");

            if ( "old_password" in data)
                con.password = await update_password(con,data['old_password'],data['new_password']);

            if("mobile" in data && data["mobile"] != con.mobile)
                    await notify_mobile(con,data["mobile"])
                

            if ( "email" in data && data["email"] != con.email )
                await notify_email(con,data["email"])
            
            con.save();
            return {'error': false, 'msg': "profile details updated successfully",  'status': 200 } //'data': con,
        }
    throw new CustomError('Account not found',404) 
}

async function verify_email_mobile(params,data) 
{
    console.log(params,data)
    const cofferid = data["cofferid"];
    const{verify_type} = params;

    const con = await consumer_find({coffer_id:cofferid})
    if (con)
        return await email_mobile_verification(con, verify_type, data["token"])

    throw new CustomError('Account not found',404)
}

async function get_consumer(data)
{
    const cofferid  = data;

    const con = await consumer_find({coffer_id:cofferid})
    if (con)
        return {'error': false, 'data': con.GetConsumerData() , 'status': 200 }

    throw new CustomError('Account not found',404)
}

function OTP()
{
    const otp = otplib.authenticator.generate(process.env.SECRETKEY)
    lastgeneratedtime = new Date();
    return otp;
    
}

function check_otp(data)
{
    //console.log(new Date() - lastgeneratedtime, (new Date() - lastgeneratedtime) >= 60000 )
    console.log(data,lastgeneratedtime)
    if ((new Date() - lastgeneratedtime) >= 300000)
            throw new CustomError("OTP is expired", 400)
        
    else
        {
            const otp = otplib.authenticator.check(data, process.env.SECRETKEY);
            if (otp)
                return true;

            throw new CustomError("Invalid OTP", 400)
        }
}

async function forget(params,data)
{
    const con  = await consumer_find({ [`${Object.keys(data)}`] : `${Object.values(data)}`});
    if(con)
        {
            if (params.verify_type == "email" )
                console.log(" ------------ VitaGist Personal Password Reset ------------ \n\t\tName: ", con.consumer_fullname() ,"\n\t\tOTP: ",OTP());
            else
                console.log(" ------------ VitaGist Personal Password Reset ------------ \n\t\tNumber: ",`${utils.get_country_phone_code(con.country)} ${con.mobile}`,"\n\t\tmsg: ","Use OTP" ,OTP(), "to verify your mobile and get started with DigiCoffer Personal");
            
            return {'error': false, 'msg': `An OTP to reset your password is sent to your ${params.verify_type}. It is valid for 5 mins`, "coffer_id": con.coffer_id, 'status':200}
        }
    throw new CustomError('Account not found',404)

}

async function forget_check(params,data)
{
    const {verify_type, token_type} = params;
    const con  = await consumer_find({ coffer_id : data['coffer_id']});

    if(con)
        {
            if(token_type == "resend")
                {
                    if(verify_type == 'email')
                        console.log("VitaGist Personal Password Reset.  \nName:", con.consumer_fullname() ,"\nOTP: ",OTP());
                    else
                        console.log("VitaGist Personal Password Reset.  \nNumber:",`${utils.get_country_phone_code(con.country)} ${con.mobile}`,"\nmsg: ","Use OTP" ,OTP(), "to verify your mobile and get started with DigiCoffer Personal");

                    return {'error': false, 'msg': `An  OTP to reset your password is sent to your ${params.verify_type}. It expires soon.`, "coffer_id": con.coffer_id, 'status':200};

                }
            else
                {
                    if (check_otp(data["otp"]))
                        {
                            con.password = await bcrypt.hash(data["password"],10);
                            con.save();
                            return {'error': false, 'msg': "Password reset successful. Please login to access your Coffer.", 'status':200};
                        }
                }
        }
    throw new CustomError('Account not found',404);
}


async function reminder(data)
{
    
    const cofferid = data["cofferid"];
    
    const con  = await consumer_find({ coffer_id : cofferid});
    const Month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    function date_converter(date)
    {   
        const d = new Date(date)
        return Month[d.getMonth()]+" "+d.getDate()+","+d.getFullYear(); 
    }

    if(con)
        {
            if (data["action"] == "create")
                {
                    data["consumer"] = cofferid;
                    data["created"] = Date.now();
                    data['target'] = moment(data["target"], "DD-MM-YYYY").format("YYYY-MM-DD");
                    await Reminder.create(data);
                    return { "error": false, "msg": "Reminder created successfully" , "status":200}
                }
            if (data["action"] == "get")
                {
                    const rem = await Reminder.find({consumer: cofferid});
                    const reminder =  rem.map(data => ( {_id: data._id, message: data.message, created : date_converter(data['created']), target : date_converter(data['target']) }));   
                    return { "error": false, "data": { reminder }, "status" : 200}
                }
            if (data["action"] == "delete")
                {
                    await Reminder.deleteOne({_id: data['remid'] })
                    return { "error": false, "msg": "Reminder deleted successfully" , "status":200}
                }
        }
    throw new CustomError('Account not found',404);
}



                 
module.exports = {consumer_create, consumer_registration_verify_section, get_Bloodgroup, get_ethinicity, consumer_update, verify_email_mobile, get_consumer, forget, forget_check, reminder}

