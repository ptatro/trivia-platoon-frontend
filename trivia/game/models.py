from django.db import models
from django.contrib.auth.models import User

class Game(models.Model):
    name = models.CharField(max_length=255)
    image = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=255)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="games")

class Question(models.Model):
    questionText = models.TextField()
    type = models.CharField(max_length=255)
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="questions")

class Result(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="results")
    player = models.ForeignKey(User, on_delete=models.CASCADE, related_name="results")
    score = models.IntegerField(default=0)
    rating = models.IntegerField(null=True, blank=True)

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="answers")
    text = models.CharField(max_length=255)
    correct = models.BooleanField()

#api/games/
#api/games/2/results
#api/games/2/questions
