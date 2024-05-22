const {Consumer} = require('./models/consumer')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const {get_country_phone_code} = require('./country')



async function generate_cofferid()
{
    const cid = crypto.randomBytes(8).toString('hex')
    const con = await Consumer.findOne({coffer_id : cid})
    if (con)   
        generate_cofferid() 
    return cid
}

async function consumer_find(email,mobile)
{
    if (email)
        {
            email = email.toLowerCase()
            const con = await Consumer.findOne({email:email})
            return con
        }
    else
        {
            const con = await Consumer.findOne({mobile:mobile})
            return con
        }
}

async function consumer_create(data)
{
    if ('email' in data)
        {
            const con =  await consumer_find(data['email'], null);
            data['email'] = data['email'].toLowerCase();


            if (con != null)
                return {'error':false, 'msg':'Email ID is already registered with DigiCoffer Personal.', 'status': 409};
        }
    else if ('mobile' in data)
        {
            
            const con = await consumer_find(null, data['mobile'])
            if (con != null)
                return {'error':false, 'msg':'Mobile number is already registered with DigiCoffer Personal.', 'status': 409};
        }
    
    const country_data = {
        'index': 'citizen_primary',
        'country': data['country'],
        'affiliation_type': 'citz'
    };
        

        
    data['coffer_id'] = await generate_cofferid();
    data['password'] = await bcrypt.hash(data['password'],10);
    data["joined"] = Date.now();
    email_verification_token = crypto.randomBytes(8).toString('hex');
    mobile_verification_token = crypto.randomBytes(8).toString('hex').toUpperCase();
    delete data['confirm_password'];

    const user = new Consumer(data);
    user.citizen = [country_data];

    if ('email' in data)
        {
            if (data['email'] !=  '')
                {
                    console.log("vitagist email verfication\nName: ", user.consumer_fullname(),`\n token:${email_verification_token}`);
                    user.email_verification_token = email_verification_token;
                }

        }
    
    else if (data['mobile'] !=  '' )
        {
            user.mobile = data['mobile'];
            console.log(`VitaGist  Mobile Verification.\nNumber: ${get_country_phone_code(user.country)} `,user.mobile ,"\nmsg: ",`Use token ${mobile_verification_token} to verify your mobile and get started with DigiCoffer Personal`)
            user.mobile_verification_token = mobile_verification_token; 
        }
    await user.save()

    return {'error': false, 'msg': 'Consumer created successfully.', 'data': user, 'status': 201};
    
}

async function consumer_registration_verify_section(verify_type,token_type,payload=null)
{
    
    if (verify_type == 'email')
        con = await consumer_find(payload['email'], null);

    else if (verify_type == 'mobile')
        con = await consumer_find(null, payload['mobile']); 

    else
        return {'error': true, 'msg': 'Error verify type.', 'status': 400}; 
 
    if (con)
        {
            if (token_type == 'resend')
                {
                    if (verify_type == 'email')
                        console.log("VitaGist Personal Email Verification.\nName:", con.consumer_fullname() ,"\ntoken: ",con.email_verification_token);
                    
                    else if (verify_type == 'mobile')
                        console.log("VitaGist Personal Mobile Verification.\nNumber:",`${get_country_phone_code(con.country)} ${con.mobile}`,"\nmsg: ",`Use token ${con.mobile_verification_token} to verify your mobile and get started with DigiCoffer Personal`)

                    return {'error': false, 'msg': 'Resend successful.', 'token': con.email_verification_token, 'status': 200};

                }
            else if (token_type == 'verify')
                {
                    token = payload['token']
                    if (!token)
                        return {'error':true, 'msg':'Token is required', 'status': 400};
                    if (verify_type == 'email')
                        {
                            if (token == con.email_verification_token)
                                {
                                    con.email_verified = true
                                    con.email_verification_token = null
                                }
                            else
                                return {'error':true, 'msg':'please enter a valid token', 'status': 400};
                        }  

                    else if (verify_type == 'mobile')
                        {
                            if (token == con.mobile_verification_token)
                                {
                                    con.mobile_verified = true
                                    con.mobile_verification_token = null
                                }
                            else
                                return {'error':true, 'msg':'please enter a valid token', 'status': 400};

                        }
                    await con.save()  

                    return {'error': false, 'msg': `${verify_type} verification successful.`, 'status': 200};
                }
            else
                return {'error': true, 'msg': 'Error Token type.', 'status': 400};    
        }
    else
        return {'error': true, 'msg': 'Account not found', 'status': 404};    
}


                
module.exports = {consumer_create,consumer_registration_verify_section}

