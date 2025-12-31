import { useEffect, useState } from 'react';
import { useAccountsMock } from './useAccountsMock';
import {
    calculateVaR,
    calculateSharpeRatio,
    calculateSortinoRatio,
    calculateMaxDrawdown,
    generateCorrelationMatrix,
} from '@/utils/riskMetrics';

export interface PortfolioAccount {
    id: string;
    name: string;
    balance: number;
    type: string;
    weight: number; // % of portfolio
    returns: number[];
    volatility: number;
    sharpeRatio: number;
    sortinoRatio: number;
    maxDrawdown: number;
    var95: number;
    var99: number;
}

export interface PortfolioRiskMetrics {
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
    accounts: PortfolioAccount[];
    portfolio: {
        var95: number;
        var99: number;
        sharpeRatio: number;
        sortinoRatio: number;
        volatility: number;
        averageReturn: number;
    };
    correlationMatrix: Array<{ account1: string; account2: string; correlation: number }>;
    allocationByType: { [type: string]: number };
    riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
}

/**
 * Generate mock daily returns for an account based on its balance
 * Uses historical simulation with realistic volatility patterns
 */
function generateMockReturns(
    accountId: string,
    balance: number,
    accountType: string,
    days: number = 90
): number[] {
    const returns: number[] = [];

    // Different volatility by account type
    const volatilityMap: { [key: string]: number } = {
        Checking: 0.001,        // Very stable
        Savings: 0.0005,        // Ultra stable
        'Credit Card': 0.002,   // Slightly volatile
        'Money Market': 0.0015, // Moderate
        default: 0.001,
    };

    const baseVolatility = volatilityMap[accountType] || volatilityMap.default;
    const trend = Math.random() * 0.0005 - 0.00025; // Random slight uptrend or downtrend

    // Generate correlated returns
    for (let i = 0; i < days; i++) {
        const randomShock = Math.random() * 2 - 1; // -1 to 1
        const seasonality = Math.sin((i / 30) * Math.PI) * 0.0001; // 30-day cycle
        const dailyReturn = trend + baseVolatility * randomShock + seasonality;

        returns.push(dailyReturn);
    }

    return returns;
}

/**
 * Generate historical balance data from returns
 */
function generateBalanceHistory(initialBalance: number, returns: number[]): number[] {
    const balances: number[] = [initialBalance];

    for (const dailyReturn of returns) {
        const lastBalance = balances[balances.length - 1];
        const newBalance = lastBalance * (1 + dailyReturn);
        balances.push(newBalance);
    }

    return balances;
}

export function usePortfolioRiskMock() {
    const { data: accountsData, loading: accountsLoading } = useAccountsMock({ limit: 100, autoFetch: true });
    const [data, setData] = useState<PortfolioRiskMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!accountsData || !accountsData.accounts) {
            setLoading(true);
            return;
        }

        try {
            setLoading(true);

            const accounts = accountsData.accounts;

            // Generate mock returns for each account
            const accountReturns: { [id: string]: number[] } = {};
            const portfolioAccounts: PortfolioAccount[] = [];

            let totalAssets = 0;
            let totalLiabilities = 0;

            // Calculate totals and generate returns
            for (const account of accounts) {
                if (account.balance > 0) {
                    totalAssets += account.balance;
                } else {
                    totalLiabilities += Math.abs(account.balance);
                }

                const returns = generateMockReturns(account.id, account.balance, account.type);
                accountReturns[account.id] = returns;

                const balances = generateBalanceHistory(account.balance, returns);
                const { maxDrawdown, drawdownPercent } = calculateMaxDrawdown(balances);

                const sharpe = calculateSharpeRatio(returns);
                const sortino = calculateSortinoRatio(returns);
                const var95 = calculateVaR(returns, 0.95);
                const var99 = calculateVaR(returns, 0.99);
                const volatility = calculateVolatility(returns);

                portfolioAccounts.push({
                    id: account.id,
                    name: account.name,
                    balance: account.balance,
                    type: account.type,
                    weight: 0, // Will be calculated after
                    returns,
                    volatility,
                    sharpeRatio: sharpe,
                    sortinoRatio: sortino,
                    maxDrawdown: drawdownPercent,
                    var95,
                    var99,
                });
            }

            // Calculate weights
            const netWorth = totalAssets - totalLiabilities;
            for (const acc of portfolioAccounts) {
                acc.weight = netWorth > 0 ? (acc.balance / netWorth) * 100 : 0;
            }

            // Calculate portfolio-level metrics
            const portfolioReturns = calculatePortfolioReturns(portfolioAccounts, accountReturns);
            const portfolioVolatility = calculateVolatility(portfolioReturns);
            const portfolioSharpe = calculateSharpeRatio(portfolioReturns);
            const portfolioSortino = calculateSortinoRatio(portfolioReturns);
            const portfolioVar95 = calculateVaR(portfolioReturns, 0.95);
            const portfolioVar99 = calculateVaR(portfolioReturns, 0.99);
            const avgReturn = portfolioReturns.reduce((a, b) => a + b, 0) / portfolioReturns.length;

            // Generate correlation matrix
            const { correlations } = generateCorrelationMatrix(accountReturns);

            // Calculate allocation by type
            const allocationByType: { [type: string]: number } = {};
            for (const acc of portfolioAccounts) {
                allocationByType[acc.type] = (allocationByType[acc.type] || 0) + acc.balance;
            }

            // Determine overall risk level
            const riskLevel = getRiskLevel(portfolioVolatility, portfolioSharpe);

            setData({
                totalAssets,
                totalLiabilities,
                netWorth,
                accounts: portfolioAccounts,
                portfolio: {
                    var95: portfolioVar95,
                    var99: portfolioVar99,
                    sharpeRatio: portfolioSharpe,
                    sortinoRatio: portfolioSortino,
                    volatility: portfolioVolatility,
                    averageReturn: avgReturn,
                },
                correlationMatrix: correlations,
                allocationByType,
                riskLevel,
            });
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to calculate risk metrics');
        } finally {
            setLoading(false);
        }
    }, [accountsData]);

    return { data, loading: loading || accountsLoading, error };
}

/**
 * Helper: Calculate volatility from returns
 */
function calculateVolatility(returns: number[]): number {
    if (returns.length === 0) return 0;
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    return stdDev * Math.sqrt(252); // Annualize
}

/**
 * Helper: Calculate portfolio returns from account returns and weights
 */
function calculatePortfolioReturns(
    portfolioAccounts: PortfolioAccount[],
    accountReturns: { [id: string]: number[] }
): number[] {
    if (portfolioAccounts.length === 0) return [];

    // Get common length
    const minLength = Math.min(...Object.values(accountReturns).map(r => r.length));
    const portfolioReturns: number[] = [];

    for (let i = 0; i < minLength; i++) {
        let dayReturn = 0;
        for (const acc of portfolioAccounts) {
            const weight = acc.weight / 100;
            const accountReturn = accountReturns[acc.id][i];
            dayReturn += weight * accountReturn;
        }
        portfolioReturns.push(dayReturn);
    }

    return portfolioReturns;
}

/**
 * Helper: Determine risk level based on volatility and Sharpe ratio
 */
function getRiskLevel(volatility: number, sharpeRatio: number): 'Low' | 'Moderate' | 'High' | 'Very High' {
    if (volatility < 0.1 && sharpeRatio > 1.5) return 'Low';
    if (volatility < 0.2 && sharpeRatio > 1.0) return 'Moderate';
    if (volatility < 0.35 && sharpeRatio > 0.5) return 'High';
    return 'Very High';
}

