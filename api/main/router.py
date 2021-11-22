from rest_framework import routers
from api.main.views import MeasurementViewSet

router = routers.SimpleRouter()
router.register('measurements', MeasurementViewSet, basename='measurements')

urlpatterns = []
urlpatterns += router.urls