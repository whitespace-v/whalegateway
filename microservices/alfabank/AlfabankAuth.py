from playwright.sync_api import sync_playwright, Playwright
import json
import time
import datetime


class AlfabankAuth:
    def __init__(self, card_login, card_password):
        self.card_login = card_login
        self.card_password = card_password

    def check_url(self):
        try:
            res = self.page.evaluate("window.location.href")
            if res == "https://web.alfabank.ru/payments/payments-and-transfers": return True
        except:
            pass

    def auth(self):
        try:
            with sync_playwright() as playwright:
                browser = playwright.chromium.launch(headless=False)
                page = browser.new_page()
                context = browser.new_context()
                page.set_default_timeout(0)

                page.goto("https://private.auth.alfabank.ru/")

                time.sleep(1)

                for i in js:
                    page.evaluate(
                        f'document.cookie = "{i["name"]}={i["value"]}; domain={i["domain"]}; path={i["path"]}; expires=Tue, 19 Jan 2038 03:14:07 GMT"')

                time.sleep(1)
                page.goto(
                    "https://private.auth.alfabank.ru/passport/cerberus-mini-blue/dashboard-blue/username?response_type=code&client_id=newclick-web&scope=openid%20newclick-web&acr_values=username&non_authorized_user=true")

                st = 0

                self.page = page

                while st < 99999:

                    url_c = self.check_url()

                    if url_c:
                        cookies = context.cookies()
                        print(cookies)


        except Exception as e:
            print(e)
            # return json.dumps({'status_code': '400-500', 'message': str(e)})

if __name__ == '__main__':
    alfabank = AlfabankAuth('s', 's').auth()


