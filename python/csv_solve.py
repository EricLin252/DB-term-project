# -*- coding: utf-8 -*-
import sys
import csv

if len(sys.argv) != 1:
	print(filename error)
	sys.exit(1)

try:
	infile = open(sys.argv[0], newline="")
except IOError:
	print("con not find file")
	sys.exit(1)

out = "data_" + sys.argv[0]

outfile = open(out, 'w', newline="")
rows = csv.reader(infile)
writer = csv.writer(outfile)

utflen = 3
countys = ["臺北市", "新北市", "基隆市", "桃園市", "新竹市", "新竹縣", "苗栗縣", "臺中市", "彰化縣", "雲林縣", "南投縣", "嘉義市", "嘉義縣", "臺南市", "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "台東縣", "澎湖縣"]
times = ["年", "月", "日", "時", "分"]
townstreet = ["市", "縣", "鄉", "鎮", "區", "村", "路", "街", "段", "巷", "弄", "道", "線"]


for row in rows:
	if len(row) < 4:
		break

	#column 0: time
	for r in times:
		row[0] = row[0].replace(r, " ")
	row[0] = row[0].split()

	#column 1: position
	county = row[1][:3*utflen]
	row[1].replace(county, "")
	tslist = []
	for ts in townstreet:
		tsp = 0
		while True:
			tsp = row[1].find(ts, tsp+utflen)
			if tsp == -1:
				break
			tslist.append(tsp)
	tslist.sort()

	start = 0
	tsdict = {}
	for p in tslist:
		ss = row[0]

	writer.writerow(array)

infile.close()
outfile.close()
