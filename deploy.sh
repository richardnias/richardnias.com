#! /usr/bin/env bash

# cache busted js assets
aws s3 sync public s3://richardnias.com \
    --region eu-west-2 \
    --exclude "*" \
    --include "*.js" \
    --exclude "service-worker.js" \
    --cache-control "max-age=2628000, immutable" \
    --content-encoding "gzip"

# service-worker.js
aws s3 sync public s3://richardnias.com \
    --region eu-west-2 \
    --exclude "*" \
    --include "service-worker.js" \
    --cache-control "max-age=0" \
    --content-encoding "gzip"

# html
aws s3 sync public s3://richardnias.com \
    --region eu-west-2 \
    --exclude "*" \
    --include "*.html" \
    --cache-control "max-age=3600" \
    --content-encoding "gzip"

# the rest
aws s3 sync public s3://richardnias.com \
    --region eu-west-2 
    --exclude "*.js" 
    --exclude "*.html" 
    --cache-control "max-age=3600"
