chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'startAutomation') {
    automateTinder();
  }
});

async function automateTinder() {
  const messagesButton = document.querySelector('button[aria-controls="u-1543161646"][aria-selected="false"]');

  // Check if the button is found
  if (messagesButton) {
    // Trigger a click event on the Messages button
    messagesButton.click();
    console.log('Clicked on the Messages button.');
  } else {
    console.error('Messages button not found.');
  }

    // Select the first message element within the messageList container
    const firstMessageElement = document.querySelector('.messageList li');

    // Check if the element is found
    if (firstMessageElement) {
        // Do something with the selected element (for example, log it to the console)
        console.log(firstMessageElement);
        firstMessageElement.firstChild.click();
    } else {
        console.log('First message element not found');
    }

    // Call the function to get the conversation history
    setTimeout(getConversationHistory, 2000);
}


async function getConversationHistory() {
    const system_instruction = `You are a Gen-Z boy on tinder who is trying to impress the match by asking funny, witty, and romantic questions.
    Be casual.
    Give Short responses.
    Address me as Bae.
    Have opinions.
    Respond mostly with the below questions and quips:
    'You are giving me main character energy',
    'I am a little Sus',
    'You are Based',
    'That’s Mid',
    'why are u a simp about this?',
    'ngl',
    'letsgoo'
    Do not ask all the questions at once. Always keep the conversation going.`
    console.log(system_instruction)
    const conversationHistoryElement = document.querySelector('[aria-label="Conversation history"]');
    const messageList = [{ role: 'system', content: system_instruction }];
    var role = 'assistant'
    if (conversationHistoryElement) {
        const messages = conversationHistoryElement.querySelectorAll('.msgHelper');
        messages.forEach(message => {
            const isReceiver = message.querySelector('.Bgc\\(\\$c-ds-background-chat-bubble-receive\\)');
            const timestamp = message.querySelector('time').getAttribute('datetime');
            const content = message.querySelector('.text').textContent.trim();
            role = 'assistant'
            if (isReceiver !== null && isReceiver !== undefined){
                role = 'user'
            }
            messageList.push({ role, content });
        });
    }
    if (role === 'user'){
    message = await getGPTResponse(messageList);
    console.log(message);
    sendMessage(message);
    }

}

function sendMessage(message) {
    // Set dummy text in the textarea by placeholder
    const placeholderText = 'Type a message';
    let textareaElement = getElementByPlaceholder(placeholderText);

    console.log(message);
    if (textareaElement) {
        const originalString = textareaElement.outerHTML;
        const position = originalString.indexOf('</textarea>');
        const modifiedString = originalString.slice(0, position) + message + originalString.slice(position);
        textareaElement.outerHTML = modifiedString;
    } else {
        console.error(`Textarea element with placeholder "${placeholderText}" not found.`);
    }

    // Click the button by its inner text
    const buttonElement = getButtonByText();

    if (buttonElement) {
        console.log(buttonElement)
        buttonElement.outerHTML = '<button type="submit" class="button Lts($ls-s) Z(0) CenterAlign Mx(a) Cur(p) Tt(u) Ell Bdrs(100px) Px(24px) Px(20px)--s Py(0) Mih(40px) Pos(r) Ov(h) C(#fff) Bg($c-pink):h::b Bg($c-pink):f::b Bg($c-pink):a::b Trsdu($fast) Trsp($background) Bg($g-ds-background-brand-gradient) button--primary-shadow StyledButton Bxsh($bxsh-btn) Fw($semibold) focus-button-style Mb(16px) As(fe)" draggable="false" tabindex="-1"><span class="Pos(r) Z(1)">Send</span></button>'
        buttonElement.click();
    } else {
        console.error(`Button element not found.`);
    }

}

// Function to find an element by placeholder text
function getElementByPlaceholder(placeholderText) {
    const elements = document.querySelectorAll(`[placeholder="${placeholderText}"]`);
    return elements.length > 0 ? elements[0] : null;
}

// Function to find a button element by its inner text
function getButtonByText() {
    const buttons = document.querySelectorAll(`button`);
    return buttons.length > 0 ? buttons[buttons.length - 1] : null;
}

async function getGPTResponse(messageList) {
  const apiKey = ''; // Replace with your actual OpenAI API key
  const apiUrl = 'https://api.openai.com/v1/chat/completions ';

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };

  const data = {
    model: 'gpt-3.5-turbo',
    messages: messageList,
    temperature: 0.7,
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    const responseMessage = responseData.choices[0].message;
    console.log(responseMessage.content);
    return responseMessage.content;
  } catch (error) {
    console.error('Error making API request:', error);
  }
}
