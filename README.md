# Fraudsight

**Hindsight is 20/20. Fraudsight is Real-Time.**

A modern financial analytics platform built for understanding risk, managing portfolios, and making data-driven financial decisions in real-time.

## Overview

Fraudsight is a cutting-edge financial intelligence platform that combines fraud detection, portfolio risk analysis, and predictive forecasting into a unified interface. Built with modern fintech principles, it provides institutional-grade analytics accessible to individual investors and small businesses.

## Core Features

- **Account Management**: Seamless aggregation and categorization of multiple financial accounts (checking, savings, credit cards, money market accounts, and more)
- **Portfolio Risk Analytics**: Comprehensive risk assessment including:
  - Value at Risk (VaR) at 95% and 99% confidence levels
  - Sharpe & Sortino Ratios for risk-adjusted performance measurement
  - Maximum drawdown analysis and volatility calculations
  - Correlation matrix for asset diversification insights
  - Asset allocation breakdown by account type
- **Graph Analytics**: Interactive visualization of transaction patterns and financial data relationships
- **Balance Forecasting**: Predictive algorithms that forecast future account balances based on historical trends and seasonality patterns
- **Risk Classification**: Automatic portfolio risk level assessment (Low, Moderate, High, Very High) based on volatility and Sharpe ratio

## Technology Stack

**Frontend:**
- **Next.js 16** - React framework with server-side rendering and Turbopack
- **TypeScript** - Type-safe code for financial calculations
- **Tailwind CSS** - Modern utility-first styling with fintech aesthetic
- **React Hooks** - State management and data fetching

**Backend & Authentication:**
- **Auth0** - Enterprise-grade authentication
- **Capital One Financial APIs** - Real transaction and account data

**Design Philosophy:**
- Premium fintech aesthetic with Plus Jakarta Sans typography
- Responsive design optimized for desktop and mobile
- Accessible, data-dense dashboards for financial professionals

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Auth0 account (for local development)

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/fraudsight.git
cd fraudsight/frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Auth0 credentials and API keys

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Deployment

The application is deployed on Vercel and connected to:
- **Frontend**: https://fraudsight.vercel.app
- **Backend Services**: Railway (database and API services)

## Future Roadmap

**Advanced Risk Analytics:**
- Monte Carlo simulations for scenario analysis
- Stress testing with custom market conditions
- ESG (Environmental, Social, Governance) risk scoring
- Real-time correlation updates with market indices

**Machine Learning Enhancements:**
- Neural network-based anomaly detection for fraud patterns
- Sophisticated time-series forecasting with external factor integration
- Personalized risk recommendations based on user profile
- Market regime detection and adaptive trading signals

**Institutional Features:**
- Multi-user portfolio management
- Compliance reporting and audit trails
- Custom alert thresholds and notification rules
- API access for enterprise integrations

## Project Goals

This project explores the intersection of financial technology, risk analysis, and fraud prevention. Built as a demonstration of modern financial software engineering practices, it showcases expertise in:
- Financial mathematics and risk metrics
- Full-stack TypeScript development
- Real-time data processing and visualization
- User authentication and data security
