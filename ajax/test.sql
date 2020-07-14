-- 新竹地區內，各月份總事故數量
SELECT month, COUNT(*) as cnt
FROM data_a1 as D, pos_a1 as P
WHERE D.uid = P.data_id AND YEAR(D.datetime) = '109' AND P.county = '新竹市'
GROUP BY MONTH(D.datetime) as month;

-- 新竹地區內，各交通工具種類事故數量
SELECT V.category, COUNT(*) as cnt
FROM data_a1 as D, pos_a1 as P, vehicle_a1 as V
WHERE D.uid = P.data_id AND P.data_id = V.data_id AND P.county = '新竹市'
GROUP BY V.category, V.data_id;