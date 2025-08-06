from rest_framework import serializers
from .models import Acta, Compromiso, Gestion

class GestionListSerializer(serializers.ModelSerializer):
    usuario_email = serializers.CharField(source='usuario.email', read_only=True)
    
    class Meta:
        model = Gestion
        fields = ['id', 'descripcion', 'archivo', 'fecha', 'usuario_email']

class CompromisoSerializer(serializers.ModelSerializer):
    gestiones = GestionListSerializer(many=True, read_only=True)
    
    class Meta:
        model = Compromiso
        fields = ['id', 'descripcion', 'responsable', 'fecha_limite', 'gestiones']

class ActaListSerializer(serializers.ModelSerializer):
    compromisos_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Acta
        fields = ['id', 'titulo', 'estado', 'fecha', 'compromisos_count']
    
    def get_compromisos_count(self, obj):
        return obj.compromisos.count()

class ActaDetailSerializer(serializers.ModelSerializer):
    compromisos = CompromisoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Acta
        fields = ['id', 'titulo', 'estado', 'fecha', 'pdf', 'compromisos']

class GestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gestion
        fields = ['compromiso', 'descripcion', 'archivo']
        
    def create(self, validated_data):
        validated_data['usuario'] = self.context['request'].user
        # La fecha se asigna automáticamente por el modelo (auto_now_add=True)
        return super().create(validated_data)