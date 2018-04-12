from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from .models import gameState
import json
from django.utils import timezone

# Create your views here.


def index(request):
    return render(request, "game/index.html")


def importstates(request):
    states_query = gameState.objects.order_by('title')
    states = []

    for state in states_query:
        states.append(state.toDict())
    return JsonResponse({'states': states, })


def savestate(request):
    data = json.loads(request.body)
    new_state = gameState()
    new_state.title = data['title']
    new_state.alignmentRadius = data['alignmentRadius']
    new_state.alignmentWeight = data['alignmentWeight']
    new_state.avoidanceRadius = data['avoidanceRadius']
    new_state.avoidanceWeight = data['avoidanceWeight']
    new_state.cohesionRadius = data['cohesionRadius']
    new_state.cohesionWeight = data['cohesionWeight']
    new_state.save()
    return HttpResponse('{}')