# doc

baseUrl: <http://localhost:9527/api>

## 1. last block lists

method: GET
url: /block/last_block
params: 
| name | type |  require|default   |description
| :----:| :----:   | :----:  | :----: |  :----: |
| row | number|no |  1 | rows from last block |

## 2. target block lists

method: GET
url: /block/list1
params: 

| name | type |  require|default   |description
| :----:| :----:   | :----:  | :----: |  :----: |
| start | number|yes |  1 | block num |
| row | number|yes |  1 | rows from target block |
## 3.era

method: GET
url: /era

## 4.network_overview

method: GET
url: /network_overview
## 5.account

method: POST
url: /account
body:
| name | type |  require|default   |description
| :----:| :----:   | :----:  | :----: |  :----: |
| accounts | object[]|yes |   | 从/api/era获取到的accounts数据 [{"address": "5DvTCFuPUXb6Vzg5NB4mFu3Hz95GUqXTMLXib66e4KhF9wxW","role": 1,"accountType": 1},] |










