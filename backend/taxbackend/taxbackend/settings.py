import os
from pathlib import Path
from datetime import timedelta
import os
import dj_database_url
from dotenv import load_dotenv

load_dotenv() 

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

#Static files
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-+bqq=^ku^zj9gn!sgqhex^+@2eqe^9i13jji62mfek6i&gmz-m'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
    # Default Django apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',

    # Your apps
    'tax_api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware', 
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'taxbackend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'taxbackend.wsgi.application'

# Database
if os.getenv('RENDER', False):
 DATABASES = {
    'default': dj_database_url.config(default=os.getenv('DATABASE_URL'),conn_max_age=600,
        ssl_require=True )
 }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'lmtdb',
            'USER': 'postgres',
            'PASSWORD': 'KIM JONG-UN',
            'HOST': 'localhost',
            'PORT': '5432',
        }
    }


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom User Model
AUTH_USER_MODEL = 'tax_api.User'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    # Change from IsAuthenticated to AllowAny for public endpoints
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',  # Changed from IsAuthenticated
    )
}

# JWT settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}
CORS_ALLOW_ALL_ORIGINS = False 

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000", 
    "https://local-market-tax-system-frontend.onrender.com",
    "https://local-market-tax-system-7fuw.onrender.com"
]


CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "https://local-market-tax-system-frontend.onrender.com",
    "https://local-market-tax-system-7fuw.onrender.com"
]

MPESA_CONSUMER_KEY = os.getenv('MPESA_CONSUMER_KEY') 
MPESA_CONSUMER_SECRET = os.getenv('MPESA_CONSUMER_SECRET')
MPESA_BUSINESS_SHORTCODE = os.getenv('MPESA_BUSINESS_SHORTCODE')
MPESA_PASSKEY = os.getenv('MPESA_PASSKEY')
MPESA_CALLBACK_URL = os.getenv('MPESA_CALLBACK_URL') 

MPESA_TOKEN_API_URL = os.getenv('MPESA_TOKEN_API_URL')
MPESA_STK_PUSH_URL = os.getenv('MPESA_STK_PUSH_URL')
MPESA_REGISTER_URL = os.getenv('MPESA_REGISTER_URL')
MPESA_SIMULATE_URL = os.getenv('MPESA_SIMULATE_URL')
