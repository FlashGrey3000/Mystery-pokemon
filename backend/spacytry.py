import spacy

nlp = spacy.load('en_core_web_sm')

text = input("Enter text to check: ")

doc = nlp(text)

for ent in doc.ents:
    print(ent.text, ent.start_char, ent.end_char, ent.label_)