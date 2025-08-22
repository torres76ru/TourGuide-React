from datetime import datetime, timedelta
from django.db.models import Avg
from attractions.models import Attraction
from ratings.models import Rating
from django.utils import timezone

def calculate_weighted_rating(rating_date):
    now = timezone.now()
    time_diff = now - rating_date
    days_diff = time_diff.days
    weight = max(0.3, 1.0 / (1 + 0.01 * days_diff)) if days_diff >= 0 else 1.0
    return weight

def get_yearly_leaderboard(limit=10, min_ratings=1, tags=None, city=None):
    one_year_ago = timezone.now() - timedelta(days=365)
    ratings = Rating.objects.filter(created_at__gte=one_year_ago)
    print(f"Found {ratings.count()} ratings in the last year")

    if not ratings.exists():
        return []

    attractions_query = Attraction.objects.all()
    if tags and any(tag.strip() for tag in tags):
        attractions_query = attractions_query.filter(tags__icontains=tags[0])
    if city:
        attractions_query = attractions_query.filter(city__name__iexact=city)

    attraction_ids = attractions_query.values_list('id', flat=True)
    ratings = ratings.filter(attraction_id__in=attraction_ids)

    if not ratings.exists():
        return []

    leaderboard_data = {}
    for rating in ratings:
        attraction_id = rating.attraction_id
        if attraction_id not in leaderboard_data:
            leaderboard_data[attraction_id] = {'total_weighted': 0, 'count': 0, 'attraction': rating.attraction}
        weight = calculate_weighted_rating(rating.created_at)
        leaderboard_data[attraction_id]['total_weighted'] += rating.value * weight
        leaderboard_data[attraction_id]['count'] += 1

    leaderboard = [
        {
            'attraction': data['attraction'],
            'weighted_average': data['total_weighted'] / data['count'] if data['count'] > 0 else 0,
            'rating_count': data['count']
        }
        for attr_id, data in leaderboard_data.items()
        if data['count'] >= min_ratings
    ]
    print(f"Leaderboard size before limit: {len(leaderboard)}")
    leaderboard.sort(key=lambda x: x['weighted_average'], reverse=True)
    try:
        limit = int(limit)
        return leaderboard[:limit] if limit > 0 else leaderboard
    except (ValueError, TypeError):
        return leaderboard[:10]