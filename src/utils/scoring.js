/**
 * Monetization scoring utilities
 * - compute engagement score, reach score and weighted monetization potential
 */

function computeEngagementScore(metrics = {}) {
    // safe extracts
    const engaged = Number(metrics.page_engaged_users?.values?.[0]?.value || 0);
    const reactions = Number(metrics.page_actions_post_reactions_total?.values?.[0]?.value || 0);
    const comments = Number(metrics.page_actions_post_comments?.values?.[0]?.value || 0);
    const shares = Number(metrics.page_actions_post_shares?.values?.[0]?.value || 0);

    // simple normalized score
    const raw = engaged + reactions * 0.5 + comments * 0.7 + shares * 1.0;
    // normalize to 0-100 assuming a broad cap
    const normalized = Math.min(100, Math.round(raw / 1000 * 100));
    return normalized;
}

function computeReachScore(metrics = {}) {
    const organic = Number(metrics.page_impressions?.values?.[0]?.value || 0);
    const paid = Number(metrics.page_impressions_paid?.values?.[0]?.value || 0);
    const followers = Number(metrics.page_fans?.values?.[0]?.value || 0);

    const raw = (organic * 0.6) + (paid * 0.8) + (followers * 0.3);
    const normalized = Math.min(100, Math.round(raw / 10000 * 100));
    return normalized;
}

function computeMonetizationPotential(metrics = {}, weights = { engagement: 0.6, reach: 0.4 }) {
    const engagementScore = computeEngagementScore(metrics);
    const reachScore = computeReachScore(metrics);
    const potential = Math.round((engagementScore * weights.engagement + reachScore * weights.reach));
    return {
        engagementScore,
        reachScore,
        monetizationPotential: potential
    };
}

module.exports = {
    computeEngagementScore,
    computeReachScore,
    computeMonetizationPotential
};