import {Currency, PaymentType, PrismaClient, Status} from '@prisma/client';

const client = new PrismaClient();

const merchantToCreate =     {
    id: 1,
    uid: '4529c874-f1dd-4165-b78d-26910427a7fa',
    name: "Bob",
    login: "SchlugerBob",
    password: "Golovnoy ubor123",
    phone: "89532084008",
    email: "giga@gmail.com",
    secret_key: "KShasdjkasdduioh123ey",
    domain: "https://vk.com/",
    created_at: Date.now().toString()
}

const sessionToCreate  =     {
  uid:         '123123-df78967812-sdf234',
  merchant_id: 1,
  secret_key:  "String",
  amount:      300.25,
  currency:    Currency["RUB"],
  status:      Status["PENDING"],
  description: "0pisani3",
  paid:        false,
  metadata:    {"Json": [1,2,3.5]},
  created_at:  Date.now().toString(),
  stage: 0
}

const cardsToCreate = [
  { 
    id: 1,
    payment_type    : PaymentType["sberbank"],
    card_number     : "2202206367196362",
    card_login      : "ksdsdfsjkdjsdhjf",
    card_password   : "SDF*^DF)9opu%^D&*F7",
    card_phone      : "79841562341",
    card_holder     : ' ',
    card_receiver   : 'Сергей Александрович А.',
    card_cvv        : '982',
    card_valid_thru : '03/34',
    card_pin        : ' ',
    card_secret     : ' ',
    active          : true,
    busy            : false,
  },
  { 
    id: 2,
    payment_type    : PaymentType["sberbank"],
    card_number     : "2202206367187221",
    card_login      : "osdfosdfsdfjksdf",
    card_password   : "lskdjfh(*^&*%^68678RTYjkhjdf",
    card_phone      : "79841563495",
    card_holder     : ' ',
    card_receiver   : 'Алексей Николаевич С.',
    card_cvv        : '994',
    card_valid_thru : '03/34',
    card_pin        : ' ',
    card_secret     : ' ',
    active          : true,
    busy            : false,
  },
  { 
    id: 3,
    payment_type    : PaymentType["sberbank"],
    card_number     : "2202206759545713",
    card_login      : "SFkdjsdfsdfksdfkl",
    card_password   : "fjsdjFFFjkf&*%^*&*62389409",
    card_phone      : "79020542692",
    card_holder     : ' ',
    card_receiver   : 'Корней Георгиевич З.',
    card_cvv        : '671',
    card_valid_thru : '11/33',
    card_pin        : ' ',
    card_secret     : ' ',
    active          : true,
    busy            : false,
  },
  { 
    id: 4,
    payment_type    : PaymentType["raiffeisen"],
    card_number     : "2200300567811169",
    card_login      : "banan12345999",
    card_password   : "ZSDFLKHDFjk8976sdo87f",
    card_phone      : "79841562620",
    card_holder     : ' ',
    card_receiver   : ' ',
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
    await client.session.create({data: sessionToCreate})
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

