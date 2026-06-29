export interface PaymentProvider {
  value: string
  label: string
  logo: string
  bankCode?: string
  /** Used for Google favicon fallback when the primary logo fails to load. */
  domain?: string
}

const NIGERIAN_BANK_LOGO_BASE =
  'https://cdn.jsdelivr.net/gh/supermx1/nigerian-banks-api@main/logos'

const SIMPLE_ICONS_BASE = 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons'

export function googleFavicon(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`
}

export const BANKS: PaymentProvider[] = [
  {
    value: 'GTBank',
    label: 'GTBank',
    logo: `${NIGERIAN_BANK_LOGO_BASE}/guaranty-trust-bank.png`,
    bankCode: '058',
    domain: 'gtbank.com',
  },
  {
    value: 'Access Bank',
    label: 'Access Bank',
    logo: `${NIGERIAN_BANK_LOGO_BASE}/access-bank.png`,
    bankCode: '044',
    domain: 'accessbankplc.com',
  },
  {
    value: 'Zenith Bank',
    label: 'Zenith Bank',
    logo: `${NIGERIAN_BANK_LOGO_BASE}/zenith-bank.png`,
    bankCode: '057',
    domain: 'zenithbank.com',
  },
  {
    value: 'First Bank',
    label: 'First Bank',
    logo: `${NIGERIAN_BANK_LOGO_BASE}/first-bank-of-nigeria.png`,
    bankCode: '011',
    domain: 'firstbanknigeria.com',
  },
  {
    value: 'UBA',
    label: 'UBA',
    logo: `${NIGERIAN_BANK_LOGO_BASE}/united-bank-for-africa.png`,
    bankCode: '033',
    domain: 'ubagroup.com',
  },
  {
    value: 'Ecobank',
    label: 'Ecobank',
    logo: `${NIGERIAN_BANK_LOGO_BASE}/ecobank-nigeria.png`,
    bankCode: '050',
    domain: 'ecobank.com',
  },
  {
    value: 'GCB Bank',
    label: 'GCB Bank',
    logo: googleFavicon('gcbbank.com.gh'),
    bankCode: '040',
    domain: 'gcbbank.com.gh',
  },
  {
    value: 'Stanbic Bank',
    label: 'Stanbic Bank',
    logo: `${NIGERIAN_BANK_LOGO_BASE}/stanbic-ibtc-bank.png`,
    bankCode: '221',
    domain: 'stanbicibtc.com',
  },
  {
    value: 'Fidelity Bank',
    label: 'Fidelity Bank',
    logo: `${NIGERIAN_BANK_LOGO_BASE}/fidelity-bank.png`,
    bankCode: '070',
    domain: 'fidelitybank.ng',
  },
]

export const MOBILE_MONEY_PROVIDERS: PaymentProvider[] = [
  {
    value: 'MTN MoMo',
    label: 'MTN MoMo',
    logo: `${NIGERIAN_BANK_LOGO_BASE}/mtn-momo-psb-ng.png`,
    domain: 'mtn.com',
  },
  {
    value: 'AirtelTigo Money',
    label: 'AirtelTigo Money',
    logo: `${NIGERIAN_BANK_LOGO_BASE}/airtel-smartcash-psb-ng.png`,
    domain: 'airtel.com',
  },
  {
    value: 'Vodafone Cash',
    label: 'Vodafone Cash',
    logo: `${SIMPLE_ICONS_BASE}/vodafone.svg`,
    domain: 'vodafone.com',
  },
  {
    value: 'M-Pesa',
    label: 'M-Pesa',
    logo: googleFavicon('safaricom.co.ke'),
    domain: 'safaricom.co.ke',
  },
]

export function getBankByValue(value: string) {
  return BANKS.find((bank) => bank.value === value)
}

export function getMobileProviderByValue(value: string) {
  return MOBILE_MONEY_PROVIDERS.find((provider) => provider.value === value)
}
