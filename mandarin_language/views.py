import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.shortcuts import render
import json
from django.conf import settings
import logging

# Set up logging
logger = logging.getLogger(__name__)

# In ask_assistant view
response = requests.post(
    'https://api.deepseek.com/v1/chat/completions',
    headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {settings.DEEPSEEK_API_KEY}'
    },
    # ... rest of the request
)

# Existing view (assuming this is your mandarin_language view)
def index(request):
    return render(request, 'mandarin_language/index.html')

# New view for the DeepSeek API proxy
@csrf_exempt
@require_POST
def ask_assistant(request):
    if request.method == 'POST':
        try:
            # Log the incoming request
            logger.info("Received assistant request")
            
            data = json.loads(request.body)
            query = data.get('query', '')
            
            if not query:
                logger.warning("Empty query received")
                return JsonResponse({'error': 'No query provided'}, status=400)
            
            # Log the query
            logger.info(f"Processing query: {query}")
            
            # DeepSeek API endpoint
            url = "https://api.deepseek.com/v1/chat/completions"
            
            # Prepare the request headers
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {settings.DEEPSEEK_API_KEY}"
            }
            
            # Log the API key (first few characters only for security)
            logger.info(f"Using API key: {settings.DEEPSEEK_API_KEY[:5]}...")
            
            # Prepare the request body
            payload = {
                "model": "deepseek-chat",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a helpful Chinese language learning assistant. Provide clear, accurate, and helpful responses about Chinese language learning, grammar, vocabulary, and culture. When explaining concepts, provide examples in both Chinese and English."
                    },
                    {
                        "role": "user",
                        "content": query
                    }
                ],
                "temperature": 0.7,
                "max_tokens": 1000
            }
            
            # Log the request details
            logger.info(f"Sending request to DeepSeek API: {url}")
            
            # Make the API request
            response = requests.post(url, headers=headers, json=payload)
            
            # Log the response status
            logger.info(f"API response status: {response.status_code}")
            
            if response.status_code == 200:
                response_data = response.json()
                logger.info("Received successful response from API")
                
                if 'choices' in response_data and len(response_data['choices']) > 0:
                    return JsonResponse({
                        'choices': [{
                            'message': {
                                'content': response_data['choices'][0]['message']['content']
                            }
                        }]
                    })
                else:
                    logger.error("Invalid response format from API")
                    return JsonResponse({'error': 'Invalid response format from API'}, status=500)
            else:
                error_message = f'API request failed with status {response.status_code}'
                try:
                    error_details = response.json()
                    error_message += f': {error_details}'
                    logger.error(f"API error: {error_message}")
                except:
                    error_message += f': {response.text}'
                    logger.error(f"API error (raw): {error_message}")
                return JsonResponse({'error': error_message}, status=response.status_code)
                
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {str(e)}")
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error: {str(e)}")
            return JsonResponse({'error': f'Request error: {str(e)}'}, status=500)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return JsonResponse({'error': f'Unexpected error: {str(e)}'}, status=500)
            
    return JsonResponse({'error': 'Method not allowed'}, status=405)