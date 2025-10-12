from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import Citizen, Authority


@api_view(['POST'])
@permission_classes([AllowAny])
def login_citizen(request):
    """
    Login endpoint for citizens.
    
    POST /api/auth/login/citizen/
    Body: {"email": "user@example.com", "password": "password123"}
    """
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({
            'success': False,
            'message': 'Email and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Find citizen by email (case-insensitive)
        citizen = Citizen.objects.get(email=email.lower())
        
        # Check password
        if not citizen.check_password(password):
            return Response({
                'success': False,
                'message': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Generate JWT tokens
        refresh = RefreshToken()
        refresh['user_id'] = citizen.id
        refresh['user_type'] = 'citizen'
        refresh['email'] = citizen.email
        refresh['name'] = citizen.name
        
        return Response({
            'success': True,
            'message': 'Login successful',
            'data': {
                'user': {
                    'id': citizen.id,
                    'name': citizen.name,
                    'email': citizen.email,
                    'user_type': 'citizen'
                },
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                }
            }
        }, status=status.HTTP_200_OK)
        
    except Citizen.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Invalid email or password'
        }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_authority(request):
    """
    Login endpoint for authorities.
    
    POST /api/auth/login/authority/
    Body: {"email": "authority@example.com", "password": "password123"}
    """
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({
            'success': False,
            'message': 'Email and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Find authority by email (case-insensitive)
        authority = Authority.objects.get(email=email.lower())
        
        # Check password
        if not authority.check_password(password):
            return Response({
                'success': False,
                'message': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Generate JWT tokens
        refresh = RefreshToken()
        refresh['user_id'] = authority.id
        refresh['user_type'] = 'authority'
        refresh['email'] = authority.email
        refresh['authority_name'] = authority.authority_name
        
        return Response({
            'success': True,
            'message': 'Login successful',
            'data': {
                'user': {
                    'id': authority.id,
                    'authority_name': authority.authority_name,
                    'email': authority.email,
                    'user_type': 'authority'
                },
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                }
            }
        }, status=status.HTTP_200_OK)
        
    except Authority.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Invalid email or password'
        }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    """
    Refresh access token using refresh token.
    
    POST /api/auth/refresh/
    Body: {"refresh": "refresh_token_here"}
    """
    refresh_token = request.data.get('refresh')
    
    if not refresh_token:
        return Response({
            'success': False,
            'message': 'Refresh token is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        refresh = RefreshToken(refresh_token)
        
        return Response({
            'success': True,
            'data': {
                'access': str(refresh.access_token)
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': 'Invalid or expired refresh token'
        }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def logout(request):
    """
    Logout endpoint (blacklist refresh token).
    
    POST /api/auth/logout/
    Body: {"refresh": "refresh_token_here"}
    """
    refresh_token = request.data.get('refresh')
    
    if not refresh_token:
        return Response({
            'success': False,
            'message': 'Refresh token is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
        
        return Response({
            'success': True,
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
        
    except Exception:
        return Response({
            'success': True,
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
