pipeline {
  agent any
  options { timestamps() }

  environment {
    REGISTRY = "docker.io/<your_dockerhub_username>"   // change or leave unused
    IMAGE = "webapp"
    APP_DIR = "app"
    SHA = "${env.GIT_COMMIT?.take(7) ?: 'local'}"
  }

  stages {
    stage('Checkout') { steps { checkout scm } }

    stage('Bootstrap tools (if missing)') {
      steps {
        sh '''
          set -e
          if ! command -v docker >/dev/null 2>&1; then
            apt-get update -y >/dev/null
            DEBIAN_FRONTEND=noninteractive apt-get install -y docker.io >/dev/null
          fi
          if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
            apt-get update -y >/dev/null
            DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs npm >/dev/null || true
          fi
          docker version
          node -v || true
          npm -v || true
        '''
      }
    }

    stage('Install & Test (Node)') {
      steps {
        dir("${env.APP_DIR}") {
          sh '''
            set -e
            npm ci
            (npm start &) >/dev/null 2>&1
            sleep 1
            npm test
            pkill -f "node app.js" || true
          '''
        }
      }
    }

    stage('Build Docker image (optional)') {
      when { expression { return fileExists("${env.APP_DIR}/Dockerfile") } }
      steps {
        dir("${env.APP_DIR}") {
          sh 'docker build -t $REGISTRY/$IMAGE:$SHA .'
        }
      }
    }

    stage('Push image (optional)') {
      when { expression { return fileExists("${env.APP_DIR}/Dockerfile") } }
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
          sh '''
            echo "$PASS" | docker login -u "$USER" --password-stdin
            docker push $REGISTRY/$IMAGE:$SHA
          '''
        }
      }
    }

    stage('Tag latest on main (optional)') {
      when { allOf { branch 'main'; expression { return fileExists("${env.APP_DIR}/Dockerfile") } } }
      steps {
        sh '''
          docker tag $REGISTRY/$IMAGE:$SHA $REGISTRY/$IMAGE:latest
          docker push $REGISTRY/$IMAGE:latest
        '''
      }
    }
  }

  post {
    success { echo "✅ CI complete for $SHA" }
    failure { echo "❌ CI failed — check logs" }
  }
}
