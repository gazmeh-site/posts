import os
import json
import requests

# Function to get the directory name of base_path
def get_dirname(path):
    return os.path.basename(os.path.normpath(path))

# Get all folders in the base path excluding hidden folders
def get_folders(base_path):
    return [f for f in os.listdir(base_path) if os.path.isdir(os.path.join(base_path, f)) and not f.startswith('.')]

# Generates a 3-line description of a Markdown file using the Gemini AI API.
def generate_description(md_file_path):
  
  api_key = os.getenv("GEMINI_API_KEY")
  
  with open(md_file_path, 'r') as f:
    md_content = f.read()

  # Convert Markdown to plain text
  text_content = md_content

  # Prepare the API request
  data = {
    "contents": [{
      "parts": [{"text": "generate 3-lines description about this article in persian: \n\n" + text_content + "\n\n"}]
    }]
  }

  url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
  headers = {'Content-Type': 'application/json'}

  response = requests.post(url, headers=headers, json=data, params={'key': api_key})

  if response.status_code == 200:
    # Extract the generated description
    result = response.json()
    if("candidates" in result):
        description = result['candidates'][0]['content']['parts'][0]['text']
        return description
    print(f"Error: no candidates in result's json: {response.text}")
  else:
    print(f"Error: {response.status_code} - {response.text}")
    return None

# update config.json's desc field based on content.md
def add_description_to_config(folder_path):
    info_path = os.path.join(folder_path, "config.json")
    if os.path.exists(info_path):
        with open(info_path, 'r', encoding='utf-8') as file:
            data = json.load(file)

            if 'desc' not in data or len(data['desc']) < 100:
                content_path = os.path.join(folder_path, "content.md")
                if os.path.exists(content_path):
                    description = generate_description(content_path)
                    if description:
                        data['desc'] = description
                        with open(info_path, 'w', encoding='utf-8') as outfile:
                            json.dump(data, outfile, ensure_ascii=False, indent=4)
                        print(f"Added description to {info_path}")
                    else:
                        print(f"Failed to generate description for {info_path}")
                else:
                    print(f"content.md not found in {folder_path}")
    else:
        print(f"config.json not found in {folder_path}")

def test_ai_function():
    md_file_path = "fa/jmeter/installation/content.md"
    summary = generate_description(md_file_path)
    print(summary)

def generate_desc_for_all_folders():   
    locals = get_folders(".")
    for locale in locals:
        local_path = f"./{locale}"
        topics = get_folders(local_path)
        for topic in topics:
            topic_path = f"./{local_path}/{topic}"
            articles =  get_folders(topic_path)
            for article in articles:
                article_path = f"{topic_path}/{article}"
                add_description_to_config(article_path)

# test_ai_function()
generate_desc_for_all_folders()

