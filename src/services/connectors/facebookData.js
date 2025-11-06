const axios = require('axios');
const { PAGE_TYPES, METRICS_BY_TYPE } = require('./constants');
const { computeMonetizationPotential } = require('../../utils/scoring');

class FacebookDataConnector {
    constructor(config) {
        this.accessToken = config.accessToken;
        this.pageId = config.pageId;
        this.baseUrl = 'https://graph.facebook.com/v19.0';
    }

    async getPageInsights(metrics, period = 'day') {
        try {
            const response = await axios.get(`${this.baseUrl}/${this.pageId}/insights`, {
                params: {
                    access_token: this.accessToken,
                    metric: metrics.join(','),
                    period: period
                }
            });
            return this._formatInsightsData(response.data.data);
        } catch (error) {
            console.error('Error fetching Facebook Insights:', error.message);
            throw error;
        }
    }

    async getPostPerformance(postIds) {
        try {
            const promises = postIds.map(id =>
                axios.get(`${this.baseUrl}/${id}`, {
                    params: {
                        access_token: this.accessToken,
                        fields: 'engagement,reach,impressions'
                    }
                })
            );
            const responses = await Promise.all(promises);
            return responses.map(r => r.data);
        } catch (error) {
            console.error('Error fetching post performance:', error.message);
            throw error;
        }
    }

    async getAudienceInsights() {
        try {
            const response = await axios.get(`${this.baseUrl}/${this.pageId}/insights/page_fans_city`, {
                params: {
                    access_token: this.accessToken
                }
            });
            return this._formatDemographicData(response.data.data);
        } catch (error) {
            console.error('Error fetching audience insights:', error.message);
            throw error;
        }
    }

    async getMonetizationMetrics() {
        try {
            const metrics = [
                'page_fans_online',
                'page_actions_post_reactions_total',
                'page_engaged_users',
                'page_impressions_paid',
                'page_posts_impressions_paid'
            ];

            const response = await this.getPageInsights(metrics, 'week');
            return this._analyzeMonetizationPotential(response);
        } catch (error) {
            console.error('Error fetching monetization metrics:', error.message);
            throw error;
        }
    }

    _formatInsightsData(data) {
        return data.reduce((acc, metric) => {
            acc[metric.name] = {
                values: metric.values,
                period: metric.period,
                title: metric.title,
                description: metric.description
            };
            return acc;
        }, {});
    }

    _formatDemographicData(data) {
        // Process demographic data for analysis
        return data.reduce((acc, item) => {
            acc[item.name] = item.values[0].value;
            return acc;
        }, {});
    }

    _analyzeMonetizationPotential(metrics) {
        // Use scoring utility for more robust scoring
        const scores = computeMonetizationPotential(metrics);
        const analysis = {
            engagementScore: scores.engagementScore,
            reachScore: scores.reachScore,
            monetizationPotential: scores.monetizationPotential,
            recommendations: this._generateRecommendations(scores)
        };
        return analysis;
    }

    _calculateEngagementScore(metrics) {
        // Implementation of engagement scoring algorithm
        const engaged = metrics.page_engaged_users.values[0].value;
        const reactions = metrics.page_actions_post_reactions_total.values[0].value;
        return (engaged + reactions) / 2;
    }

    _calculateReachScore(metrics) {
        // Implementation of reach scoring algorithm
        const organic = metrics.page_impressions_paid.values[0].value;
        const paid = metrics.page_posts_impressions_paid.values[0].value;
        return (organic + paid) / 2;
    }

    _generateRecommendations(analysis) {
        const recommendations = [];

        if (analysis.engagementScore < 50) {
            recommendations.push({
                area: 'Engagement',
                actions: [
                    'Increase post frequency during peak hours',
                    'Experiment with more video content',
                    'Engage with comments more actively'
                ]
            });
        }

        if (analysis.reachScore < 50) {
            recommendations.push({
                area: 'Reach',
                actions: [
                    'Increase ad budget for best-performing posts',
                    'Expand targeting to similar audiences',
                    'Test different ad formats'
                ]
            });
        }

        return recommendations;
    }
}

module.exports = FacebookDataConnector;