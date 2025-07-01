# local-market-tax-system
```
local-market-tax-system
├─ backend
│  ├─ requirements.txt
│  └─ taxbackend
│     ├─ manage.py
│     ├─ taxbackend
│     │  ├─ asgi.py
│     │  ├─ settings.py
│     │  ├─ urls.py
│     │  ├─ wsgi.py
│     │  └─ __init__.py
│     └─ tax_api
│        ├─ admin.py
│        ├─ migrations
│        │  ├─ 0001_initial.py
│        │  ├─ 0002_remove_user_is_vendor_user_role.py
│        │  └─ __init__.py
│        ├─ models.py
│        ├─ permissions.py
│        ├─ serializers.py
│        ├─ templates
│        │  └─ emails
│        ├─ tests.py
│        ├─ urls.py
│        ├─ views.py
│        └─ __init__.py
├─ docs
├─ frontend
│  ├─ package.json
│  └─ tax-collection-ui
│     ├─ package-lock.json
│     ├─ package.json
│     ├─ public
│     │  ├─ auth.jpg
│     │  ├─ chart.png
│     │  ├─ favicon.ico
│     │  ├─ hero.png
│     │  ├─ icon.png
│     │  ├─ index.html
│     │  ├─ logo.png
│     │  ├─ logo192.png
│     │  ├─ logo512.png
│     │  ├─ manifest.json
│     │  ├─ market-illustration.jpg
│     │  └─ robots.txt
│     ├─ README.md
│     └─ src
│        ├─ App.css
│        ├─ App.js
│        ├─ App.test.js
│        ├─ components
│        │  ├─ Footer.jsx
│        │  ├─ Header.jsx
│        │  ├─ LoginForm.jsx
│        │  ├─ MainLayout.jsx
│        │  └─ RegisterForm.jsx
│        ├─ contexts
│        │  └─ AuthContext.jsx
│        ├─ custom.css
│        ├─ custom.scss
│        ├─ features
│        │  └─ auth
│        │     └─ AuthForm.jsx
│        ├─ index.css
│        ├─ index.js
│        ├─ logo.svg
│        ├─ pages
│        │  ├─ AdminDashboard.jsx
│        │  ├─ Dashboard.jsx
│        │  ├─ Home.jsx
│        │  ├─ Login.jsx
│        │  ├─ NotFound.jsx
│        │  ├─ Register.jsx
│        │  ├─ SuperAdminDashboard.jsx
│        │  └─ VendorDashboard.jsx
│        ├─ reportWebVitals.js
│        ├─ routes
│        │  └─ PrivateRoute.jsx
│        ├─ services
│        │  ├─ api.js
│        │  └─ AuthService.js
│        └─ setupTests.js
├─ LICENSE
├─ package-lock.json
├─ package.json
└─ README.md

```
```
local-market-tax-system
├─ backend
│  ├─ db.sqlite3
│  ├─ requirements.txt
│  └─ taxbackend
│     ├─ manage.py
│     ├─ Procfile
│     ├─ taxbackend
│     │  ├─ asgi.py
│     │  ├─ settings.py
│     │  ├─ urls.py
│     │  ├─ wsgi.py
│     │  └─ __init__.py
│     └─ tax_api
│        ├─ admin.py
│        ├─ migrations
│        │  ├─ 0001_initial.py
│        │  ├─ 0002_remove_user_is_vendor_user_role.py
│        │  ├─ 0003_alter_user_is_superuser.py
│        │  ├─ 0004_alter_user_managers_alter_user_business_type_and_more.py
│        │  ├─ 0005_alter_user_managers_alter_user_business_type_and_more.py
│        │  ├─ 0006_alter_user_is_superuser_alter_user_role.py
│        │  ├─ 0007_alter_user_national_id.py
│        │  └─ __init__.py
│        ├─ models.py
│        ├─ permissions.py
│        ├─ serializers.py
│        ├─ static
│        │  ├─ asset-manifest.json
│        │  ├─ auth.jpg
│        │  ├─ chart.png
│        │  ├─ favicon.ico
│        │  ├─ hero.png
│        │  ├─ icon.png
│        │  ├─ index.html
│        │  ├─ logo.png
│        │  ├─ logo192.png
│        │  ├─ logo512.png
│        │  ├─ manifest.json
│        │  ├─ market-illustration.jpg
│        │  ├─ robots.txt
│        │  └─ static
│        │     ├─ css
│        │     │  ├─ main.6235e4ff.css
│        │     │  └─ main.6235e4ff.css.map
│        │     ├─ js
│        │     │  ├─ main.ebec7c69.js
│        │     │  ├─ main.ebec7c69.js.LICENSE.txt
│        │     │  └─ main.ebec7c69.js.map
│        │     └─ media
│        │        ├─ bootstrap-icons.1295669cd4e305c97f2c.woff
│        │        └─ bootstrap-icons.92ea18a81d737146ff04.woff2
│        ├─ templates
│        │  └─ emails
│        ├─ tests.py
│        ├─ urls.py
│        ├─ views.py
│        └─ __init__.py
├─ docs
├─ frontend
│  ├─ package-lock.json
│  ├─ package.json
│  └─ tax-collection-ui
│     ├─ package-lock.json
│     ├─ package.json
│     ├─ public
│     │  ├─ auth.jpg
│     │  ├─ chart.png
│     │  ├─ favicon.ico
│     │  ├─ hero.png
│     │  ├─ icon.png
│     │  ├─ index.html
│     │  ├─ logo.png
│     │  ├─ logo192.png
│     │  ├─ logo512.png
│     │  ├─ manifest.json
│     │  ├─ market-illustration.jpg
│     │  └─ robots.txt
│     ├─ README.md
│     └─ src
│        ├─ App.css
│        ├─ App.js
│        ├─ App.test.js
│        ├─ components
│        │  ├─ Footer.jsx
│        │  ├─ Header.jsx
│        │  ├─ LoginForm.jsx
│        │  ├─ MainLayout.jsx
│        │  └─ RegisterForm.jsx
│        ├─ contexts
│        │  └─ AuthContext.jsx
│        ├─ custom.css
│        ├─ custom.scss
│        ├─ features
│        │  └─ auth
│        │     └─ AuthForm.jsx
│        ├─ index.css
│        ├─ index.js
│        ├─ logo.svg
│        ├─ pages
│        │  ├─ AdminDashboard.jsx
│        │  ├─ Dashboard.jsx
│        │  ├─ Home.jsx
│        │  ├─ Login.jsx
│        │  ├─ NotFound.jsx
│        │  ├─ Register.jsx
│        │  ├─ SuperAdminDashboard.jsx
│        │  └─ VendorDashboard.jsx
│        ├─ reportWebVitals.js
│        ├─ routes
│        │  └─ PrivateRoute.jsx
│        ├─ services
│        │  ├─ api.js
│        │  └─ AuthService.js
│        └─ setupTests.js
├─ LICENSE
├─ package-lock.json
├─ package.json
├─ README.md
└─ render.yaml

```
```
local-market-tax-system
├─ backend
│  ├─ requirements.txt
│  └─ taxbackend
│     ├─ manage.py
│     ├─ Procfile
│     ├─ taxbackend
│     │  ├─ asgi.py
│     │  ├─ settings.py
│     │  ├─ urls.py
│     │  ├─ wsgi.py
│     │  └─ __init__.py
│     └─ tax_api
│        ├─ admin.py
│        ├─ migrations
│        │  ├─ 0001_initial.py
│        │  ├─ 0002_remove_user_is_vendor_user_role.py
│        │  ├─ 0003_alter_user_is_superuser.py
│        │  ├─ 0004_alter_user_managers_alter_user_business_type_and_more.py
│        │  ├─ 0005_alter_user_managers_alter_user_business_type_and_more.py
│        │  ├─ 0006_alter_user_is_superuser_alter_user_role.py
│        │  ├─ 0007_alter_user_national_id.py
│        │  ├─ 0008_alter_user_national_id.py
│        │  ├─ 0009_alter_user_national_id.py
│        │  ├─ 0010_alter_user_national_id.py
│        │  ├─ 0011_paymenttransaction.py
│        │  ├─ 0012_user_market_of_operation.py
│        │  └─ __init__.py
│        ├─ models.py
│        ├─ mpesa
│        │  ├─ callback.py
│        │  ├─ client.py
│        │  ├─ urls.py
│        │  ├─ utils.py
│        │  ├─ views.py
│        │  └─ __init__.py
│        ├─ permissions.py
│        ├─ serializers.py
│        ├─ static
│        │  ├─ asset-manifest.json
│        │  ├─ auth.jpg
│        │  ├─ chart.png
│        │  ├─ favicon.ico
│        │  ├─ hero.png
│        │  ├─ icon.png
│        │  ├─ index.html
│        │  ├─ logo.png
│        │  ├─ logo192.png
│        │  ├─ logo512.png
│        │  ├─ manifest.json
│        │  ├─ market-illustration.jpg
│        │  ├─ robots.txt
│        │  └─ static
│        │     ├─ css
│        │     │  ├─ main.6235e4ff.css
│        │     │  └─ main.6235e4ff.css.map
│        │     ├─ js
│        │     │  ├─ main.ebec7c69.js
│        │     │  ├─ main.ebec7c69.js.LICENSE.txt
│        │     │  └─ main.ebec7c69.js.map
│        │     └─ media
│        │        ├─ bootstrap-icons.1295669cd4e305c97f2c.woff
│        │        └─ bootstrap-icons.92ea18a81d737146ff04.woff2
│        ├─ templates
│        │  └─ emails
│        ├─ tests.py
│        ├─ urls.py
│        ├─ views.py
│        └─ __init__.py
├─ docs
├─ frontend
│  ├─ package-lock.json
│  ├─ package.json
│  └─ tax-collection-ui
│     ├─ package-lock.json
│     ├─ package.json
│     ├─ public
│     │  ├─ auth.jpg
│     │  ├─ chart.png
│     │  ├─ favicon.ico
│     │  ├─ hero.png
│     │  ├─ icon.png
│     │  ├─ index.html
│     │  ├─ logo.png
│     │  ├─ logo192.png
│     │  ├─ logo512.png
│     │  ├─ manifest.json
│     │  ├─ market-illustration.jpg
│     │  ├─ robots.txt
│     │  └─ username.png
│     ├─ README.md
│     └─ src
│        ├─ App.css
│        ├─ App.js
│        ├─ App.test.js
│        ├─ components
│        │  ├─ Footer.jsx
│        │  ├─ Header.jsx
│        │  ├─ LoginForm.jsx
│        │  ├─ MainLayout.jsx
│        │  ├─ PaymentForm.jsx
│        │  ├─ PaymentModal.jsx
│        │  └─ RegisterForm.jsx
│        ├─ contexts
│        │  └─ AuthContext.jsx
│        ├─ custom.css
│        ├─ custom.scss
│        ├─ features
│        │  └─ auth
│        │     └─ AuthForm.jsx
│        ├─ index.css
│        ├─ index.js
│        ├─ logo.svg
│        ├─ pages
│        │  ├─ AdminDashboard.jsx
│        │  ├─ Dashboard.jsx
│        │  ├─ Home.jsx
│        │  ├─ Login.jsx
│        │  ├─ NotFound.jsx
│        │  ├─ Register.jsx
│        │  └─ VendorDashboard.jsx
│        ├─ reportWebVitals.js
│        ├─ routes
│        │  └─ PrivateRoute.jsx
│        ├─ services
│        │  ├─ api.js
│        │  ├─ AuthService.js
│        │  └─ mpesaService.js
│        └─ setupTests.js
├─ LICENSE
├─ package-lock.json
├─ package.json
├─ README.md
└─ render.yaml

```
```
local-market-tax-system
├─ backend
│  ├─ requirements.txt
│  └─ taxbackend
│     ├─ manage.py
│     ├─ Procfile
│     ├─ stk.py
│     ├─ taxbackend
│     │  ├─ asgi.py
│     │  ├─ settings.py
│     │  ├─ urls.py
│     │  ├─ wsgi.py
│     │  └─ __init__.py
│     └─ tax_api
│        ├─ admin.py
│        ├─ migrations
│        │  ├─ 0001_initial.py
│        │  ├─ 0002_remove_user_is_vendor_user_role.py
│        │  ├─ 0003_alter_user_is_superuser.py
│        │  ├─ 0004_alter_user_managers_alter_user_business_type_and_more.py
│        │  ├─ 0005_alter_user_managers_alter_user_business_type_and_more.py
│        │  ├─ 0006_alter_user_is_superuser_alter_user_role.py
│        │  ├─ 0007_alter_user_national_id.py
│        │  ├─ 0008_alter_user_national_id.py
│        │  ├─ 0009_alter_user_national_id.py
│        │  ├─ 0010_alter_user_national_id.py
│        │  ├─ 0011_paymenttransaction.py
│        │  ├─ 0012_user_market_of_operation.py
│        │  └─ __init__.py
│        ├─ models.py
│        ├─ mpesa
│        │  ├─ callback.py
│        │  ├─ client.py
│        │  ├─ urls.py
│        │  ├─ utils.py
│        │  ├─ views.py
│        │  └─ __init__.py
│        ├─ permissions.py
│        ├─ serializers.py
│        ├─ static
│        │  ├─ asset-manifest.json
│        │  ├─ auth.jpg
│        │  ├─ chart.png
│        │  ├─ favicon.ico
│        │  ├─ hero.png
│        │  ├─ icon.png
│        │  ├─ index.html
│        │  ├─ logo.png
│        │  ├─ logo192.png
│        │  ├─ logo512.png
│        │  ├─ manifest.json
│        │  ├─ market-illustration.jpg
│        │  ├─ robots.txt
│        │  └─ static
│        │     ├─ css
│        │     │  ├─ main.6235e4ff.css
│        │     │  └─ main.6235e4ff.css.map
│        │     ├─ js
│        │     │  ├─ main.ebec7c69.js
│        │     │  ├─ main.ebec7c69.js.LICENSE.txt
│        │     │  └─ main.ebec7c69.js.map
│        │     └─ media
│        │        ├─ bootstrap-icons.1295669cd4e305c97f2c.woff
│        │        └─ bootstrap-icons.92ea18a81d737146ff04.woff2
│        ├─ templates
│        │  └─ emails
│        ├─ tests.py
│        ├─ urls.py
│        ├─ views.py
│        └─ __init__.py
├─ docs
├─ frontend
│  ├─ package-lock.json
│  ├─ package.json
│  └─ tax-collection-ui
│     ├─ package-lock.json
│     ├─ package.json
│     ├─ public
│     │  ├─ auth.jpg
│     │  ├─ chart.png
│     │  ├─ favicon.ico
│     │  ├─ hero.png
│     │  ├─ icon.png
│     │  ├─ index.html
│     │  ├─ logo.png
│     │  ├─ logo192.png
│     │  ├─ logo512.png
│     │  ├─ M-PESA_LOGO-01.svg
│     │  ├─ manifest.json
│     │  ├─ market-illustration.jpg
│     │  ├─ robots.txt
│     │  └─ username.png
│     ├─ README.md
│     └─ src
│        ├─ App.css
│        ├─ App.js
│        ├─ App.test.js
│        ├─ components
│        │  ├─ Footer.jsx
│        │  ├─ Header.jsx
│        │  ├─ LoginForm.jsx
│        │  ├─ MainLayout.jsx
│        │  ├─ PaymentForm.jsx
│        │  ├─ PaymentModal.jsx
│        │  └─ RegisterForm.jsx
│        ├─ contexts
│        │  └─ AuthContext.jsx
│        ├─ custom.css
│        ├─ custom.scss
│        ├─ features
│        │  └─ auth
│        │     └─ AuthForm.jsx
│        ├─ index.css
│        ├─ index.js
│        ├─ logo.svg
│        ├─ pages
│        │  ├─ AdminDashboard.jsx
│        │  ├─ Dashboard.jsx
│        │  ├─ Home.jsx
│        │  ├─ Login.jsx
│        │  ├─ NotFound.jsx
│        │  ├─ Register.jsx
│        │  └─ VendorDashboard.jsx
│        ├─ reportWebVitals.js
│        ├─ routes
│        │  └─ PrivateRoute.jsx
│        ├─ services
│        │  ├─ api.js
│        │  ├─ AuthService.js
│        │  └─ mpesaService.js
│        └─ setupTests.js
├─ LICENSE
├─ package-lock.json
├─ package.json
├─ README.md
└─ render.yaml

```