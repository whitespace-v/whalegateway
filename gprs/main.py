from CodeGrabber import CodeGrabber
from usim800 import sim800

if __name__ == '__main__':
    # bash : sudo chmod 777 /dev/ttyUSB0
    # bash : sudo chown angelbeyond /dev/ttyUSB0
    gsm = sim800(baudrate=9600, path="/dev/ttyUSB0")
    grabber = CodeGrabber(timestamp=16666, gsm=gsm, payment_type=3)
    print(grabber.grab())