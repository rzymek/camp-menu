#!/bin/bash
set -eu
git subtree pull --prefix=camp-dsl/ dsl-ui-template master --squash
git subtree pull --prefix=camp-ui/ pwa-app master --squash

