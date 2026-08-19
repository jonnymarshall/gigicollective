#!/bin/sh
# Checks what the Cloudflare login helper can actually see at runtime.
#
# Run this whenever sign-in misbehaves. It tells you whether the three variables
# reached the Worker, without needing the Cloudflare dashboard.
#
#   sh scripts/check-login-helper.sh

WORKER=https://sveltia-cms-auth.jonnymarshall5.workers.dev
SITE=jonnymarshall.github.io   # change to gigicollective.com once DNS has moved

probe() {
  curl -s "$WORKER/auth?provider=github&site_id=$1" \
    | grep -oE "(UNSUPPORTED_DOMAIN|MISCONFIGURED_CLIENT)" | head -1
}

# A domain that must never be on the allow list.
bogus=$(probe "definitely-not-allowed.invalid")
real=$(probe "$SITE")

echo "ALLOWED_DOMAINS"
if [ "$bogus" = "UNSUPPORTED_DOMAIN" ]; then
  echo "  OK. A bogus domain was correctly rejected."
else
  echo "  PROBLEM. A bogus domain was let through, so the variable is not reaching"
  echo "  the Worker. Right now anyone could point their own editor at it."
fi

echo "GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET"
case "$real" in
  MISCONFIGURED_CLIENT)
    echo "  PROBLEM. Not reaching the Worker."
    echo "  Usual causes, in order: they were added to the Variables and secrets"
    echo "  section nested under Build instead of the one at the top of the page;"
    echo "  or Deploy was never clicked; or a typo in a variable name." ;;
  UNSUPPORTED_DOMAIN)
    echo "  Cannot tell. $SITE is being rejected by ALLOWED_DOMAINS."
    echo "  Add it to ALLOWED_DOMAINS, then run this again." ;;
  *)
    echo "  OK. The Worker got as far as redirecting to GitHub to sign in." ;;
esac
