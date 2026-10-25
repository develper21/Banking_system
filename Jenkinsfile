pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        timestamps()
    }

    environment {
        CI = 'true'
        NEXT_TELEMETRY_DISABLED = '1'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Node.js') {
            steps {
                sh '''
                    node --version
                    npm --version
                    node -e "const [major, minor] = process.versions.node.split('.').map(Number); if (major < 20 || (major === 20 && minor < 9)) { console.error('Node.js 20.9 or newer is required.'); process.exit(1); }"
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Tests') {
            steps {
                sh 'npm test -- --runInBand'
            }
        }

        stage('Build') {
            steps {
                withCredentials([
                    string(credentialsId: 'NEXT_PUBLIC_APPWRITE_ENDPOINT', variable: 'NEXT_PUBLIC_APPWRITE_ENDPOINT'),
                    string(credentialsId: 'NEXT_PUBLIC_APPWRITE_PROJECT', variable: 'NEXT_PUBLIC_APPWRITE_PROJECT'),
                    string(credentialsId: 'NEXT_APPWRITE_KEY', variable: 'NEXT_APPWRITE_KEY'),
                    string(credentialsId: 'APPWRITE_DATABASE_ID', variable: 'APPWRITE_DATABASE_ID'),
                    string(credentialsId: 'APPWRITE_USER_COLLECTION_NAME', variable: 'APPWRITE_USER_COLLECTION_NAME'),
                    string(credentialsId: 'APPWRITE_BANK_COLLECTION_NAME', variable: 'APPWRITE_BANK_COLLECTION_NAME'),
                    string(credentialsId: 'APPWRITE_ITEM_COLLECTION_NAME', variable: 'APPWRITE_ITEM_COLLECTION_NAME'),
                    string(credentialsId: 'APPWRITE_TRANSACTION_COLLECTION_NAME', variable: 'APPWRITE_TRANSACTION_COLLECTION_NAME'),
                    string(credentialsId: 'PLAID_CLIENT_ID', variable: 'PLAID_CLIENT_ID'),
                    string(credentialsId: 'PLAID_SECRET', variable: 'PLAID_SECRET'),
                    string(credentialsId: 'PLAID_ENV', variable: 'PLAID_ENV'),
                    string(credentialsId: 'DWOLLA_KEY', variable: 'DWOLLA_KEY'),
                    string(credentialsId: 'DWOLLA_SECRET', variable: 'DWOLLA_SECRET'),
                    string(credentialsId: 'DWOLLA_BASE_URL', variable: 'DWOLLA_BASE_URL'),
                    string(credentialsId: 'DWOLLA_ENV', variable: 'DWOLLA_ENV')
                ]) {
                    sh 'npm run build'
                }
            }
        }
    }
}