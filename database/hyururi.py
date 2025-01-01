import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
import random

# Load intents.json
with open("intents.json", "r") as file:
    intents = json.load(file)["intents"]

# Prepare data
X = []  # Patterns
y = []  # Corresponding intents
for intent in intents:
    for pattern in intent["patterns"]:
        X.append(pattern)
        y.append(intent["intent"])

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Build a pipeline: TF-IDF Vectorizer + Logistic Regression
model = Pipeline([
    ("vectorizer", TfidfVectorizer()),
    ("classifier", LogisticRegression())
])

# Train the model
model.fit(X_train, y_train)

# Chatbot response function
def chatbot_response(user_input):
    intent = model.predict([user_input])[0]
    for i in intents:
        if i["intent"] == intent:
            return random.choice(i["responses"])
    return "Sorry, I didn't understand that."

# Chat loop
print("Chatbot: Hello! Let's start chatting!")
while True:
    user_input = input("You: ")
    if user_input.lower() in ["exit", "quit", "bye"]:
        print("Chatbot: Bye! Have a great day!")
        break
    response = chatbot_response(user_input)
    print(f"Chatbot: {response}")
