# import json
# from selenium.webdriver import Keys
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support import expected_conditions
# from selenium.webdriver.support.wait import WebDriverWait
# from config.driver import Driver
#
#
# class SberbankAuth:
#     def __init__(self, card_login, card_password):
#         self.card_login = card_login
#         self.card_password = card_password
#         self.driver = Driver().set_driver()
#
#     def _auth(self):
#         try:
#             self.driver.get('https://online.sberbank.ru/CSAFront/index.do')
#             WebDriverWait(self.driver, 3).until(expected_conditions.presence_of_element_located((By.ID, 'loginByLogin')))
#             input_login = self.driver.find_element(By.ID, "loginByLogin")
#             input_password = self.driver.find_element(By.ID, "password")
#             input_login.send_keys(self.card_login)
#             input_password.send_keys(self.card_password)
#             input_password.send_keys(Keys.ENTER)
#             wait = WebDriverWait(self.driver, 3)
#             wait.until(lambda driver: "main" in self.driver.current_url)
#             cookies = self.driver.get_cookies()
#             cookies = json.dumps(cookies)
#             time.sleep(99999999)
#             return json.dumps({'status_code': 201, 'message': 'Successfully logged in', 'cookies': cookies})
#         except Exception as e:
#             print(e)
#             return json.dumps({'status_code': 403, 'message': 'Login failed'})
#         finally:
#             self.driver.close()
#             self.driver.quit()
