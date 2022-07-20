from rest_framework import routers
from api.main.views import MeasurementViewSet, CalculateParametersViewSet

router = routers.SimpleRouter()
router.register('measurements', MeasurementViewSet, basename='measurements')
router.register('calculate_parameters', CalculateParametersViewSet, basename="calculate_parameters")

urlpatterns = []
urlpatterns += router.urls