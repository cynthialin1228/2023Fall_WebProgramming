# Web Programming HW#1
### 1. Add your .env to backend
    PORT=8000
    MONGO_URL= (replace your mongodb here, ex:mongodb+srv......)

### 2. At terminal:
1. cd backend
2. yarn dev

### 3. Double click index.html in frontend
##### Main page:
* press 新增日記卡 to enter create page
* press the added diary to edit it directly.
* if there are diaries exist, you can try the "filter by tag" function below the 新增日記卡 button
##### Create page:
* can edit the date and also check whether the date is valid
* add description
* choose 類別 and 心情
    * if you want to add a new 類別/心情，remember to press the "Add XX" button, and click it when it is added to list.
    * finished all input, click "儲存" and go to browse page
    * if you don't want to keep this diary, ckick "取消“ and go back to the main page.
##### Browse page:
* press 編輯模式 to edit the specific diary
##### Edit page:
* remember to choose taggs for 類別, and tag2 for 心情.
* click "儲存" save edits and go to browse page
* click "回瀏覽模式“ to save no modificatioins and go to browse page
* click "回首頁" to go back to the main page.
    
    