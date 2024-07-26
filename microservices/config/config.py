import random


def get_random_headers():
    uas_file = open('config/user_agents.txt')
    uas = uas_file.read().splitlines()
    uas_file.close()
    return {
        'User-Agent': random.choice(uas),
        'Accept-Encoding': 'gzip, deflate',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Upgrade-Insecure-Requests': '1',
        'Connection': 'keep-alive'
    }


def get_proxy():
    uas_file = open('config/proxies.txt')
    uas = uas_file.read().splitlines()
    uas_file.close()
    return random.choice(uas)