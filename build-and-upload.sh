#!/bin/bash

cd $TRAVIS_BUILD_DIR
brew install yarn && yarn install
yes | gem uninstall cocoapods && gem install cocoapods -v 1.5.3
cd $TRAVIS_BUILD_DIR/ios && pod install --verbose
gem install bundler
cd $TRAVIS_BUILD_DIR/ios && bundle check || bundle install --path vendor/bundle
cd $TRAVIS_BUILD_DIR/ios && bundle update
export buildNumber=$(cat $TRAVIS_BUILD_DIR/buildNumber.txt)
export APP_BUILD_NUMBER=7785
echo $FASTLANE_PASSWORD
echo $OAUTH_TOKEN
cd $TRAVIS_BUILD_DIR/ios && bundle exec fastlane deploy_staging APP_BUILD_NUMBER:$APP_BUILD_NUMBER build_number:$buildNumber APP_NAME:"Pillar Staging"
