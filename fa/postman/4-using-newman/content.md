امروزه در بسیاری از شرکت‌های بزرگ روند تولید و استقرار یک نرم‌افزار به صورت خودکار و با استفاده از ادغام پیوسته (Continuous Integration) انجام می‌شود. در این فرایند پس از ادغام کدها با repository اصلی تست‌ها به صورت خودکار اجرا می‌شوند تا در زمان کوتاه محصول نرم‌افزاری اعتبارسنجی شود و تمام باگ‌ها و مشکلات  پیدا و برطرف شوند. ابزارهای مختلفی برای انجام این عمل در دسترس است که یکی از محبوب‌ترین آن‌ها ‌‌Jenkins می‌باشد. پیش از این نحوه‌ی ایجاد تست‌های خودکار و اجرای آن‌ها در ابزار پستمن (Postman) را آموختیم. اما برای اجرای تست‌ها در ادغام پیوسته باید آنها را به صورت command line اجرا کنیم. برای این کار از ابزاری به نام نیومن (Newman) استفاده می‌کنیم. 
## نیومن چیست؟
نیومن (Newman) ابزاری رایگان و متن باز است که امکان اجرای مجموعه تست‌های پستمن به صورت command line را فراهم می‌کند. در وبسایت رسمی پستمن، نیومن به عنوان یک command-line collection runner برای پستمن توصیف شده است. 
نیومن به شما این امکان را می‌دهد که مجموعه‌ها (Collections) را مشابه collection runner موجود در پستمن اجرا کنید. این ابزار به راحتی با CI ادغام می‌شود و توسعه دهندگان سیستم پس از هر بار تغییر کد بازخورد سریعی درمورد عملکرد APIها دریافت می‌کنند. پس از این‌که تغییراتی در کد اعمال شده و با repository اصلی ادغام شود، CI مجموعه تست‌ها را توسط نیومن اجرا خواهد کرد. 
تفاوت های اصلی نیومن و collection runner به صورت زیر است:
* نیومن یک افزونه برای پستمن است که باید به صورت مجزا نصب شود.
* نیومن از command line استفاده می‌کند در حالی که collection runner محیط گرافیکی دارد.
* نیومن را می‌توان در فرایند CI استفاده کرد.
## نصب و راه اندازی نیومن 
برای نصب نیومن باید مراحل زیر انجام شوند:
### 1. نصب NodeJS و npm
 Node.js یک محیط اجرایی برای اجرای برنامه‌های JavaScript در سمت سرور است. نیومن ابزاری بر پایه NodeJS می‌باشد و برای نصب آن باید از npm که وظبفه آن مدیریت بسته‌های NodeJS است استفاده شود. بنابراین، برای نصب و راه‌اندازی نیومن نیاز دارید Node.js و npm را روی سیستم خود نصب کنید. 
