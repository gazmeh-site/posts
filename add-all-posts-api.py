import os
import json
import requests

# CONSTANTS
REPOSITORY = "gazmeh-site/posts"
REPOSITORY_URL = f"https://raw.githubusercontent.com/{REPOSITORY}/main"

# URLs for the backend
BASE_API_URL = "http://localhost:1337/api"
ADD_POST_API_URL = f"{BASE_API_URL}/posts"
TAGS_API_URL = f"{BASE_API_URL}/post-tags"
USERS_API_URL = f"{BASE_API_URL}/users"


# Function to get the directory name of base_path
def get_dirname(path):
    return os.path.basename(os.path.normpath(path))

# Get all folders in the base path
def get_folders(base_path):
    return [f for f in os.listdir(base_path) if os.path.isdir(os.path.join(base_path, f)) and not f.startswith('.')]

# Function to get all tags from the backend
def get_all_tags():
    response = requests.get(TAGS_API_URL)
    if response.status_code == 200:
        return response.json().get('data', [])
    else:
        print(f"Failed to fetch tags, Status Code: {response.status_code}, Response: {response.text}")
        return []

# Function to get tag ID by tag name
def get_tag_id(tag_name, tags):
    for tag in tags:
        if tag['name'] == tag_name or tag['localeName'] == tag_name:
            return tag['documentId']
    return None


# Function to get all users from the backend
def get_all_users():
    response = requests.get(USERS_API_URL)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch users, Status Code: {response.status_code}, Response: {response.text}")
        return []

# Function to get user ID by username
def get_user_id(username, users):
    for user in users:
        if user['username'] == username:
            return user['id']
    return None


# Function to add a post to backend
def add_post(post):
    data = {'data':post}
    response = requests.post(ADD_POST_API_URL, json=data)
    if response.status_code == 201:
        print(f"Successfully added: {data['data']['slug']}")
    else:
        print(f"Failed to add: {data['data']['slug']}, Status Code: {response.status_code}, Response: {response.text}")

# Function to check if an image file exists in the resources folder
def image_exists(folder_path, image_name):
    extensions = ['png', 'jpeg', 'webp']
    for ext in extensions:
        image_path = os.path.join(folder_path,'resources', f"{image_name}.{ext}")
        if os.path.exists(image_path):
            return image_path
    return None

# Iterate over each folder and read the config.json file and add the post
def add_posts(base_path, locale):
    folders = get_folders(base_path)
    for folder in folders:
        folder_path = os.path.join(base_path, folder)
        info_path = os.path.join(folder_path, "config.json")
        if os.path.exists(info_path):
            with open(info_path, 'r', encoding='utf-8') as file:
                data = json.load(file)

                #location field
                data['location'] = f"{locale}/{get_dirname(base_path)}/{folder}"

                # baseUrl field
                repo_base_url = f"{REPOSITORY_URL}/{data['location']}"
                data['baseUrl'] = repo_base_url

                # content field
                content_path = os.path.join(folder_path, "content.md")
                if os.path.exists(content_path):
                    with open(content_path, 'r', encoding='utf-8') as content_file:
                        data['content'] = content_file.read()

                # slug field
                if not 'slug' in data:
                    data['slug'] = f"{get_dirname(base_path)}-{folder}"

                # image fields
                all_image_fields = ['image','imageCover','imageCard','imageThumbnail','imageBackground']
                for image_field in all_image_fields:
                    if not image_field in data:
                        image_path = image_exists(folder_path, image_field)
                        if image_path:
                            data[image_field]=f"{repo_base_url}/resources/{os.path.basename(image_path)}"

                # tags field
                if 'tags' in data:
                    tags = data['tags']
                else:
                    tags = [get_dirname(base_path)]

                tag_ids = []
                for tag in tags:
                    tag_id = get_tag_id(tag, allTags)
                    if tag_id:
                        tag_ids.append(tag_id)
                    else:
                        print(f"Tag not found: {tag}")

                data['tags'] = tag_ids

                # author field
                users = get_all_users()
                author_id = get_user_id(data['writer'], users)
                if author_id:
                    data['writer'] = author_id
                else:
                    print(f"writer not found: {data['writer']}")
                    data['writer'] = None

                add_post(data)
        else:
            print(f"config.json not found in {folder}")

# test functions
def test_functions():
    print(f"base directory: {get_dirname(base_path)}")
    given_tag='jmeter'
    tag_id = get_tag_id(given_tag, allTags)
    if tag_id:
        print(f"Tag ID for {given_tag}': {tag_id}")
    else:
        print("Tag not found")

    given_user='mgh'
    user_id = get_user_id(given_user, allUsers)
    if user_id:
        print(f"User ID for {given_user}': {user_id}")


allTags = get_all_tags()
allUsers = get_all_users()
 
# add all posts
locals = get_folders(".")
for locale in locals:
    base_path = f"./{locale}"
    topics = get_folders(base_path)
    for topic in topics:
        base_path = f"./{locale}/{topic}"
        add_posts(base_path, locale)

