from bs4 import BeautifulSoup
import requests
import csv

def obtainRegionTuple(id):
    if id=='#':
        return None
    id = int(id)

    if 1 <= id <= 151:
        return ('Kanto', 1)
    elif 152 <= id <= 251:
        return ('Johto', 2)
    elif 252 <= id <= 386:
        return ('Hoenn', 3)
    elif 387 <= id <= 493:
        return ('Sinnoh', 4)
    elif 494 <= id <= 649:
        return ('Unova', 5)
    elif 650 <= id <= 721:
        return ('Kalos', 6)
    elif 722 <= id <= 809:
        return ('Alola', 7)
    elif 810 <= id <= 905:
        return ('Galar', 8)
    elif 906 <= id <= 1025:
        return ('Paldea', 9)
    else:
        return ('Unknown', 'Unknown')

pokedex = []

#Scraping a website to get latest pokemon database
html_doc = requests.get('https://pokemondb.net/pokedex/all')
soup = BeautifulSoup(html_doc.text, 'lxml')

#finding and filling our pokedex
db_list = soup.find_all('tr')

for poke_data in db_list:
    poke_content = poke_data.contents
    pokedex.append(
        {
            "ID":poke_content[1].text,
            "Name":poke_content[3].text,
            "Typings":poke_content[4].text,
            "Stats": 
            {
                "Total":poke_content[6].text,
                "HP":poke_content[8].text,
                "Attack":poke_content[10].text,
                "Defense":poke_content[12].text,
                "Sp. Atk":poke_content[14].text,
                "Sp. Def":poke_content[16].text,
                "Speed":poke_content[18].text
            },
            "Abilities": 
            {
                "ability1":None,
                "ability2":None,
                "hidden_ability":None
            },
            "Evolution_condition":None,
            "Rarity":None,
            "Region": obtainRegionTuple(poke_content[1].text)
            })


#Writing data into a csv file
with open("Pokemon_Database.csv","w",newline='',encoding='utf-8') as file:
    writer=csv.DictWriter(file, fieldnames= ["ID","Name","Typings","Stats","Abilities","Evolution_condition","Rarity","Region"])
    writer.writeheader()
    writer.writerows(pokedex)
