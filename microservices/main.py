from Driver import Driver
import asyncio
import tornado
import json
import time
import requests 

class MainHandler(tornado.web.RequestHandler):
    async def get(self):
        login = self.get_argument("login", None, True)
        password = self.get_argument("password", None, True)
        card_phone = self.get_argument("card_phone", None, True)
        payment_type = self.get_argument("payment_type", None, True)
        session_timestamp = self.get_argument("timestamp", None, True)
        amount = self.get_argument("amount", None, True)
        session_uid = self.get_argument("session_uid", None, True)
        driver = Driver(login, password, card_phone, payment_type, session_timestamp, amount)
        status = "PENDING"
        result = json.dumps({"data": {'from': 'Никита Андреевич Б.', 'time_paid': 1722002639000}, "status": 'SUCCESS', "session_uid": session_uid})
        r = requests.post("http://localhost:5000/payment/paid/", json=result)
        while status != "SUCCESS" and int(str(int(time.time())) + "000") <= int(session_timestamp) + 840000:
            transaction = await driver.auth()
            print(transaction)
            # если пришли
            if transaction:
                print(transaction)
                status = "SUCCESS"
                # send to api 
                result = json.dumps({"data": transaction, "status": 'SUCCESS', "session_uid": session_uid})
                r = requests.post("http://localhost:5000/payment/paid/", json=result)
                print(r)
            # если срок сессии вышел 
            if int(str(int(time.time())) + "000") <= int(session_timestamp) + 840000:
                #  send as exited
                result = json.dumps({"status": 'EXITED'})
                requests.post("http://localhost:5000/payment/paid/", data=result)
            # r = json.dumps({"data": transaction, "status": 'SUCCESS'})
        # self.write(r)

# 9020542692


async def main():
    app = tornado.web.Application([(r"/expect", MainHandler)])
    app.listen(5500)
    await asyncio.Event().wait()

if __name__ == "__main__":
    asyncio.run(main())
