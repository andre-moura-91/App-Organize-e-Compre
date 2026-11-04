export function parseBrazilianCurrency(value) {
    const normalized = value.trim().replace(/^R\$\s*/i, '').replace(/\s/g, '');
    if (!/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(normalized)) return null;

    const amount = Number(normalized.replace(/\./g, '').replace(',', '.'));
    return Number.isFinite(amount) ? amount : null;
}
