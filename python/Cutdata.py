# -*- coding: utf-8 -*-
"""
Created on Sat Jul 11 10:44:51 2020

@author: 陳鈺升
"""

"""
花蓮縣秀林鄉和仁村台9線164公里700公尺處南向外側車道

我只要把他切成
county：花蓮縣
township：秀林鄉
street：台九線
detail：花蓮縣秀林鄉和仁村台9線164公里700公尺處南向外側車道
"""


import pandas as pd

INFILE = "A1.csv"
OUTFILE = "data"+INFILE

initcols = ["發生時間","發生地點","經度","緯度"]
newcols = ['county','township','street','except','multiroad']
countrys = ["臺北市", "新北市", "基隆市", "桃園市", "新竹市", "新竹縣", "苗栗縣", "臺中市", "彰化縣", "雲林縣", "南投縣", "嘉義市", "嘉義縣", "臺南市", "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "台東縣", "澎湖縣"]
times = ["年", "月", "日", "時", "分"]
town = ["市", "縣", "鄉", "鎮", "區", "村", "里"]
street = ["路", "街", "段", "巷", "弄", "道", "線"]
""" cut the place into serveral cols"""

df = pd.read_csv(INFILE)[initcols].dropna()

# add empty cols
for col in newcols:
    df[col] = ""
    
#%%
# breakdown the strings
import re

for i,placestr in enumerate(df["發生地點"]):
    print("--------------------------------")
    print(placestr)
    
    if re.match(r"(.*/.*)",placestr):
        # Intersection
        #df['multiroad'][i] = 1       
        continue
    
    # county
    cty = re.findall(r"(..[市縣])",placestr)
    #df["county"][i] = cty[0]
    placestr = re.sub(cty[0], "", placestr)
    print(placestr)
    
    # township
    twn = re.findall(r"(.{1,4}[市縣鄉鎮區])",placestr)
    #df["township"][i] = twn[0]
    placestr = re.sub(twn[0], "", placestr)
    print(twn)
    
    # kill sub-town
    subtwn = re.findall(r"(.{1,4}[村里])",placestr)
    placestr = re.sub(subtwn[0], "", placestr)
    print(subtwn)
    
    # street
    st = re.findall(r"(.{1,5}[路街段巷弄道線])",placestr)
    if len(st)>=2:
        # Intersection
        #df['multiroad'][i] = 1       
        continue
    
    #df["street"][i] = st[0]
    
    print("--------------------------------")
    
    
    
    










#%%
"""
宜蘭縣宜蘭市191縣道路東側 / 宜蘭縣宜蘭市黎明路口
['宜蘭縣', '宜蘭市', '91縣', '宜蘭縣', '宜蘭市']
"""
