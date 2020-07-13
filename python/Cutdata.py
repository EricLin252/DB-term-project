# -*- coding: utf-8 -*-
"""
Created on Sat Jul 11 15:27:55 2020

@author: JEFF
"""

import numpy as np
import pandas as pd
import re
import datetime

data = pd.read_csv('109_A1.csv')
data = data.iloc[:-2,:]
data.rename(columns={'發生地點':'detial'}, inplace=True)
fucking_data = ['臺東縣臺東市東45 12公里附近']
data = data[~data.detial.isin(fucking_data)]
# create datetime column and change format
replace_date = {'年':'-','月':'-',"日":'',"時":':',"分":':',"秒":''}
data['datetime'] = data['發生時間'].replace(replace_date, regex=True)
data['county'] = [re.search(r'^..[市縣]', str(x)).group() for x in data['detial']]
data['township'] = [re.search(r"(?<=...).{1,3}[區市鎮鄉]", str(x)).group() for x in data['detial']]
data['street'] = [re.findall("(?:(?:^..[市縣].{1,3}(?:(?<!區))+[鄉鎮市區])(?:.{1,3}(?:(?<!公))"
                             "+[村里]|.*?)(國道.號|省道.*線|區道.*線|市道.*線|.{1,4}[路段線街道巷])"
                             ".*\s\/\s)(?:(?:..[市縣].{1,3}(?:(?<!區))+[鄉鎮市區])(?:.{1,3}(?:(?<!公))"
                             "+[村里]|.*?)(國道.號|省道.*線|區道.*線|市道.*線|.{1,5}[路段線街道巷]))|(?:("
                             "?:^..[市縣].{1,3}(?:(?<!區))+[鄉鎮市區])(?:.{1,3}(?:(?<!公))+[村里]|.??)"
                             "((?:國道.號|省道.*線|區道.*線|市道.*線|.{1,5}[路段線街道巷])|.*(?:台.線))"
                             "(?:.*與(.{1,5}[路段線街道巷])|.*?))", str(x)) for x in data['detial']]
data['death'] = [int(re.search(r'^死亡(.*);受傷(.*)', str(x)).group(1)) for x in data['死亡受傷人數']]
data['injured'] = [int(re.search(r'^死亡(.*);受傷(.*)', str(x)).group(2)) for x in data['死亡受傷人數']]
#%%