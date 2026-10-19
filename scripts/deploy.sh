#!/usr/bin/env bash
# Выкладка сборки в S3 + сброс кэша CloudFront.
#
#   S3_BUCKET=имя-бакета CLOUDFRONT_DISTRIBUTION_ID=E123... npm run deploy
#   DRY_RUN=1 S3_BUCKET=... npm run deploy   — показать, что будет загружено, ничего не меняя
#
# Нужен установленный и настроенный AWS CLI (aws configure).
set -euo pipefail

: "${S3_BUCKET:?Укажите S3_BUCKET — имя бакета сайта}"
DRY=()
[[ "${DRY_RUN:-}" == "1" ]] && DRY=(--dryrun)

[[ -f dist/index.html ]] || { echo "Нет dist/ — сначала выполните npm run build"; exit 1; }

# 1. Файлы с хешем в имени (JS, CSS, картинки) кэшируются навсегда.
aws s3 sync dist/assets "s3://$S3_BUCKET/assets" "${DRY[@]}" \
  --cache-control "public, max-age=31536000, immutable"

# 2. Остальная статика (иконки, манифест) — короткий кэш. HTML загружаем отдельно ниже.
aws s3 sync dist "s3://$S3_BUCKET" "${DRY[@]}" \
  --exclude "assets/*" --exclude "*.html" --exclude ".vite/*" \
  --cache-control "public, max-age=3600"

# 3. HTML без кэша, чтобы новая версия была видна сразу.
aws s3 cp dist/index.html "s3://$S3_BUCKET/index.html" "${DRY[@]}" \
  --content-type "text/html; charset=utf-8" --cache-control "no-cache"

# 4. Страницы туториалов загружаем под ключом без расширения (tutorials/<slug>):
#    CloudFront с S3-источником не подставляет index.html для папок сам.
for page in dist/tutorials/*/index.html; do
  slug="$(basename "$(dirname "$page")")"
  aws s3 cp "$page" "s3://$S3_BUCKET/tutorials/$slug" "${DRY[@]}" \
    --content-type "text/html; charset=utf-8" --cache-control "no-cache"
done

if [[ -n "${CLOUDFRONT_DISTRIBUTION_ID:-}" && "${DRY_RUN:-}" != "1" ]]; then
  aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" --paths "/*"
fi

echo "Готово."
