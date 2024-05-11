import React, { useState } from 'react';
import axios from 'axios';

const GPT = () => {
    const [userInput, setUserInput] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const handleUserInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(event.target.value);
    };

    const handleSendButtonClick = async () => { 
        try {
            const csrftoken = getCSRFToken(); // Retrieve the CSRF token
    
            // Log whether the CSRF token was retrieved successfully using getCSRFToken()
            // console.log('CSRF token retrieved:', csrftoken);

            const requestConfig = {
                url: 'http://localhost:8000/backend/call-gpt/',
                method: 'POST',
                data: {
                    user_input: userInput,
                },
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                withCredentials: true
            };
    
            const response = await axios(requestConfig);

            // Log the status code of the response
            console.log('Response from ChatGPT:', response.data.response);

            setResponseMessage(response.data.response); // Update the response message
            
            // Handle the response from ChatGPT (e.g., update UI)
            
        } catch (error) {
            console.error('Error:', error);
            // Handle error
        }
    };

    const getCSRFToken = () => {
        let csrfToken = null;
        // console.log('document.cookie:', document.cookie); 
        if (document.cookie && document.cookie !== '') {
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, "csrftoken".length + 1) === ("csrftoken" + '=')) {
                    csrfToken = decodeURIComponent(cookie.substring("csrftoken".length + 1));
                    break;
                }
            }
        }
        // Log whether the CSRF token was found in the cookies
        // console.log('CSRF token found in cookies:', Boolean(csrfToken));

        return csrfToken;
    };
    
    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <input
                type="text"
                className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg mr-2 focus:outline-none"
                value={userInput}
                onChange={handleUserInputChange}
                placeholder="Type your message..."
            />
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none"
                onClick={handleSendButtonClick}
            >
                Send
            </button>
            {responseMessage && (
                <div className="mt-4 bg-white rounded-lg border border-gray-300 p-4">
                    <h3 className="font-semibold">Response from ChatGPT:</h3>
                    <p>{responseMessage}</p>
                </div>
            )}
        </div>
    );
};

export default GPT;
