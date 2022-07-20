from rest_framework import viewsets, response, status
from rest_framework.decorators import action
from api.main.serializers import MeasurementSerializer, serializers
from mainapp.models import Measurement
import xlwt
from django.http import HttpResponse
import cv2
import numpy as np

class MeasurementViewSet(viewsets.ModelViewSet):
    serializer_class = MeasurementSerializer

    @action(methods=['get'], detail=False)
    def get_hello(self, request):
        return response.Response("Hello")

    @action(methods=['get'], detail=False)
    def all_measurements(self, request):
        all_measures = Measurement.objects.filter(real_diag=1)
        return response.Response(MeasurementSerializer(all_measures, many=True).data)

    @action(methods=['get'], detail=False)
    def dump_database(self, request):
        response = HttpResponse(content_type='application/ms-excel')
        response['Content-Disposition'] = 'attachment; filename="results.xls"'
        wb = xlwt.Workbook(encoding='utf-8')
        ws = wb.add_sheet("sheet1")
        row_num = 0

        columns = ["name", "real_diag", "real_width", "diag", "width"]
        for i in range(len(columns)):
            ws.row(0).write(i, columns[i])

        measurements = Measurement.objects.all()
        for i in range(1, len(measurements)+1):
            row = ws.row(i)
            for j in range(len(columns)):
                row.write(j, getattr(measurements[i-1], columns[j]))

        font_style = xlwt.XFStyle()
        # headers are bold
        font_style.font.bold = True
        wb.save(response)
        return response

    @action(methods=['post'], detail=False)
    def add_measurement(self, request):
        serializer = MeasurementSerializer(data=request.data)
        if serializer.is_valid():
            model = Measurement(**serializer.validated_data)
            model.save()
        return response.Response(serializer.errors)

class CalculateParametersViewSet(viewsets.ModelViewSet):
    @action(methods=['post'], detail=False)
    def get_calculate(self, request):
        response = HttpResponse(content_type='text/html')
        file1 = request.FILES['photo_profile'].read()
        file2 = request.FILES['photo_anfas'].read()
        img1 = cv2.imdecode(np.frombuffer(file1, np.uint8), cv2.IMREAD_COLOR)
        img2 = cv2.imdecode(np.frombuffer(file2, np.uint8), cv2.IMREAD_COLOR)
        return response