جهت نصب Node.js به سایت رسمی آن [NodeJS](https://nodejs.org) مراجعه کنید و نسخه‌ای از Node.js که با سیستم عامل شما سازگار است، دانلود و نصب کنید. پس از نصب با استفاده از دستور node -v در comand prompt میتوان از نصب بودن آن اطمینان حاصل کرد. در صورت نمایش ورژن، نصب موفقیت آمیز بوده است.



![Node installation Check](./resources/node-check-istallment.png?raw=true "Node installation Check")


پس از نصب و پیکربندی NodeJS باید از نصب بودن npm اطمینان حاصل کنیم. npm  یا node package manager بستری برای مدیریت پکیج های جاوااسکریپت است. به عبارت دیگر npm این امکان را به برنامه نویسان می‌دهد که پکیج‌های خود را در اختیار سایر برنامه نویسان قرار دهند و یا از پکیج‌های دیگران استفاده کنند. پس از نصب npm،  NodeJS به صورت خودکار نصب خواهد شد. برای اطمینان از نصب صحیح آن میتوان  دستور npm -v را در ترمینال اجرا نمود.


![NPM installation Check](./resources/npm-check-istallment.png?raw=true "NPM installation Check")

### 2. نصب نیومن با استفاده از npm
بعد از نصب  NodeJS و npm ، می‌توانیم با استفاده از دستور زیر نیومن را نصب کنیم:
```
npm install -g newman
```

![Installing Newman](./resources/installing-newman.png?raw=true "Installing Newman")


پس از نصب نیومن با استفاده از دستور `newman -v` از موفقیت آمیز بودن فرایند نصب اطمینان حاصل کنید. همان طور که در تصویر زیر مشاهده می‌کنید باید ورژن نیومن نمایش داده شود.

![Newman installation Check](./resources/newman-check-installment.png?raw=true "Newman installation Check")

## اجرای تست‌ها با استفاده از نیومن 
### اجرای مجموعه‌ها توسط نیومن
پس از نصب نیومن، جهت اجرای تست‌ها به وسیله آن باید از مجموعه (collection) و متغیرهای (Environment) موجود در پستمن export بگیریم. 
به عنوان مثال درخواست دریافت لیست آگهی‌های املاک در سایت دیوار را در نظر بگیرید.
ابتدا در پستمن مجموعه‌ای ایجاد کرده و درون آن درخواست مورد نظر را می‌سازیم. 


![Create Request](./resources/request.png?raw=true "Create Request")

جهت export گرفتن از مجموعه موجود ابتدا روی سه نقطه کنار آن کلیک کرده و گزینه export را انتخاب نمایید. در صفحه نمایش داده شده دو یا سه گزینه را مشاهده خواهید کرد (بسته به نسخه پستمن شما). برای این آموزش ما از پستمن نسخه 10.11.1 استفاده می‌کنیم. گزینه Collection v2.1 که گزینه پیشنهادی پستمن نیز می‌باشد را انتخاب کرده و روی Export را کلیک کنید.

![Export Collection Step 1](./resources/export-collection1.png?raw=true "Export Collection Step 1")

![Export Collection Step 2](./resources/export-collection2.png?raw=true "Export Collection Step 2")

سپس مسیر مورد نظر خود برای ذخیره فایل JSON را مشخص نموده و آن را ذخیره کنید.
از آنجایی که در درخواست ایجاد شده از متغیر استفاده کردیم برای اجرای مجموعه توسط نیومن باید از متغیرها نیز export بگیریم. برای export گرفتن از متغیرها طبق مراحل زیر پیش می‌رویم:
1. روی باتن کنار آن کلیک و گزینه edit را انتخاب می‌کنیم. 

![Export Environment Step 1](./resources/export-environment1.png?raw=true "Export Environment Step 1")

2. سپس باتن سه نقطه را انتخاب کرده و روی گزینه export کلیک می‌کنیم. 

![Export Environment Step 2](./resources/export-environment2.png?raw=true "Export Environment Step 2")

3. مسیر ذخیره سازی آن را مشخص نموده و فایل را ذخیره می‌کنیم.
پس از ذخیره فایل‌ها در command prompt دایرکتوری جاری را به دایرکتوری که فایل‌های مریوطه را در آن ذخیره کردید تغییر دهید. سپس با استفاده از دستور زیر فایل مربوط به مجموعه را توسط نیومن اجرا نمایید.
```
newman run <name of the collection file> -e <name of the environment file>
newman run "Newman Test Collection.postman_collection.json" -e "Divar Environment.postman_environment.json"  
```

![Run Collection Using Newman](./resources/newman-run-collection.png?raw=true "Run Collection Using Newman")

با اجرای دستور بالا نتایج اجرا به صورت زیر در خروجی نمایش داده خواهد شد.

![Newman Result](./resources/newman-result.png?raw=true "Newman Result")

### اجرای assertion در نیومن
collection runner نیومن کاملا مشابه postman collection runner در اجرای مجموعه‌ها می‌باشد و از آنجایی که درخواست‌های پستمن می‌توانند حاوی assertionهای متفاوتی باشند، assertionها در زمانی که اجرای درخواست تکمیل می‌شود، ارزیابی شده و خلاصه اجرای آن‌ها در پایان اجرای تست نمایش داده می‌شود. با افزودن تاییدیه زیر به درخواست موجود و اجرای مجدد آن نتیجه تست به صورت زیر می‌باشد.

![Assertion](./resources/assertion.png?raw=true "Assertion")

![Newman Assertion Result](./resources/newman-assertion-result.png?raw=true "Newman Assertion Result")

### تولید گزارش به وسیله نیومن

تا اینجا می‌دانیم که نیومن می‌تواند مجموعه‌های پستمن را از طریق command line اجرا کرده و گزارش‌هایی را به صورت log نمایش دهد. گاهی اوقات نیاز است تا گزارش‌های موجود را به اشتراک بگذاریم. نیومن قادر است گزارش تست را در قالب html و یا JSON تولید کند. ماژول‌های NodeJS مجزایی جهت تولید این گزارش‌ها موجود می‌باشند که می‌توان با استفاده از دستور زیر آن‌ها را نصب نمود:

```
npm install -g newman-reporter-html
```

![HTML Reporter](./resources/html-reporter.png?raw=true "HTML Reporter")

پس از نصب ماژول مورد نظر با استفاده از دستور زیر می‌توان این گزارش را تولید کرد:
```
newman run <name of the collection file> -e <name of the environment file> -r html
```

![HTML Report](./resources/html-report.png?raw=true "HTML Report")

پس از اجرای این دستور فایلی در دایرکتوری جاری ایجاد می‌شود که به صورت زیر است: 
بخش 1: خلاصه اجرا تست
بخش 2: جزئیات مربوط به هر درخواست به صورت مجزا

![HTML Result](./resources/html-result.png?raw=true "HTML Result")


با تغییر دستور فوق و استفاده از json به جای پارامتر html خروجی به صورت json تولید می‌شود.
