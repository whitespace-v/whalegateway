import re
from datetime import datetime
import math
from bs4 import BeautifulSoup as bs
import requests
from playwright.async_api import async_playwright, expect
import time
from config.config import get_random_headers


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
            async with async_playwright() as p:
                browser = await p.firefox.launch(headless=False)
                page = await browser.new_page()
                await page.goto("https://online.sberbank.ru/CSAFront/index.do", timeout=0)
                await page.get_by_placeholder("Введите логин").fill(self.user_metadata["login"])
                await page.get_by_placeholder("Пароль").fill(self.user_metadata["password"])
                await page.keyboard.down("Enter")
                await page.get_by_text("Кошелёк").hover()
                await page.goto("https://web7.online.sberbank.ru/pfm/alf", timeout=0)
                await page.get_by_text("Зачисления").click()
                await page.get_by_role("option", name="Переводы от людей").click()
                # TODO: change to wait until load content with history
                time.sleep(3)
                # get operation-list and f5
                r = await page.content()
                page = bs(r, 'html.parser')
                operation_list = page.find('div', {'id': 'operation-list'})
                for operation in operation_list:
                    transaction = {}
                    for p_tag, name in zip(operation.findChildren("p"), ["from", "date", "sum"]):
                        # remove unnecessary span tags
                        for match in p_tag.findAll('span'): match.unwrap()
                        # remove unnecessary rub sign
                        transaction[name] = p_tag.text.replace('₽', '').strip()
                    self.transactions.append(transaction)
                await browser.close()
                for transaction in self.transactions:
                    # replace month to number
                    transaction_timestamp = self.extract_transaction_timestamp(transaction)
                    if transaction_timestamp > int(self.user_metadata["session_timestamp"]) and\
                            math.ceil(float(self.user_metadata["amount"])) == int(transaction['sum']):
                        return {"from": transaction['from'], "time_paid": transaction_timestamp}
        except Exception as e:
            print(e)
