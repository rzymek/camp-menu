#!/bin/bash
set -eu
cd $(dirname $0)
git subtree pull --prefix=camp-dsl/ dsl-ui-template master --squash
git subtree pull --prefix=camp-ui/ pwa-app master --squash

