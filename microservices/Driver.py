import re
from datetime import datetime
import math
from bs4 import BeautifulSoup
import requests
from playwright.async_api import async_playwright, expect
import time
from config.config import get_random_headers
import nodriver

class Driver:
    def __init__(self, login, password, card_phone, payment_type, session_timestamp, amount):
        self.user_metadata = {
            "login": login,
            "password": password,
            "card_phone": card_phone,
            "payment_type": payment_type,
            "amount": amount,
            "session_timestamp": session_timestamp
        }
        self.headers = None
        self.transactions = []

    def extract_transaction_timestamp(self, transaction):
        months = {"января": '01', "февраля": '02', "марта": '03', "апреля": '04', "мая": '05', "июня": '06',
                  "июля": '07', "августа": '08', "сентября": '09', "октября": '10', "ноября": '11',
                  "декабря": '12'}
        # swap monthname to numbers
        month = re.search(r'[А-я]+', transaction['date'], flags=re.IGNORECASE).group()
        return int(datetime.strptime(transaction['date']
                                     .replace(month, months[month])
                                     + ',2024,59', # add year and 59 seconds
                                     "%d %m, %H:%M,%Y,%S").timestamp()
                   * 1000  # convert to Unix
                   + 25200000)  # + 7 hours

    async def auth(self):
        print('[Driver]: Authorizing')
        try:
            browser = await nodriver.start(headless=True)
            page = await browser.get('https://online.sberbank.ru/CSAFront/index.do')
            log_input = await page.select('input[placeholder="Введите логин"]')
            await log_input.send_keys(self.user_metadata["login"])
            pwd_input = await page.select('input[placeholder="Пароль"]')
            await pwd_input.send_keys(self.user_metadata["password"])
            enter_button = await page.find("Войти", best_match=True)
            await enter_button.click()
            # wait redirect
            try:
                mark_pin = await page.find("Пропустить", best_match=True)
                if mark_pin:
                    await mark_pin.click()
            except:
                pass
            await page.find("Кошелёк", best_match=True)
            #  if not то пропустить код  и ждем кошелек dlkfsdhfskdflsdf LKSHF-90d7f0234
            history_btn = await page.find("История", best_match=True)
            await history_btn.click()
            alf_btn = await page.select('a[data-unit="alf-link-income"]')
            await alf_btn.click()
            # page = await browser.get("https://web4-new.online.sberbank.ru/pfm/alf", new_tab=False)
            t_btn = await page.find('button[data-action="operation-tab-income"]')
            await t_btn.click()
            opt = await page.find('Переводы от людей')
            await opt.click()
            await page.find('Операции')
            r = await page.get_content()
            soup = BeautifulSoup(r, 'html.parser')
            operation_list = soup.find('div', {'id': 'operation-list'})
            await page.close()
            browser.stop()
            for operation in operation_list:
                transaction = {}
                for p_tag, name in zip(operation.findChildren("p"), ["from", "date", "sum"]):
                    # remove unnecessary span tags
                    for match in p_tag.findAll('span'): match.unwrap()
                    # remove unnecessary rub sign
                    transaction[name] = p_tag.text.replace('₽', '').strip()
                self.transactions.append(transaction)
            for transaction in self.transactions:
                # replace month to number
                transaction_timestamp = self.extract_transaction_timestamp(transaction)
                if transaction_timestamp > int(self.user_metadata["session_timestamp"]) and\
                        math.ceil(float(self.user_metadata["amount"])) == int(transaction['sum']):     
                    return {"from": transaction['from'], "time_paid": transaction_timestamp}
        except Exception as e:
            print('[Driver]: Exception, Exited tabs & browser:', e)
            await page.close()
            browser.stop()
            print(e)
