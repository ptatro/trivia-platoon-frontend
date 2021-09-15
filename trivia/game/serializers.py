from rest_framework.serializers import ModelSerializer
from .models import Game, Result, Question, Answer

class ResultsSerializer(ModelSerializer):
    class Meta:
        model = Result
        fields = ['id', 'score', 'rating','player']

class AnswersSerializer(ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id','text','correct']

class GamesSerializer(ModelSerializer):
    class Meta:
        model = Game
        fields = ['id','name','image','description','category','creator']

class QuestionsSerializer(ModelSerializer):
    answer = AnswersSerializer(many=True, read_only=True)
    game = GamesSerializer(read_only=True)
    class Meta:
        model = Question
        fields = ['id','questionText','type','answer','game']
    # def create(self, validated_data):
    #     instance.game = self.context['request'].query_params['game_pk']
    #     instance.save()

