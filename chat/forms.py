from django.forms import ModelForm
from chat.models import Chatter
from django.contrib.auth.models import User

class ProfileUserForm(ModelForm):
    class Meta:
        model = User
        fields = '__all__'

class ProfileChatterForm(ModelForm):
    class Meta:
        model = Chatter
        fields = '__all__'