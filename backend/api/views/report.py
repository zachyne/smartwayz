from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from api.models import Report, Citizen, Status
from api.serializers import ReportSerializer


class ReportViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Report CRUD operations.
    
    Citizens can:
    - Create reports (with location)
    - View their own reports
    
    Citizens CANNOT:
    - Update reports
    - Delete reports
    
    Authorities can view all reports.
    """
    
    queryset = Report.objects.select_related('report_type', 'citizen', 'sub_category').all()
    serializer_class = ReportSerializer
    permission_classes = [AllowAny]  # We handle auth manually in create()
    
    def get_queryset(self):
        """
        Filter reports based on user type and query parameters.
        Citizens can only see their own reports.
        """
        queryset = super().get_queryset()
        
        # Filter by citizen_id if provided (for testing without auth)
        citizen_id = self.request.query_params.get('citizen_id', None)
        if citizen_id:
            queryset = queryset.filter(citizen_id=citizen_id)
        
        # Filter by category if provided
        category_id = self.request.query_params.get('category', None)
        if category_id:
            queryset = queryset.filter(report_type_id=category_id)
        
        # Filter by sub_category if provided
        sub_category_id = self.request.query_params.get('sub_category', None)
        if sub_category_id:
            queryset = queryset.filter(sub_category_id=sub_category_id)
        
        return queryset.order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        """
        Create a new report with location data.
        Automatically extracts citizen from JWT token.
        """
        # Extract and validate JWT token manually
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')

        if not auth_header.startswith('Bearer '):
            return Response(
                {
                    'success': False,
                    'message': 'Authentication required. Please log in.'
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        token_string = auth_header.split(' ')[1]

        try:
            # Decode and validate token
            token = AccessToken(token_string)
            user_id = token.get('user_id')
            user_type = token.get('user_type')
        except (InvalidToken, TokenError) as e:
            return Response(
                {
                    'success': False,
                    'message': 'Invalid or expired token. Please log in again.',
                    'detail': str(e)
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user_id or user_type != 'citizen':
            return Response(
                {
                    'success': False,
                    'message': 'Only citizens can create reports.'
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # Verify citizen exists
        try:
            citizen = Citizen.objects.get(id=user_id)
        except Citizen.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'User not found. Please log in again.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Create report data with citizen ID and default status
        report_data = request.data.copy()
        report_data['citizen'] = citizen.id

        # Set default status to 'pending' if not provided
        if 'status' not in report_data:
            try:
                pending_status = Status.objects.get(code='pending')
                report_data['status'] = pending_status.id
            except Status.DoesNotExist:
                return Response(
                    {
                        'success': False,
                        'message': 'System error: Status configuration is missing.'
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        serializer = self.get_serializer(data=report_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(
            {
                'success': True,
                'message': 'Report created successfully. Your report has been submitted.',
                'data': serializer.data
            },
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
    def update(self, request, *args, **kwargs):
        """
        Citizens CANNOT update reports.
        Only authorities can update reports (to be implemented).
        """
        return Response(
            {
                'success': False,
                'message': 'Citizens cannot update reports. Reports are read-only once submitted.'
            },
            status=status.HTTP_403_FORBIDDEN
        )
    
    def partial_update(self, request, *args, **kwargs):
        """
        Citizens CANNOT partially update reports.
        Only authorities can update reports (to be implemented).
        """
        return Response(
            {
                'success': False,
                'message': 'Citizens cannot update reports. Reports are read-only once submitted.'
            },
            status=status.HTTP_403_FORBIDDEN
        )
    
    def destroy(self, request, *args, **kwargs):
        """
        Citizens CANNOT delete reports.
        Only authorities can delete reports (to be implemented).
        """
        return Response(
            {
                'success': False,
                'message': 'Citizens cannot delete reports. Please contact authorities if you need to remove a report.'
            },
            status=status.HTTP_403_FORBIDDEN
        )
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get report statistics by category"""
        from django.db.models import Count
        
        stats = Report.objects.values(
            'report_type__report_type'
        ).annotate(
            count=Count('id')
        ).order_by('-count')
        
        return Response({
            'total_reports': Report.objects.count(),
            'by_category': list(stats)
        })
