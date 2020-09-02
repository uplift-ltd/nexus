#!/usr/bin/env sh

git diff-index --quiet HEAD -- && git clean -dfx src || (echo 'Changes found, stash them before running.' && exit 1)