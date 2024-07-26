# import json
#
# import requests
# from selenium.webdriver import Keys
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support import expected_conditions
# from selenium.webdriver.support.wait import WebDriverWait
# from config.driver import Driver
#
# class SberbankExpectance:
#     def __init__(self, cookies, card_password):
#         self.cookies = cookies
#         self.card_password = card_password
#         self.driver = Driver().set_driver()
#
#
#     def _expect(self):
#         r = requests.post('https://web-node5.online.sberbank.ru/uoh-bh/v1/operations/list', cookies=self.cookies)
#         print(r.status_code)
#         print(r.text)
#
#
#
#         # self.driver.get('https://web5-new.online.sberbank.ru/operations')
#         # WebDriverWait(self.driver, 3).until(expected_conditions.presence_of_element_located((By.ID, 'loginByLogin')))
