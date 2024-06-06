const {Consumer} = require('./models/consumer')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const utils = require('./utils')
const {CustomError} = require('./middleware/customerror')
const {logger} = require('./logger')
const moment = require('moment')





async function generate_cofferid()
{
    const cid = crypto.randomBytes(8).toString('hex')
    const con = await Consumer.findOne({coffer_id : cid})
    if (con)   
        return generate_cofferid() 
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
    console.log("vitagist email verfication\nName: ", user.consumer_fullname(),`\ntoken:${email_verification_token}`);
    user.email_verification_token = email_verification_token;

    return user;

}

async function notify_mobile(user,mobile)
{

    await check({mobile:mobile})

    user.mobile = mobile;
    user.mobile_verified = false
    mobile_verification_token = crypto.randomBytes(8).toString('hex').toUpperCase();
    console.log(`VitaGist  Mobile Verification.\nNumber: ${utils.get_country_phone_code(user.country)} `,user.mobile ,"\nmsg: ",`Use token ${mobile_verification_token} to verify your mobile and get started with DigiCoffer Personal`)
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

    return {'error': false, 'msg': 'Consumer created successfully.', 'data': user, 'status': 201};
    
}

async function consumer_registration_verify_section(params,data)
{
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
                        console.info("VitaGist Personal Email Verification.\nName:", con.consumer_fullname() ,"\ntoken: ",con.email_verification_token);
                    
                    else if (verify_type == 'mobile')
                        console.log("VitaGist Personal Mobile Verification.\nNumber:",`${utils.get_country_phone_code(con.country)} ${con.mobile}`,"\nmsg: ",`Use token ${con.mobile_verification_token} to verify your mobile and get started with DigiCoffer Personal`)

                    return {'error': false, 'msg': 'Resend successful.', 'token': con[`${verify_type}_verification_token`], 'status': 200};
                }
            else if (token_type == 'verify')
                {
                    token = data['token']
                    return  await email_mobile_verification(con,verify_type,token)

                    /*if (verify_type == 'email')
                        {
                            if (token == con.email_verification_token)
                                {
                                    con.email_verified = true
                                    con.email_verification_token = null
                                }
                            else
                                throw new CustomError('please enter a valid token', 400)   
                        }  

                    else if (verify_type == 'mobile')
                        {
                            if (token == con.mobile_verification_token)
                                {
                                    con.mobile_verified = true
                                    con.mobile_verification_token = null
                                }
                            else
                                throw new CustomError('please enter a valid token', 400)
                        }*/
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
    con.password = await bcrypt.hash(n_password,10)

    return con

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

async function consumer_update(params, data)
{
    const{cofferid} = params;
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
                con = await update_password(con,data['old_password'],data['new_password']);

            if ( "mobile" in data)
                {
                    //case1: mobile verifed user , check saved mobile number not equal to current and mobile verified true to update
                    if (data["mobile"] != con.mobile && con.mobile_verified)
                        await notify_mobile(con,data["mobile"])
                        
                    //case2: mobile not verifed user (email verified user) , check saved mobile number not equal to current
                    else if (data["mobile"] != con.mobile )
                        {
                            await check({mobile:data["mobile"]})
                            con.mobile = data["mobile"] 
                        }
                    //case3: above cases are not it remains unchange 
                } 

            if ( "email" in data)
                {
                    if (data["email"] != con.email && con.email_verified)
                        await notify_email(con,data["email"])

                    else if (data["email"] != con.email )
                        {
                            await check({email:data["email"]})
                            con.email = data["email"] 
                        }
                }
            
            con.save();
            return {'error': false, 'msg': "profile details updated successfully", 'data': con, 'status': 200 }
        }
    throw new CustomError('Account not found',404) 
}

async function verify_email_mobile(params,data) 
{
    const{cofferid,verify_type} = params;

    const con = await consumer_find({coffer_id:cofferid})
    if (con)
        return await email_mobile_verification(con, verify_type, data["token"])

    throw new CustomError('Account not found',404)
}

async function get_consumer(params)
{
    const{cofferid} = params;

    const con = await consumer_find({coffer_id:cofferid})
    console.log(con)
    if (con)
        
        return {'error': false, 'data': con.GetConsumerData() , 'status': 200 }

    throw new CustomError('Account not found',404)
}
                
module.exports = {consumer_create, consumer_registration_verify_section, get_Bloodgroup, get_ethinicity, consumer_update, verify_email_mobile, get_consumer}

