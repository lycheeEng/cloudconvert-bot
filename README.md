# cloudconvert-bot

CloudConvert with Telegram

一个利用 Telegram 和 CloudConvert 开放 api 在线转换格式的机器人。

### How to use?

1. Clone this repo and `cd` into it
2. Use `npm i` install all dependencies
3. Creat a file named as `token.js`, add two lines, and change to your own token:
    ```js
    export let telegram_token = "your_telegram_bot_token"
    export let cloudconvert_token = "your_cloudconvert_token"
    ```
4. Use `node app` run the bot

P.S. 这个机器人目前仅仅是用于转换电子书格式的，因此转换其他文件（非 `document` 类型）会报错，可以在 `app.js` 第 `41` 行自行修改（比如修改成 `audio` 类型，就可以转换音频文件）。（此问题会在以后修复）

如以上所言，需求单一，会有很多 **edge cases** 没有考虑到。欢迎提 issue，一起来造轮子呀。

### References
- [telegraf.js - v4.6.0 docs](https://telegraf.js.org/modules.html)
- [KnorpelSenf/cloudconvert-bot](https://github.com/KnorpelSenf/cloudconvert-bot)
- [cloudconvert/cloudconvert-node](https://github.com/cloudconvert/cloudconvert-node)
