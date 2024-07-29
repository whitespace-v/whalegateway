import multiprocessing
import subprocess
from multiprocessing import Process, Pool
from Driver.Driver import Driver
from usim800 import sim800


# TODO: Отвязать карту от райфа, 1 карта = 1 симка
if __name__ == '__main__':
    driver = Driver()
    gsms = []
    for tty in (subprocess.check_output('ls /dev | grep USB', shell=True).decode('utf-8').splitlines()):
        gsms.append(sim800(baudrate=9600, path=f"/dev/{tty}"))
    with Pool(len(gsms)) as pool:
        results = pool.map(driver.get_number, gsms)
        pool.close()
        pool.terminate()
        pool.join()
    driver.sync(results)

    driver.get_last_sms()

""
    # with Pool(len(gsms)) as p:
    #     p.map(driver.last_sms, gsms)

    # +
    # 79841562341
    # sber
    # 2202 2063 6719 6362
    # l: ksdsdfsjkdjsdhjf
    # p: SDF*^DF)9opu%^D&*F7

    # +
    # 79841563495
    # sber
    # 2202 2063 6718 7221
    # l: osdfosdfsdfjksdf
    # p: lskdjfh(*^&*%^68678RTYjkhjdf
    
    # +
    # 79020542692
    # sber
    # 2202 2067 5954 5713
    # l: SFkdjsdfsdfksdfkl
    # p: fjsdjFFFjkf&*%^*&*62389409
    
    # !
    # 79841562620
    # raif
    # 2200 3005 6781 1169
    # l: banan12345999
    # p: ZSDFLKHDFjk8976sdo87f

