# Read fom a csv file
len_6 = {}

# Open the file
with open('legendas.csv', 'r') as file:
	for line in file:
		list = line.split(',')
		if list[1].startswith('Ba'):
			if len(list[1]) <= 7:
				len_6["less"] = len_6.get("less", 0) + 1
			if len(list[1]) > 7:
				len_6["more"] = len_6.get("more", 0) + 1
			

print(len_6)