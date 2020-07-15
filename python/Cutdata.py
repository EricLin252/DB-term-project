# -*- coding: utf-8 -*-
"""
Created on Sat Jul 11 15:27:55 2020

@author: JEFF
"""

import numpy as np
import pandas as pd
import re
import datetime

data_109 = pd.read_csv('109_A2.csv')
data_108 = pd.read_csv('108_A2.csv')
data_109 = data_109.iloc[:-2,:]
data_108 = data_108.iloc[:-2,:]

data = pd.concat([data_108, data_109])
data['oldIndex'] = data.index
data = data.reset_index(drop=True)
data = data.reset_index()
#%%
data['data_id'] = [str(data.發生時間[x][2]) +'2'+ str(data.oldIndex[x]).zfill(6) for x in data.index]
#%%
data.rename(columns={'發生地點':'detail', '車種':'category', 'index':'uid'}, inplace=True)
# fucking_data = ['臺東縣臺東市東45 12公里附近']
# data = data[~data.detial.isin(fucking_data)]

data['category']= data['category'].str.split(";")

# create datetime column and change format
replace_date = {'年':'-','月':'-',"日":'',"時":':',"分":':',"秒":'',"109":"2020", "108":"2019"}
data['datetime'] = data['發生時間'].replace(replace_date, regex=True)
data['county'] = [re.search(r'^..[市縣]', str(x)).group() for x in data['detail']]
data['township'] = [re.search(r"(?<=...).{1,3}[區市鎮鄉]", str(x)).group() for x in data['detail']]
data['street'] = [re.findall("(?:(?:^..[市縣].{1,3}(?:(?<!區))+[鄉鎮市區])(?:.{1,3}(?:(?<!公))+[村里]"
                             "|.*?)(國道.號|省道.*線|區道.*線|市道.*線|.{1,4}[路段線街道巷]).*\s\/\s)"
                             "(?:(?:..[市縣].{1,3}(?:(?<!區))+[鄉鎮市區])(?:.{1,3}(?:(?<!公))+[村里]|"
                             ".*?)(國道.號|省道.*線|區道.*線|市道.*線|.{1,5}[路段線街道巷]))|(?:(?:^.."
                             "[市縣].{1,3}(?:(?<!區))+[鄉鎮市區])(?:.{1,3}(?:(?<!公))+[村里]|.??)(?:"
                             "(國道.號|省道.*線|區道.*線|市道.*線|.{1,5}(?:(?<!電))+[路段線街道巷])|.*(台"
                             ".線))(?:.*與(.{1,5}[路段線街道巷])|.*?))", str(x)) for x in data['detail']]
data['death'] = [int(re.search(r'^死亡(.*);受傷(.*)', str(x)).group(1)) for x in data['死亡受傷人數']]
data['injured'] = [int(re.search(r'^死亡(.*);受傷(.*)', str(x)).group(2)) for x in data['死亡受傷人數']]

#%% handle vehicle_a1 table
vehicle_a1 = data[['data_id','category']]
vehicle_a1 = vehicle_a1.explode('category')
vehicle_a1 = vehicle_a1.reset_index(drop=True)

#%% handle pos_a1 table
pos_a1 = data[['data_id','county','township','street','detail']]
for idx, x in enumerate(pos_a1['street']):
    if(len(x)==0): continue
    else:
        temp = list(filter(None, list(x[0])))
        pos_a1.at[idx, 'street'] = temp
pos_a1 = pos_a1.explode('street')
pos_a1 = pos_a1.reset_index(drop=True)

#%% handle data_a1 table
data_a1 = data[['data_id','datetime','death','injured']]
#%%
vehicle_a1.to_csv("vehicle_a2.csv")
#%%
pos_a1.to_csv("pos_a2.csv")
data_a1.to_csv("data_a2.csv",index=False)