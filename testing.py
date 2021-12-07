import pytest
from seleniumbase import BaseCase as sb
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import ElementNotVisibleException, WebDriverException
import os

#---------------------------------------------------SETTINGS------------------------------------------------------------

host="http://127.0.0.1:3000/"


# Login Test

@pytest.mark.parametrize("email,password,redirect_link", [
    # ("bhushanpatil","sakuna","farmer","http://127.0.0.1:8000/"),
    # ("bhushan","sakuna","farmer","http://127.0.0.1:8000/login"),
    # ("parampatil","itadori","wholesaler","http://127.0.0.1:8000/"),
    ("yashvimehta45@gmail.com","yashvi","http://127.0.0.1:3000/prescription"),
])

def test_speak(sb,email,password,redirect_link):
    sb.open(host+'login')
    sb.maximize_window()
    sb.find_element('email',By.NAME).send_keys(email)
    sb.find_element('password',By.NAME).send_keys(password)
    # sb.sleep(3)
    sb.find_element('checkbox',By.ID).click()
    sb.find_element('submit',By.ID).send_keys(Keys.RETURN)
    sb.sleep(5)
    print("***************************"+sb.get_current_url(),redirect_link+"***************************")
    assert sb.get_current_url()==redirect_link
    sb.find_element('save-note-btn-name',By.ID).send_keys(Keys.RETURN)
    sb.sleep(1)
    sb.find_element('save-note-btn-symptoms',By.ID).send_keys(Keys.RETURN)
    sb.sleep(2)
    sb.find_element('save-note-btn-diagnosis',By.ID).send_keys(Keys.RETURN)
    sb.sleep(2)
    sb.find_element('save-note-btn-prescription',By.ID).send_keys(Keys.RETURN)
    sb.sleep(2)
    sb.find_element('save-note-btn-advice',By.ID).send_keys(Keys.RETURN)
    sb.sleep(2)
    sb.find_element('final-report',By.ID).send_keys(Keys.RETURN)
    sb.scroll_to_bottom()
    sb.sleep(2)
    sb.find_element('final-pdf',By.ID).send_keys(Keys.RETURN)
    sb.sleep(10)

