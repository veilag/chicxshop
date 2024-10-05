from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.shortcuts import render, redirect


def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect(request.META['HTTP_REFERER'])

        else:
            return redirect("/")


def logout_view(request):
    logout(request)
    return redirect(request.META['HTTP_REFERER'])


def signup_view(request):
    username = request.POST.get("username")
    email = request.POST.get("email")
    password = request.POST.get("password")

    try:
        user_in_db = User.objects.get(email=email)
        if user_in_db:
            return redirect("/")

    except:
        try:
            User.objects.create_user(
                username=username,
                email=email,
                password=password
            )

            user = authenticate(username=username, password=password)
            login(request, user)

            return redirect(request.META['HTTP_REFERER'])

        except IntegrityError:
            return redirect("/")
