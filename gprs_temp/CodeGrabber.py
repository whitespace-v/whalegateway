import math
import re
import time
from datetime import datetime

class CodeGrabber:
    def __init__(self, timestamp, payment_type, gsm):
        self.timestamp = timestamp
        self.gsm = gsm
        self.bank_name = ['900', 'alfabank', 'tinkoff', 'Raiffeisen'][payment_type]

    def grab(self):
        messages = self.gsm[0].sms.readAll()
        messages = self.gsm[1].sms.readAll()
        # filter by "from" && "timestamp"
        print(messages)
        # for i in (i for i in messages
        #           if messages[i][2] == self.bank_name and
        #              math.floor(time.mktime(
        #                  datetime.strptime(messages[i][4] + '00', "%y/%m/%d,%H:%M:%S%z").timetuple())) > self.timestamp):
        #     # Raiffeisen && Sberbank
        #     res = re.search('код (.*) для', messages[i][5])
        #     return res.group(1)