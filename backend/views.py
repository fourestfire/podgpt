from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse


def index(request):
    return HttpResponse("Hello, world. You're at the backend index.")


def front (request, *args, **kwargs):
    return render(request, 'new.html')


from openai import OpenAI
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect

import time

def chat_view(request):
    get_token(request)
    return render(request, 'chat.html')

# Create an instance of the OpenAI client
client = OpenAI()

import json

# Function to receive the call from the frontend
# TODO: fix crsf stuff for prod
@csrf_exempt
# @csrf_protect
@ensure_csrf_cookie
@require_POST
def call_gpt(request):
    # print('Request data:', request, request.body)  # Log the request data
    print('Content-Type:', request.META.get('HTTP_CONTENT_TYPE'))  # Log the Content-Type
    if request.method == 'POST':

        # Get user input from request: decode the byte string and parse JSON data to Python dictionary
        data = json.loads(request.body.decode('utf-8'))

        # Extract user input from parsed data
        user_input = data.get('user_input')
        model_type = data.get('model_type')
        images = data.get('images')
        message_history = json.loads(data.get('message_history', '[]')) # used as context for gpt

        # Generate response using user input
        response = generate_response(user_input, model_type, message_history, images)

        # Return response as JSON
        return JsonResponse({'response': response})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    

# Function to generate response
def generate_response(user_input, model_type, message_history=[], images=[]):
    # time.sleep(30)  # delay for 30 seconds to test frontend loading stuff
    # print("image:", image[:50] if image else None)
    # print("message history:", message_history)
          
    # Default messages and content
    default_sys_message = [
        {
            "role": "system",
            "content": "You are a helpful assistant. Be very brief."
        }
    ]

    latest_message = [
        {
            "role": "user",
            "content": user_input
        },
    ]

    
    # Emoji model
    if model_type == 'Emoji':   
        default_sys_message = [
            {
                "role": "system",
                "content": "Please respond with emojis. Under no circumstances should you use words even if emojis aren't available to explain your thoughts."
            }
        ]

        latest_message = [
            {
                "role": "user",
                "content": user_input
            },
        ]


    # Vision model
    if model_type == 'Vision':
        default_sys_message = [
            {
                "role": "system",
                "content": "You are a helpful assistant. Be very brief."
            }
        ]
        if images:
            print('image(s) present. Vision go!')
            image_objects = [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{image}",
                        "detail": "low"
                    }
                } for image in images
            ]
            latest_message = [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": user_input
                        },
                        *image_objects # unpacks all images into the content section
                    ]
                },
                
            ]
    
        if not images:
            print('image(s) not present: vision model')
            latest_message = [
            {
                "role": "user",
                "content": user_input
            },
        ]

    # combine all message dictionaries (aka objects) into one array
    messages = default_sys_message + message_history + latest_message

    # Mapping from display name to internal name
    model_mapping = {
        'Standard': 'gpt-3.5-turbo',
        'Emoji': 'gpt-3.5-turbo',
        'Vision': 'gpt-4-turbo',
        # Add more mappings as needed
    }
    
    # Transform model_type
    model_type = model_mapping.get(model_type, model_type) # if model_type is a key in the model_mapping dictionary, this line will replace model_type with the corresponding value from the dictionary. If model_type is not in the dictionary, it will remain the same. This is a way to transform or map model_type to a different value if a mapping exists, or leave it unchanged if no mapping is found.

    print(f"User input: {user_input}. Model type: {model_type}")  
    print("messages:", messages)

    response = client.chat.completions.create(
        model=model_type,
        messages=messages,
        temperature=0.6,
        max_tokens=256,
        top_p=0.6
    )

    return response.choices[0].message.content

