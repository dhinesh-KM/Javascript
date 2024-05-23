const {Consumer} = require('./models/consumer')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const {get_country_phone_code} = require('./country')




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

async function consumer_create(data)
{
    const user = await createuser(data)

    if ('email' in data)
        {
            const con =  await consumer_find({email: data['email']});

            if (con)
                return {'error':false, 'msg':'Email ID is already registered with DigiCoffer Personal.', 'status': 409};

            
            user.email = data['email'].toLowerCase();
            email_verification_token = crypto.randomBytes(8).toString('hex');
            console.log("vitagist email verfication\nName: ", user.consumer_fullname(),`\ntoken:${email_verification_token}`);
            user.email_verification_token = email_verification_token;

        }
    else if ('mobile' in data)
        {
            
            const con = await consumer_find({mobile: data['mobile']})

            if (con)
                return {'error':false, 'msg':'Mobile number is already registered with DigiCoffer Personal.', 'status': 409};

            user.mobile = data['mobile'];
            mobile_verification_token = crypto.randomBytes(8).toString('hex').toUpperCase();
            console.log(`VitaGist  Mobile Verification.\nNumber: ${get_country_phone_code(user.country)} `,user.mobile ,"\nmsg: ",`Use token ${mobile_verification_token} to verify your mobile and get started with DigiCoffer Personal`)
            user.mobile_verification_token = mobile_verification_token; 

        }
    
    await user.save()

    return {'error': false, 'msg': 'Consumer created successfully.', 'data': user, 'status': 201};
    
}

async function consumer_registration_verify_section(verify_type,token_type,payload=null)
{
    console.log('////////////')
    if (verify_type == 'email')
        con = await consumer_find({email: payload['email']});

    else if (verify_type == 'mobile')
        con = await consumer_find({mobile: payload['mobile']}); 
 
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
        }
    else
        return {'error': true, 'msg': 'Account not found', 'status': 404};    
}


                
module.exports = {consumer_create,consumer_registration_verify_section}

