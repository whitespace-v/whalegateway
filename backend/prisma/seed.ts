import {Currency, PaymentType, PrismaClient, Status} from '@prisma/client';

const client = new PrismaClient();

const merchantToCreate = {
    id: 1,
    uid: '4529c874-f1dd-4165-b78d-26910427a7af',
    name: "Bob",
    login: "SchlugerBob",
    password: "Golovnoy ubor123",
    phone: "89532084008",
    email: "giga@gmail.com",
    secret_key: "KShasdjkasdduioh123ey",
    created_at: Date.now().toString()
}

// const sessionToCreate  =     {
//   uid:         '123123-df78967812-sdf234',
//   merchant_id: 1,
//   secret_key:  "String",
//   amount:      300.25,
//   currency:    Currency["RUB"],
//   status:      Status["PENDING"],
//   description: "0pisani3",
//   paid:        false,
//   metadata:    {"Json": [1,2,3.5]},
//   created_at:  Date.now().toString(),
//   stage: 0
// }

const cardsToCreate = [
  { 
    id: 1,
    payment_type    : PaymentType["sberbank"],
    card_number     : "2202208069490903",
    card_login      : "DFKodoisdf423",
    card_password   : "DKLflsdkj234!",
    card_phone      : "79841562811",
    card_holder     : ' ',
    card_receiver   : 'Денис Андреевич К.',
    card_cvv        : ' ',
    card_valid_thru : ' ',
    card_pin        : ' ',
    card_secret     : ' ',
    active          : true,
    busy            : false,
  },
  {  
    id: 2,
    payment_type    : PaymentType["sberbank"],
    card_number     : "2202208069535061",
    card_login      : "DKLHDFKJDGFjkdfs",
    card_password   : "FjkdkjKJDSF844!!",
    card_phone      : "89841564493",
    card_holder     : ' ',
    card_receiver   : 'Матвей Владимирович С.',
    card_cvv        : ' ',
    card_valid_thru : ' ',
    card_pin        : ' ',
    card_secret     : ' ',
    active          : true,
    busy            : false,
  },
  { 
    id: 3,
    payment_type    : PaymentType["sberbank"],
    card_number     : "2202208066675878",
    card_login      : "ksdsdfsjkdjsdhjf",
    card_password   : "KJDSf9sd720p9FP(*",
    card_phone      : "89841562818",
    card_holder     : ' ',
    card_receiver   : 'Сергей Александрович А.',
    card_cvv        : ' ',
    card_valid_thru : ' ',
    card_pin        : ' ',
    card_secret     : ' ',
    active          : true,
    busy            : false,
  },
  { 
    id: 4,
    payment_type    : PaymentType["sberbank"],
    card_number     : "2202206770168248",
    card_login      : "dlkfsdhfskdflsdf",
    card_password   : "LKSHF-90d7f0234",
    card_phone      : "89841560863",
    card_holder     : ' ',
    card_receiver   : 'Роман Русланович М.',
    card_cvv        : ' ',
    card_valid_thru : ' ',
    card_pin        : ' ',
    card_secret     : ' ',
    active          : true,
    busy            : false,
  },
  { 
    id: 5,
    payment_type    : PaymentType["sberbank"],
    card_number     : "2202206367187221",
    card_login      : "osdfosdfsdfjksdf",
    card_password   : "FS0-sedf23Fy8",
    card_phone      : "89841563495",
    card_holder     : ' ',
    card_receiver   : 'Алексей Николаевич С.',
    card_cvv        : ' ',
    card_valid_thru : ' ',
    card_pin        : ' ',
    card_secret     : ' ',
    active          : true,
    busy            : false,
  },
  { 
    id: 6,
    payment_type    : PaymentType["sberbank"],
    card_number     : "2202206759545713",
    card_login      : "SFkdjsdfsdfksdfkl",
    card_password   : "LKFDHkujfdsgfus1-",
    card_phone      : "89020542692",
    card_holder     : ' ',
    card_receiver   : 'Корней Георгиевич З.',
    card_cvv        : ' ',
    card_valid_thru : ' ',
    card_pin        : ' ',
    card_secret     : ' ',
    active          : true,
    busy            : false,
  },
]

const seed = async () =>{
  try{
    await client.merchant.create({ data: merchantToCreate})
    // await client.session.create({data: sessionToCreate})
    for (let i of cardsToCreate){
      console.log(await client.card.create({data: i}))
    }
    console.log('[+] Seeded')
  } catch(e){
    console.log(e)
  }   
} 

await seed()
  .then(async () => {
    await client.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await client.$disconnect();
  });

// mts
// 8 984 156 23 41
// sberbank	
// 2202 2063 6719 6362
// l: 
// p: 
// ---------
// 8 984 156 23 37
// 2202 2080 6745 2046
// l: 
// p: 
// --------------
// 8 964 156 42 21
// ??????????
// ---------------
// 8 984 156 26 20
// 2200 3005 6781 1169
// -----------------
// 7 984 156 28 11
// 2202 2080 6949 0903
// l: DFKodoisdf423
// p: OPIS&F(P*D7fp0234
// ----------
// 8 984 156 44 93
// 2202 2080 6953 5061
// l: DKLHDFKJDGFjkdfs
// p: psdf-(*(68324hnS
// ------------------
// 8 984 156 28 18
// 2202 2080 6667 5878
// l: ksdsdfsjkdjsdhjf
// p: KJDSf9sd720p9FP(*
// ------------------
// 8 984 156 08 63
// 2202 2067 7016 8248
// l: dlkfsdhfskdflsdf
// p: LKSHF-90d7f0234
// ---------------------
// 8 984 156 34 95
// 2202 2063 6718 7221
// l: osdfosdfsdfjksdf
// p: FS0-sedf23Fy8
// -----------------
// 8 902 054 26 92
// 2202 2067 5954 5713
// l: SFkdjsdfsdfksdfkl
// p: LKFDHkujfdsgfus1- 