from django.db import models

class gameState(models.Model):
    title = models.CharField(max_length=200)
    alignmentRadius = models.IntegerField()
    alignmentWeight = models.FloatField()
    avoidanceRadius = models.IntegerField()
    avoidanceWeight = models.FloatField()
    cohesionRadius = models.IntegerField()
    cohesionWeight = models.FloatField()


    def toDict(self):
        return {
                'id': self.id,
                'title': self.title,
                'alignmentRadius': self.alignmentRadius,
                'alignmentWeight': self.alignmentWeight,
                'avoidanceRadius': self.avoidanceRadius,
                'avoidanceWeight': self.avoidanceWeight,
                'cohesionRadius': self.cohesionRadius,
                'cohesionWeight': self.cohesionWeight,
                }
