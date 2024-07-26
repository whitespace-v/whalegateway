export class MerchantController {
    static getAllMerchants(){
        return 'all merchants';
    }
    static getMerchantByUID(uid: string){
        try {
            console.log(uid, 'asasdas')
            return uid;
        } catch (e){
            console.log(e)
        }
    }
}

// create ???
// отменить оплату