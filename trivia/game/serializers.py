from rest_framework.serializers import ModelSerializer
from .models import Game, Result, Question, Answer

class ResultsSerializer(ModelSerializer):
    class Meta:
        model = Result
        fields = ["id", "score", "rating", "player"]

    def create(self, validated_data):
        game = Game.objects.get(pk=self.context["game_pk"])
        question = Result.objects.create(game=game, **validated_data)
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
        
    def update(self, instance, validated_data):
        instance.questionText = validated_data.get('questionText', instance.questionText)
        instance.type = validated_data.get('type', instance.type)
        instance.save()
        return instance