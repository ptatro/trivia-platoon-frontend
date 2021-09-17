from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from .models import Game, Result, Question, Answer
from django.contrib.auth.models import User


class ResultsSerializer(ModelSerializer):
    player = PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Result
        fields = ["id", "score", "rating", "player"]

    def create(self, validated_data):
        game = Game.objects.get(pk=self.context["game_pk"])

        """
        Need to figure out how to get the player ID here. Whether it is passed in the actual request or what not. Might need this passed in from the view as context depending on how we figure that out.
        """

        player = User.objects.get(pk=1)
        question = Result.objects.create(game=game, player=player, **validated_data)
        return question


class AnswersSerializer(ModelSerializer):
    class Meta:
        model = Answer
        fields = ["id", "text", "correct"]


class GamesSerializer(ModelSerializer):
    class Meta:
        model = Game
        fields = ["id", "name", "image", "description", "category", "creator"]


class QuestionsSerializer(ModelSerializer):
    answers = AnswersSerializer(many=True)

    class Meta:
        model = Question
        fields = ["id", "questionText", "type", "answers"]

    def create(self, validated_data):
        print(f"this is the validated data {validated_data}")
        answers_data = validated_data.pop('answers')
        game_pk = self.context["game_pk"]
        question = Question.objects.create(
            game=Game.objects.get(pk=game_pk), **validated_data
        )
        for answer_data in answers_data:
            Answer.objects.create(question=question, **answer_data)

        return question
