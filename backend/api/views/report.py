from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
import logging
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from api.models import Report, ReportImage, Citizen, Status
from api.serializers import ReportSerializer

logger = logging.getLogger(__name__)


class ReportViewSet(viewsets.ModelViewSet):
    """
    CRUD interface for report records.

    Citizens may create reports and view their own submissions.
    Authorities may view reports assigned to their area of responsibility.
    Update and delete operations are intentionally restricted here.
    """
    
    queryset = Report.objects.select_related('report_type', 'citizen', 'sub_category').prefetch_related('images').all()
    serializer_class = ReportSerializer
    permission_classes = [AllowAny]  # Authentication is enforced manually in create().
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    
    def get_queryset(self):
        """
        Limit report visibility based on the authenticated token and filters.
        """
        queryset = super().get_queryset()

        # Django exposes request headers through META using the HTTP_ prefix.
        auth_header = self.request.META.get('HTTP_AUTHORIZATION', '')

        if auth_header.startswith('Bearer '):
            token_string = auth_header.split(' ')[1]
            try:
                token = AccessToken(token_string)
                user_id = token.get('user_id')
                user_type = token.get('user_type')

                if user_type == 'citizen' and user_id:
                    queryset = queryset.filter(citizen_id=user_id)

                elif user_type == 'authority' and user_id:
                    queryset = queryset.filter(sub_category__authority_id=user_id)

            except (InvalidToken, TokenError):
                pass

        # Support an explicit citizen filter for non-authenticated test flows.
        citizen_id = self.request.query_params.get('citizen_id', None)
        if citizen_id:
            queryset = queryset.filter(citizen_id=citizen_id)

        category_id = self.request.query_params.get('category', None)
        if category_id:
            queryset = queryset.filter(report_type_id=category_id)

        sub_category_id = self.request.query_params.get('sub_category', None)
        if sub_category_id:
            queryset = queryset.filter(sub_category_id=sub_category_id)

        return queryset.order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        """
        Create a report and associate it with the authenticated citizen.
        """
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

        # Apply the authenticated citizen and default status server-side.
        report_data = request.data.copy()
        report_data['citizen'] = citizen.id

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

        uploaded_images = request.FILES.getlist('images')
        if len(uploaded_images) > 5:
            return Response(
                {
                    'success': False,
                    'message': 'You can upload up to 5 images per report.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=report_data)
        serializer.is_valid(raise_exception=True)
        try:
            report = serializer.save()
            for image_file in uploaded_images:
                ReportImage.objects.create(report=report, image=image_file)
        except Exception as exc:
            logger.exception("Report creation/upload failed")
            return Response(
                {
                    'success': False,
                    'message': 'Report upload failed. Please check storage configuration.',
                    'detail': str(exc),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        response_serializer = self.get_serializer(report)
        headers = self.get_success_headers(response_serializer.data)

        return Response(
            {
                'success': True,
                'message': 'Report created successfully. Your report has been submitted.',
                'data': response_serializer.data
            },
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
    def update(self, request, *args, **kwargs):
        """
        Report records are read-only after submission through this endpoint.
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
        Partial updates are not supported through this endpoint.
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
        Deletion is intentionally disabled for submitted reports.
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
        """Return aggregate report counts grouped by category."""
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

    @action(detail=True, methods=["patch"], url_path="status", permission_classes=[AllowAny])
    def update_status(self, request, pk=None):
        """
        Update the status of a report.
        """
        report = self.get_object()
        new_status_id = request.data.get("status_id")

        if not new_status_id:
            return Response(
                {"success": False, "message": "status_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate status exists
        try:
            new_status = Status.objects.get(id=new_status_id)
        except Status.DoesNotExist:
            return Response(
                {"success": False, "message": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Optional: enforce allowed transitions
        ALLOWED_TRANSITIONS = {
            1: [2, 4],  # pending → approved or rejected
            2: [3],     # approved → in_progress
            3: [5],     # in_progress → resolved
        }

        current_status_id = report.status_id

        if current_status_id in ALLOWED_TRANSITIONS:
            if int(new_status_id) not in ALLOWED_TRANSITIONS[current_status_id]:
                return Response(
                    {"success": False, "message": "Invalid status transition"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Save new status
        report.status = new_status
        report.save(update_fields=["status"])

        return Response(
            {
                "success": True,
                "message": "Status updated successfully",
                "new_status": new_status.code
            }
        )

    @action(detail=False, methods=["get"])
    def stats(self, request):
        from django.db.models import Count

        by_status = Report.objects.values("status__code").annotate(count=Count("id"))
        by_category = Report.objects.values("report_type__report_type").annotate(count=Count("id"))

        return Response({
            "total_reports": Report.objects.count(),
            "by_status": list(by_status),
            "by_category": list(by_category),
        })
