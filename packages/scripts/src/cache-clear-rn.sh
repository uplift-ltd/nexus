#!/usr/bin/env sh

if type watchman > /dev/null; then 
    watchman watch-del-all && rm -rf $TMPDIR/metro-* && rm -rf $TMPDIR/haste-map-*
fi
