'use client';

import { usePortfolioRiskMock } from '@/hooks/usePortfolioRiskMock';

export default function PortfolioAnalytics() {
    const { data, loading, error } = usePortfolioRiskMock();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Calculating risk metrics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">⚠️</div>
                    <p className="text-red-600 font-semibold mb-2">Error Calculating Metrics</p>
                    <p className="text-gray-600 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const getRiskLevelColor = (level: string) => {
        switch (level) {
            case 'Low':
                return 'bg-green-50 border-green-200 text-green-700';
            case 'Moderate':
                return 'bg-blue-50 border-blue-200 text-blue-700';
            case 'High':
                return 'bg-orange-50 border-orange-200 text-orange-700';
            case 'Very High':
                return 'bg-red-50 border-red-200 text-red-700';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">💼</span>
                    <h2 className="text-3xl font-bold">Portfolio Risk Analytics</h2>
                </div>
                <p className="text-blue-100">
                    Advanced risk metrics: VaR, Sharpe Ratio, Sortino Ratio, and correlation analysis
                </p>
            </div>

            {/* Portfolio Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <p className="text-sm text-gray-600 mb-2">Total Assets</p>
                    <p className="text-3xl font-bold text-green-600">{formatCurrency(data.totalAssets)}</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <p className="text-sm text-gray-600 mb-2">Total Liabilities</p>
                    <p className="text-3xl font-bold text-red-600">{formatCurrency(data.totalLiabilities)}</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <p className="text-sm text-gray-600 mb-2">Net Worth</p>
                    <p className="text-3xl font-bold text-blue-600">{formatCurrency(data.netWorth)}</p>
                </div>

                <div className={`rounded-lg shadow-sm border p-6 ${getRiskLevelColor(data.riskLevel)}`}>
                    <p className="text-sm font-medium mb-2">Overall Risk Level</p>
                    <p className="text-3xl font-bold">{data.riskLevel}</p>
                </div>
            </div>

            {/* Portfolio Risk Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* VaR and Risk Metrics */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">📊</span>
                        Value at Risk (VaR)
                    </h3>
                    <div className="space-y-4">
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <p className="text-sm text-gray-600 mb-1">VaR at 95% Confidence</p>
                            <p className="text-2xl font-bold text-blue-600">{(data.portfolio.var95 * 100).toFixed(2)}%</p>
                            <p className="text-xs text-gray-500 mt-1">Daily loss limit with 95% confidence</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                            <p className="text-sm text-gray-600 mb-1">VaR at 99% Confidence</p>
                            <p className="text-2xl font-bold text-red-600">{(data.portfolio.var99 * 100).toFixed(2)}%</p>
                            <p className="text-xs text-gray-500 mt-1">Daily loss limit with 99% confidence</p>
                        </div>
                    </div>
                </div>

                {/* Sharpe & Sortino Ratios */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">⚖️</span>
                        Risk-Adjusted Returns
                    </h3>
                    <div className="space-y-4">
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                            <p className="text-sm text-gray-600 mb-1">Sharpe Ratio</p>
                            <p className="text-2xl font-bold text-purple-600">{data.portfolio.sharpeRatio.toFixed(2)}</p>
                            <p className="text-xs text-gray-500 mt-1">Return per unit of total risk</p>
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                            <p className="text-sm text-gray-600 mb-1">Sortino Ratio</p>
                            <p className="text-2xl font-bold text-indigo-600">{data.portfolio.sortinoRatio.toFixed(2)}</p>
                            <p className="text-xs text-gray-500 mt-1">Return per unit of downside risk</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Volatility and Returns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">📈</span>
                        Volatility
                    </h3>
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
                        <p className="text-sm text-gray-600 mb-1">Annual Volatility</p>
                        <p className="text-3xl font-bold text-orange-600">{(data.portfolio.volatility * 100).toFixed(2)}%</p>
                        <p className="text-xs text-gray-500 mt-1">Annualized standard deviation of returns</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">💰</span>
                        Average Daily Return
                    </h3>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                        <p className="text-sm text-gray-600 mb-1">Daily Return</p>
                        <p className="text-3xl font-bold text-green-600">{(data.portfolio.averageReturn * 100).toFixed(3)}%</p>
                        <p className="text-xs text-gray-500 mt-1">Average daily return based on 90-day history</p>
                    </div>
                </div>
            </div>

            {/* Asset Allocation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🥧</span>
                    Asset Allocation by Type
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(data.allocationByType).map(([type, amount]) => {
                        const percent = (amount / data.netWorth) * 100;
                        return (
                            <div key={type} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">{type}</p>
                                <p className="text-xl font-bold text-gray-900">{percent.toFixed(1)}%</p>
                                <p className="text-xs text-gray-500 mt-1">{formatCurrency(amount)}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Account-Level Risk Metrics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🏦</span>
                    Account-Level Risk Metrics
                </h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Account
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Balance
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Weight
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sharpe
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sortino
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Volatility
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Max Drawdown
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    VaR 95%
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.accounts.map((account) => (
                                <tr key={account.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {account.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatCurrency(account.balance)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {account.weight.toFixed(1)}%
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={account.sharpeRatio > 1 ? 'text-green-600' : 'text-orange-600'}>
                                            {account.sharpeRatio.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={account.sortinoRatio > 1 ? 'text-green-600' : 'text-orange-600'}>
                                            {account.sortinoRatio.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {(account.volatility * 100).toFixed(2)}%
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                        {account.maxDrawdown.toFixed(2)}%
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {(account.var95 * 100).toFixed(2)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Correlation Matrix */}
            {data.correlationMatrix.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">🔗</span>
                        Account Correlations
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Correlation between account returns. Values range from -1 (perfectly inverse) to 1 (perfectly correlated).
                    </p>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Account 1
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Account 2
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Correlation
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.correlationMatrix.map((corr, idx) => {
                                    const account1 = data.accounts.find(a => a.id === corr.account1);
                                    const account2 = data.accounts.find(a => a.id === corr.account2);

                                    return (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {account1?.name || corr.account1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {account2?.name || corr.account2}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${
                                                                corr.correlation > 0.5 ? 'bg-red-500' :
                                                                corr.correlation > 0 ? 'bg-yellow-500' :
                                                                'bg-green-500'
                                                            }`}
                                                            style={{
                                                                width: `${(Math.abs(corr.correlation) * 100).toFixed(0)}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {corr.correlation.toFixed(3)}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Disclaimer */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <span className="text-2xl">ℹ️</span>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Risk Metrics Disclaimer</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                            <p>
                                These risk metrics are calculated based on 90 days of historical data and may not be representative of future risk.
                                VaR estimates the maximum expected loss but does not account for tail risk events. Sharpe and Sortino ratios assume
                                normal distribution of returns. Always consult with a financial advisor before making investment decisions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
