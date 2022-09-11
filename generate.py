import json
import random
import subprocess

def newPrefix():
    pref = {
        1:[0,3,9],
        2:[0,2,4,7,8,9],
        3:[0,1,3,4,5,6,7,8,9],
        4:[0,1,2,3,5,6,7,8,9],
        6:[0,1,2,3,6,8],
        7:[0,3,7],
        8:[0,3,5,8,9],
        9:[0,1,2,3,7]
    }
    sep = ["", "-", " "]
    
    k = random.choice(list(pref.keys()))
    return "3" + str(k) + str(random.choice(pref[k])) + random.choice(sep)


def newPhone():
    num = newPrefix()
    for i in range(7):
        num += str(random.randint(0,9))
    return num


def newDoB(minAge, maxAge):
    return "{:02}/{:02}/{}".format(
        random.randint(1,28),
        random.randint(1,12),
        2022-random.randint(minAge,maxAge)
    )


def newEmail():
    dom = {"com": ["gmail","protonmail","outlook",
                   "hotmail","yahoo","zoho","aol",
                   "gmx","icloud","yandex"],
           "it" : ["alice","libero","poste"]}
    k = random.choice(list(dom.keys()))
    
    return "{}.{}{}@{}.{}".format(
        person["name"].lower(), person["surname"].lower(),
        person["dob"][-2:], random.choice(dom[k]), k)


def jsonParse(filepath, encoding):
    f = open(filepath, encoding=encoding)
    data = json.load(f)
    return data


def newPostcode(pRange):
    pRange = [int(s) for s in pRange.split("-")]
    return "{:05}".format(
        random.randint(pRange[0],pRange[1])
    )


def runScraper(filename):
    args = ("node .\\scraping\\"+filename+".js").split(" ")
    p = subprocess.Popen(args)
    p.wait()


runScraper("main-nomi")
runScraper("main-cognomi")
runScraper("main-comuni")

person = {}

data = jsonParse("data/nomi.json", "utf-8")
gender = "M" if random.random() < 0.5 else "F"
person["name"] = random.choice(data[gender])

data = jsonParse("data/cognomi.json", "utf-8")
person["surname"] = random.choice(data)

data = jsonParse("data/comuni.json", "ISO-8859-1")
data = random.choice(data).split(":")
person["postcode"] = data[0] if "-" not in data[0] \
                             else newPostcode(data[0])
person["city"] = data[1]
person["dob"] = newDoB(14,60)
person["email"] = newEmail()
person["phone"] = newPhone()

print("\n", person, sep='')