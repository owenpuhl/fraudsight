/**
 * Risk Analytics Utilities
 * Calculate VaR, Sharpe Ratio, Sortino Ratio, Max Drawdown, and Correlation
 */

/**
 * Calculate Value at Risk (VaR)
 * VaR = Mean - (Z-score * Standard Deviation)
 * @param returns - Array of daily returns (e.g., [0.01, -0.02, 0.015, ...])
 * @param confidenceLevel - 0.95 for 95% VaR, 0.99 for 99% VaR
 */
export function calculateVaR(returns: number[], confidenceLevel: number = 0.95): number {
    if (returns.length === 0) return 0;

    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);

    // Z-scores for common confidence levels
    const zScores: { [key: number]: number } = {
        0.90: 1.282,
        0.95: 1.645,
        0.99: 2.326,
    };

    const zScore = zScores[confidenceLevel] || 1.645;
    const var_ = mean - (zScore * stdDev);

    return var_;
}

/**
 * Calculate Sharpe Ratio
 * Sharpe = (Mean Return - Risk-free Rate) / Std Dev
 * @param returns - Array of daily returns
 * @param riskFreeRate - Annual risk-free rate (default 4% = 0.04)
 */
export function calculateSharpeRatio(returns: number[], riskFreeRate: number = 0.04): number {
    if (returns.length === 0) return 0;

    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev === 0) return 0;

    // Annualize returns and risk-free rate (252 trading days)
    const annualizedReturn = mean * 252;
    const annualizedStdDev = stdDev * Math.sqrt(252);

    return (annualizedReturn - riskFreeRate) / annualizedStdDev;
}

/**
 * Calculate Sortino Ratio (better than Sharpe for asymmetric returns)
 * Sortino = (Mean Return - Risk-free Rate) / Downside Deviation
 * @param returns - Array of daily returns
 * @param riskFreeRate - Annual risk-free rate (default 4%)
 */
export function calculateSortinoRatio(returns: number[], riskFreeRate: number = 0.04): number {
    if (returns.length === 0) return 0;

    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;

    // Downside deviation - only consider negative returns
    const downsideReturns = returns.filter(r => r < 0);
    let downsidevVariance = 0;

    if (downsideReturns.length > 0) {
        downsidevVariance = downsideReturns.reduce((a, b) => a + Math.pow(b - 0, 2), 0) / returns.length;
    }

    const downsidevStdDev = Math.sqrt(downsidevVariance);

    if (downsidevStdDev === 0) return 0;

    // Annualize
    const annualizedReturn = mean * 252;
    const annualizedDownsideStdDev = downsidevStdDev * Math.sqrt(252);

    return (annualizedReturn - riskFreeRate) / annualizedDownsideStdDev;
}

/**
 * Calculate Maximum Drawdown
 * Maximum peak-to-trough decline during a given period
 * @param balances - Array of account balances over time
 */
export function calculateMaxDrawdown(balances: number[]): { maxDrawdown: number; drawdownPercent: number } {
    if (balances.length === 0) return { maxDrawdown: 0, drawdownPercent: 0 };

    let maxBalance = balances[0];
    let maxDrawdown = 0;

    for (let i = 1; i < balances.length; i++) {
        if (balances[i] > maxBalance) {
            maxBalance = balances[i];
        }
        const drawdown = maxBalance - balances[i];
        if (drawdown > maxDrawdown) {
            maxDrawdown = drawdown;
        }
    }

    const drawdownPercent = maxBalance > 0 ? (maxDrawdown / maxBalance) * 100 : 0;

    return { maxDrawdown, drawdownPercent };
}

/**
 * Calculate correlation between two return series
 * @param returns1 - First account returns
 * @param returns2 - Second account returns
 */
export function calculateCorrelation(returns1: number[], returns2: number[]): number {
    if (returns1.length === 0 || returns2.length === 0 || returns1.length !== returns2.length) {
        return 0;
    }

    const n = returns1.length;
    const mean1 = returns1.reduce((a, b) => a + b, 0) / n;
    const mean2 = returns2.reduce((a, b) => a + b, 0) / n;

    let covariance = 0;
    let variance1 = 0;
    let variance2 = 0;

    for (let i = 0; i < n; i++) {
        const diff1 = returns1[i] - mean1;
        const diff2 = returns2[i] - mean2;
        covariance += diff1 * diff2;
        variance1 += diff1 * diff1;
        variance2 += diff2 * diff2;
    }

    covariance /= n;
    variance1 /= n;
    variance2 /= n;

    const stdDev1 = Math.sqrt(variance1);
    const stdDev2 = Math.sqrt(variance2);

    if (stdDev1 === 0 || stdDev2 === 0) return 0;

    return covariance / (stdDev1 * stdDev2);
}

/**
 * Generate correlation matrix for multiple accounts
 * @param accountReturns - Map of account ID to returns array
 */
export function generateCorrelationMatrix(
    accountReturns: { [accountId: string]: number[] }
): {
    matrix: { [key: string]: number };
    correlations: Array<{ account1: string; account2: string; correlation: number }>;
} {
    const accountIds = Object.keys(accountReturns);
    const matrix: { [key: string]: number } = {};
    const correlations: Array<{ account1: string; account2: string; correlation: number }> = [];

    for (let i = 0; i < accountIds.length; i++) {
        for (let j = i; j < accountIds.length; j++) {
            const id1 = accountIds[i];
            const id2 = accountIds[j];

            if (i === j) {
                // Correlation with itself is 1
                matrix[`${id1}-${id2}`] = 1;
            } else {
                const corr = calculateCorrelation(accountReturns[id1], accountReturns[id2]);
                matrix[`${id1}-${id2}`] = corr;
                matrix[`${id2}-${id1}`] = corr;

                correlations.push({
                    account1: id1,
                    account2: id2,
                    correlation: corr,
                });
            }
        }
    }

    return { matrix, correlations };
}

/**
 * Calculate portfolio volatility given weights
 * @param accountReturns - Map of account ID to returns
 * @param weights - Map of account ID to portfolio weight (should sum to 1)
 */
export function calculatePortfolioVolatility(
    accountReturns: { [accountId: string]: number[] },
    weights: { [accountId: string]: number }
): number {
    const accountIds = Object.keys(accountReturns);

    // Calculate standard deviations for each account
    const stdDevs: { [accountId: string]: number } = {};
    for (const id of accountIds) {
        const returns = accountReturns[id];
        const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
        const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
        stdDevs[id] = Math.sqrt(variance);
    }

    // Get correlation matrix
    const { correlations } = generateCorrelationMatrix(accountReturns);

    // Calculate portfolio variance
    let portfolioVariance = 0;

    for (let i = 0; i < accountIds.length; i++) {
        for (let j = 0; j < accountIds.length; j++) {
            const id1 = accountIds[i];
            const id2 = accountIds[j];

            let correlation = 0;
            if (i === j) {
                correlation = 1;
            } else {
                const corr = correlations.find(c =>
                    (c.account1 === id1 && c.account2 === id2) ||
                    (c.account1 === id2 && c.account2 === id1)
                );
                correlation = corr?.correlation || 0;
            }

            const w1 = weights[id1] || 0;
            const w2 = weights[id2] || 0;

            portfolioVariance += w1 * w2 * stdDevs[id1] * stdDevs[id2] * correlation;
        }
    }

    return Math.sqrt(portfolioVariance) * Math.sqrt(252); // Annualize
}
