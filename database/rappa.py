import json
import random
import re

# Load intents.json
with open("intents.json", "r") as file:
    intents = json.load(file)["intents"]

def chatbot_response(user_input):
    for intent in intents:
        for pattern in intent["patterns"]:
            if re.search(pattern, user_input, re.IGNORECASE):
                return random.choice(intent["responses"])
    return "Sorry, I didn't understand that. Can you try again?"

# Chat loop
print("Chatbot: Hello! Let's start chatting!")
while True:
    user_input = input("You: ")
    if user_input.lower() in ["exit", "quit", "bye"]:
        print("Chatbot: Bye! Have a great day!")
        break
    response = chatbot_response(user_input)
    print(f"Chatbot: {response}")
