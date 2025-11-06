/**
 * Facebook Page Type Configurations and Metrics
 */
const PAGE_TYPES = {
    ECOMMERCE: 'ecommerce',
    CONTENT_CREATOR: 'content_creator',
    BRAND: 'brand',
    COMMUNITY: 'community',
    LOCAL_BUSINESS: 'local_business'
};

/**
 * Metrics mapped by page type
 */
const METRICS_BY_TYPE = {
    [PAGE_TYPES.ECOMMERCE]: {
        basic: [
            'page_impressions',
            'page_engaged_users',
            'page_fans',
            'page_views_total'
        ],
        commerce: [
            'product_catalog_views',
            'shop_visits',
            'purchase_conversion_value',
            'purchases_conversion_rate'
        ],
        ads: [
            'ads_click_through_rate',
            'ads_conversion_value',
            'ads_return_on_ad_spend'
        ]
    },
    [PAGE_TYPES.CONTENT_CREATOR]: {
        basic: [
            'page_impressions',
            'page_engaged_users',
            'page_fans',
            'page_video_views'
        ],
        monetization: [
            'stars_received',
            'fan_subscription_value',
            'branded_content_value',
            'creator_earnings'
        ],
        content: [
            'video_retention_rate',
            'video_complete_views',
            'live_video_engagement'
        ]
    },
    [PAGE_TYPES.BRAND]: {
        basic: [
            'page_impressions',
            'page_engaged_users',
            'page_fans',
            'page_brand_lift'
        ],
        engagement: [
            'brand_mention_rate',
            'sentiment_score',
            'story_engagement'
        ],
        reach: [
            'organic_reach_viral',
            'paid_reach_efficiency',
            'audience_growth_rate'
        ]
    },
    [PAGE_TYPES.COMMUNITY]: {
        basic: [
            'page_impressions',
            'page_engaged_users',
            'page_fans',
            'group_activity'
        ],
        engagement: [
            'member_engagement_rate',
            'discussion_participation',
            'community_growth'
        ],
        value: [
            'membership_retention',
            'premium_conversion_rate',
            'community_satisfaction'
        ]
    },
    [PAGE_TYPES.LOCAL_BUSINESS]: {
        basic: [
            'page_impressions',
            'page_engaged_users',
            'page_fans',
            'local_impressions'
        ],
        location: [
            'store_visits',
            'local_awareness',
            'call_button_clicks'
        ],
        business: [
            'appointment_bookings',
            'message_response_rate',
            'customer_leads'
        ]
    }
};

module.exports = {
    PAGE_TYPES,
    METRICS_BY_TYPE
};