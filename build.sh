#!/bin/bash

#install npm package and build

#get SHARED_CONVEX_INSTALL_GITHUB_TOKEN from environment variable
if [ -z "$SHARED_CONVEX_INSTALL_GITHUB_TOKEN" ]; then
  echo "SHARED_CONVEX_INSTALL_GITHUB_TOKEN is not set"
  exit 1
fi

# Configure npm registry
echo "@pptlinks:registry=https://npm.pkg.github.com/" > .npmrc
echo "//npm.pkg.github.com/:_authToken=${SHARED_CONVEX_INSTALL_GITHUB_TOKEN}" >> .npmrc

npm install --legacy-peer-deps
npm run build