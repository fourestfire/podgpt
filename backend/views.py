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
from django.views.decorators.http import require_POST

def chat_view(request):
    return render(request, 'chat.html')

# Create an instance of the OpenAI client
client = OpenAI()

# Function to generate response
def generate_response(user_input):
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "user",
                "content": user_input
            }
            ,
            {
                "role": "system",
                "content": "Please respond with emojis."
            }
        ],
        temperature=0.8,
        max_tokens=64,
        top_p=1
    )
    return response.choices[0].message.content

import json

# @csrf_exempt
@require_POST
def call_gpt(request):
    print('Request data:', request, request.body)  # Log the request data
    print('Content-Type:', request.META.get('HTTP_CONTENT_TYPE'))  # Log the Content-Type
    if request.method == 'POST':

        # Get user input from request: decode the byte string and parse JSON data to Python dictionary
        data = json.loads(request.body.decode('utf-8'))

        # Extract user input from parsed data
        user_input = data.get('user_input')

        # Generate response using user input
        response = generate_response(user_input)

        # Return response as JSON
        return JsonResponse({'response': response})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)