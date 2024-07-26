import os, sys, subprocess, re
from multiprocessing import Pool

from usim800 import sim800


class Driver:
    # sudo chown kernel /dev/ttyUSB0
    def __init__(self):
        self.gsm_list = []
        self.numbers = []

    def get_number(self, gsm):
        gsm.info.prepare()
        sms_list = gsm.sms.readAll()
        for i in sms_list:
            if 'Ваш номер' in sms_list[i][5]:
                r = re.compile(r'\d+').findall(sms_list[i][5])[0]
                if r[0] == '9': r = '7' + r
                return {"gsm": gsm, "number": r}
                # self/gsm['number'] = r
                # break

    def sync(self, gsm_list):
        self.gsm_list = gsm_list

    def get_gsms(self):
        return self.gsm_list

    def last_sms(self, gsm):
        print(gsm['number'], gsm['gsm'].sms.readAll())
        _, l = list(gsm['gsm'].sms.readAll().items())[-1]
        print(gsm['number'], l)

    def get_last_sms(self):
        with Pool(len(self.gsm_list)) as pool:
            pool.map(self.last_sms, self.gsm_list)
            pool.close()
            pool.terminate()
            pool.join()
