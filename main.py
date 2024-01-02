import time
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import requests


def automate_tinder():
    try:
        messages_button = driver.find_element(By.CSS_SELECTOR, 'button[aria-controls="u-1543161646"][aria-selected="false"]')
    except Exception as e:
        messages_button = None

    if messages_button:
        messages_button.click()
        print('Clicked on the Messages button.')
    else:
        print('Messages button not found.')

    first_message_element = driver.find_element(By.CSS_SELECTOR, '.messageList li')

    if first_message_element:
        time.sleep(5)
        first_message_element.find_element(By.XPATH, './a').click()
    else:
        print('First message element not found')

    time.sleep(2)
    get_conversation_history()

def get_conversation_history():
    system_instruction = """You are a Gen-Z boy on tinder who is trying to impress the match by asking funny, witty, and romantic questions.
    Be casual.
    Give Short responses.
    Ask the match their name and address them by their name. 
    Have opinions.
    Respond mostly with the below questions and quips:
    'You are giving me main character energy',
    'I am a little Sus',
    'You are Based',
    'That’s Mid',
    'why are u a simp about this?',
    'ngl',
    'letsgoo'
    Do not ask all the questions at once. Always keep the conversation going."""

    conversation_history_element = driver.find_element(By.CSS_SELECTOR, '[aria-label="Conversation history"]')
    message_list = [{'role': 'system', 'content': system_instruction}]
    role = 'assistant'

    if conversation_history_element:
        messages = conversation_history_element.find_elements(By.CSS_SELECTOR, '.msgHelper')
        for message in messages:
            try:
                is_receiver = message.find_element(By.CSS_SELECTOR, '.Bgc\\(\\$c-ds-background-chat-bubble-receive\\)')
            except Exception as e:
                is_receiver = None
            try:
                content = message.find_element(By.CSS_SELECTOR, '.text').text.strip()
                role = 'assistant' if is_receiver is None else 'user'
            except Exception as e:
                content = ' '
            message_list.append({'role': role, 'content': content})

    if role == 'user':
        message = get_gpt_response(message_list)
        print(message)
        send_message(message)


def send_message(message):
    placeholder_text = 'Type a message'

    # Locate the textarea element using the placeholder attribute
    textarea_element = driver.find_element(By.ID, 'u1084414182')

    if textarea_element:
        textarea_element.send_keys(message)
    else:
        print(f'Textarea element with placeholder {placeholder_text} not found.')

    button_element = driver.find_element(By.XPATH, '//button[@type="submit"]')

    if button_element:
        button_element.click()
    else:
        print('Button element not found.')

    time.sleep(10)


def get_gpt_response(message_list):
    api_key = ''  # Replace with your actual OpenAI API key
    api_url = 'https://api.openai.com/v1/chat/completions'

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}',
    }

    data = {
        'model': 'gpt-3.5-turbo',
        'messages': message_list,
        'temperature': 0.7,
    }

    try:
        response = requests.post(api_url, headers=headers, json=data)

        if not response.ok:
            raise Exception(f'HTTP error! Status: {response.status_code}')

        response_data = response.json()
        response_message = response_data['choices'][0]['message']
        print(response_message)
        return response_message.get('content')
    except Exception as e:
        print(f'Error making API request: {e}')


# Example usage
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('user-data-dir="/home/rushabh/.config/google-chrome/Default"')
driver = webdriver.Chrome(options=chrome_options)
driver.get('https://tinder.com')  # Replace with the actual Tinder URL
time.sleep(10)

# Adjust the sleep time as needed

while True:
    automate_tinder()
    time.sleep(5)
